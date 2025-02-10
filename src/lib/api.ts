import { supabase } from './supabase';

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`/api${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({ error: 'An error occurred' }));
      throw new Error(data.error || 'An error occurred');
    }

    return response.json();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    console.error('API Error:', message);
    throw error;
  }
}

export async function uploadFile(endpoint: string, formData: FormData) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`/api${endpoint}`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({ error: 'An error occurred' }));
      throw new Error(data.error || 'Upload failed');
    }

    return response.json();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    console.error('Upload Error:', message);
    throw error;
  }
}