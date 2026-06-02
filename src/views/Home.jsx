import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FileUp, Sparkles, ChevronLeft, ArrowRight, X, Layers, Settings as SettingsIcon } from 'lucide-react';
import { extractPdfText } from '../lib/pdf.js';
import { defaultCountFor } from '../lib/prefs.js';

const SUGGESTIONS = [
  'Biologia celular',
  'Direito constitucional',
  'Cálculo',
  'Farmacologia',
  'História do Brasil',
  'Inglês',
];

const MIN_COUNT = 3;
const MAX_COUNT = 30;

export function Home({ onGenerate, busy, prefs, onBack, onOpenSettings }) {
  const [topic, setTopic] = useState(prefs?.focus || '');
  const [text, setText] = useState('');
  const [count, setCount] = useState(defaultCountFor(prefs));
  const [pdfName, setPdfName] = useState(null);
  const [extracting, setExtracting] = useState(false);
  const fileRef = useRef(null);

  async function onPickPdf(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPdfName(file.name);
    setExtracting(true);
    try {
      const raw = await extractPdfText(file);
      setText(raw.slice(0, 6000));
    } catch (err) {
      alert('Falha ao ler PDF: ' + err.message);
      setPdfName(null);
    } finally {
      setExtracting(false);
    }
  }

  function clearPdf() {
    setPdfName(null);
    setText('');
    if (fileRef.current) fileRef.current.value = '';
  }

  function submit(e) {
    e.preventDefault();
    if (!topic.trim() && !text.trim()) return;
    onGenerate(topic.trim(), text.trim(), count);
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="py-10"
    >
      <div className="flex items-center justify-between mb-4">
        {onBack && (
          <button
            onClick={onBack}
            className="text-sm text-slate-500 hover:text-brand-700 dark:hover:text-brand-300 inline-flex items-center gap-1"
          >
            <ChevronLeft size={14} /> Voltar
          </button>
        )}
        {onOpenSettings && (
          <button
            onClick={onOpenSettings}
            className="text-xs text-slate-500 hover:text-brand-700 dark:hover:text-brand-300 inline-flex items-center gap-1"
          >
            <SettingsIcon size={12} /> Preferências de estudo
          </button>
        )}
      </div>
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[.18em] text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/40 px-3 py-1 rounded-full font-semibold">
            <Sparkles size={12} /> Gerador de decks
          </div>
          <h1 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.05]">
            Crie um deck{' '}
            <span className="bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">
              em segundos
            </span>
            .
          </h1>
          <p className="mt-5 text-slate-600 dark:text-slate-400 text-lg max-w-lg">
            Envie um PDF, slide ou só o tema. A IA monta um deck inteligente com{' '}
            <b className="text-slate-700 dark:text-slate-200">repetição espaçada</b> que
            adapta cada revisão ao seu ritmo de aprendizagem.
          </p>

          <form onSubmit={submit} className="mt-7 card p-5 space-y-4">
            <Field label="Tema do estudo">
              <input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="ex.: Biologia celular, Direito constitucional…"
                className="input"
              />
            </Field>

            <Field label="Material (opcional)" hint={text ? `${text.length} caracteres` : ''}>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={4}
                placeholder="Cole anotações, slides ou parágrafos do livro…"
                className="input resize-none scroll-thin"
              />
            </Field>

            <CountField count={count} setCount={setCount} />

            <div className="flex items-center gap-3 flex-wrap">
              <input
                ref={fileRef}
                type="file"
                accept="application/pdf"
                hidden
                onChange={onPickPdf}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="btn-ghost"
                disabled={extracting}
              >
                <FileUp size={16} />
                {extracting ? 'Lendo PDF…' : 'Anexar PDF'}
              </button>
              {pdfName && (
                <span className="inline-flex items-center gap-1 text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                  {pdfName}
                  <button
                    type="button"
                    onClick={clearPdf}
                    className="text-slate-400 hover:text-rose-500"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}
              <div className="ml-auto">
                <button
                  type="submit"
                  disabled={busy || (!topic.trim() && !text.trim())}
                  className="btn-primary"
                >
                  {busy ? (
                    'Gerando…'
                  ) : (
                    <>
                      Gerar deck com IA <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          <div className="mt-4 flex gap-2 flex-wrap">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setTopic(s)}
                className="text-xs px-3 py-1.5 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-brand-500 hover:text-brand-700 dark:hover:text-brand-300 transition"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <Hero />
      </div>
    </motion.section>
  );
}

function CountField({ count, setCount }) {
  const presets = [5, 8, 12, 20];
  function clamp(n) {
    return Math.max(MIN_COUNT, Math.min(MAX_COUNT, Math.round(Number(n) || 0)));
  }
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400 inline-flex items-center gap-1.5">
          <Layers size={12} /> Quantos cards gerar
        </span>
        <span className="text-[11px] text-slate-400">
          mín {MIN_COUNT} · máx {MAX_COUNT}
        </span>
      </div>

      <div className="mt-2 flex items-center gap-3">
        <input
          type="range"
          min={MIN_COUNT}
          max={MAX_COUNT}
          step={1}
          value={count}
          onChange={(e) => setCount(clamp(e.target.value))}
          className="flex-1 accent-brand-600 cursor-pointer"
        />
        <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => setCount(clamp(count - 1))}
            className="px-2.5 py-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="diminuir"
          >
            −
          </button>
          <input
            type="number"
            min={MIN_COUNT}
            max={MAX_COUNT}
            value={count}
            onChange={(e) => setCount(clamp(e.target.value))}
            className="w-12 text-center text-sm font-bold bg-transparent focus:outline-none [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          <button
            type="button"
            onClick={() => setCount(clamp(count + 1))}
            className="px-2.5 py-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="aumentar"
          >
            +
          </button>
        </div>
      </div>

      <div className="mt-2 flex gap-1.5 flex-wrap">
        {presets.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setCount(p)}
            className={`text-[11px] px-2.5 py-1 rounded-full border transition ${
              count === p
                ? 'bg-brand-600 text-white border-brand-600'
                : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 hover:border-brand-500 text-slate-500 dark:text-slate-400'
            }`}
          >
            {p} cards
          </button>
        ))}
      </div>
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <label className="block">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400">
          {label}
        </span>
        {hint && <span className="text-[11px] text-slate-400">{hint}</span>}
      </div>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function Hero() {
  const cards = [
    { q: 'O que é repetição espaçada?', a: 'Revisões cronometradas antes do esquecimento.' },
    { q: 'Função da mitocôndria?', a: 'Produção de ATP via respiração celular.' },
    { q: 'Definição de derivada', a: 'Limite de [f(x+h)−f(x)] / h, h→0.' },
  ];
  return (
    <div className="relative">
      <div className="absolute -inset-8 bg-gradient-to-br from-brand-100/60 via-transparent to-transparent dark:from-brand-950/30 blur-2xl -z-10 rounded-3xl" />
      <div className="relative h-80">
        {cards.map((c, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 14, rotate: 0 }}
            animate={{ opacity: 1, y: 0, rotate: (i - 1) * 5 }}
            transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
            className="absolute left-1/2 top-1/2 w-72 h-44 card p-5"
            style={{
              transform: `translate(calc(-50% + ${(i - 1) * 22}px), calc(-50% + ${(i - 1) * 14}px))`,
              zIndex: i,
            }}
          >
            <div className="text-[10px] uppercase tracking-widest text-brand-600 font-semibold">
              Flashcard {i + 1}
            </div>
            <div className="mt-2 font-semibold text-sm">{c.q}</div>
            <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">{c.a}</div>
            <div className="absolute bottom-3 right-4 text-[10px] text-slate-400">
              SmartDeck
            </div>
          </motion.div>
        ))}
      </div>
      <div className="mt-6 grid grid-cols-3 gap-3">
        <Stat big="+8 mi" small="universitários" />
        <Stat big="2.457" small="IES no Brasil" />
        <Stat big="100%" small="foco em aprender" />
      </div>
    </div>
  );
}

function Stat({ big, small }) {
  return (
    <div className="card p-3 text-center">
      <div className="text-xl font-extrabold bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">
        {big}
      </div>
      <div className="text-[10px] uppercase tracking-widest text-slate-400 mt-0.5">
        {small}
      </div>
    </div>
  );
}

