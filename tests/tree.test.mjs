import test from 'node:test';
import assert from 'node:assert/strict';
import {
  addChild,
  fromOutline,
  parentIds,
  parseTree,
  removeNode,
  renameNode,
  toPlain,
} from '../public/js/tree.js';

const sample = () => fromOutline('R', [['A', [['A1'], ['A2']]], ['B']]);

test('addChild não altera a árvore original', () => {
  const t = sample();
  const { tree, id } = addChild(t, t.children[1].id, 'B1');
  assert.equal(t.children[1].children.length, 0);
  assert.equal(tree.children[1].children[0].id, id);
  assert.equal(tree.children[0], t.children[0]); // ramo intacto é reaproveitado
});

test('renameNode troca o rótulo e ignora texto vazio', () => {
  const t = sample();
  assert.equal(
    renameNode(t, t.children[0].id, '  Novo ').children[0].label,
    'Novo'
  );
  assert.equal(renameNode(t, t.children[0].id, '   '), t);
});

test('removeNode apaga o nó com seus descendentes', () => {
  const t = sample();
  const next = removeNode(t, t.children[0].id);
  assert.deepEqual(
    next.children.map((c) => c.label),
    ['B']
  );
});

test('removeNode não remove a raiz', () => {
  const t = sample();
  assert.equal(removeNode(t, t.id), t);
});

test('parentIds lista só nós com filhos', () => {
  const t = sample();
  assert.equal(parentIds(t).length, 2); // R e A
});

test('parseTree faz ida e volta com toPlain', () => {
  const t = sample();
  assert.deepEqual(toPlain(parseTree(toPlain(t))), toPlain(t));
});

test('parseTree rejeita dados inválidos', () => {
  assert.throws(() => parseTree({ label: '' }));
  assert.throws(() => parseTree({ label: 'x', children: 'y' }));
  assert.throws(() => parseTree(null));
});
