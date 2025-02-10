import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../lib/i18n';
import { toast } from 'react-hot-toast';
import { useTranslation } from '../hooks/useTranslation';

interface LanguageSwitchProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
}

export function LanguageSwitch({ currentLanguage, onLanguageChange }: LanguageSwitchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation(currentLanguage);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleLanguageChange = (code: string) => {
    onLanguageChange(code);
    setIsOpen(false);
    toast.success(t('languageChanged'));
  };

  const currentLang = SUPPORTED_LANGUAGES.find(lang => lang.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-all"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={t('selectLanguage')}
      >
        <Globe className="w-5 h-5" aria-hidden="true" />
        <span className="hidden sm:inline">{currentLang.nativeName}</span>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-48 bg-black/90 backdrop-blur-sm rounded-lg shadow-xl border border-yellow-500/10 py-1 z-50"
          role="listbox"
          aria-label={t('selectLanguage')}
          onKeyDown={handleKeyDown}
        >
          {SUPPORTED_LANGUAGES.map((language) => (
            <button
              key={language.code}
              className={`w-full px-4 py-2 text-left flex items-center justify-between hover:bg-yellow-500/10 transition-colors ${
                currentLanguage === language.code ? 'text-yellow-500' : 'text-gray-300'
              }`}
              onClick={() => handleLanguageChange(language.code)}
              role="option"
              aria-selected={currentLanguage === language.code}
            >
              <div className="flex flex-col">
                <span className="font-medium">{language.nativeName}</span>
                <span className="text-sm text-gray-500">{language.name}</span>
              </div>
              {currentLanguage === language.code && (
                <Check className="w-4 h-4" aria-hidden="true" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}