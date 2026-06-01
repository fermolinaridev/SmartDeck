import { motion } from 'framer-motion';
import { Library, Plus, Clock } from 'lucide-react';

export function DeckList({ decks, onOpen, onHome }) {
  if (!decks) {
    return <div className="py-20 text-center text-slate-500">Carregando…</div>;
  }
  if (decks.length === 0) {
    return (
      <div className="max-w-md mx-auto card p-10 text-center mt-16">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-300 grid place-items-center">
          <Library size={24} />
        </div>
        <h2 className="mt-4 font-extrabold text-xl">Nenhum deck por aqui</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Gere seu primeiro deck a partir de um tema ou de um PDF.
        </p>
        <button onClick={onHome} className="btn-primary mx-auto mt-5">
          <Plus size={16} /> Criar deck
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-[.18em] text-brand-700 dark:text-brand-300 font-semibold">
            Meus decks
          </div>
          <h2 className="mt-1 text-3xl font-extrabold tracking-tight">
            {decks.length} {decks.length === 1 ? 'deck' : 'decks'} prontos
          </h2>
        </div>
        <button onClick={onHome} className="btn-primary">
          <Plus size={16} /> Novo deck
        </button>
      </div>

      <div className="mt-6 grid md:grid-cols-2 gap-3">
        {decks.map((d) => (
          <button
            key={d.id}
            onClick={() => onOpen(d.id)}
            className="text-left card p-5 hover:border-brand-400 dark:hover:border-brand-700 transition group"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="font-semibold truncate">{d.title}</div>
              {d.due > 0 && (
                <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider bg-brand-600 text-white px-2 py-0.5 rounded-full">
                  {d.due} due
                </span>
              )}
            </div>
            <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-3">
              <span>{d.total} cards</span>
              <span className="inline-flex items-center gap-1">
                <Clock size={11} />
                {new Date(d.createdAt).toLocaleDateString('pt-BR')}
              </span>
            </div>
            <div className="mt-4 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-300"
                style={{
                  width: `${d.total ? Math.round((d.stats?.mastered || 0) * 100 / d.total) : 0}%`,
                }}
              />
            </div>
            <div className="mt-1 text-[10px] text-slate-400">
              {d.stats?.mastered || 0} dominados
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
