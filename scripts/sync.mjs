// Injects progress/progress.json into the dashboard's data island.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const json = readFileSync(join(root, 'progress/progress.json'), 'utf8').trim();
JSON.parse(json); // validate before injecting
// the non-greedy island regex would end the match early on an embedded closing tag
if (json.includes('</script>')) throw new Error('progress.json must not contain "</script>"');

const htmlPath = join(root, 'site/index.html');
const html = readFileSync(htmlPath, 'utf8');
const re = /(<script id="progress-data" type="application\/json">)[\s\S]*?(<\/script>)/;
if (!re.test(html)) throw new Error('progress-data island not found in site/index.html');
// function replacer: a string replacement would interpret $-sequences ($1, $&, $`) inside the JSON
writeFileSync(htmlPath, html.replace(re, (_m, open, close) => `${open}\n${json}\n${close}`));
console.log('dashboard synced');
