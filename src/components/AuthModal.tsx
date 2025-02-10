import React, { useState } from 'react';
import { X } from 'lucide-react';
import { RegisterForm } from './RegisterForm';
import { LoginForm } from './LoginForm';
import { useTranslation } from '../hooks/useTranslation';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: string;
}

export function AuthModal({ isOpen, onClose, language = 'en' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const { t } = useTranslation(language);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-xl p-8 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>

        {mode === 'login' ? (
          <>
            <LoginForm onSuccess={onClose} language={language} />
            <p className="text-center mt-6 text-gray-400">
              {t('dontHaveAccount')}{' '}
              <button
                onClick={() => setMode('register')}
                className="text-yellow-500 hover:text-yellow-400"
              >
                {t('register')}
              </button>
            </p>
          </>
        ) : (
          <>
            <RegisterForm onSuccess={() => setMode('login')} language={language} />
            <p className="text-center mt-6 text-gray-400">
              {t('alreadyHaveAccount')}{' '}
              <button
                onClick={() => setMode('login')}
                className="text-yellow-500 hover:text-yellow-400"
              >
                {t('login')}
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}