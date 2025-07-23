import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

export const useLanguageTitle = () => {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const updateTitle = () => {
      document.title = `${t('personal.name')} - ${t('personal.title')}`;
      
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', t('personal.description'));
      }
    };

    updateTitle();
    i18n.on('languageChanged', updateTitle);

    return () => {
      i18n.off('languageChanged', updateTitle);
    };
  }, [t, i18n]);
};

export default useLanguageTitle;
