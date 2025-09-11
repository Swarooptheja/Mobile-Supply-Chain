import { useI18n } from '../context/I18nContext';

/**
 * Custom hook for easier translation usage
 * Provides a simple `t` function for translating keys
 */
export const useTranslation = () => {
  const { t, language, setLanguage } = useI18n();
  
  return {
    t,
    language,
    setLanguage,
  };
};

export default useTranslation;
