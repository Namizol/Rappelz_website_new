import React, { useEffect, useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { Upload, Trash2, Image as ImageIcon, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { fetchApi } from '../lib/api';

interface WebsiteImage {
  id: string;
  category: string;
  fileName: string;
  fileSize: number;
  uploadedBy: string;
  uploadedAt: string;
  description?: string;
}

export function AdminImages({ language }: { language: string }) {
  const { t } = useTranslation(language);
  const [images, setImages] = useState<WebsiteImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const data = await fetchApi('/admin/images');
      setImages(data);
    } catch (error) {
      console.error('Error fetching images:', error);
      toast.error('Failed to fetch images');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    setIsUploading(true);
    try {
      const response = await fetch('/api/admin/images', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      toast.success('Image uploaded successfully');
      event.currentTarget.reset();
      await fetchImages();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to upload image';
      toast.error(message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (imageId: string) => {
    if (!window.confirm(t('confirmDeleteImage'))) return;

    try {
      await fetchApi(`/admin/images/${imageId}`, {
        method: 'DELETE',
      });
      toast.success('Image deleted successfully');
      await fetchImages();
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image');
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
      <h2 className="text-2xl font-bold mb-6">Manage Website Images</h2>

      {/* Upload Form */}
      <form onSubmit={handleImageUpload} className="bg-black/30 rounded-lg p-6 border border-yellow-500/10">
        <h3 className="text-xl font-semibold mb-4">Upload New Image</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              name="category"
              required
              className="w-full px-4 py-2 bg-black/30 border border-yellow-500/10 rounded-lg"
            >
              <option value="banners">Banners</option>
              <option value="news">News</option>
              <option value="events">Events</option>
              <option value="backgrounds">Backgrounds</option>
              <option value="misc">Miscellaneous</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <input
              type="text"
              name="description"
              placeholder="Brief description of the image"
              className="w-full px-4 py-2 bg-black/30 border border-yellow-500/10 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Image</label>
            <input
              type="file"
              name="image"
              required
              accept=".jpg,.jpeg,.png,.gif,.webp"
              className="w-full px-4 py-2 bg-black/30 border border-yellow-500/10 rounded-lg"
            />
          </div>

          <button
            type="submit"
            disabled={isUploading}
            className="w-full bg-yellow-500 text-black py-3 px-4 rounded-lg font-semibold hover:bg-yellow-400 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Upload Image
              </>
            )}
          </button>
        </div>
      </form>

      {/* Images Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <div
            key={image.id}
            className="bg-black/30 rounded-lg border border-yellow-500/10 overflow-hidden group"
          >
            <div className="aspect-square relative">
              <img
                src={`/images/${image.category}/${image.fileName}`}
                alt={image.description || image.fileName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <a
                  href={`/images/${image.category}/${image.fileName}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-yellow-500 transition"
                  title="View full size"
                >
                  <ImageIcon className="w-6 h-6" />
                </a>
                <button
                  onClick={() => handleDelete(image.id)}
                  className="text-red-500 hover:text-red-400 transition"
                  title="Delete image"
                >
                  <Trash2 className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-3">
              <p className="text-sm font-medium truncate">{image.description || image.fileName}</p>
              <p className="text-xs text-gray-400">
                {new Date(image.uploadedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}