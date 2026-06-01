import { motion } from 'framer-motion';
import { Play, Plus, ChevronLeft, Trash2 } from 'lucide-react';
import { StatGrid } from '../components/StatGrid.jsx';
import { ProgressChart } from '../components/ProgressChart.jsx';

export function Deck({ deck, onStudy, onHome, onDelete }) {
  const stats = deck.stats || {
    total: deck.cards.length,
    seen: 0,
    due: deck.cards.length,
    mastered: 0,
    avgEf: 2.5,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-8"
    >
      <button
        onClick={onHome}
        className="text-sm text-slate-500 hover:text-brand-700 dark:hover:text-brand-300 inline-flex items-center gap-1 mb-4"
      >
        <ChevronLeft size={14} /> Voltar
      </button>

      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-[.18em] text-brand-700 dark:text-brand-300 font-semibold">
            Deck
          </div>
          <h2 className="mt-1 text-3xl md:text-4xl font-extrabold tracking-tight truncate">
            {deck.title}
          </h2>
          <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {deck.cards.length} cards · criado em{' '}
            {new Date(deck.createdAt).toLocaleString('pt-BR')}
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <button onClick={onDelete} className="btn-ghost text-rose-600 hover:!text-rose-700">
            <Trash2 size={16} /> Excluir
          </button>
          <button onClick={onHome} className="btn-ghost">
            <Plus size={16} /> Novo
          </button>
          <button onClick={onStudy} className="btn-primary">
            <Play size={16} /> Estudar
          </button>
        </div>
      </div>

      <div className="mt-6">
        <StatGrid stats={stats} />
      </div>

      <div className="mt-6 grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 card p-5">
          <div className="font-semibold mb-3">Cards do deck</div>
          <div className="space-y-2 max-h-[28rem] overflow-y-auto scroll-thin pr-1">
            {deck.cards.map((c, i) => (
              <CardRow key={c.id} index={i} card={c} />
            ))}
          </div>
        </div>
        <div className="card p-5">
          <div className="font-semibold mb-3">Maturidade</div>
          <ProgressChart stats={stats} />
          <div className="mt-4 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            A maturidade cresce conforme você acerta cards consecutivamente. Cards
            <b> dominados</b> têm intervalos longos; cards <b>para revisar</b> voltam ao topo.
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function CardRow({ index, card }) {
  const due = card.state.due <= Date.now();
  const mastered = card.state.reps >= 3 && card.state.ef >= 2.5;
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 hover:border-brand-400 dark:hover:border-brand-700 transition">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-slate-400">
        <span>Card {index + 1}</span>
        {mastered && (
          <span className="text-emerald-600 dark:text-emerald-400">· dominado</span>
        )}
        {due && !mastered && (
          <span className="text-brand-600 dark:text-brand-300">· para revisar</span>
        )}
      </div>
      <div className="mt-1 text-sm font-semibold">{card.q}</div>
      <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">{card.a}</div>
      <div className="mt-2 flex gap-3 text-[11px] text-slate-400">
        <span>EF {card.state.ef.toFixed(2)}</span>
        <span>Intervalo {card.state.interval}d</span>
        <span>Reps {card.state.reps}</span>
      </div>
    </div>
  );
}
