import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '../locales/en.json';
import te from '../locales/te.json';
import hi from '../locales/hi.json';
import { ta, kn, ml } from '../locales/otherLanguages';

const savedLanguage = localStorage.getItem('sheora_app_language') || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      te: { translation: te },
      hi: { translation: hi },
      ta: { translation: ta },
      kn: { translation: kn },
      ml: { translation: ml },
    },
    lng: savedLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already safeguards from XSS
    },
  });

export default i18n;
