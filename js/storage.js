/** Adaptador de persistência. Falha em silêncio: o app funciona mesmo sem localStorage. */
import { parseTree, toPlain } from './tree.js';

const KEY = 'mapa-mental:v2';

export function loadTree() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? parseTree(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

export function saveTree(tree) {
  try {
    localStorage.setItem(KEY, JSON.stringify(toPlain(tree)));
  } catch {
    /* modo privado, cota cheia ou storage bloqueado */
  }
}
