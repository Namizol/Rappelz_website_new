import React, { useState } from 'react';
import { Search, ChevronDown, HelpCircle } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-hot-toast';

export function FAQPage({ language, onNavigate }: { language: string; onNavigate: (page: string) => void }) {
  const { t } = useTranslation(language);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();

  const handleContactSupport = () => {
    if (!user) {
      toast.error(t('pleaseLoginToAccessSupport'));
      return;
    }
    onNavigate('support');
  };

  const faqItems = [
    {
      question: t('faqQuestion1'),
      answer: t('faqAnswer1'),
      category: 'account',
    },
    {
      question: t('faqQuestion2'),
      answer: t('faqAnswer2'),
      category: 'technical',
    },
    {
      question: t('faqQuestion3'),
      answer: t('faqAnswer3'),
      category: 'gameplay',
    },
    // Add more FAQ items here
  ];

  const filteredFAQs = faqItems.filter(item =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="bg-yellow-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-yellow-500 mb-4">{t('frequentlyAskedQuestions')}</h1>
          <p className="text-xl text-gray-300">{t('faqDesc')}</p>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          {/* Search */}
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchFAQ')}
              className="w-full pl-12 pr-4 py-3 bg-black/30 border border-yellow-500/10 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>

          {/* FAQ Categories */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {['account', 'technical', 'gameplay'].map((category) => (
              <button
                key={category}
                className="bg-black/30 border border-yellow-500/10 rounded-lg p-4 hover:border-yellow-500/30 transition-all"
                onClick={() => setSearchQuery(t(category).toLowerCase())}
              >
                <h3 className="text-lg font-semibold capitalize">{t(category)}</h3>
              </button>
            ))}
          </div>

          {/* FAQ List */}
          <div className="space-y-4">
            {filteredFAQs.map((faq, index) => (
              <details
                key={index}
                className="group bg-black/30 rounded-lg border border-yellow-500/10 hover:border-yellow-500/30 transition-all"
              >
                <summary className="flex justify-between items-center cursor-pointer p-4 font-medium">
                  {faq.question}
                  <span className="transform group-open:rotate-180 transition-transform duration-200">
                    <ChevronDown className="w-5 h-5 text-yellow-500" />
                  </span>
                </summary>
                <div className="px-4 pb-4 text-gray-300">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>

          {/* Contact Support Link */}
          <div className="text-center mt-12 pt-8 border-t border-yellow-500/10">
            <p className="text-gray-400 mb-4">{t('needMoreHelp')}</p>
            <button
              onClick={handleContactSupport}
              className="inline-flex items-center gap-2 bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition"
            >
              {t('contactSupport')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}