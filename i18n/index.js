import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en';
import id from './id';

const resources = {
  en: {
    translation: en,
  },
  id: {
    translation: id,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'id',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
