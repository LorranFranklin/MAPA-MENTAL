/** Store mínima: estado único + notificação de mudanças (padrão observer). */
export function createStore(initial) {
  let state = initial;
  const listeners = new Set();

  return {
    getState: () => state,
    /** @param patch objeto parcial ou função (estadoAtual) => objeto parcial */
    setState(patch) {
      const prev = state;
      state = {
        ...state,
        ...(typeof patch === 'function' ? patch(state) : patch),
      };
      listeners.forEach((fn) => fn(state, prev));
    },
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
  };
}
