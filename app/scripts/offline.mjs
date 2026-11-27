import { globSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import path from 'node:path';

const icon = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="14" fill="#304a3a"/><path d="M18 30 Q34 24 48 34 V74 Q34 64 18 69 Z M82 30 Q66 24 52 34 V74 Q66 64 82 69 Z" fill="#f6ecd1"/></svg>');
for (const size of [192,512]) {
  await sharp(icon).resize(size,size).png().toFile('dist/icon-' + size + '.png');
}
const template = readFileSync('scripts/worker.js','utf8');
const digest = createHash('sha256').update(template);
const paths = globSync('**/*',{cwd:'dist',withFileTypes:true}).filter(e => e.isFile()).map(e => {
  return path.relative('dist',path.join(e.parentPath,e.name)).split(path.sep).join('/');
}).filter(p => p !== 'sw.js').sort();
for (const p of paths) digest.update(p).update(readFileSync('dist/' + p));
const urls = paths.map(p => '/viveplume/' + p.replace(/(^|\/)index\.html$/, '$1'));
writeFileSync('dist/sw.js', template.replace('__VERSION__',digest.digest('hex').slice(0,20)).replace('/* URLS */[]', JSON.stringify(urls)));
