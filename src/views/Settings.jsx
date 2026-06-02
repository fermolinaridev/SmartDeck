import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Check, LogOut, AlignLeft, Gauge, Flame, Bookmark } from 'lucide-react';
import { DEFAULT_PREFS } from '../lib/prefs.js';

const LENGTH_OPTIONS = [
  { value: 'curto', label: 'Curto', desc: 'Respostas em uma frase, ideais para flash de revisão.' },
  { value: 'medio', label: 'Médio', desc: 'Equilíbrio entre síntese e contexto. Recomendado.' },
  { value: 'longo', label: 'Longo', desc: 'Respostas aprofundadas, com exceções e contexto extra.' },
];

const DIFFICULTY_OPTIONS = [
  { value: 'basico', label: 'Básico', desc: 'Linguagem simples, ótimo pra primeira leitura.' },
  { value: 'intermediario', label: 'Intermediário', desc: 'Vocabulário acadêmico padrão.' },
  { value: 'avancado', label: 'Avançado', desc: 'Provocações conceituais e contrastes com teorias rivais.' },
];

const PACE_OPTIONS = [
  { value: 'rapido', label: 'Rápido', desc: 'Decks de ~5 cards · sessões curtas no dia a dia.' },
  { value: 'normal', label: 'Normal', desc: 'Decks de ~8 cards · padrão para a maioria.' },
  { value: 'profundo', label: 'Profundo', desc: 'Decks de ~15 cards · pré-prova ou tema novo.' },
];

export function Settings({ user, prefs, onSave, onBack, onLogout }) {
  const [draft, setDraft] = useState(prefs);
  const [saved, setSaved] = useState(false);

  function set(k, v) {
    setDraft((d) => ({ ...d, [k]: v }));
    setSaved(false);
  }

  function save() {
    onSave(draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }

  function reset() {
    setDraft(DEFAULT_PREFS);
    setSaved(false);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-10 max-w-3xl mx-auto"
    >
      <button
        onClick={onBack}
        className="text-sm text-slate-500 hover:text-brand-700 dark:hover:text-brand-300 inline-flex items-center gap-1 mb-4"
      >
        <ChevronLeft size={14} /> Voltar
      </button>

      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="text-[11px] uppercase tracking-[.18em] text-brand-700 dark:text-brand-300 font-semibold">
            Configurações
          </div>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight">
            Como você quer estudar
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Essas preferências moldam todos os próximos decks que a IA gerar pra você.
          </p>
        </div>
        <button onClick={onLogout} className="btn-ghost text-rose-600 hover:!text-rose-700">
          <LogOut size={16} /> Sair
        </button>
      </div>

      <div className="mt-8 space-y-6">
        <OptionGroup
          icon={<AlignLeft size={18} />}
          title="Tamanho das respostas"
          options={LENGTH_OPTIONS}
          value={draft.length}
          onChange={(v) => set('length', v)}
        />

        <OptionGroup
          icon={<Flame size={18} />}
          title="Dificuldade"
          options={DIFFICULTY_OPTIONS}
          value={draft.difficulty}
          onChange={(v) => set('difficulty', v)}
        />

        <OptionGroup
          icon={<Gauge size={18} />}
          title="Ritmo do deck"
          options={PACE_OPTIONS}
          value={draft.pace}
          onChange={(v) => set('pace', v)}
        />

        <div className="card p-5">
          <div className="flex items-center gap-2 font-semibold">
            <Bookmark size={18} className="text-brand-600" />
            Tema preferido
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Será pré-preenchido como sugestão na tela de gerar deck.
          </p>
          <input
            value={draft.focus}
            onChange={(e) => set('focus', e.target.value)}
            placeholder="ex.: Direito constitucional, Cálculo, Farmacologia…"
            className="input mt-3"
          />
        </div>
      </div>

      <div className="mt-8 flex items-center gap-3 flex-wrap">
        <button onClick={save} className="btn-primary px-5 py-3">
          {saved ? (
            <>
              <Check size={16} /> Salvo!
            </>
          ) : (
            'Salvar preferências'
          )}
        </button>
        <button onClick={reset} className="btn-ghost px-5 py-3">
          Restaurar padrões
        </button>
        {user && (
          <span className="ml-auto text-xs text-slate-400">
            Logado como {user.name} · {user.email}
          </span>
        )}
      </div>
    </motion.div>
  );
}

function OptionGroup({ icon, title, options, value, onChange }) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 font-semibold">
        <span className="text-brand-600">{icon}</span>
        {title}
      </div>
      <div className="mt-4 grid md:grid-cols-3 gap-2">
        {options.map((opt) => {
          const active = value === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className={`text-left rounded-xl border p-4 transition ${
                active
                  ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/40 ring-2 ring-brand-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-brand-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="font-bold text-sm">{opt.label}</div>
                {active && (
                  <Check size={14} className="text-brand-600 dark:text-brand-300" />
                )}
              </div>
              <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {opt.desc}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
