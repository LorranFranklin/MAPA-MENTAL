/**
 * Domínio: operações PURAS e IMUTÁVEIS sobre a árvore.
 * Não conhece DOM, storage nem estado da interface — por isso é fácil de testar.
 *
 * @typedef {{ id: string, label: string, children: TreeNode[] }} TreeNode
 */

const MAX_DEPTH = 10;
const MAX_LABEL = 200;
let counter = 0;

const newId = () => `n${++counter}`;

/** @returns {TreeNode} */
export function createNode(label, children = []) {
  return { id: newId(), label, children };
}

/** Converte o formato compacto [rótulo, filhos?] em árvore. */
export function fromOutline(label, outline = []) {
  return createNode(
    label,
    outline.map(([l, kids]) => fromOutline(l, kids))
  );
}

/** Remove os ids (formato para salvar/exportar). */
export function toPlain(node) {
  return { label: node.label, children: node.children.map(toPlain) };
}

/** Valida dados externos (storage/importação) e devolve uma árvore nova. Lança erro se inválido. */
export function parseTree(raw, depth = 0) {
  if (depth > MAX_DEPTH) throw new Error('Profundidade excessiva');
  if (!raw || typeof raw.label !== 'string') throw new Error('Nó inválido');
  const label = raw.label.trim();
  if (!label || label.length > MAX_LABEL) throw new Error('Rótulo inválido');
  const kids = raw.children ?? [];
  if (!Array.isArray(kids)) throw new Error('Filhos inválidos');
  return createNode(
    label,
    kids.map((c) => parseTree(c, depth + 1))
  );
}

/** Aplica fn ao nó com o id dado, copiando só o caminho alterado. */
function updateNode(node, id, fn) {
  if (node.id === id) return fn(node);
  let changed = false;
  const children = node.children.map((c) => {
    const next = updateNode(c, id, fn);
    if (next !== c) changed = true;
    return next;
  });
  return changed ? { ...node, children } : node;
}

/** @returns {{ tree: TreeNode, id: string }} árvore nova e id do filho criado */
export function addChild(tree, parentId, label) {
  const child = createNode(label);
  const next = updateNode(tree, parentId, (n) => ({
    ...n,
    children: [...n.children, child],
  }));
  return { tree: next, id: child.id };
}

export function renameNode(tree, id, label) {
  const clean = label.trim();
  if (!clean || clean.length > MAX_LABEL) return tree;
  return updateNode(tree, id, (n) => ({ ...n, label: clean }));
}

/** Remove o nó (e seus descendentes). A raiz não pode ser removida. */
export function removeNode(tree, id) {
  const prune = (node) => {
    const kept = node.children.filter((c) => c.id !== id).map(prune);
    const same =
      kept.length === node.children.length &&
      kept.every((c, i) => c === node.children[i]);
    return same ? node : { ...node, children: kept };
  };
  return prune(tree);
}

/** Ids de todos os nós que têm filhos (usado por "Expandir tudo"). */
export function parentIds(node, acc = []) {
  if (node.children.length) acc.push(node.id);
  node.children.forEach((c) => parentIds(c, acc));
  return acc;
}
