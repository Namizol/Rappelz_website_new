import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { Plus, Edit2, Trash2, Save, X, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNews } from '../hooks/useNews';

interface NewsArticle {
  id: string;
  title: string;
  content: string;
  publish_date: string;
  author_id: string;
  category: 'update' | 'event' | 'maintenance' | 'community';
  image_url: string | null;
}

export function AdminNews({ language }: { language: string }) {
  const { t } = useTranslation(language);
  const { news, loading, createArticle, updateArticle, deleteArticle } = useNews();
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const articleData = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      category: formData.get('category') as NewsArticle['category'],
      image_url: formData.get('imageUrl') as string || null,
    };

    try {
      if (editingArticle?.id) {
        const result = await updateArticle(editingArticle.id, articleData);
        if (result.success) {
          toast.success('Article updated successfully');
          setEditingArticle(null);
        } else {
          toast.error(result.error || 'Failed to update article');
        }
      } else {
        const result = await createArticle(articleData);
        if (result.success) {
          toast.success('Article created successfully');
          setEditingArticle(null);
        } else {
          toast.error(result.error || 'Failed to create article');
        }
      }
    } catch (error) {
      console.error('Error saving article:', error);
      toast.error('Failed to save article');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (articleId: string) => {
    if (!articleId) {
      toast.error('Invalid article ID');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this article?')) return;

    try {
      const result = await deleteArticle(articleId);
      if (result.success) {
        toast.success('Article deleted successfully');
        if (editingArticle?.id === articleId) {
          setEditingArticle(null);
        }
      } else {
        toast.error(result.error || 'Failed to delete article');
      }
    } catch (error) {
      console.error('Error deleting article:', error);
      toast.error('Failed to delete article');
    }
  };

  const handleCreateNew = () => {
    setEditingArticle({
      id: '',
      title: '',
      content: '',
      publish_date: new Date().toISOString(),
      author_id: '',
      category: 'update',
      image_url: null,
    });
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage News Articles</h2>
        {!editingArticle && (
          <button
            onClick={handleCreateNew}
            className="bg-yellow-500 text-black px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-yellow-400 transition"
          >
            <Plus className="w-5 h-5" />
            New Article
          </button>
        )}
      </div>

      {editingArticle && (
        <form onSubmit={handleSubmit} className="bg-black/30 rounded-lg p-6 border border-yellow-500/10">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                name="title"
                required
                defaultValue={editingArticle.title}
                className="w-full px-4 py-2 bg-black/30 border border-yellow-500/10 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                name="category"
                required
                defaultValue={editingArticle.category}
                className="w-full px-4 py-2 bg-black/30 border border-yellow-500/10 rounded-lg"
              >
                <option value="update">Game Updates</option>
                <option value="event">Events</option>
                <option value="maintenance">Maintenance</option>
                <option value="community">Community</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Image URL</label>
              <input
                type="url"
                name="imageUrl"
                defaultValue={editingArticle.image_url || ''}
                className="w-full px-4 py-2 bg-black/30 border border-yellow-500/10 rounded-lg"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Content</label>
              <textarea
                name="content"
                required
                defaultValue={editingArticle.content}
                rows={10}
                className="w-full px-4 py-2 bg-black/30 border border-yellow-500/10 rounded-lg resize-none"
              />
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setEditingArticle(null)}
                className="px-4 py-2 text-gray-400 hover:text-white transition flex items-center gap-2"
              >
                <X className="w-5 h-5" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-yellow-500 text-black px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-yellow-400 transition disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Article
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {news.map((article) => (
          <div
            key={article.id}
            className="bg-black/30 rounded-lg p-6 border border-yellow-500/10"
          >
            <div className="flex justify-between items-start gap-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>
                    {new Date(article.publish_date).toLocaleDateString()}
                  </span>
                  <span className="px-2 py-1 rounded text-xs bg-yellow-500/20 text-yellow-500">
                    {article.category}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingArticle(article)}
                  className="text-yellow-500 hover:text-yellow-400 transition"
                  title="Edit article"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(article.id)}
                  className="text-red-500 hover:text-red-400 transition"
                  title="Delete article"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {news.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No articles found. Create your first article by clicking the "New Article" button above.
          </div>
        )}
      </div>
    </div>
  );
}