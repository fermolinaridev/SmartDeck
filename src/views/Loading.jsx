import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const STEPS = [
  'Analisando conceitos-chave…',
  'Identificando tópicos de alta densidade…',
  'Montando flashcards otimizados…',
  'Agendando primeiras revisões…',
];

export function Loading() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-md mx-auto card p-10 text-center mt-20"
    >
      <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-300 grid place-items-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}
        >
          <Sparkles size={24} />
        </motion.div>
      </div>
      <div className="mt-5 font-extrabold text-lg">A IA está montando seu deck</div>
      <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Levo só alguns segundos.
      </div>
      <ul className="mt-6 space-y-2 text-sm text-left">
        {STEPS.map((s, i) => (
          <motion.li
            key={s}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.18 }}
            className="flex items-center gap-2 text-slate-600 dark:text-slate-300"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse-soft" />
            {s}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}
