import { globSync, readFileSync, realpathSync } from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';
import { createHash } from 'node:crypto';
import { mkdir } from 'node:fs/promises';
import sharp from 'sharp';

export const root = realpathSync(process.env.VIVELANDE_FIXTURES === '1' ? 'tests/fixtures' : '..');
export const base = '/viveplume/';
export const files = pattern => globSync(pattern, { cwd: root }).sort();
export const read = file => readFileSync(path.join(root, file), 'utf8');

export function metadata(file) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(read(file));
  return match ? parse(match[1]) : {};
}
export function published(file, data) {
  return !path.basename(file).startsWith('00-modele') && ['relu', 'final'].includes(data.statut);
}
export function novels() {
  return files('romans/*/roman.yaml').map(file => ({ id: file.split('/')[1], ...parse(read(file)) }));
}
export function chapters() {
  return files('romans/*/chapitres/*.md').flatMap(file => {
    const data = metadata(file);
    return published(file, data) ? [{ ...data, id: file.slice(0,-3), file }] : [];
  });
}
export function compareBooks(a, b) {
  return (a.ordre_lecture ?? Infinity) - (b.ordre_lecture ?? Infinity) || a.titre.localeCompare(b.titre, 'fr');
}

// Générer uniquement les images référencées par une page publiée.
export async function media(source, relative) {
  const file = realpathSync(path.resolve(root, path.dirname(source), relative));
  const allowed = ['romans','bible'].some(dir => file.startsWith(path.join(root, dir) + path.sep));
  if (!allowed || !/\.(webp|png|jpe?g)$/i.test(file)) throw Error('Image non prise en charge : ' + relative);
  const bytes = readFileSync(file);
  const key = createHash('sha256').update(bytes).digest('hex').slice(0,24);
  await mkdir('dist/images', { recursive: true });
  await sharp(bytes).rotate().resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true }).webp().toFile('dist/images/' + key + '.webp');
  return base + 'images/' + key + '.webp';
}
