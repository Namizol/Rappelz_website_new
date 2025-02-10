import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

interface NewsArticle {
  id: string;
  title: string;
  content: string;
  publish_date: string;
  author_id: string;
  category: 'update' | 'event' | 'maintenance' | 'community';
  image_url: string | null;
  updated_at?: string;
}

export function useNews() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from('news_articles')
        .select('*')
        .order('publish_date', { ascending: false });

      if (supabaseError) throw supabaseError;
      setNews(data || []);
    } catch (error) {
      console.error('Error fetching news:', error);
      setError('Failed to fetch news');
      setNews([{
        id: 'featured-1',
        title: 'Welcome to Rappelz',
        content: 'We are excited to announce the launch of our new game server! Join us in this epic adventure.',
        publish_date: new Date().toISOString(),
        author_id: '1',
        category: 'update',
        image_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const createArticle = async (article: Omit<NewsArticle, 'id' | 'author_id' | 'publish_date'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('news_articles')
        .insert([{
          ...article,
          author_id: user.id,
          publish_date: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('No data returned from insert');

      setNews(prev => [data, ...prev]);
      return { success: true, data };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create article';
      console.error('Error creating article:', message);
      return { success: false, error: message };
    }
  };

  const updateArticle = async (id: string, updates: Partial<Omit<NewsArticle, 'id' | 'author_id'>>) => {
    if (!id) {
      return { success: false, error: 'Invalid article ID' };
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('news_articles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('Article not found');

      setNews(prev => prev.map(article => 
        article.id === id ? { ...article, ...data } : article
      ));
      return { success: true, data };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update article';
      console.error('Error updating article:', message);
      return { success: false, error: message };
    }
  };

  const deleteArticle = async (id: string) => {
    if (!id) {
      return { success: false, error: 'Invalid article ID' };
    }

    try {
      const { error } = await supabase
        .from('news_articles')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setNews(prev => prev.filter(article => article.id !== id));
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete article';
      console.error('Error deleting article:', message);
      return { success: false, error: message };
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return {
    news,
    loading,
    error,
    refreshNews: fetchNews,
    createArticle,
    updateArticle,
    deleteArticle,
  };
}