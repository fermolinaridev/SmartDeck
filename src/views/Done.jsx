import { motion } from 'framer-motion';
import { Trophy, RotateCw, Plus } from 'lucide-react';
import { StatGrid } from '../components/StatGrid.jsx';

export function Done({ deck, onBack, onHome }) {
  const stats = deck.stats || {};
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 120 }}
      className="max-w-xl mx-auto card p-10 text-center mt-16"
    >
      <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 grid place-items-center">
        <Trophy size={28} />
      </div>
      <h2 className="mt-4 text-2xl font-extrabold">Sessão concluída!</h2>
      <p className="mt-2 text-slate-500 dark:text-slate-400 text-sm">
        Próximas revisões agendadas com base no seu desempenho.
      </p>
      <div className="mt-6">
        <StatGrid stats={stats} />
      </div>
      <div className="mt-6 flex gap-2 justify-center">
        <button onClick={onBack} className="btn-ghost">
          <RotateCw size={16} /> Ver deck
        </button>
        <button onClick={onHome} className="btn-primary">
          <Plus size={16} /> Novo deck
        </button>
      </div>
    </motion.div>
  );
}
