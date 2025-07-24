import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

export const useLanguageTitle = () => {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const updateSEO = () => {
      // Update title
      document.title = `${t('personal.name')} - ${t('personal.title')}`;
      
      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', t('personal.description'));
      }
      
      // Update meta keywords
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute('content', t('personal.keywords'));
      }
      
      // Update Open Graph title
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) {
        ogTitle.setAttribute('content', `${t('personal.name')} - ${t('personal.title')}`);
      }
      
      // Update Open Graph description
      const ogDescription = document.querySelector('meta[property="og:description"]');
      if (ogDescription) {
        ogDescription.setAttribute('content', t('personal.about.intro'));
      }
      
      // Update Twitter title
      const twitterTitle = document.querySelector('meta[name="twitter:title"]');
      if (twitterTitle) {
        twitterTitle.setAttribute('content', `${t('personal.name')} - ${t('personal.title')}`);
      }
      
      // Update Twitter description
      const twitterDescription = document.querySelector('meta[name="twitter:description"]');
      if (twitterDescription) {
        twitterDescription.setAttribute('content', t('personal.about.intro'));
      }
      
      // Update lang attribute
      document.documentElement.lang = i18n.language === 'pt' ? 'pt-BR' : 
                                     i18n.language === 'en' ? 'en-US' : 
                                     i18n.language === 'es' ? 'es-ES' : i18n.language;
      
      // Update canonical URL based on language
      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) {
        const baseUrl = 'https://crepequer.dev';
        const langSuffix = i18n.language === 'pt' ? '' : `/${i18n.language}`;
        canonical.setAttribute('href', `${baseUrl}${langSuffix}/`);
      }
      
      // Update Open Graph locale
      const ogLocale = document.querySelector('meta[property="og:locale"]');
      if (ogLocale) {
        const locale = i18n.language === 'pt' ? 'pt_BR' : 
                      i18n.language === 'en' ? 'en_US' : 
                      i18n.language === 'es' ? 'es_ES' : 'pt_BR';
        ogLocale.setAttribute('content', locale);
      }
    };

    updateSEO();
    i18n.on('languageChanged', updateSEO);

    return () => {
      i18n.off('languageChanged', updateSEO);
    };
  }, [t, i18n]);
};

export default useLanguageTitle;
