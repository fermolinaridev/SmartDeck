import { motion } from 'framer-motion';
import { ArrowRight, Brain, Repeat2, Target, Sparkles } from 'lucide-react';
import { Logo } from '../components/Logo.jsx';

export function Landing({ onEnter }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-brand-50/30 to-white dark:from-slate-950 dark:via-brand-950/20 dark:to-slate-950">
      <nav className="px-6 h-16 flex items-center justify-between max-w-6xl w-full mx-auto">
        <div className="flex items-center gap-3">
          <Logo size={26} />
          <div className="font-extrabold text-lg tracking-tight">SmartDeck</div>
        </div>
        <button onClick={onEnter} className="btn-primary">
          Entrar <ArrowRight size={16} />
        </button>
      </nav>

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-12 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[.18em] text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/40 px-3 py-1 rounded-full font-semibold">
            <Sparkles size={12} /> Edtech · IA + ciência cognitiva
          </div>
          <h1 className="mt-6 text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.02]">
            A evolução{' '}
            <span className="bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">
              do estudo
            </span>
            .
          </h1>
          <p className="mt-6 text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Transforme qualquer material em flashcards inteligentes gerados por IA.
            Aprenda mais rápido. Retenha por mais tempo. Gabarite com menos estresse.
          </p>
          <div className="mt-10 flex items-center gap-3 justify-center">
            <button onClick={onEnter} className="btn-primary px-6 py-3 text-base">
              Começar agora <ArrowRight size={16} />
            </button>
            <a
              href="#como-funciona"
              className="btn-ghost px-6 py-3 text-base"
            >
              Como funciona
            </a>
          </div>
        </motion.div>

        <div className="mt-20 grid md:grid-cols-3 gap-6" id="como-funciona">
          {[
            {
              icon: <Brain size={22} />,
              title: 'Active Recall',
              desc: 'Recordação ativa: testar a memória em vez de reler. É assim que o cérebro fixa de verdade.',
            },
            {
              icon: <Repeat2 size={22} />,
              title: 'Spaced Repetition',
              desc: 'Algoritmo SM-2 agenda cada revisão no ponto ótimo entre lembrar e esquecer.',
            },
            {
              icon: <Target size={22} />,
              title: 'Foco no que importa',
              desc: 'A IA detecta seus pontos fracos e concentra a revisão exatamente neles.',
            },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              className="card p-6"
            >
              <div className="w-11 h-11 grid place-items-center rounded-xl bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300">
                {f.icon}
              </div>
              <h3 className="mt-4 font-bold text-lg">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-24 grid md:grid-cols-3 gap-3 max-w-3xl mx-auto">
          {[
            ['+8 mi', 'universitários no Brasil'],
            ['2.457', 'instituições de ensino superior'],
            ['100%', 'foco em aprender, não montar'],
          ].map(([big, small]) => (
            <div key={small} className="text-center">
              <div className="text-3xl font-extrabold bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">
                {big}
              </div>
              <div className="text-[11px] uppercase tracking-widest text-slate-500 mt-1">
                {small}
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="py-8 text-center text-xs text-slate-400">
        SmartDeck · PUC-Campinas · Práticas Empreendedoras
      </footer>
    </div>
  );
}
