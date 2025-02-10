import React, { useState } from 'react';
import { Calendar, User, ChevronRight, Search } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { ArticleView } from './ArticleView';
import { LoadingSpinner } from './LoadingSpinner';
import { useNews } from '../hooks/useNews';

interface Article {
  id: string;
  title: string;
  content: string;
  publish_date: string;
  author_id: string;
  category: string;
  image_url: string | null;
}

export function NewsPage({ language }: { language: string }) {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { t } = useTranslation(language);
  const { news, loading } = useNews();

  // Filter articles based on search and category
  const filteredArticles = news.filter(article => {
    const matchesSearch = searchQuery === '' || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !selectedCategory || article.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  if (selectedArticle) {
    return (
      <ArticleView
        article={{
          ...selectedArticle,
          publishDate: selectedArticle.publish_date,
          authorEmail: t('adminTeam'),
          image: selectedArticle.image_url || undefined
        }}
        onBack={() => setSelectedArticle(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-yellow-500 mb-4">{t('latestNews')}</h1>
          <p className="text-xl text-gray-300">{t('newsDescription')}</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <LoadingSpinner size={40} />
          </div>
        ) : (
          <>
            {/* Search and Filters */}
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('searchNews')}
                  className="w-full pl-10 pr-4 py-2 bg-black/30 border border-yellow-500/10 rounded-lg"
                />
              </div>
              <div className="flex gap-2">
                {['update', 'event', 'maintenance', 'community'].map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(
                      selectedCategory === category ? null : category
                    )}
                    className={`px-4 py-2 rounded-lg transition ${
                      selectedCategory === category
                        ? 'bg-yellow-500 text-black'
                        : 'bg-black/30 text-gray-400 hover:text-white'
                    }`}
                  >
                    {t(category)}
                  </button>
                ))}
              </div>
            </div>

            {/* Articles Grid */}
            {filteredArticles.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredArticles.map((article) => (
                  <div
                    key={article.id}
                    className="bg-black/30 rounded-xl overflow-hidden border border-yellow-500/10 hover:border-yellow-500/30 transition-all cursor-pointer group"
                    onClick={() => setSelectedArticle(article)}
                  >
                    {article.image_url && (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={article.image_url}
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-3 py-1 rounded-full text-sm bg-yellow-500/20 text-yellow-500">
                          {t(article.category)}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mb-2">{article.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(article.publish_date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {t('adminTeam')}
                        </span>
                      </div>
                      <p className="text-gray-300 mb-4 line-clamp-3">{article.content}</p>
                      <span className="text-yellow-500 flex items-center gap-1 group-hover:text-yellow-400 transition">
                        {t('readMore')} <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400 py-12">
                {t('noArticlesFound')}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}