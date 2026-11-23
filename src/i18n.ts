import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import cs from './locales/cs/translation.json';
import en from './locales/en/translation.json';

export const supportedLanguages = ['en', 'cs'];

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    cs: { translation: cs },
  },
  lng: 'en',
  fallbackLng: 'en',
  keySeparator: false,
  // Untranslated keys from Weblate arrive as "" - fall back to English instead of rendering nothing.
  returnEmptyString: false,
  interpolation: {
    escapeValue: false, // React already escapes
  },
});
