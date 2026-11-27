import test from 'node:test';
import assert from 'node:assert/strict';
process.env.VIVELANDE_FIXTURES = '1';
const { biblePages, localLink } = await import('../src/bible.mjs');
test('index, dossiers et fiches partagent les routes de leurs liens', () => {
  assert.deepEqual(biblePages().map(p => p.id).sort(), ['bible','bible/lieux','bible/lieux/atelier']);
  assert.equal(localLink('bible/lieux/atelier.md','../README.md'), '/viveplume/bible/');
  assert.equal(localLink('bible/README.md','lieux/atelier.md#établi'), '/viveplume/bible/lieux/atelier/#établi');
});
