import { Moon, Sun, Home, Library, Settings as SettingsIcon, LogOut, Sparkles } from 'lucide-react';
import { Logo } from './Logo.jsx';
import { initialFor } from '../lib/auth.js';

export function Header({ view, setView, dark, toggleDark, user, onLogout }) {
  return (
    <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-950/80 backdrop-blur border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <button
          onClick={() => setView('dashboard')}
          className="flex items-center gap-3 group"
        >
          <Logo size={28} />
          <div className="text-left leading-tight">
            <div className="font-extrabold text-lg tracking-tight">SmartDeck</div>
            <div className="text-[10px] uppercase tracking-[.18em] text-slate-400">
              A evolução do estudo
            </div>
          </div>
        </button>

        <nav className="flex items-center gap-1">
          <NavButton active={view === 'dashboard'} onClick={() => setView('dashboard')} icon={<Home size={16} />} label="Início" />
          <NavButton active={view === 'generate'} onClick={() => setView('generate')} icon={<Sparkles size={16} />} label="Gerar" />
          <NavButton active={view === 'decks'} onClick={() => setView('decks')} icon={<Library size={16} />} label="Decks" />
          <NavButton active={view === 'settings'} onClick={() => setView('settings')} icon={<SettingsIcon size={16} />} label="Config." />

          <button
            onClick={toggleDark}
            className="ml-2 w-9 h-9 grid place-items-center rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
            aria-label="alternar tema"
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {user && (
            <div className="ml-2 flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-600 to-brand-400 text-white grid place-items-center text-sm font-extrabold">
                {initialFor(user.name)}
              </div>
              <button
                onClick={onLogout}
                className="w-9 h-9 grid place-items-center rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                title="Sair"
              >
                <LogOut size={14} />
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

function NavButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-md text-sm inline-flex items-center gap-1.5 transition ${
        active
          ? 'bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300'
          : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
      }`}
    >
      {icon}
      <span className="hidden md:inline">{label}</span>
    </button>
  );
}
