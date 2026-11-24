/**
 * Camada de visão: recebe o estado e desenha o DOM. Não altera estado nem acessa storage.
 * Os eventos são tratados em main.js via delegação (data-action / data-id).
 * Todo texto entra por textContent — sem risco de injeção de HTML.
 */
const BRANCH_COLORS = 7;

function h(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined) el.textContent = text;
  return el;
}

function buildLabel(node, depth, open) {
  const hasKids = node.children.length > 0;
  const kind = depth === 0 ? 'root' : depth === 1 ? 'strong' : 'soft';
  const btn = h('button', `node node--${kind}${hasKids ? ' has' : ''}`);
  btn.type = 'button';
  btn.append(h('span', '', node.label));
  if (hasKids) {
    btn.dataset.action = 'toggle';
    btn.dataset.id = node.id;
    btn.setAttribute('aria-expanded', String(open));
    btn.append(
      h('span', 'node__count', String(node.children.length)),
      h('span', 'node__chev', '›')
    );
  }
  return btn;
}

function buildInput(node) {
  const wrap = h('span', 'node node--soft');
  const input = h('input', 'edit-input');
  input.value = node.label;
  input.dataset.id = node.id;
  input.setAttribute('aria-label', 'Editar texto');
  wrap.append(input);
  return wrap;
}

function toolButton(action, id, text, title, extraClass = '') {
  const b = h('button', `tool ${extraClass}`.trim(), text);
  b.type = 'button';
  b.dataset.action = action;
  b.dataset.id = id;
  b.title = title;
  b.setAttribute('aria-label', title);
  return b;
}

function buildTools(node, depth, pendingDeleteId) {
  const box = h('span', 'tools');
  const isRoot = depth === 0;
  if (!isRoot) box.append(toolButton('rename', node.id, '✎', 'Renomear'));
  box.append(
    toolButton(
      'add',
      node.id,
      '+',
      isRoot ? 'Adicionar ramo' : 'Adicionar subitem'
    )
  );
  if (!isRoot) {
    const confirming = pendingDeleteId === node.id;
    box.append(
      toolButton(
        'remove',
        node.id,
        confirming ? 'Excluir?' : '✕',
        confirming ? 'Confirmar exclusão' : 'Excluir',
        confirming ? 'confirm' : ''
      )
    );
  }
  return box;
}

function buildItem(node, depth, ctx) {
  const open = ctx.expanded.has(node.id);
  const item = h('div', 'item');
  const box = h('div', 'nodebox');
  box.append(
    ctx.renamingId === node.id
      ? buildInput(node)
      : buildLabel(node, depth, open)
  );
  if (ctx.editing) box.append(buildTools(node, depth, ctx.pendingDeleteId));
  item.append(box);

  if (node.children.length && open) {
    const kids = h('div', 'kids');
    node.children.forEach((child, i) => {
      const kid = h(
        'div',
        depth === 0 ? `kid branch-${i % BRANCH_COLORS}` : 'kid'
      );
      kid.append(buildItem(child, depth + 1, ctx));
      kids.append(kid);
    });
    item.append(kids);
  }
  return item;
}

export function render(container, state) {
  container.replaceChildren(buildItem(state.tree, 0, state));
  const input = container.querySelector('.edit-input');
  if (input) {
    input.focus();
    input.select();
  }
}
