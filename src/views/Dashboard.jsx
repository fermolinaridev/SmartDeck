import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Library,
  Settings as SettingsIcon,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { api } from '../lib/api.js';
import { initialFor } from '../lib/auth.js';

export function Dashboard({ user, prefs, setView }) {
  const [decks, setDecks] = useState([]);
  const [stats, setStats] = useState({ total: 0, due: 0, mastered: 0 });

  useEffect(() => {
    (async () => {
      try {
        const list = await api.listDecks();
        setDecks(list);
        setStats({
          total: list.reduce((s, d) => s + d.total, 0),
          due: list.reduce((s, d) => s + d.due, 0),
          mastered: list.reduce((s, d) => s + (d.stats?.mastered || 0), 0),
        });
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const hour = new Date().getHours();
  const saudacao = hour < 12 ? 'Bom dia' : hour < 19 ? 'Boa tarde' : 'Boa noite';

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-10"
    >
      <div className="flex items-center gap-4 flex-wrap">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-400 text-white grid place-items-center text-2xl font-extrabold shadow-glow">
          {initialFor(user?.name)}
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-[.18em] text-brand-700 dark:text-brand-300 font-semibold">
            {saudacao}
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            {user?.name || 'Estudante'}
          </h1>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            {decks.length === 0
              ? 'Vamos criar seu primeiro deck?'
              : `Você tem ${stats.due} cards para revisar hoje.`}
          </div>
        </div>
      </div>

      <div className="mt-8 grid md:grid-cols-3 gap-3">
        <StatTile label="Decks" value={decks.length} />
        <StatTile label="Cards no total" value={stats.total} />
        <StatTile
          label="Para revisar"
          value={stats.due}
          accent="text-brand-600 dark:text-brand-300"
        />
      </div>

      <div className="mt-8 grid md:grid-cols-3 gap-4">
        <ActionCard
          accent="from-brand-600 to-brand-400"
          icon={<Sparkles size={22} />}
          title="Gerar com IA"
          desc="Cole um tema, anotações ou um PDF — a IA monta um deck inteligente em segundos."
          cta="Gerar novo deck"
          onClick={() => setView('generate')}
        />
        <ActionCard
          accent="from-emerald-600 to-emerald-400"
          icon={<Library size={22} />}
          title="Meus decks"
          desc={`Você tem ${decks.length} ${decks.length === 1 ? 'deck' : 'decks'} salvos${stats.due ? ` · ${stats.due} para revisar` : ''}.`}
          cta="Ver biblioteca"
          onClick={() => setView('decks')}
        />
        <ActionCard
          accent="from-slate-700 to-slate-500"
          icon={<SettingsIcon size={22} />}
          title="Configurações"
          desc={`Estilo atual: ${labelLength(prefs.length)} · ${labelDifficulty(prefs.difficulty)} · ${labelPace(prefs.pace)}.`}
          cta="Ajustar preferências"
          onClick={() => setView('settings')}
        />
      </div>

      {decks.length > 0 && (
        <div className="mt-12">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Decks recentes</h2>
            <button
              onClick={() => setView('decks')}
              className="text-sm text-brand-700 dark:text-brand-300 inline-flex items-center gap-1 hover:underline"
            >
              Ver todos <ArrowRight size={14} />
            </button>
          </div>
          <div className="mt-4 grid md:grid-cols-3 gap-3">
            {decks.slice(0, 3).map((d) => (
              <button
                key={d.id}
                onClick={() => setView({ type: 'open-deck', id: d.id })}
                className="text-left card p-4 hover:border-brand-400 dark:hover:border-brand-700 transition"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="font-semibold truncate">{d.title}</div>
                  {d.due > 0 && (
                    <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider bg-brand-600 text-white px-2 py-0.5 rounded-full">
                      {d.due} due
                    </span>
                  )}
                </div>
                <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 inline-flex items-center gap-2">
                  <span>{d.total} cards</span>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock size={11} />
                    {new Date(d.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

function StatTile({ label, value, accent = 'text-slate-800 dark:text-slate-100' }) {
  return (
    <div className="card p-4">
      <div className="text-[10px] uppercase tracking-widest text-slate-400">{label}</div>
      <div className={`mt-1 text-3xl font-extrabold ${accent}`}>{value}</div>
    </div>
  );
}

function ActionCard({ accent, icon, title, desc, cta, onClick }) {
  return (
    <button
      onClick={onClick}
      className="text-left card p-6 hover:border-brand-400 dark:hover:border-brand-700 transition group"
    >
      <div
        className={`w-11 h-11 grid place-items-center rounded-xl bg-gradient-to-br ${accent} text-white shadow-glow`}
      >
        {icon}
      </div>
      <h3 className="mt-4 font-bold text-lg">{title}</h3>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 min-h-[42px]">{desc}</p>
      <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 dark:text-brand-300">
        {cta}
        <ArrowRight size={14} className="group-hover:translate-x-0.5 transition" />
      </div>
    </button>
  );
}

function labelLength(v) {
  return { curto: 'cards curtos', medio: 'tamanho médio', longo: 'cards aprofundados' }[v] || 'tamanho médio';
}
function labelDifficulty(v) {
  return { basico: 'básico', intermediario: 'intermediário', avancado: 'avançado' }[v] || 'intermediário';
}
function labelPace(v) {
  return { rapido: 'ritmo rápido', normal: 'ritmo normal', profundo: 'ritmo profundo' }[v] || 'ritmo normal';
}
