import React from 'react';
import { Calendar, User, ArrowLeft, Share2 } from 'lucide-react';

interface ArticleViewProps {
  article: {
    id: string;
    title: string;
    content: string;
    publishDate: string;
    authorEmail: string;
    image?: string;
  };
  onBack: () => void;
}

export function ArticleView({ article, onBack }: ArticleViewProps) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.content.substring(0, 100) + '...',
        url: window.location.href,
      }).catch(console.error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-yellow-500 hover:text-yellow-400 transition mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to News
        </button>

        {article.image && (
          <div className="relative h-[400px] mb-8 rounded-2xl overflow-hidden">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
          </div>
        )}

        <div className="bg-black/50 rounded-2xl p-8 backdrop-blur-sm border border-yellow-500/10">
          <div className="flex justify-between items-start gap-4 mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-yellow-500">{article.title}</h1>
            <button
              onClick={handleShare}
              className="text-gray-400 hover:text-white transition p-2"
              title="Share article"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-6 text-gray-400 mb-8">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(article.publishDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
            <span className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {article.authorEmail}
            </span>
          </div>

          <div className="prose prose-invert prose-yellow max-w-none">
            {article.content.split('\n').map((paragraph, index) => (
              <p key={index} className="text-gray-300 leading-relaxed mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}