import MarkdownIt from 'markdown-it';
import anchor from 'markdown-it-anchor';
import path from 'node:path';
import { base, media, read } from './content.mjs';

const md = new MarkdownIt({ html: false }).use(anchor, { slugify: text => text.trim().toLocaleLowerCase('fr').replace(/[^\p{L}\p{N}\s_-]/gu, '').replace(/\s+/g, '-') });
const escape = md.utils.escapeHtml;
export const chapterUrl = file => base + file.replace(/\.md$/, '/');
export async function renderPage(file, link = href => href, illustrations = []) {
  const source = read(file).replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/, '');
  const env = {};
  const tokens = md.parse(source, env);
  const seen = new Set();
  async function prepare(token) {
    if (token.type === 'image') {
      const src = token.attrGet('src');
      seen.add(src);
      token.attrSet('src', await media(file, decodeURI(src)));
      token.attrSet('loading', 'lazy');
    }
    if (token.type === 'link_open') token.attrSet('href', link(token.attrGet('href')));
    for (const child of token.children ?? []) await prepare(child);
  }
  for (const token of tokens) await prepare(token);
  for (let i = 1; i < tokens.length - 1; i++) {
    const children = tokens[i].children;
    if (tokens[i-1].type === 'paragraph_open' && children?.length === 1 && children[0].type === 'image') {
      tokens[i-1].tag = 'figure';
      tokens[i+1].tag = 'figure';
      const caption = new tokens[i].constructor('html_inline', '', 0);
      caption.content = '<figcaption>' + escape(children[0].content) + '</figcaption>';
      children.push(caption);
    }
  }
  let html = md.renderer.render(tokens, md.options, env);
  for (const src of illustrations ?? []) {
    if (seen.has(src)) continue;
    const title = path.parse(src).name.replace(/-/g, ' ');
    html += '<figure><img loading="lazy" src="' + await media(file, src) + '" alt="' + escape(title) + '"><figcaption>' + escape(title) + '</figcaption></figure>';
  }
  return html;
}
