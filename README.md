# SmartDeck

> A evolução do estudo — flashcards inteligentes gerados por IA, com repetição espaçada (SM-2) e ritmo adaptado a você.

SmartDeck transforma qualquer material acadêmico (PDF, anotações ou apenas um tema) em um baralho de flashcards otimizado. A IA monta o deck, o algoritmo de **repetição espaçada SM-2** agenda cada revisão no ponto ótimo entre lembrar e esquecer, e o seu desempenho ajusta os próximos blocos automaticamente.

---

## Stack

- **Backend** — Node.js + Express, persistência em arquivo (`data/decks.json`)
- **Frontend** — Vite + React 18 + Tailwind CSS 3
- **UI** — Framer Motion, Lucide Icons, Recharts
- **PDF** — `pdfjs-dist` extraindo texto direto no cliente

---

## Funcionalidades

- **Geração por IA** a partir de tema, texto colado ou PDF (até 20 páginas)
- **Banco curado** para temas comuns: Biologia celular, Direito constitucional, Cálculo, Farmacologia, História do Brasil e Inglês — com fallback genérico para qualquer outro assunto
- **Quantidade configurável** de cards por deck (3 a 30) com slider, input numérico e presets
- **Algoritmo SM-2** completo (mesma base do Anki) recalculando `ef`, `interval`, `reps` e `due` a cada revisão
- **Modo de estudo** com card 3D animado, atalhos de teclado e 4 graus de avaliação
- **Dashboard logado** com saudação contextual, stats globais e atalhos
- **Preferências de estudo** persistidas por usuário:
  - tamanho das respostas (curto · médio · longo)
  - dificuldade (básico · intermediário · avançado)
  - ritmo do deck (rápido · normal · profundo)
  - tema preferido (pré-preenchido na geração)
- **Dark mode** com detecção automática + toggle manual
- **Login fake** (qualquer nome/email) — demo sem cadastro real

---

## Como rodar

Requer **Node.js 18+** e **npm**.

```bash
# instalar dependências
npm install

# modo desenvolvimento (Vite com HMR + Express em paralelo)
npm run dev
# → http://localhost:5173

# modo produção (build + servidor único)
npm run build
npm start
# → http://localhost:3000
```

Para parar o servidor: `Ctrl + C`. Se uma porta ficar presa:

```bash
lsof -ti:3000 | xargs kill -9   # ou :5173 em dev
```

---

## Atalhos no modo de estudo

| Tecla | Ação |
|-------|------|
| `Espaço` | Mostrar a resposta |
| `1` | Errei (reseta intervalo) |
| `2` | Difícil |
| `3` | Bom |
| `4` | Fácil (intervalo cresce mais) |
| `Esc` | Sair da sessão |

---

## Estrutura do projeto

```
SmartDeck/
├── server/
│   └── index.js              # API Express (generate, list, get, review, delete)
├── src/
│   ├── App.jsx               # roteamento de views + auth
│   ├── main.jsx
│   ├── styles.css            # Tailwind + componentes base
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Logo.jsx
│   │   ├── ProgressChart.jsx # Recharts (maturidade do deck)
│   │   └── StatGrid.jsx
│   ├── views/
│   │   ├── Landing.jsx       # tela pública
│   │   ├── Login.jsx         # login fake
│   │   ├── Dashboard.jsx     # hub logado
│   │   ├── Home.jsx          # gerador de decks
│   │   ├── Settings.jsx      # preferências de estudo
│   │   ├── Deck.jsx          # detalhe do deck
│   │   ├── Study.jsx         # modo de estudo (flip + SM-2)
│   │   ├── DeckList.jsx      # biblioteca
│   │   ├── Done.jsx
│   │   └── Loading.jsx
│   └── lib/
│       ├── api.js            # cliente HTTP
│       ├── auth.js           # usuário em localStorage
│       ├── prefs.js          # preferências em localStorage
│       └── pdf.js            # extração de texto via pdfjs
├── data/
│   └── decks.json            # persistência local dos decks (gitignored)
├── dist/                     # build de produção (gitignored)
├── index.html                # entry point do Vite
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## API

Todos os endpoints retornam JSON.

### `POST /api/generate`

Gera um novo deck.

```json
{
  "topic": "Biologia celular",
  "text": "Cole anotações aqui (opcional)",
  "count": 8,
  "prefs": {
    "length": "medio",
    "difficulty": "intermediario",
    "pace": "normal"
  }
}
```

Resposta: deck completo com `cards[]`, cada card contendo `id`, `q`, `a` e `state` SM-2.

### `GET /api/decks`

Lista todos os decks com contagem total e cards `due`.

### `GET /api/decks/:id`

Retorna um deck com cards completos + `stats`.

### `POST /api/decks/:id/review`

Registra uma avaliação e recalcula o estado SM-2 do card.

```json
{
  "cardId": "uuid",
  "quality": 4
}
```

Resposta: card atualizado + estatísticas do deck.

### `DELETE /api/decks/:id`

Remove um deck.

---

## SM-2 em uma frase

A cada acerto, o intervalo cresce multiplicado pelo *easiness factor* (EF). A cada erro, o card volta ao topo da fila. Acertos fáceis aumentam o EF; difíceis reduzem (mínimo 1.3). Resultado: cards que você domina aparecem cada vez menos, cards difíceis voltam com frequência.

---

## Roadmap curto

- Integração real com LLM (OpenAI / Anthropic) substituindo o banco curado
- Exportar deck em formato Anki (`.apkg`)
- Modo multiplayer / sala de estudo
- Gamificação leve (streak, conquistas)
- Backend persistente (SQLite ou Postgres)
- Autenticação real

---

## Time

- **Fernando Munhoz Molinari** — CEO e desenvolvedor
- **Gabriel Borges** — Especialista em educação
- **Gabriel Dimas** — Especialista em design e marketing

---

## Licença

Projeto privado em fase de demonstração.
