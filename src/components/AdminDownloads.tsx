import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { Upload, Trash2, FileDown, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface DownloadFile {
  id: string;
  platform: string;
  version: string;
  file_name: string;
  file_size: number;
  uploaded_at: string;
  is_active: boolean;
  download_url: string;
}

export function AdminDownloads({ language }: { language: string }) {
  const { t } = useTranslation(language);
  const [files, setFiles] = useState<DownloadFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const timestamp = Date.now(); // Add timestamp to prevent caching
      const response = await fetch(`/downloads/metadata.json?t=${timestamp}`, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch metadata: ${response.statusText}`);
      }
      
      const metadata = await response.json();
      setFiles(metadata.sort((a: DownloadFile, b: DownloadFile) => 
        new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime()
      ));
    } catch (error) {
      console.error('Error fetching files:', error);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const platform = formData.get('platform') as string;
    const version = formData.get('version') as string;
    const downloadUrl = formData.get('downloadUrl') as string;
    const fileSize = formData.get('fileSize') as string;

    if (!platform || !version || !downloadUrl || !fileSize) {
      toast.error(t('requiredField'));
      return;
    }

    setIsUploading(true);
    const uploadToastId = toast.loading(t('addingDownload'));

    try {
      // Create new file entry
      const newFile: DownloadFile = {
        id: Date.now().toString(),
        platform,
        version,
        file_name: downloadUrl.split('/').pop() || 'unknown',
        file_size: parseInt(fileSize) * 1024 * 1024, // Convert MB to bytes
        uploaded_at: new Date().toISOString(),
        is_active: true,
        download_url: downloadUrl
      };

      // Add new file to metadata
      const updatedFiles = [...files, newFile];
      
      // Save to metadata.json
      const saveResponse = await fetch('/downloads/metadata.json', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFiles)
      });

      if (!saveResponse.ok) {
        throw new Error('Failed to save metadata');
      }

      setFiles(updatedFiles);
      toast.success(t('downloadAdded'), { id: uploadToastId });
      formRef.current?.reset();
    } catch (error) {
      const message = error instanceof Error ? error.message : t('downloadFailed');
      console.error('Upload error:', message);
      toast.error(message, { id: uploadToastId });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (file: DownloadFile) => {
    if (!window.confirm(t('confirmDeleteFile'))) return;

    const deleteToastId = toast.loading(t('deletingDownload'));

    try {
      // Remove file from metadata
      const updatedFiles = files.filter(f => f.id !== file.id);
      
      // Save updated metadata
      const saveResponse = await fetch('/downloads/metadata.json', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFiles)
      });

      if (!saveResponse.ok) {
        throw new Error('Failed to save metadata');
      }

      setFiles(updatedFiles);
      toast.success(t('downloadDeleted'), { id: deleteToastId });
    } catch (error) {
      const message = error instanceof Error ? error.message : t('downloadFailed');
      console.error('Delete error:', message);
      toast.error(message, { id: deleteToastId });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">{t('manageDownloads')}</h2>

      {/* Upload Form */}
      <form ref={formRef} onSubmit={handleFileUpload} className="bg-black/30 rounded-lg p-6 border border-yellow-500/10">
        <h3 className="text-xl font-semibold mb-4">{t('uploadNewFile')}</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">{t('platform')}</label>
            <select
              name="platform"
              required
              className="w-full px-4 py-2 bg-black/30 border border-yellow-500/10 rounded-lg"
            >
              <option value="client">{t('gameClient')}</option>
              <option value="launcher">{t('gameLauncher')}</option>
              <option value="luminacore">{t('luminaCore')}</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">{t('version')}</label>
            <input
              type="text"
              name="version"
              required
              placeholder="e.g., 1.0.0"
              className="w-full px-4 py-2 bg-black/30 border border-yellow-500/10 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {t('downloadUrl')}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="url"
              name="downloadUrl"
              required
              placeholder="https://example.com/downloads/file.exe"
              className="w-full px-4 py-2 bg-black/30 border border-yellow-500/10 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {t('fileSize')}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="number"
              name="fileSize"
              required
              min="1"
              step="0.1"
              placeholder="e.g., 1024"
              className="w-full px-4 py-2 bg-black/30 border border-yellow-500/10 rounded-lg"
            />
            <p className="mt-1 text-sm text-gray-400">{t('fileSizeInMB')}</p>
          </div>

          <button
            type="submit"
            disabled={isUploading}
            className="w-full bg-yellow-500 text-black py-3 px-4 rounded-lg font-semibold hover:bg-yellow-400 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {t('addingDownload')}
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                {t('addDownload')}
              </>
            )}
          </button>
        </div>
      </form>

      {/* Files List */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">{t('availableDownloads')}</h3>
        {files.map((file) => (
          <div
            key={file.id}
            className="bg-black/30 rounded-lg p-6 border border-yellow-500/10"
          >
            <div className="flex justify-between items-start gap-4">
              <div>
                <h4 className="font-semibold mb-1">{file.file_name}</h4>
                <div className="text-sm text-gray-400">
                  <p>{t('platform')}: {file.platform}</p>
                  <p>{t('version')}: {file.version}</p>
                  <p>{t('fileSize')}: {(file.file_size / (1024 * 1024)).toFixed(2)} MB</p>
                  <p className="mt-2 break-all">
                    {t('downloadUrl')}: {file.download_url}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => window.open(file.download_url, '_blank')}
                  className="text-yellow-500 hover:text-yellow-400 transition"
                  title={t('openDownloadUrl')}
                >
                  <FileDown className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(file)}
                  className="text-red-500 hover:text-red-400 transition"
                  title={t('delete')}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {files.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            {t('noDownloadsYet')}
          </div>
        )}
      </div>
    </div>
  );
}