import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Base directory for downloads
const DOWNLOADS_BASE_DIR = path.join(process.cwd(), 'public', 'downloads');

// Create download directories
async function createDownloadDirectories() {
  const directories = [
    DOWNLOADS_BASE_DIR,
    path.join(DOWNLOADS_BASE_DIR, 'client'),
    path.join(DOWNLOADS_BASE_DIR, 'launcher'),
    path.join(DOWNLOADS_BASE_DIR, 'luminacore')
  ];

  for (const dir of directories) {
    try {
      await fs.access(dir);
    } catch {
      await fs.mkdir(dir, { recursive: true });
    }
  }
}

// Initialize directories
createDownloadDirectories().catch(console.error);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    try {
      const platform = req.body.platform || 'client';
      const uploadDir = path.join(DOWNLOADS_BASE_DIR, platform.toLowerCase());
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const version = req.body.version ? `-${req.body.version}` : '';
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    cb(null, `${basename}${version}-${timestamp}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 1024 * 10 // 10GB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.exe', '.rar', '.AppImage', '.deb', '.rpm'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only .exe, .rar, .AppImage, .deb, and .rpm files are allowed.'));
    }
  }
});

// Get metadata file path
const getMetadataPath = () => path.join(DOWNLOADS_BASE_DIR, 'metadata.json');

// Initialize metadata file if it doesn't exist
async function initializeMetadata() {
  const metadataPath = getMetadataPath();
  try {
    await fs.access(metadataPath);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await createDownloadDirectories();
      await fs.writeFile(metadataPath, '[]');
    }
  }
}

// Read metadata with error handling
async function readMetadata() {
  await initializeMetadata();
  try {
    const metadataPath = getMetadataPath();
    const data = await fs.readFile(metadataPath, 'utf8');
    return JSON.parse(data || '[]');
  } catch (error) {
    console.error('Error reading metadata:', error);
    return [];
  }
}

// Write metadata with error handling
async function writeMetadata(metadata) {
  try {
    const metadataPath = getMetadataPath();
    await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
  } catch (error) {
    console.error('Error writing metadata:', error);
    throw new Error('Failed to save metadata');
  }
}

// Get all download files
router.get('/', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  try {
    const metadata = await readMetadata();
    
    // Filter out files that no longer exist
    const existingFiles = await Promise.all(metadata.map(async (file) => {
      try {
        const filePath = path.join(DOWNLOADS_BASE_DIR, file.platform, file.file_name);
        await fs.access(filePath);
        return file;
      } catch {
        return null;
      }
    }));

    const validFiles = existingFiles.filter(file => file !== null);
    
    // Update metadata if files were removed
    if (validFiles.length !== metadata.length) {
      await writeMetadata(validFiles);
    }
    
    res.json(validFiles);
  } catch (error) {
    console.error('Error fetching download files:', error);
    res.status(500).json({ error: 'Failed to fetch download files' });
  }
});

// Upload new file
router.post('/', authMiddleware, adminMiddleware, upload.single('file'), async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  try {
    const file = req.file;
    const { platform, version } = req.body;

    if (!file || !platform || !version) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate platform
    const validPlatforms = ['client', 'launcher', 'luminacore'];
    if (!validPlatforms.includes(platform.toLowerCase())) {
      return res.status(400).json({ error: 'Invalid platform' });
    }

    const metadata = await readMetadata();
    const newFile = {
      id: Date.now().toString(),
      file_name: file.filename,
      file_size: file.size,
      platform: platform.toLowerCase(),
      version,
      uploaded_at: new Date().toISOString(),
      is_active: true
    };

    metadata.push(newFile);
    await writeMetadata(metadata);

    res.status(201).json({
      message: 'File uploaded successfully',
      file: newFile
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: error.message || 'Failed to upload file' });
  }
});

// Delete file
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  try {
    const { id } = req.params;
    const metadata = await readMetadata();
    const fileIndex = metadata.findIndex(file => file.id === id);

    if (fileIndex === -1) {
      return res.status(404).json({ error: 'File not found' });
    }

    const file = metadata[fileIndex];
    const filePath = path.join(DOWNLOADS_BASE_DIR, file.platform, file.file_name);

    try {
      await fs.unlink(filePath);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }

    metadata.splice(fileIndex, 1);
    await writeMetadata(metadata);

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

export default router;