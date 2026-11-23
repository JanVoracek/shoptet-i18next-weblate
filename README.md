# i18next + Weblate demo

Minimal React + TypeScript (Vite) app using `react-i18next`, with English and Czech translations including plurals.

```sh
pnpm install
pnpm dev              # start the app
pnpm i18n:extract     # scan src/ and update src/locales/*/translation.json
pnpm i18n:status      # show translation coverage per language
```

## Translation files

`pnpm i18n:extract` (powered by [`i18next-cli`](https://github.com/i18next/i18next-cli), config in `i18next.config.ts`):

- reads all `t(...)` calls in `src/`,
- writes English source strings (from the defaults in code) to `src/locales/en/translation.json`,
- adds missing keys as empty strings to `src/locales/cs/translation.json`, keeping existing translations,
- creates the right plural suffixes per language (`en`: `_one`, `_other`; `cs`: `_one`, `_few`, `_many`, `_other`),
- removes keys that are no longer used in code.

## Weblate component settings

| Setting                 | Value                               |
| ----------------------- | ----------------------------------- |
| File format             | i18next JSON file v4                |
| File mask               | `src/locales/*/translation.json`    |
| Monolingual base file   | `src/locales/en/translation.json`   |
| Source language         | English                             |

Weblate groups the `_one/_few/_many/_other` keys into one plural string, so translators see a single entry with a field for each Czech plural form.
