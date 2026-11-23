import { useTranslation } from 'react-i18next';
import { Cart } from './components/Cart';
import { supportedLanguages } from './i18n';

function App() {
  const { t, i18n } = useTranslation();

  return (
    <main>
      <h1>{t('_STOREFRONT_DEMO_TITLE', 'i18next + Weblate demo')}</h1>
      <label>
        {t('_STOREFRONT_LANGUAGE_LABEL', 'Language')}{' '}
        <select value={i18n.resolvedLanguage} onChange={(e) => void i18n.changeLanguage(e.target.value)}>
          {supportedLanguages.map((lng) => (
            <option key={lng} value={lng}>
              {lng.toUpperCase()}
            </option>
          ))}
        </select>
      </label>
      <Cart />
    </main>
  );
}

export default App;
