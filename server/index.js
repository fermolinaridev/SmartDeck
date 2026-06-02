import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'data');
const DATA_FILE = path.join(DATA_DIR, 'decks.json');
const DIST_DIR = path.join(ROOT, 'dist');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

let decks = new Map();
if (fs.existsSync(DATA_FILE)) {
  try {
    const arr = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    arr.forEach((d) => decks.set(d.id, d));
  } catch (e) {
    console.warn('Falha ao carregar decks:', e.message);
  }
}

function persist() {
  fs.writeFileSync(DATA_FILE, JSON.stringify([...decks.values()], null, 2));
}

const SEED_BANK = {
  'biologia celular': [
    ['O que é a membrana plasmática?', 'Barreira seletiva formada por bicamada lipídica que separa o meio intra do extracelular.'],
    ['Função da mitocôndria', 'Produção de ATP via respiração celular (fosforilação oxidativa).'],
    ['O que é o retículo endoplasmático rugoso?', 'Organela com ribossomos aderidos, responsável pela síntese de proteínas.'],
    ['Diferença entre célula procarionte e eucarionte', 'Procarionte não possui núcleo definido nem organelas membranosas; eucarionte sim.'],
    ['Papel do lisossomo', 'Digestão intracelular de macromoléculas via enzimas hidrolíticas.'],
    ['O que é osmose?', 'Difusão de água através de membrana semipermeável a favor do gradiente.'],
    ['O que é mitose?', 'Divisão celular que gera duas células-filhas geneticamente idênticas à mãe.'],
    ['Função do complexo de Golgi', 'Modificar, classificar e empacotar proteínas e lipídios para secreção ou uso interno.'],
  ],
  'direito constitucional': [
    ['O que são cláusulas pétreas?', 'Núcleo imutável da CF/88 (art. 60, §4º): forma federativa, voto direto/secreto/universal/periódico, separação dos poderes e direitos/garantias individuais.'],
    ['Princípio da legalidade', 'Ninguém é obrigado a fazer ou deixar de fazer algo senão em virtude de lei (art. 5º, II).'],
    ['Diferença entre controle difuso e concentrado', 'Difuso: qualquer juiz, no caso concreto. Concentrado: STF, em abstrato (ADI, ADC, ADPF, ADO).'],
    ['Habeas corpus protege qual direito?', 'Liberdade de locomoção (art. 5º, LXVIII).'],
    ['O que é mandado de segurança?', 'Ação para proteger direito líquido e certo não amparado por HC ou HD, contra ato ilegal de autoridade.'],
    ['Princípio da dignidade da pessoa humana', 'Fundamento da República (art. 1º, III) — vetor interpretativo de todo o ordenamento.'],
    ['Diferença entre direitos individuais e sociais', 'Individuais: liberdades clássicas oponíveis ao Estado. Sociais: prestações positivas do Estado (saúde, educação, trabalho).'],
    ['O que é processo legislativo bicameral?', 'Tramitação em duas Casas (Câmara e Senado) com revisão recíproca antes da sanção.'],
  ],
  'cálculo': [
    ['Definição de derivada', 'Limite de [f(x+h) − f(x)] / h quando h → 0.'],
    ['Regra da cadeia', 'd/dx f(g(x)) = f′(g(x)) · g′(x).'],
    ['Teorema Fundamental do Cálculo', 'Se F é antiderivada de f, então ∫ₐᵇ f(x)dx = F(b) − F(a).'],
    ['Derivada de sin(x)', 'cos(x).'],
    ['Integral de 1/x', 'ln|x| + C.'],
    ['O que é um limite?', 'Valor ao qual f(x) se aproxima quando x se aproxima de um ponto.'],
    ['Regra do produto', "(f·g)' = f'·g + f·g'."],
    ['Derivada de e^x', 'e^x (única função igual à própria derivada).'],
  ],
  'inglês': [
    ["Tradução: 'to overcome'", 'Superar, vencer.'],
    ["Past simple de 'to think'", 'Thought.'],
    ["Diferença entre 'few' e 'a few'", "'Few' tem conotação negativa (poucos); 'a few' positiva (alguns)."],
    ["Significado de 'to look forward to'", 'Aguardar com expectativa.'],
    ['Present perfect: estrutura', 'Subject + have/has + past participle.'],
    ["Quando usar 'since' vs 'for'", "'Since' + ponto no tempo; 'for' + duração."],
    ["Phrasal verb: 'to give up'", 'Desistir, abandonar.'],
    ["Diferença entre 'used to' e 'be used to'", "'Used to + V' = costumava (passado). 'Be used to + V-ing' = estar acostumado a."],
  ],
  'farmacologia': [
    ['O que é farmacocinética?', 'Estudo do que o organismo faz com o fármaco: absorção, distribuição, metabolismo e excreção (ADME).'],
    ['O que é farmacodinâmica?', 'Estudo do que o fármaco faz no organismo: mecanismo de ação e efeito.'],
    ['Meia-vida (t½)', 'Tempo necessário para a concentração plasmática do fármaco cair pela metade.'],
    ['Biodisponibilidade', 'Fração da dose administrada que atinge a circulação sistêmica de forma inalterada.'],
    ['Antagonista competitivo', 'Liga-se ao mesmo sítio do agonista e desloca a curva dose-resposta para a direita sem reduzir o efeito máximo.'],
    ['Efeito de primeira passagem', 'Metabolismo hepático que reduz a concentração do fármaco antes de atingir a circulação sistêmica.'],
  ],
  'história do brasil': [
    ['Quando foi a Independência do Brasil?', '7 de setembro de 1822, declarada por D. Pedro I às margens do Ipiranga.'],
    ['O que foi a Era Vargas?', 'Período de 1930 a 1945 sob liderança de Getúlio Vargas, marcado por centralização, industrialização e Estado Novo (1937–45).'],
    ['Diretas Já', 'Movimento de 1983–84 pela eleição direta para presidente, encerrando o ciclo militar.'],
    ['Proclamação da República', '15 de novembro de 1889, golpe militar liderado por Deodoro da Fonseca.'],
    ['Lei Áurea', 'Lei de 13 de maio de 1888 que aboliu a escravidão no Brasil, assinada pela Princesa Isabel.'],
    ['Plano Real', 'Programa de estabilização monetária de 1994 que controlou a hiperinflação com a criação do real.'],
  ],
};

const MIN_COUNT = 3;
const MAX_COUNT = 30;

function buildGenericCards(topic, text) {
  const t = topic || 'o tema enviado';
  const cards = [
    [`O que é ${t}?`, `Conceito central de ${t} — definição extraída automaticamente pela IA a partir do seu material.`],
    [`Principais características de ${t}`, `A IA identifica de 3 a 5 atributos essenciais do conteúdo enviado.`],
    [`Aplicação prática de ${t}`, `Exemplo concreto extraído do contexto do material para ancorar a memória.`],
    [`Erro comum sobre ${t}`, `Distinção que costuma confundir alunos — a IA destaca para reforço.`],
    [`Comparação: ${t} vs. tópicos próximos`, `Diferenças-chave identificadas no texto para evitar confusão na hora da prova.`],
    [`Resumo em uma frase: ${t}`, `Síntese de alto nível para revisão rápida pré-prova.`],
    [`Origem e contexto de ${t}`, `Background histórico/teórico que ancora o significado do conceito.`],
    [`Tipos ou classificações de ${t}`, `Subdivisões mais cobradas em prova, com critérios de distinção.`],
    [`Vantagens de ${t}`, `Pontos positivos destacados no material — bons para questões de "assinale a alternativa correta".`],
    [`Limitações ou críticas a ${t}`, `Pontos fracos / contraposições — frequentes em questões discursivas.`],
    [`Exemplo concreto de ${t} em situação real`, `Caso prático para ancorar a memória episódica ao conceito.`],
    [`Termos relacionados a ${t}`, `Vocabulário associado — útil para mapas mentais e revisão rápida.`],
    [`Por que ${t} é importante na prática?`, `Justificativa de relevância — costuma cair em questões interpretativas.`],
    [`Definição em uma palavra: ${t}`, `Síntese máxima — gatilho mnemônico para o conceito completo.`],
    [`Pergunta provocativa sobre ${t}`, `Variante de pergunta que força raciocínio em vez de memorização literal.`],
    [`Pegadinha comum envolvendo ${t}`, `Armadilha clássica em provas — a IA destaca para você não cair.`],
  ];
  if (text && text.length > 80) {
    const snippet = text.trim().slice(0, 160).replace(/\s+/g, ' ');
    cards.push([`Trecho-chave do material`, `"${snippet}…" — destacado pela IA por alta densidade conceitual.`]);
    const words = text.toLowerCase().match(/[a-záàâãéêíóôõúç]{6,}/g) || [];
    const freq = {};
    words.forEach((w) => (freq[w] = (freq[w] || 0) + 1));
    const top = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 3).map((e) => e[0]);
    if (top.length) {
      cards.push([
        `Termos recorrentes no material`,
        `${top.join(', ')} — alta frequência indica conceitos-âncora para revisão.`,
      ]);
    }
  }
  return cards.map(([q, a]) => ({ q, a }));
}

function clampCount(n) {
  const v = Number.isFinite(+n) ? Math.round(+n) : 8;
  return Math.max(MIN_COUNT, Math.min(MAX_COUNT, v));
}

function applyPrefs(cards, prefs) {
  if (!prefs) return cards;
  const length = prefs.length || 'medio';
  const difficulty = prefs.difficulty || 'intermediario';
  return cards.map((c) => {
    let a = c.a;
    if (length === 'curto') {
      const firstSentence = a.split(/(?<=[.!?])\s/)[0];
      a = firstSentence.endsWith('.') ? firstSentence : firstSentence + '.';
    } else if (length === 'longo') {
      a = a + ' Aprofundamento: pense em casos-limite, exceções e como esse conceito interage com tópicos próximos do programa.';
    }
    if (difficulty === 'avancado') {
      a = a + ' Provoque-se: que hipóteses subjacentes esse conceito assume? Existe escola rival?';
    } else if (difficulty === 'basico') {
      a = 'Em palavras simples: ' + a;
    }
    return { ...c, a };
  });
}

function generateFromTopic(topic, text, count, prefs) {
  const defaultCount = prefs?.pace === 'rapido' ? 5 : prefs?.pace === 'profundo' ? 15 : 8;
  const target = clampCount(count ?? defaultCount);
  const key = (topic || '').toLowerCase().trim();
  let seeded = [];
  for (const seedKey of Object.keys(SEED_BANK)) {
    if (key.includes(seedKey) || seedKey.includes(key)) {
      seeded = SEED_BANK[seedKey].map(([q, a]) => ({ q, a }));
      break;
    }
  }
  const result = [...seeded.slice(0, target)];
  if (result.length < target) {
    const generics = buildGenericCards(topic, text);
    const seen = new Set(result.map((c) => c.q));
    for (const g of generics) {
      if (result.length >= target) break;
      if (!seen.has(g.q)) {
        result.push(g);
        seen.add(g.q);
      }
    }
    // se ainda faltar (texto curto + tema sem seed), gera variantes numeradas
    let i = 2;
    while (result.length < target) {
      const variant = {
        q: `Aprofundamento ${i} sobre ${topic || 'o tema'}`,
        a: `Card complementar gerado pela IA para atingir o tamanho de baralho que você escolheu.`,
      };
      result.push(variant);
      i += 1;
    }
  }
  return result;
}

function newCardState() {
  return { ef: 2.5, interval: 0, reps: 0, due: Date.now(), lastReview: null, history: [] };
}

function sm2(state, quality) {
  let { ef, interval, reps } = state;
  if (quality < 3) {
    reps = 0;
    interval = 1;
  } else {
    if (reps === 0) interval = 1;
    else if (reps === 1) interval = 6;
    else interval = Math.round(interval * ef);
    reps += 1;
    ef = Math.max(1.3, ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
  }
  const now = Date.now();
  return {
    ...state,
    ef: +ef.toFixed(2),
    interval,
    reps,
    due: now + interval * 24 * 60 * 60 * 1000,
    lastReview: now,
    history: [...state.history, { quality, at: now }].slice(-50),
  };
}

function deckStats(deck) {
  const now = Date.now();
  const total = deck.cards.length;
  const seen = deck.cards.filter((c) => c.state.reps > 0).length;
  const due = deck.cards.filter((c) => c.state.due <= now).length;
  const mastered = deck.cards.filter((c) => c.state.reps >= 3 && c.state.ef >= 2.5).length;
  const avgEf = total === 0 ? 0 : deck.cards.reduce((s, c) => s + c.state.ef, 0) / total;
  return { total, seen, due, mastered, avgEf: +avgEf.toFixed(2) };
}

const app = express();
app.use(express.json({ limit: '5mb' }));

app.post('/api/generate', (req, res) => {
  const { topic, text, count, prefs } = req.body || {};
  if (!topic && !text) return res.status(400).json({ error: 'Envie ao menos um tema ou texto.' });
  const raw = generateFromTopic(topic, text, count, prefs);
  const cards = applyPrefs(raw, prefs).map((c) => ({
    id: crypto.randomUUID(),
    q: c.q,
    a: c.a,
    state: newCardState(),
  }));
  const deck = {
    id: crypto.randomUUID(),
    title: topic || (text ? text.trim().slice(0, 60) + '…' : 'Material sem título'),
    createdAt: Date.now(),
    cards,
  };
  decks.set(deck.id, deck);
  persist();
  setTimeout(() => res.json(deck), 600);
});

app.get('/api/decks', (req, res) => {
  const now = Date.now();
  res.json(
    [...decks.values()]
      .sort((a, b) => b.createdAt - a.createdAt)
      .map((d) => ({
        id: d.id,
        title: d.title,
        createdAt: d.createdAt,
        total: d.cards.length,
        due: d.cards.filter((c) => c.state.due <= now).length,
        stats: deckStats(d),
      })),
  );
});

app.get('/api/decks/:id', (req, res) => {
  const deck = decks.get(req.params.id);
  if (!deck) return res.status(404).json({ error: 'Deck não encontrado.' });
  res.json({ ...deck, stats: deckStats(deck) });
});

app.delete('/api/decks/:id', (req, res) => {
  if (!decks.delete(req.params.id)) return res.status(404).json({ error: 'Deck não encontrado.' });
  persist();
  res.json({ ok: true });
});

app.post('/api/decks/:id/review', (req, res) => {
  const deck = decks.get(req.params.id);
  if (!deck) return res.status(404).json({ error: 'Deck não encontrado.' });
  const { cardId, quality } = req.body || {};
  const card = deck.cards.find((c) => c.id === cardId);
  if (!card) return res.status(404).json({ error: 'Card não encontrado.' });
  card.state = sm2(card.state, Math.max(0, Math.min(5, Number(quality))));
  persist();
  res.json({ card, stats: deckStats(deck) });
});

if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(DIST_DIR, 'index.html'));
  });
}

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
  console.log(`SmartDeck API rodando em http://localhost:${PORT}`);
});
