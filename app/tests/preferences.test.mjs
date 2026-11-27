import test from 'node:test';
import assert from 'node:assert/strict';
import { get, save, fraction } from '../src/preferences.mjs';
test('le stockage refusé ne bloque pas la lecture', () => {
  Object.defineProperty(globalThis, 'localStorage', {get() { throw Error('Refus'); }, configurable:true});
  assert.equal(get('theme'), null);
  assert.equal(save('theme','auto'), false);
});
test('progression bornée, même sur un chapitre court', () => {
  assert.deepEqual([fraction(1,2),fraction(-1,2),fraction(5,2),fraction(0,0)],[0.5,0,1,1]);
});
