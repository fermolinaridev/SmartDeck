import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Header } from './components/Header.jsx';
import { Home } from './views/Home.jsx';
import { Loading } from './views/Loading.jsx';
import { Deck } from './views/Deck.jsx';
import { Study } from './views/Study.jsx';
import { Done } from './views/Done.jsx';
import { DeckList } from './views/DeckList.jsx';
import { api } from './lib/api.js';

export default function App() {
  const [view, setViewRaw] = useState('home');
  const [deck, setDeck] = useState(null);
  const [decks, setDecks] = useState(null);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('sd:dark');
    const wantDark = stored ? stored === '1' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDark(wantDark);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('sd:dark', dark ? '1' : '0');
  }, [dark]);

  function setView(v) {
    setViewRaw(v);
    if (v === 'list') refreshDecks();
  }

  async function refreshDecks() {
    try {
      const list = await api.listDecks();
      setDecks(list);
    } catch (e) {
      console.error(e);
    }
  }

  async function handleGenerate(topic, text) {
    setViewRaw('loading');
    try {
      const d = await api.generate(topic, text);
      setDeck(d);
      setViewRaw('deck');
    } catch (e) {
      alert('Erro: ' + e.message);
      setViewRaw('home');
    }
  }

  async function openDeck(id) {
    try {
      const d = await api.getDeck(id);
      setDeck(d);
      setViewRaw('deck');
    } catch (e) {
      alert(e.message);
    }
  }

  async function handleReview(cardId, quality) {
    if (!deck) return;
    try {
      const { card, stats } = await api.review(deck.id, cardId, quality);
      setDeck((d) => ({
        ...d,
        stats,
        cards: d.cards.map((c) => (c.id === cardId ? card : c)),
      }));
    } catch (e) {
      console.error(e);
    }
  }

  async function handleDelete() {
    if (!deck || !confirm('Excluir este deck?')) return;
    try {
      await api.deleteDeck(deck.id);
      setDeck(null);
      setViewRaw('list');
      refreshDecks();
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header view={view} setView={setView} dark={dark} toggleDark={() => setDark(!dark)} />
      <main className="flex-1 max-w-6xl w-full mx-auto px-6">
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <Home key="home" onGenerate={handleGenerate} busy={false} />
          )}
          {view === 'loading' && <Loading key="loading" />}
          {view === 'deck' && deck && (
            <Deck
              key="deck"
              deck={deck}
              onStudy={() => setViewRaw('study')}
              onHome={() => setViewRaw('home')}
              onDelete={handleDelete}
            />
          )}
          {view === 'study' && deck && (
            <Study
              key="study"
              deck={deck}
              onReview={handleReview}
              onExit={() => setViewRaw('deck')}
              onDone={() => setViewRaw('done')}
            />
          )}
          {view === 'done' && deck && (
            <Done
              key="done"
              deck={deck}
              onBack={() => setViewRaw('deck')}
              onHome={() => setViewRaw('home')}
            />
          )}
          {view === 'list' && (
            <DeckList
              key="list"
              decks={decks}
              onOpen={openDeck}
              onHome={() => setViewRaw('home')}
            />
          )}
        </AnimatePresence>
      </main>
      <footer className="text-center text-xs text-slate-400 dark:text-slate-600 py-8">
        SmartDeck · PUC-Campinas · Práticas Empreendedoras
      </footer>
    </div>
  );
}
