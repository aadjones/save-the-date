import React, { createContext, useContext, useState, useCallback } from 'react';
import { Locale, Translations, en, es } from './translations';

const translations: Record<Locale, Translations> = { en, es };

const STORAGE_KEY = 'save-the-date-locale';

function getInitialLocale(): Locale {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'en' || stored === 'es') return stored;
  } catch { }
  return 'en';
}

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try { localStorage.setItem(STORAGE_KEY, next); } catch { }
  }, []);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t: translations[locale] }}>
      {children}
    </LocaleContext.Provider>
  );
};

export function useT(): Translations {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useT must be used within LocaleProvider');
  return ctx.t;
}

export function useLocale(): [Locale, (locale: Locale) => void] {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider');
  return [ctx.locale, ctx.setLocale];
}

export const LanguageToggleLight: React.FC = () => {
  const [locale, setLocale] = useLocale();

  return (
    <div className="flex items-center gap-0 select-none">
      <button
        onClick={() => setLocale('en')}
        className={`flex items-center gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 rounded-l-full border-2 transition-all cursor-pointer ${locale === 'en'
            ? 'border-stone-500 bg-stone-900 text-stone-100 scale-105'
            : 'border-stone-300 text-stone-400 hover:text-stone-700 hover:border-stone-400'
          }`}
      >
        <span className="text-sm">🇺🇸</span>
        <span className="font-mono text-[10px] sm:text-xs font-bold tracking-wider">EN</span>
      </button>
      <button
        onClick={() => setLocale('es')}
        className={`flex items-center gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 rounded-r-full border-2 border-l-0 transition-all cursor-pointer ${locale === 'es'
            ? 'border-stone-500 bg-stone-900 text-stone-100 scale-105'
            : 'border-stone-300 text-stone-400 hover:text-stone-700 hover:border-stone-400'
          }`}
      >
        <span className="text-sm">🇲🇽</span>
        <span className="font-mono text-[10px] sm:text-xs font-bold tracking-wider">ES</span>
      </button>
    </div>
  );
};

export const LanguageToggle: React.FC = () => {
  const [locale, setLocale] = useLocale();

  return (
    <div className="flex items-center gap-0 select-none">
      <button
        onClick={() => setLocale('en')}
        className={`flex items-center gap-1.5 sm:gap-2 px-2 py-1 sm:px-4 sm:py-2 rounded-l-full border-2 transition-all cursor-pointer ${locale === 'en'
            ? 'border-stone-500 bg-stone-800/80 text-stone-100 scale-105'
            : 'border-stone-700/50 text-stone-500 hover:text-stone-300 hover:border-stone-600'
          }`}
      >
        <span className="text-sm sm:text-lg">🇺🇸</span>
        <span className="font-mono text-[10px] sm:text-sm font-bold tracking-wider">EN</span>
      </button>
      <button
        onClick={() => setLocale('es')}
        className={`flex items-center gap-1.5 sm:gap-2 px-2 py-1 sm:px-4 sm:py-2 rounded-r-full border-2 border-l-0 transition-all cursor-pointer ${locale === 'es'
            ? 'border-stone-500 bg-stone-800/80 text-stone-100 scale-105'
            : 'border-stone-700/50 text-stone-500 hover:text-stone-300 hover:border-stone-600'
          }`}
      >
        <span className="text-sm sm:text-lg">🇲🇽</span>
        <span className="font-mono text-[10px] sm:text-sm font-bold tracking-wider">ES</span>
      </button>
    </div>
  );
};
