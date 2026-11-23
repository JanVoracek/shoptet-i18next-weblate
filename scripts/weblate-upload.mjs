// Uploads src/locales/<lang>/translation.json files to Weblate via its REST API.
//
// Env (or .env file):
//   WEBLATE_URL        e.g. https://hosted.weblate.org
//   WEBLATE_TOKEN      personal API key (Weblate -> Your profile -> API access)
//   WEBLATE_PROJECT    defaults to shoptet-i18next-demo
//   WEBLATE_COMPONENT  optional; auto-detected from the component file mask
import { readdir, readFile } from 'node:fs/promises';

const LOCALES_DIR = 'src/locales';
const FILE_MASK = `${LOCALES_DIR}/*/translation.json`;
const SOURCE_LANGUAGE = 'en';

const { WEBLATE_URL, WEBLATE_TOKEN, WEBLATE_PROJECT = 'shoptet-i18next-demo' } = process.env;
if (!WEBLATE_URL || !WEBLATE_TOKEN) {
  console.error('Set WEBLATE_URL and WEBLATE_TOKEN (e.g. in .env).');
  process.exit(1);
}

const api = new URL('api/', WEBLATE_URL.endsWith('/') ? WEBLATE_URL : `${WEBLATE_URL}/`);
const headers = { Authorization: `Token ${WEBLATE_TOKEN}` };

async function request(path, init = {}) {
  const res = await fetch(new URL(path, api), { ...init, headers });
  const body = await res.json().catch(() => null);
  if (!res.ok) throw new Error(`${init.method ?? 'GET'} ${path} -> ${res.status} ${JSON.stringify(body)}`);
  return body;
}

async function findComponent() {
  if (process.env.WEBLATE_COMPONENT) return process.env.WEBLATE_COMPONENT;
  const components = [];
  for (let page = `projects/${WEBLATE_PROJECT}/components/`; page; ) {
    const data = await request(page);
    components.push(...data.results);
    page = data.next;
  }
  const match = components.find((c) => c.filemask === FILE_MASK);
  if (!match) {
    const found = components.map((c) => `${c.slug} (${c.filemask})`).join(', ') || 'none';
    throw new Error(`No component with file mask ${FILE_MASK} in ${WEBLATE_PROJECT}. Found: ${found}. Set WEBLATE_COMPONENT.`);
  }
  return match.slug;
}

async function upload(component, language) {
  const form = new FormData();
  const content = await readFile(`${LOCALES_DIR}/${language}/translation.json`);
  form.append('file', new Blob([content], { type: 'application/json' }), 'translation.json');
  if (language === SOURCE_LANGUAGE) {
    // Source strings: code is the source of truth, so new keys are added and removed keys disappear.
    form.append('method', 'replace');
  } else {
    // Translations: fill in only strings that are still untranslated in Weblate, never overwrite translators' work.
    form.append('method', 'translate');
    form.append('conflicts', 'ignore');
  }
  const result = await request(`translations/${WEBLATE_PROJECT}/${component}/${language}/file/`, { method: 'POST', body: form });
  console.log(`${language}: accepted ${result.accepted}, skipped ${result.not_found + result.skipped}, total ${result.total}`);
}

const component = await findComponent();
console.log(`Uploading to ${WEBLATE_URL} ${WEBLATE_PROJECT}/${component}`);
const languages = (await readdir(LOCALES_DIR)).sort((a, b) => (a === SOURCE_LANGUAGE ? -1 : b === SOURCE_LANGUAGE ? 1 : 0));
for (const language of languages) await upload(component, language);
