import { defineConfig } from 'i18next-cli';

export default defineConfig({
  locales: ['en', 'cs'],
  extract: {
    input: ['src/**/*.{ts,tsx}'],
    // One file per language/namespace -> Weblate file mask: src/locales/*/translation.json
    output: 'src/locales/{{language}}/{{namespace}}.json',
    primaryLanguage: 'en',
    defaultNS: 'translation',
    // Flat keys are easiest to review in Weblate; nested keys work too.
    keySeparator: false,
    // Keep keys that disappear from code out of the files sent to Weblate.
    removeUnusedKeys: true,
    sort: true,
    indentation: 2,
    // Secondary languages get empty strings for new keys so Weblate shows them as untranslated.
    defaultValue: '',
  },
});
