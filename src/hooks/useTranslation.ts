import { useCallback } from 'react';
import { translations } from '../lib/i18n';

type TranslationKey = keyof typeof translations.en;

export function useTranslation(language: string) {
  const t = useCallback((key: TranslationKey) => {
    // First try the selected language
    if (translations[language]?.[key]) {
      return translations[language][key];
    }
    
    // Fallback to English
    if (translations.en[key]) {
      return translations.en[key];
    }
    
    // If key doesn't exist, return the key itself
    console.warn(`Translation missing for key: ${key}`);
    return key;
  }, [language]);

  return { t };
}