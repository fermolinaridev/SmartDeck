const base = '';

async function req(path, opts = {}) {
  const res = await fetch(base + path, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Erro de rede.' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  generate: (topic, text) =>
    req('/api/generate', { method: 'POST', body: JSON.stringify({ topic, text }) }),
  listDecks: () => req('/api/decks'),
  getDeck: (id) => req('/api/decks/' + id),
  deleteDeck: (id) => req('/api/decks/' + id, { method: 'DELETE' }),
  review: (deckId, cardId, quality) =>
    req(`/api/decks/${deckId}/review`, {
      method: 'POST',
      body: JSON.stringify({ cardId, quality }),
    }),
};
