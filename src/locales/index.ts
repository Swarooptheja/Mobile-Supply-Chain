import { en } from './en';
import { es } from './es';
import { fr } from './fr';

export type Language = 'en' | 'es' | 'fr';

export type TranslationKeys = typeof en;

export const translations = {
  en,
  es,
  fr,
} as const;

export const languageNames = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
} as const;

export const getLanguageName = (code: Language): string => {
  return languageNames[code];
};

export const getAvailableLanguages = (): Array<{ code: Language; name: string }> => {
  return Object.entries(languageNames).map(([code, name]) => ({
    code: code as Language,
    name,
  }));
};
