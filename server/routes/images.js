import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { getConnection } from '../../src/lib/database.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const { category } = req.body;
    const uploadDir = path.join(process.cwd(), 'public', 'images', category || 'misc');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5 // 5MB limit for images
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images are allowed.'));
    }
  }
});

router.get('/', async (req, res) => {
  try {
    const pool = await getConnection();
    const [rows] = await pool.execute(`
      SELECT 
        id,
        category,
        file_name,
        file_size,
        uploaded_by,
        uploaded_at,
        description
      FROM website_images
      ORDER BY uploaded_at DESC
    `);
    
    res.json(rows);
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { category, description } = req.body;
    const file = req.file;

    if (!file || !category) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const fileStats = await fs.stat(file.path);
    const pool = await getConnection();

    const [result] = await pool.execute(
      `INSERT INTO website_images (
        category,
        file_name,
        file_size,
        uploaded_by,
        description
      ) VALUES (?, ?, ?, ?, ?)`,
      [category, file.filename, fileStats.size, req.user.id, description || '']
    );

    res.status(201).json({ 
      message: 'Image uploaded successfully',
      path: `/images/${category}/${file.filename}`
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getConnection();

    const [rows] = await pool.execute(
      'SELECT file_name, category FROM website_images WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Image not found' });
    }

    const { file_name, category } = rows[0];
    const filePath = path.join(process.cwd(), 'public', 'images', category, file_name);

    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error('Error deleting image from disk:', error);
    }

    await pool.execute('DELETE FROM website_images WHERE id = ?', [id]);

    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

export default router;