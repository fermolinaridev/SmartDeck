import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, Sparkles } from 'lucide-react';
import { Logo } from '../components/Logo.jsx';

export function Login({ onLogin, onBack }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  function submit(e) {
    e.preventDefault();
    const finalName = name.trim() || 'Estudante';
    const finalEmail = email.trim() || 'aluno@smartdeck.app';
    onLogin({ name: finalName, email: finalEmail, since: Date.now() });
  }

  function loginDemo() {
    onLogin({
      name: 'Aluno PUC',
      email: 'demo@smartdeck.app',
      since: Date.now(),
    });
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <nav className="px-6 h-16 flex items-center justify-between max-w-6xl w-full mx-auto">
        <button onClick={onBack} className="flex items-center gap-3">
          <Logo size={26} />
          <div className="font-extrabold text-lg tracking-tight">SmartDeck</div>
        </button>
        <button
          onClick={onBack}
          className="text-sm text-slate-500 hover:text-brand-600 inline-flex items-center gap-1"
        >
          <ChevronLeft size={14} /> Voltar
        </button>
      </nav>

      <main className="flex-1 grid place-items-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-8 w-full max-w-md"
        >
          <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[.18em] text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/40 px-3 py-1 rounded-full font-semibold">
            <Sparkles size={12} /> Acesso de aluno
          </div>
          <h1 className="mt-3 text-2xl font-extrabold tracking-tight">
            Entre no SmartDeck
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Sem cadastro de verdade — é uma demo. Qualquer nome serve.
          </p>

          <form onSubmit={submit} className="mt-6 space-y-3">
            <label className="block">
              <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400">
                Nome
              </span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Como você quer ser chamado?"
                className="input mt-1.5"
                autoFocus
              />
            </label>
            <label className="block">
              <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400">
                E-mail
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="input mt-1.5"
              />
            </label>
            <button type="submit" className="btn-primary w-full mt-2 py-3">
              Entrar <ArrowRight size={16} />
            </button>
          </form>

          <div className="my-5 flex items-center gap-3 text-[10px] uppercase tracking-widest text-slate-400">
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
            ou
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
          </div>

          <button onClick={loginDemo} className="btn-ghost w-full py-3">
            Entrar como demo
          </button>
        </motion.div>
      </main>
    </div>
  );
}
