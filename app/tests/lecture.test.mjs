import assert from 'node:assert/strict';
import test from 'node:test';
process.env.VIVELANDE_FIXTURES = '1';
const { chapters } = await import('../src/content.mjs');
const { renderPage } = await import('../src/markdown.mjs');
test('seuls les deux chapitres publiables alimentent la lecture', async () => {
  const pages = chapters();
  assert.deepEqual(pages.map(p => p.numero), [1,3]);
  const html = await renderPage(pages[0].file);
  assert.match(html, /<figcaption>Damier de test<\/figcaption>/);
  assert.match(html, /src="\/viveplume\/images\/\w+\.webp"/);
});
