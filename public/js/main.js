/** Raiz de composição: liga dados, estado, visão e eventos. */
import { DEFAULT_OUTLINE, ROOT_LABEL } from './data.js';
import {
  addChild,
  fromOutline,
  parentIds,
  parseTree,
  removeNode,
  renameNode,
  toPlain,
} from './tree.js';
import { loadTree, saveTree } from './storage.js';
import { createStore } from './state.js';
import { render } from './view.js';

const $ = (sel) => document.querySelector(sel);
const treeEl = $('#tree');
const statusEl = $('#status');
const panelEl = $('#io-panel');
const ioText = $('#io-text');
const ioMessage = $('#io-message');

const defaultTree = () => fromOutline(ROOT_LABEL, DEFAULT_OUTLINE);
const initialTree = loadTree() ?? defaultTree();

const store = createStore({
  tree: initialTree,
  expanded: new Set([initialTree.id]),
  editing: false,
  renamingId: null,
  pendingDeleteId: null,
});

/* ---------- Ações sobre o mapa ---------- */
const withToggled = (set, id) => {
  const next = new Set(set);
  next.has(id) ? next.delete(id) : next.add(id);
  return next;
};

const actions = {
  toggle: (id) =>
    store.setState((s) => ({
      expanded: withToggled(s.expanded, id),
      pendingDeleteId: null,
    })),

  rename: (id) => store.setState({ renamingId: id, pendingDeleteId: null }),

  add: (id) =>
    store.setState((s) => {
      const { tree, id: childId } = addChild(s.tree, id, 'Novo item');
      return {
        tree,
        expanded: new Set(s.expanded).add(id),
        renamingId: childId,
        pendingDeleteId: null,
      };
    }),

  remove: (id) => {
    const s = store.getState();
    if (s.pendingDeleteId !== id)
      return store.setState({ pendingDeleteId: id });
    store.setState({ tree: removeNode(s.tree, id), pendingDeleteId: null });
  },

  commit: (id, label) =>
    store.setState((s) => ({
      tree: renameNode(s.tree, id, label),
      renamingId: null,
    })),

  cancel: () => store.setState({ renamingId: null }),
};

/* ---------- Comandos da barra ---------- */
let resetTimer = null;
const resetBtn = $('[data-cmd="reset"]');

function loadIntoStore(tree) {
  store.setState({
    tree,
    expanded: new Set([tree.id]),
    renamingId: null,
    pendingDeleteId: null,
  });
}

function disarmReset() {
  clearTimeout(resetTimer);
  resetTimer = null;
  resetBtn.textContent = 'Restaurar original';
}

const commands = {
  'expand-all': () =>
    store.setState((s) => ({ expanded: new Set(parentIds(s.tree)) })),
  'collapse-all': () =>
    store.setState((s) => ({ expanded: new Set([s.tree.id]) })),
  'toggle-edit': () =>
    store.setState((s) => ({
      editing: !s.editing,
      renamingId: null,
      pendingDeleteId: null,
    })),

  reset() {
    if (!resetTimer) {
      resetBtn.textContent = 'Confirmar restauração?';
      resetTimer = setTimeout(disarmReset, 4000);
      return;
    }
    disarmReset();
    loadIntoStore(defaultTree());
  },

  'open-io'() {
    ioText.value = JSON.stringify(toPlain(store.getState().tree));
    ioMessage.textContent = '';
    panelEl.hidden = false;
  },
  'close-io': () => {
    panelEl.hidden = true;
  },
  'apply-io'() {
    try {
      loadIntoStore(parseTree(JSON.parse(ioText.value)));
      ioMessage.textContent = 'Aplicado.';
    } catch {
      ioMessage.textContent =
        'Texto inválido. Cole exatamente o que foi copiado.';
    }
  },
};

/* ---------- Eventos (delegação) ---------- */
treeEl.addEventListener('click', (e) => {
  const el = e.target.closest('[data-action]');
  if (el && Object.hasOwn(actions, el.dataset.action))
    actions[el.dataset.action](el.dataset.id);
});

treeEl.addEventListener('keydown', (e) => {
  if (!e.target.matches('.edit-input')) return;
  if (e.key === 'Enter') actions.commit(e.target.dataset.id, e.target.value);
  else if (e.key === 'Escape') actions.cancel();
});

treeEl.addEventListener('focusout', (e) => {
  if (
    e.target.matches('.edit-input') &&
    store.getState().renamingId === e.target.dataset.id
  ) {
    actions.commit(e.target.dataset.id, e.target.value);
  }
});

document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-cmd]');
  if (el && Object.hasOwn(commands, el.dataset.cmd)) commands[el.dataset.cmd]();
});

/* ---------- Reação a mudanças de estado ---------- */
function paint(state) {
  render(treeEl, state);
  $('[data-cmd="toggle-edit"]').setAttribute(
    'aria-pressed',
    String(state.editing)
  );
  statusEl.textContent = state.editing
    ? 'Edição ativa: ✎ renomeia, + adiciona, ✕ exclui (clique duas vezes). Alterações ficam salvas neste navegador.'
    : '';
}

store.subscribe((state, prev) => {
  paint(state);
  if (state.tree !== prev.tree) saveTree(state.tree);
});

paint(store.getState());
