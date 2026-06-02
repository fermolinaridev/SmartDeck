import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Header } from './components/Header.jsx';
import { Landing } from './views/Landing.jsx';
import { Login } from './views/Login.jsx';
import { Dashboard } from './views/Dashboard.jsx';
import { Home } from './views/Home.jsx';
import { Loading } from './views/Loading.jsx';
import { Deck } from './views/Deck.jsx';
import { Study } from './views/Study.jsx';
import { Done } from './views/Done.jsx';
import { DeckList } from './views/DeckList.jsx';
import { Settings } from './views/Settings.jsx';
import { api } from './lib/api.js';
import { loadUser, saveUser, logout as authLogout } from './lib/auth.js';
import { loadPrefs, savePrefs } from './lib/prefs.js';

const PUBLIC_VIEWS = new Set(['landing', 'login']);

export default function App() {
  const [user, setUser] = useState(null);
  const [view, setViewRaw] = useState('landing');
  const [deck, setDeck] = useState(null);
  const [decks, setDecks] = useState(null);
  const [prefs, setPrefs] = useState(loadPrefs());
  const [dark, setDark] = useState(false);

  // hidrata user + tema na primeira render
  useEffect(() => {
    const u = loadUser();
    if (u) {
      setUser(u);
      setViewRaw('dashboard');
    }
    const stored = localStorage.getItem('sd:dark');
    const wantDark = stored ? stored === '1' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDark(wantDark);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('sd:dark', dark ? '1' : '0');
  }, [dark]);

  // setView aceita string OU { type: 'open-deck', id }
  function setView(v) {
    if (typeof v === 'object' && v?.type === 'open-deck') {
      openDeck(v.id);
      return;
    }
    setViewRaw(v);
    if (v === 'decks') refreshDecks();
  }

  function handleLogin(u) {
    saveUser(u);
    setUser(u);
    setViewRaw('dashboard');
  }

  function handleLogout() {
    authLogout();
    setUser(null);
    setDeck(null);
    setDecks(null);
    setViewRaw('landing');
  }

  function handleSavePrefs(p) {
    savePrefs(p);
    setPrefs(p);
  }

  async function refreshDecks() {
    try {
      const list = await api.listDecks();
      setDecks(list);
    } catch (e) {
      console.error(e);
    }
  }

  async function handleGenerate(topic, text, count) {
    setViewRaw('loading');
    try {
      const d = await api.generate(topic, text, count, prefs);
      setDeck(d);
      setViewRaw('deck');
    } catch (e) {
      alert('Erro: ' + e.message);
      setViewRaw('generate');
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
      setViewRaw('decks');
      refreshDecks();
    } catch (e) {
      alert(e.message);
    }
  }

  // ÁREA PÚBLICA
  if (!user || PUBLIC_VIEWS.has(view)) {
    if (view === 'login') {
      return <Login onLogin={handleLogin} onBack={() => setViewRaw('landing')} />;
    }
    return <Landing onEnter={() => setViewRaw('login')} />;
  }

  // ÁREA LOGADA
  return (
    <div className="min-h-screen flex flex-col">
      <Header
        view={view}
        setView={setView}
        dark={dark}
        toggleDark={() => setDark(!dark)}
        user={user}
        onLogout={handleLogout}
      />
      <main className="flex-1 max-w-6xl w-full mx-auto px-6">
        <AnimatePresence mode="wait">
          {view === 'dashboard' && (
            <Dashboard key="dashboard" user={user} prefs={prefs} setView={setView} />
          )}
          {view === 'generate' && (
            <Home
              key="generate"
              onGenerate={handleGenerate}
              busy={false}
              prefs={prefs}
              onBack={() => setViewRaw('dashboard')}
              onOpenSettings={() => setViewRaw('settings')}
            />
          )}
          {view === 'loading' && <Loading key="loading" />}
          {view === 'deck' && deck && (
            <Deck
              key="deck"
              deck={deck}
              onStudy={() => setViewRaw('study')}
              onHome={() => setViewRaw('generate')}
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
              onHome={() => setViewRaw('dashboard')}
            />
          )}
          {view === 'decks' && (
            <DeckList
              key="decks"
              decks={decks}
              onOpen={openDeck}
              onHome={() => setViewRaw('generate')}
            />
          )}
          {view === 'settings' && (
            <Settings
              key="settings"
              user={user}
              prefs={prefs}
              onSave={handleSavePrefs}
              onBack={() => setViewRaw('dashboard')}
              onLogout={handleLogout}
            />
          )}
        </AnimatePresence>
      </main>
      <footer className="text-center text-xs text-slate-400 dark:text-slate-600 py-8">
        SmartDeck · A evolução do estudo
      </footer>
    </div>
  );
}
