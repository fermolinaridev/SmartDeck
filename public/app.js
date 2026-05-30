const app = document.getElementById('app');
const state = {
  view: 'home',
  deck: null,
  studyIndex: 0,
  studyQueue: [],
  flipped: false,
};

function goHome() { state.view = 'home'; render(); }

function render() {
  app.innerHTML = '';
  if (state.view === 'home') return renderHome();
  if (state.view === 'loading') return renderLoading();
  if (state.view === 'deck') return renderDeck();
  if (state.view === 'study') return renderStudy();
  if (state.view === 'list') return renderDeckList();
  if (state.view === 'done') return renderDone();
}

function renderHome() {
  app.innerHTML = `
    <section class="fade-in">
      <div class="grid md:grid-cols-2 gap-10 items-center">
        <div>
          <div class="text-xs uppercase tracking-widest text-blue-700 font-semibold mb-3">Edtech · IA + Ciência cognitiva</div>
          <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.05]">
            Pare de estudar <span class="text-slate-400 line-through">mais</span>.<br/>
            Comece a estudar <span class="text-blue-700">melhor</span>.
          </h1>
          <p class="mt-5 text-slate-600 max-w-lg">
            Transforme qualquer material em flashcards inteligentes gerados por IA.
            Repetição espaçada + recordação ativa para reter mais com menos tempo.
          </p>

          <form id="genForm" class="mt-7 bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tema do estudo</label>
            <input id="topic" required placeholder="ex.: Biologia celular, Direito constitucional, Cálculo…"
              class="mt-1 w-full text-base px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />

            <label class="block mt-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Cole um trecho do material (opcional)</label>
            <textarea id="text" rows="4" placeholder="Cole aqui um PDF, slide ou anotações…"
              class="mt-1 w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"></textarea>

            <div class="mt-4 flex items-center justify-between">
              <div class="text-xs text-slate-400">A IA monta o baralho em segundos.</div>
              <button class="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-5 py-2.5 rounded-lg shadow-sm">
                Gerar deck com IA →
              </button>
            </div>
          </form>

          <div class="mt-4 flex flex-wrap gap-2">
            ${['Biologia celular','Direito constitucional','Cálculo','Inglês'].map(t => `
              <button data-suggest="${t}" class="text-xs px-3 py-1.5 rounded-full border border-slate-300 bg-white hover:border-blue-500 hover:text-blue-700">
                ${t}
              </button>`).join('')}
          </div>
        </div>

        <div class="relative">
          <div class="absolute -inset-6 bg-gradient-to-tr from-blue-100 to-transparent rounded-3xl -z-10"></div>
          ${stackedCardsIllustration()}
          <div class="mt-8 grid grid-cols-3 gap-3">
            ${miniStat('+8 mi','universitários')}
            ${miniStat('2.457','IES no Brasil')}
            ${miniStat('100%','foco em aprender')}
          </div>
        </div>
      </div>

      <section class="mt-20 grid md:grid-cols-3 gap-5">
        ${featureCard('01','Upload do material','Envie um PDF, slide ou apenas digite o tema. A IA cuida do resto.')}
        ${featureCard('02','IA gera o deck','Em segundos, um baralho otimizado pronto para você estudar.')}
        ${featureCard('03','Revisão inteligente','Repetição espaçada adapta as revisões aos seus pontos fracos.')}
      </section>
    </section>
  `;

  document.querySelectorAll('[data-suggest]').forEach((b) => {
    b.onclick = () => {
      document.getElementById('topic').value = b.dataset.suggest;
    };
  });
  document.getElementById('genForm').onsubmit = (e) => {
    e.preventDefault();
    const topic = document.getElementById('topic').value.trim();
    const text = document.getElementById('text').value.trim();
    generate(topic, text);
  };
}

function stackedCardsIllustration() {
  return `
  <div class="relative h-72">
    ${[0,1,2].map(i => `
      <div class="absolute left-1/2 top-1/2 w-64 h-40 bg-white rounded-xl shadow-lg border border-slate-200 p-4"
        style="transform: translate(calc(-50% + ${(i-1)*16}px), calc(-50% + ${(i-1)*10}px)) rotate(${(i-1)*4}deg); z-index:${i};">
        <div class="text-[10px] uppercase tracking-widest text-blue-600 font-semibold">Flashcard ${i+1}</div>
        <div class="mt-2 font-semibold text-slate-800 text-sm">
          ${['O que é repetição espaçada?','Qual a função da mitocôndria?','Definição de derivada'][i]}
        </div>
        <div class="mt-2 text-xs text-slate-500 line-clamp-3">
          ${['Revisões cronometradas antes de você esquecer.','Produção de ATP via respiração celular.','Limite de [f(x+h)-f(x)]/h quando h→0.'][i]}
        </div>
        <div class="absolute bottom-3 right-3 text-[10px] text-slate-400">SmartDeck</div>
      </div>
    `).join('')}
  </div>`;
}

function miniStat(big, small) {
  return `
    <div class="bg-white rounded-lg border border-slate-200 p-3 text-center">
      <div class="text-xl font-extrabold text-blue-700">${big}</div>
      <div class="text-[11px] uppercase tracking-widest text-slate-400">${small}</div>
    </div>`;
}

function featureCard(num, title, desc) {
  return `
    <div class="bg-white border border-slate-200 rounded-xl p-5">
      <div class="text-blue-700 font-extrabold text-sm">PASSO ${num}</div>
      <div class="mt-1 font-bold text-lg">${title}</div>
      <div class="mt-2 text-sm text-slate-600">${desc}</div>
    </div>`;
}

function renderLoading() {
  app.innerHTML = `
    <div class="max-w-md mx-auto bg-white border border-slate-200 rounded-2xl p-10 text-center fade-in">
      <div class="flex justify-center gap-2 mb-5">
        ${[0,1,2].map(i => `<span class="w-2.5 h-2.5 rounded-full bg-blue-700 pulse-dot" style="animation-delay:${i*.18}s"></span>`).join('')}
      </div>
      <div class="font-semibold">A IA está montando seu deck…</div>
      <div class="text-sm text-slate-500 mt-2">Identificando conceitos-chave e gerando flashcards otimizados.</div>
    </div>`;
}

async function generate(topic, text) {
  state.view = 'loading'; render();
  try {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, text }),
    });
    if (!res.ok) throw new Error('falha na geração');
    state.deck = await res.json();
    state.view = 'deck'; render();
  } catch (e) {
    alert('Erro ao gerar deck.');
    state.view = 'home'; render();
  }
}

function renderDeck() {
  const d = state.deck;
  const stats = computeStats(d);
  app.innerHTML = `
    <div class="fade-in">
      <div class="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div class="text-xs uppercase tracking-widest text-blue-700 font-semibold">Deck gerado</div>
          <h2 class="text-3xl font-extrabold mt-1">${escapeHtml(d.title)}</h2>
          <div class="text-sm text-slate-500 mt-1">${d.cards.length} flashcards prontos para estudo</div>
        </div>
        <div class="flex gap-2">
          <button onclick="goHome()" class="px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-sm">Novo deck</button>
          <button onclick="startStudy()" class="px-5 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold">Estudar agora →</button>
        </div>
      </div>

      <div class="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        ${statTile('Total', stats.total)}
        ${statTile('Para revisar', stats.due, 'text-blue-700')}
        ${statTile('Já vistos', stats.seen)}
        ${statTile('Dominados', stats.mastered, 'text-emerald-600')}
      </div>

      <div class="mt-8 grid md:grid-cols-2 gap-3">
        ${d.cards.map((c, i) => `
          <div class="bg-white border border-slate-200 rounded-xl p-4 hover:border-blue-400 transition">
            <div class="text-[10px] uppercase tracking-widest text-slate-400">Card ${i+1}</div>
            <div class="mt-1 font-semibold">${escapeHtml(c.q)}</div>
            <div class="mt-2 text-sm text-slate-600">${escapeHtml(c.a)}</div>
            <div class="mt-3 text-[11px] text-slate-400 flex gap-4">
              <span>EF ${c.state.ef}</span>
              <span>Reps ${c.state.reps}</span>
              <span>${c.state.due <= Date.now() ? 'Pronto p/ revisar' : 'Agendado'}</span>
            </div>
          </div>`).join('')}
      </div>
    </div>`;
}

function statTile(label, value, valueClass = 'text-slate-800') {
  return `
    <div class="bg-white border border-slate-200 rounded-xl p-4">
      <div class="text-[10px] uppercase tracking-widest text-slate-400">${label}</div>
      <div class="text-2xl font-extrabold mt-1 ${valueClass}">${value}</div>
    </div>`;
}

function computeStats(d) {
  const now = Date.now();
  return {
    total: d.cards.length,
    seen: d.cards.filter(c => c.state.reps > 0).length,
    due: d.cards.filter(c => c.state.due <= now).length,
    mastered: d.cards.filter(c => c.state.reps >= 3 && c.state.ef >= 2.5).length,
  };
}

function startStudy() {
  const now = Date.now();
  const due = state.deck.cards.filter(c => c.state.due <= now);
  state.studyQueue = due.length ? due.map(c => c.id) : state.deck.cards.map(c => c.id);
  state.studyIndex = 0;
  state.flipped = false;
  state.view = 'study';
  render();
}

function renderStudy() {
  const cardId = state.studyQueue[state.studyIndex];
  if (!cardId) { state.view = 'done'; return render(); }
  const card = state.deck.cards.find(c => c.id === cardId);
  const progress = ((state.studyIndex) / state.studyQueue.length) * 100;

  app.innerHTML = `
    <div class="max-w-2xl mx-auto fade-in">
      <div class="flex items-center justify-between text-xs text-slate-500 mb-2">
        <span>${escapeHtml(state.deck.title)}</span>
        <span>Card ${state.studyIndex+1} / ${state.studyQueue.length}</span>
      </div>
      <div class="h-1.5 bg-slate-200 rounded-full overflow-hidden mb-6">
        <div class="h-full bg-blue-700 transition-all" style="width:${progress}%"></div>
      </div>

      <div class="card-flip">
        <div id="cardInner" class="card-inner relative w-full h-80 ${state.flipped ? 'flipped' : ''}">
          <div class="card-face absolute inset-0 bg-white border border-slate-200 rounded-2xl p-8 shadow-sm flex flex-col">
            <div class="text-[10px] uppercase tracking-widest text-blue-700 font-semibold">Pergunta</div>
            <div class="flex-1 flex items-center justify-center">
              <div class="text-2xl font-bold text-center">${escapeHtml(card.q)}</div>
            </div>
            <button onclick="flipCard()" class="mt-4 self-center px-6 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm">
              Mostrar resposta
            </button>
          </div>
          <div class="card-face card-back absolute inset-0 bg-white border border-blue-300 rounded-2xl p-8 shadow-sm flex flex-col">
            <div class="text-[10px] uppercase tracking-widest text-blue-700 font-semibold">Resposta</div>
            <div class="flex-1 flex items-center justify-center">
              <div class="text-lg text-center text-slate-700 leading-relaxed">${escapeHtml(card.a)}</div>
            </div>
            <div class="mt-3 text-center text-xs text-slate-400">Como você se saiu?</div>
            <div class="mt-2 grid grid-cols-4 gap-2">
              <button onclick="review(1)" class="py-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-800 text-xs font-semibold">Errei</button>
              <button onclick="review(3)" class="py-2 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-800 text-xs font-semibold">Difícil</button>
              <button onclick="review(4)" class="py-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs font-semibold">Bom</button>
              <button onclick="review(5)" class="py-2 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-semibold">Fácil</button>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-6 text-center text-xs text-slate-400">
        Active Recall + Spaced Repetition · A IA reajusta o intervalo de cada card automaticamente
      </div>
    </div>`;
}

function flipCard() {
  state.flipped = true;
  document.getElementById('cardInner').classList.add('flipped');
}

async function review(quality) {
  const cardId = state.studyQueue[state.studyIndex];
  try {
    const res = await fetch(`/api/decks/${state.deck.id}/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cardId, quality }),
    });
    const data = await res.json();
    const idx = state.deck.cards.findIndex(c => c.id === cardId);
    if (idx >= 0) state.deck.cards[idx] = data.card;
  } catch (e) {}
  state.studyIndex += 1;
  state.flipped = false;
  if (state.studyIndex >= state.studyQueue.length) state.view = 'done';
  render();
}

function renderDone() {
  const stats = computeStats(state.deck);
  app.innerHTML = `
    <div class="max-w-md mx-auto bg-white border border-slate-200 rounded-2xl p-10 text-center fade-in">
      <div class="text-5xl">🎯</div>
      <h2 class="mt-3 text-2xl font-extrabold">Sessão concluída!</h2>
      <p class="mt-2 text-slate-600 text-sm">A IA agendou suas próximas revisões com base no seu desempenho.</p>
      <div class="mt-6 grid grid-cols-3 gap-2 text-left">
        ${statTile('Vistos', stats.seen)}
        ${statTile('Dominados', stats.mastered, 'text-emerald-600')}
        ${statTile('A revisar', stats.due, 'text-blue-700')}
      </div>
      <div class="mt-6 flex gap-2 justify-center">
        <button onclick="state.view='deck';render()" class="px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm">Voltar ao deck</button>
        <button onclick="goHome()" class="px-4 py-2 rounded-lg bg-blue-700 text-white text-sm font-semibold">Novo deck</button>
      </div>
    </div>`;
}

async function renderDeckList() {
  state.view = 'list';
  app.innerHTML = `<div class="text-slate-500">Carregando…</div>`;
  const res = await fetch('/api/decks');
  const decks = await res.json();
  if (decks.length === 0) {
    app.innerHTML = `
      <div class="max-w-md mx-auto bg-white border border-slate-200 rounded-2xl p-10 text-center fade-in">
        <div class="text-4xl">📚</div>
        <div class="mt-2 font-semibold">Você ainda não tem decks.</div>
        <button onclick="goHome()" class="mt-4 px-5 py-2 rounded-lg bg-blue-700 text-white text-sm font-semibold">Criar meu primeiro deck</button>
      </div>`;
    return;
  }
  app.innerHTML = `
    <div class="fade-in">
      <h2 class="text-2xl font-extrabold">Meus decks</h2>
      <div class="mt-5 grid md:grid-cols-2 gap-3">
        ${decks.map(d => `
          <button data-id="${d.id}" class="text-left bg-white border border-slate-200 rounded-xl p-4 hover:border-blue-500">
            <div class="font-semibold">${escapeHtml(d.title)}</div>
            <div class="mt-1 text-xs text-slate-500">${d.total} cards · ${d.due} para revisar</div>
          </button>`).join('')}
      </div>
    </div>`;
  document.querySelectorAll('[data-id]').forEach(b => {
    b.onclick = async () => {
      const r = await fetch('/api/decks/' + b.dataset.id);
      state.deck = await r.json();
      state.view = 'deck'; render();
    };
  });
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

render();
