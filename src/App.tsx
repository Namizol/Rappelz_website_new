import React, { useState } from 'react';
import { Download, ChevronRight, Globe, Users, Sword, Calendar, User } from 'lucide-react';
import { AuthModal } from './components/AuthModal';
import { CookieConsent } from './components/CookieConsent';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { DownloadPage } from './components/DownloadPage';
import { NewsPage } from './components/NewsPage';
import { SupportPage } from './components/SupportPage';
import { FAQPage } from './components/FAQPage';
import { AdminPanel } from './components/AdminPanel';
import { useAuth } from './hooks/useAuth';
import { Toaster } from 'react-hot-toast';
import { LanguageSwitch } from './components/LanguageSwitch';
import { useTranslation } from './hooks/useTranslation';
import { useNews } from './hooks/useNews';
import { LoadingSpinner } from './components/LoadingSpinner';

type Page = 'home' | 'privacy' | 'download' | 'news' | 'support' | 'faq' | 'admin';

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function NavButton({ active, onClick, children }: NavButtonProps) {
  return (
    <button
      className={`hover:text-yellow-500 transition ${active ? 'text-yellow-500' : ''}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'en');
  const { user, signOut } = useAuth();
  const { t } = useTranslation(language);
  const { news, loading } = useNews();

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAuth = () => {
    setIsAuthModalOpen(true);
  };

  // Get the latest 3 news articles
  const latestNews = news.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Toaster position="top-right" />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} language={language} />
      <CookieConsent language={language} />
      
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-sm fixed w-full z-50">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <button 
            className="text-2xl font-bold text-yellow-500 hover:text-yellow-400 transition" 
            onClick={() => handleNavigate('home')}
            aria-label="Go to home page"
          >
            Echo der Ewigkeit
          </button>
          <div className="flex gap-6 items-center">
            <NavButton active={currentPage === 'home'} onClick={() => handleNavigate('home')}>
              {t('home')}
            </NavButton>
            <NavButton active={currentPage === 'news'} onClick={() => handleNavigate('news')}>
              {t('news')}
            </NavButton>
            <NavButton active={currentPage === 'download'} onClick={() => handleNavigate('download')}>
              {t('download')}
            </NavButton>
            <NavButton active={currentPage === 'faq'} onClick={() => handleNavigate('faq')}>
              {t('faq')}
            </NavButton>
            {user?.role === 'admin' && (
              <NavButton active={currentPage === 'admin'} onClick={() => handleNavigate('admin')}>
                Admin
              </NavButton>
            )}
            <LanguageSwitch
              currentLanguage={language}
              onLanguageChange={handleLanguageChange}
            />
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-yellow-500">{user.email}</span>
                <button
                  onClick={() => signOut()}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                >
                  {t('signOut')}
                </button>
              </div>
            ) : (
              <button
                onClick={handleOpenAuth}
                className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-400 transition"
              >
                {t('signIn')}
              </button>
            )}
          </div>
        </nav>
      </header>

      {/* Main Content */}
      {currentPage === 'privacy' ? (
        <PrivacyPolicy language={language} />
      ) : currentPage === 'download' ? (
        <DownloadPage />
      ) : currentPage === 'news' ? (
        <NewsPage language={language} />
      ) : currentPage === 'support' ? (
        <SupportPage language={language} onOpenAuth={handleOpenAuth} />
      ) : currentPage === 'faq' ? (
        <FAQPage language={language} onNavigate={handleNavigate} />
      ) : currentPage === 'admin' ? (
        <AdminPanel language={language} />
      ) : (
        // Home page content
        <div>
          {/* Hero Section */}
          <section className="relative h-screen">
            <div className="absolute inset-0">
              <img 
                src="https://images.unsplash.com/photo-1511882150382-421056c89033?auto=format&fit=crop&q=80"
                alt="Hero Background"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80"></div>
            </div>
            <div className="relative container mx-auto px-4 h-full flex items-center">
              <div className="max-w-2xl">
                <h1 className="text-6xl font-bold mb-6">{t('welcomeTitle')}</h1>
                <p className="text-xl mb-8">{t('welcomeDescription')}</p>
                <button 
                  onClick={() => handleNavigate('download')}
                  className="bg-yellow-500 text-black px-8 py-4 rounded-lg font-bold flex items-center gap-2 hover:bg-yellow-400 transition"
                >
                  <Download size={24} />
                  {t('playNow')}
                </button>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-20 bg-[#111]">
            <div className="container mx-auto px-4">
              <h2 className="text-4xl font-bold text-center mb-16">{t('gameFeatures')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <FeatureCard 
                  icon={<Globe />}
                  title={t('vastWorld')}
                  description={t('vastWorldDesc')}
                />
                <FeatureCard 
                  icon={<Users />}
                  title={t('epicGuilds')}
                  description={t('epicGuildsDesc')}
                />
                <FeatureCard 
                  icon={<Sword />}
                  title={t('pvpCombat')}
                  description={t('pvpCombatDesc')}
                />
              </div>
            </div>
          </section>

          {/* News Section */}
          <section className="py-20 bg-[#0a0a0a]">
            <div className="container mx-auto px-4">
              <div className="flex justify-between items-center mb-16">
                <h2 className="text-4xl font-bold">{t('latestNews')}</h2>
                <button
                  onClick={() => handleNavigate('news')}
                  className="text-yellow-500 hover:text-yellow-400 transition flex items-center gap-2"
                >
                  {t('viewAllNews')} <ChevronRight size={20} />
                </button>
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner size={40} />
                </div>
              ) : latestNews.length > 0 ? (
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Featured News */}
                  <div 
                    className="relative group cursor-pointer rounded-2xl overflow-hidden"
                    onClick={() => handleNavigate('news')}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10"></div>
                    <img 
                      src={latestNews[0].image_url || "https://images.unsplash.com/photo-1542751371-adc38448a05e"}
                      alt={latestNews[0].title}
                      className="w-full h-[400px] object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                      <div className="flex items-center gap-4 text-sm text-gray-300 mb-3">
                        <span className="px-3 py-1 rounded-full text-sm bg-blue-500/20 text-blue-500">
                          {t(latestNews[0].category)}
                        </span>
                        <span className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {new Date(latestNews[0].publish_date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          {t('adminTeam')}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold mb-3">{latestNews[0].title}</h3>
                      <p className="text-gray-300 mb-4 line-clamp-2">{latestNews[0].content}</p>
                      <span className="text-yellow-500 flex items-center gap-1 group-hover:text-yellow-400 transition">
                        {t('readMore')} <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-6">
                    {latestNews.slice(1, 3).map((article) => (
                      <NewsCard 
                        key={article.id}
                        title={article.title}
                        date={new Date(article.publish_date).toLocaleDateString()}
                        author={t('adminTeam')}
                        category={t(article.category)}
                        categoryColor="bg-blue-500/20 text-blue-500"
                        description={article.content}
                        image={article.image_url || undefined}
                        onClick={() => handleNavigate('news')}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-400 py-12">
                  {t('noArticlesFound')}
                </div>
              )}
            </div>
          </section>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-black py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-2xl font-bold text-yellow-500 mb-4 md:mb-0">Echo der Ewigkeit</div>
            <div className="flex gap-6">
              <button className="text-gray-400 hover:text-white transition">
                {t('termsOfService')}
              </button>
              <button 
                className="text-gray-400 hover:text-white transition"
                onClick={() => handleNavigate('privacy')}
              >
                {t('privacyPolicy')}
              </button>
              <button 
                className="text-gray-400 hover:text-white transition"
                onClick={() => handleNavigate('support')}
              >
                {t('support')}
              </button>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-400">
            {t('copyright')}
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-black/50 p-8 rounded-lg hover:bg-black/70 transition">
      <div className="text-yellow-500 mb-4 w-12 h-12">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}

interface NewsCardProps {
  title: string;
  date: string;
  author: string;
  category: string;
  categoryColor: string;
  description: string;
  image?: string;
  onClick: () => void;
}

function NewsCard({ 
  title, 
  date, 
  author, 
  category,
  categoryColor,
  description, 
  image,
  onClick 
}: NewsCardProps) {
  const { t } = useTranslation('en');
  
  return (
    <div 
      className="bg-black/30 rounded-xl overflow-hidden border border-yellow-500/10 hover:border-yellow-500/30 transition-all cursor-pointer group"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
    >
      {image && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className={`px-3 py-1 rounded-full text-sm ${categoryColor}`}>
            {category}
          </span>
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {date}
          </span>
          <span className="flex items-center gap-1">
            <User className="w-4 h-4" />
            {author}
          </span>
        </div>
        <p className="text-gray-300 mb-4 line-clamp-2">{description}</p>
        <span className="text-yellow-500 flex items-center gap-1 group-hover:text-yellow-400 transition">
          {t('readMore')} <ChevronRight className="w-4 h-4" />
        </span>
      </div>
    </div>
  );
}

export default App;