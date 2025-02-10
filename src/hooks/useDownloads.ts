import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';

interface DownloadFile {
  id: string;
  platform: string;
  version: string;
  file_name: string;
  file_size: number;
  uploaded_at: string;
  is_active: boolean;
}

export function useDownloads() {
  const [files, setFiles] = useState<DownloadFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('download_files')
        .select('*')
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setFiles(data || []);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch files';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (formData: FormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const file = formData.get('file') as File;
      const platform = formData.get('platform') as string;
      const version = formData.get('version') as string;

      if (!file || !platform || !version) {
        throw new Error('Missing required fields');
      }

      // Validate platform
      const validPlatforms = ['client', 'launcher', 'luminacore'] as const;
      if (!validPlatforms.includes(platform as typeof validPlatforms[number])) {
        throw new Error('Invalid platform selected');
      }

      // Create a unique filename
      const timestamp = Date.now();
      const ext = file.name.substring(file.name.lastIndexOf('.'));
      const fileName = `${platform}-${version}-${timestamp}${ext}`;

      // Upload file to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('downloads')
        .upload(`${platform}/${fileName}`, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;
      if (!data?.path) throw new Error('Upload failed - no data returned');

      // Create database record
      const { error: dbError } = await supabase
        .from('download_files')
        .insert([{
          platform,
          version,
          file_name: fileName,
          file_size: file.size,
          file_path: data.path,
          uploaded_by: user.id,
          is_active: true
        }]);

      if (dbError) {
        // If database insert fails, try to clean up the uploaded file
        await supabase.storage
          .from('downloads')
          .remove([`${platform}/${fileName}`]);
        throw dbError;
      }

      await fetchFiles();
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to upload file';
      console.error('Upload error:', error);
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const deleteFile = async (fileId: string) => {
    try {
      // Get file info first
      const { data: file, error: fetchError } = await supabase
        .from('download_files')
        .select('*')
        .eq('id', fileId)
        .single();

      if (fetchError) throw fetchError;
      if (!file) throw new Error('File not found');

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('downloads')
        .remove([`${file.platform}/${file.file_name}`]);

      if (storageError) throw storageError;

      // Delete database record
      const { error: dbError } = await supabase
        .from('download_files')
        .delete()
        .eq('id', fileId);

      if (dbError) throw dbError;

      await fetchFiles();
      toast.success('File deleted successfully');
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete file';
      console.error('Delete error:', error);
      toast.error(message);
      return { success: false, error: message };
    }
  };

  return {
    files,
    loading,
    error,
    fetchFiles,
    uploadFile,
    deleteFile,
  };
}