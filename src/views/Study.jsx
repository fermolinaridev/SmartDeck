import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { CardImage } from '../components/CardImage.jsx';

const GRADES = [
  { q: 1, label: 'Errei', color: 'bg-rose-100 text-rose-800 hover:bg-rose-200 dark:bg-rose-950/40 dark:text-rose-300', kbd: '1' },
  { q: 3, label: 'Difícil', color: 'bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-950/40 dark:text-amber-300', kbd: '2' },
  { q: 4, label: 'Bom', color: 'bg-brand-100 text-brand-800 hover:bg-brand-200 dark:bg-brand-950/40 dark:text-brand-300', kbd: '3' },
  { q: 5, label: 'Fácil', color: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300', kbd: '4' },
];

export function Study({ deck, onReview, onReimage, onExit, onDone }) {
  const queueIds = useMemo(() => {
    const now = Date.now();
    const due = deck.cards.filter((c) => c.state.due <= now).map((c) => c.id);
    return due.length ? due : deck.cards.map((c) => c.id);
  }, [deck.id]);

  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const cardId = queueIds[idx];
  const card = deck.cards.find((c) => c.id === cardId);

  useEffect(() => {
    function onKey(e) {
      if (e.code === 'Space') {
        e.preventDefault();
        if (!flipped) setFlipped(true);
      } else if (flipped && ['1', '2', '3', '4'].includes(e.key)) {
        const grade = GRADES[Number(e.key) - 1];
        grade && handleReview(grade.q);
      } else if (e.key === 'Escape') {
        onExit();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [flipped, idx]);

  async function handleReview(q) {
    await onReview(card.id, q);
    if (idx + 1 >= queueIds.length) {
      onDone();
    } else {
      setFlipped(false);
      setIdx(idx + 1);
    }
  }

  if (!card) {
    return (
      <div className="py-20 text-center text-slate-500">Nada para estudar agora.</div>
    );
  }

  const progress = (idx / queueIds.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto py-8"
    >
      <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 mb-3">
        <button onClick={onExit} className="inline-flex items-center gap-1 hover:text-brand-600">
          <ChevronLeft size={14} /> Sair
        </button>
        <span>
          Card <b className="text-slate-700 dark:text-slate-200">{idx + 1}</b> /{' '}
          {queueIds.length}
        </span>
      </div>
      <div className="h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mb-6">
        <motion.div
          className="h-full bg-gradient-to-r from-brand-500 to-brand-700"
          animate={{ width: `${progress}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 18 }}
        />
      </div>

      <div className="[perspective:1200px]">
        <motion.div
          className="relative w-full h-[26rem] [transform-style:preserve-3d]"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.55, ease: [0.4, 0.2, 0.2, 1] }}
        >
          {/* Front */}
          <div className="card absolute inset-0 flex flex-col overflow-hidden [backface-visibility:hidden]">
            {card.image && (
              <CardImage
                card={card}
                onReimage={onReimage}
                variant="banner"
                height={160}
              />
            )}
            <div className="flex-1 p-6 flex flex-col">
              <div className="text-[10px] uppercase tracking-widest text-brand-600 dark:text-brand-300 font-semibold">
                Pergunta
              </div>
              <div className="flex-1 grid place-items-center">
                <div className="text-2xl md:text-3xl font-bold text-center leading-tight">
                  {card.q}
                </div>
              </div>
              <button
                onClick={() => setFlipped(true)}
                className="btn-primary mx-auto"
              >
                Mostrar resposta <span className="kbd ml-1">Espaço</span>
              </button>
            </div>
          </div>

          {/* Back */}
          <div className="card absolute inset-0 flex flex-col overflow-hidden [backface-visibility:hidden] [transform:rotateY(180deg)] border-brand-300 dark:border-brand-800">
            {card.image && (
              <CardImage card={card} variant="banner" height={120} />
            )}
            <div className="flex-1 p-6 flex flex-col">
              <div className="text-[10px] uppercase tracking-widest text-brand-600 dark:text-brand-300 font-semibold">
                Resposta
              </div>
              <div className="flex-1 grid place-items-center">
                <div className="text-base md:text-lg text-center text-slate-700 dark:text-slate-200 leading-relaxed">
                  {card.a}
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 mt-3">
                {GRADES.map((g) => (
                  <button
                    key={g.q}
                    onClick={() => handleReview(g.q)}
                    className={`py-2.5 rounded-lg text-xs font-semibold transition flex flex-col gap-0.5 items-center ${g.color}`}
                  >
                    <span>{g.label}</span>
                    <span className="kbd">{g.kbd}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="mt-6 text-center text-xs text-slate-400">
        Active Recall + Spaced Repetition · A IA reajusta o intervalo automaticamente
      </div>
    </motion.div>
  );
}
