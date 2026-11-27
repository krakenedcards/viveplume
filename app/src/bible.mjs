import path from 'node:path';
import { base, files, read, metadata } from './content.mjs';

const urlPath = file => file.replace(/(?:^|\/)README\.md$/i, '/').replace(/\.md$/i, '/').replace(/^\/+|\/+$/g, '');
export function localLink(file, href) {
  if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#|\?)/i.test(href)) return href;
  const [, raw, suffix] = /^([^?#]*)(.*)$/.exec(href);
  const target = path.posix.normalize(path.posix.join(path.posix.dirname(file), decodeURI(raw)));
  if (!/^(bible|romans)(\/|$)/.test(target)) return href;
  return base + urlPath(target) + '/' + suffix;
}
export function biblePages() {
  const entries = new Map();
  for (const file of files('bible/**/*.md')) {
    const route = urlPath(file);
    const dirs = file.split('/').slice(0,-1);
    for (let n = 1; n <= dirs.length; n++) {
      const id = dirs.slice(0,n).join('/');
      if (!entries.has(id)) entries.set(id, { id, title: dirs[n-1], file: null });
    }
    if (path.basename(file).startsWith('_')) continue;
    const title = metadata(file).nom || /^#\s+(.+)$/m.exec(read(file))?.[1] || path.basename(file, '.md');
    entries.set(route, { id: route, file, title });
  }
  return [...entries.values()].sort((a,b) => a.title.localeCompare(b.title, 'fr'));
}
