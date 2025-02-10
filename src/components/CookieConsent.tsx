import React, { useEffect, useState } from 'react';
import { Cookie, X } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

interface CookieConsentProps {
  language: string;
}

export function CookieConsent({ language }: CookieConsentProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useTranslation(language);

  useEffect(() => {
    const hasConsented = localStorage.getItem('cookieConsent');
    if (!hasConsented) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'false');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-yellow-500/20 z-50 p-4 transform transition-transform duration-300">
      <div className="container mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Cookie className="w-6 h-6 text-yellow-500" />
          <p className="text-gray-300 text-sm">
            {t('cookieMessage')}{' '}
            <a href="/privacy" className="text-yellow-500 hover:text-yellow-400 underline">
              {t('privacyPolicy')}
            </a>
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleDecline}
            className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
          >
            {t('decline')}
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 text-sm font-medium bg-yellow-500 text-black rounded hover:bg-yellow-400 transition-colors"
          >
            {t('acceptAll')}
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-white p-1"
            aria-label="Close cookie consent"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}