import test from 'node:test';
import assert from 'node:assert/strict';
process.env.VIVELANDE_FIXTURES = '1';
const { novels, compareBooks, published } = await import('../src/content.mjs');
test('catalogue fictif et ordre de lecture', () => {
  assert.equal(novels()[0].slug, 'essai');
  const titles = [{titre:'Z',ordre_lecture:null},{titre:'Y',ordre_lecture:1},{titre:'A',ordre_lecture:null}];
  assert.deepEqual(titles.sort(compareBooks).map(b => b.titre), ['Y','A','Z']);
  assert.equal(published('00-modele.md',{statut:'final'}), false);
});
