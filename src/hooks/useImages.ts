import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

interface WebsiteImage {
  id: string;
  category: string;
  file_name: string;
  file_size: number;
  uploaded_by: string;
  uploaded_at: string;
  description: string | null;
  url: string;
}

export function useImages() {
  const [images, setImages] = useState<WebsiteImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchImages = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from('website_images')
        .select('*')
        .order('uploaded_at', { ascending: false });

      if (supabaseError) throw supabaseError;

      setImages(data || []);
    } catch (error) {
      console.error('Error fetching images:', error);
      setError('Failed to fetch images');
      setImages([]); // Clear images on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const uploadImage = async (formData: FormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const file = formData.get('image') as File;
      const category = formData.get('category') as string;
      const description = formData.get('description') as string;

      if (!file || !category) {
        throw new Error('Missing required fields');
      }

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('website-images')
        .upload(`${category}/${Date.now()}-${file.name}`, file);

      if (uploadError) throw uploadError;

      // Create database record
      const { error: dbError } = await supabase
        .from('website_images')
        .insert([{
          category,
          file_name: file.name,
          file_size: file.size,
          uploaded_by: user.id,
          description,
          url: uploadData.path
        }]);

      if (dbError) throw dbError;

      await fetchImages();
      return { success: true };
    } catch (error) {
      console.error('Error uploading image:', error);
      return { success: false, error: 'Failed to upload image' };
    }
  };

  const deleteImage = async (id: string) => {
    try {
      const imageToDelete = images.find(img => img.id === id);
      if (!imageToDelete) throw new Error('Image not found');

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('website-images')
        .remove([imageToDelete.url]);

      if (storageError) throw storageError;

      // Delete database record
      const { error: dbError } = await supabase
        .from('website_images')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      await fetchImages();
      return { success: true };
    } catch (error) {
      console.error('Error deleting image:', error);
      return { success: false, error: 'Failed to delete image' };
    }
  };

  return {
    images,
    loading,
    error,
    refreshImages: fetchImages,
    uploadImage,
    deleteImage,
  };
}