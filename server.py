"""SmartDeck — demo backend (Python stdlib).

Run: python3 server.py  →  http://localhost:3000
"""
import json
import mimetypes
import os
import time
import uuid
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "public")
PORT = int(os.environ.get("PORT", 3000))

DECKS: dict[str, dict] = {}

SEED_BANK = {
    "biologia celular": [
        ("O que é a membrana plasmática?",
         "Barreira seletiva formada por bicamada lipídica que separa o meio intra do extracelular."),
        ("Função da mitocôndria",
         "Produção de ATP via respiração celular (fosforilação oxidativa)."),
        ("O que é o retículo endoplasmático rugoso?",
         "Organela com ribossomos aderidos, responsável pela síntese de proteínas."),
        ("Diferença entre célula procarionte e eucarionte",
         "Procarionte não possui núcleo definido nem organelas membranosas; eucarionte sim."),
        ("Papel do lisossomo",
         "Digestão intracelular de macromoléculas via enzimas hidrolíticas."),
        ("O que é osmose?",
         "Difusão de água através de membrana semipermeável a favor do gradiente."),
    ],
    "direito constitucional": [
        ("O que são cláusulas pétreas?",
         "Núcleo imutável da CF/88 (art. 60, §4º): forma federativa, voto direto/secreto/universal/periódico, separação dos poderes e direitos/garantias individuais."),
        ("Princípio da legalidade",
         "Ninguém é obrigado a fazer ou deixar de fazer algo senão em virtude de lei (art. 5º, II)."),
        ("Diferença entre controle difuso e concentrado",
         "Difuso: qualquer juiz, no caso concreto. Concentrado: STF, em abstrato (ADI, ADC, ADPF, ADO)."),
        ("Habeas corpus protege qual direito?",
         "Liberdade de locomoção (art. 5º, LXVIII)."),
        ("O que é mandado de segurança?",
         "Ação para proteger direito líquido e certo não amparado por HC ou HD, contra ato ilegal de autoridade."),
        ("Princípio da dignidade da pessoa humana",
         "Fundamento da República (art. 1º, III) — vetor interpretativo de todo o ordenamento."),
    ],
    "cálculo": [
        ("Definição de derivada", "Limite de [f(x+h) − f(x)] / h quando h → 0."),
        ("Regra da cadeia", "d/dx f(g(x)) = f′(g(x)) · g′(x)."),
        ("Teorema Fundamental do Cálculo",
         "Se F é antiderivada de f, então ∫ₐᵇ f(x)dx = F(b) − F(a)."),
        ("Derivada de sin(x)", "cos(x)."),
        ("Integral de 1/x", "ln|x| + C."),
        ("O que é um limite?", "Valor ao qual f(x) se aproxima quando x se aproxima de um ponto."),
    ],
    "inglês": [
        ("Tradução: 'to overcome'", "Superar, vencer."),
        ("Past simple de 'to think'", "Thought."),
        ("Diferença entre 'few' e 'a few'",
         "'Few' tem conotação negativa (poucos); 'a few' positiva (alguns)."),
        ("Significado de 'to look forward to'", "Aguardar com expectativa."),
        ("Present perfect: estrutura", "Subject + have/has + past participle."),
        ("Quando usar 'since' vs 'for'", "'Since' + ponto no tempo; 'for' + duração."),
    ],
}


def generate_from_topic(topic: str, text: str) -> list[dict]:
    key = (topic or "").lower().strip()
    for seed_key, cards in SEED_BANK.items():
        if seed_key in key or key in seed_key:
            return [{"q": q, "a": a} for q, a in cards]
    t = topic or "o tema enviado"
    base = [
        (f"O que é {t}?",
         f"Conceito central de {t} — definição extraída automaticamente pela IA a partir do seu material."),
        (f"Principais características de {t}",
         "A IA identifica de 3 a 5 atributos essenciais do conteúdo enviado."),
        (f"Aplicação prática de {t}",
         "Exemplo concreto extraído do contexto do material para ancorar a memória."),
        (f"Erro comum sobre {t}",
         "Distinção que costuma confundir alunos — a IA destaca para reforço."),
        (f"Comparação: {t} vs. tópicos próximos",
         "Diferenças-chave identificadas no texto para evitar confusão na hora da prova."),
        (f"Resumo em uma frase: {t}",
         "Síntese de alto nível para revisão rápida pré-prova."),
    ]
    if text and len(text) > 80:
        snippet = " ".join(text.strip().split())[:140]
        base.append(("Trecho-chave do material enviado",
                     f"\"{snippet}…\" — destacado pela IA por alta densidade conceitual."))
    return [{"q": q, "a": a} for q, a in base]


def new_card_state() -> dict:
    return {
        "ef": 2.5,
        "interval": 0,
        "reps": 0,
        "due": int(time.time() * 1000),
        "lastReview": None,
        "history": [],
    }


def sm2(state: dict, quality: int) -> dict:
    ef, interval, reps = state["ef"], state["interval"], state["reps"]
    if quality < 3:
        reps = 0
        interval = 1
    else:
        if reps == 0:
            interval = 1
        elif reps == 1:
            interval = 6
        else:
            interval = round(interval * ef)
        reps += 1
        ef = max(1.3, ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)))
    now = int(time.time() * 1000)
    history = (state.get("history") or []) + [{"quality": quality, "at": now}]
    return {
        "ef": round(ef, 2),
        "interval": interval,
        "reps": reps,
        "due": now + interval * 24 * 60 * 60 * 1000,
        "lastReview": now,
        "history": history[-20:],
    }


def deck_stats(deck: dict) -> dict:
    now = int(time.time() * 1000)
    total = len(deck["cards"])
    seen = sum(1 for c in deck["cards"] if c["state"]["reps"] > 0)
    due = sum(1 for c in deck["cards"] if c["state"]["due"] <= now)
    mastered = sum(1 for c in deck["cards"]
                   if c["state"]["reps"] >= 3 and c["state"]["ef"] >= 2.5)
    avg_ef = 0 if total == 0 else sum(c["state"]["ef"] for c in deck["cards"]) / total
    return {"total": total, "seen": seen, "due": due, "mastered": mastered,
            "avgEf": round(avg_ef, 2)}


class Handler(BaseHTTPRequestHandler):
    def log_message(self, fmt, *args):
        print("[%s] %s" % (time.strftime("%H:%M:%S"), fmt % args))

    def _send_json(self, status: int, body: dict | list):
        data = json.dumps(body).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def _read_json(self) -> dict:
        length = int(self.headers.get("Content-Length", "0") or 0)
        if length == 0:
            return {}
        raw = self.rfile.read(length).decode("utf-8")
        try:
            return json.loads(raw)
        except json.JSONDecodeError:
            return {}

    def _serve_static(self, path: str):
        if path == "/" or path == "":
            path = "/index.html"
        fs_path = os.path.normpath(os.path.join(ROOT, path.lstrip("/")))
        if not fs_path.startswith(ROOT) or not os.path.isfile(fs_path):
            self.send_error(404, "Not found")
            return
        ctype, _ = mimetypes.guess_type(fs_path)
        with open(fs_path, "rb") as f:
            data = f.read()
        self.send_response(200)
        self.send_header("Content-Type", ctype or "application/octet-stream")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def do_GET(self):
        url = urlparse(self.path)
        p = url.path

        if p == "/api/decks":
            now = int(time.time() * 1000)
            self._send_json(200, [{
                "id": d["id"],
                "title": d["title"],
                "createdAt": d["createdAt"],
                "total": len(d["cards"]),
                "due": sum(1 for c in d["cards"] if c["state"]["due"] <= now),
            } for d in DECKS.values()])
            return

        if p.startswith("/api/decks/") and p.endswith("/stats"):
            deck_id = p.split("/")[3]
            deck = DECKS.get(deck_id)
            if not deck:
                self._send_json(404, {"error": "Deck não encontrado."})
                return
            self._send_json(200, deck_stats(deck))
            return

        if p.startswith("/api/decks/"):
            deck_id = p.split("/")[3]
            deck = DECKS.get(deck_id)
            if not deck:
                self._send_json(404, {"error": "Deck não encontrado."})
                return
            self._send_json(200, deck)
            return

        self._serve_static(p)

    def do_POST(self):
        url = urlparse(self.path)
        p = url.path

        if p == "/api/generate":
            body = self._read_json()
            topic = (body.get("topic") or "").strip()
            text = (body.get("text") or "").strip()
            if not topic and not text:
                self._send_json(400, {"error": "Envie ao menos um tema ou texto."})
                return
            cards = [{
                "id": str(uuid.uuid4()),
                "q": c["q"],
                "a": c["a"],
                "state": new_card_state(),
            } for c in generate_from_topic(topic, text)]
            deck = {
                "id": str(uuid.uuid4()),
                "title": topic or "Material sem título",
                "createdAt": int(time.time() * 1000),
                "cards": cards,
            }
            DECKS[deck["id"]] = deck
            time.sleep(0.7)
            self._send_json(200, deck)
            return

        if p.startswith("/api/decks/") and p.endswith("/review"):
            deck_id = p.split("/")[3]
            deck = DECKS.get(deck_id)
            if not deck:
                self._send_json(404, {"error": "Deck não encontrado."})
                return
            body = self._read_json()
            card_id = body.get("cardId")
            quality = max(0, min(5, int(body.get("quality", 0))))
            card = next((c for c in deck["cards"] if c["id"] == card_id), None)
            if not card:
                self._send_json(404, {"error": "Card não encontrado."})
                return
            card["state"] = sm2(card["state"], quality)
            self._send_json(200, {"card": card, "deckStats": deck_stats(deck)})
            return

        self.send_error(404, "Not found")


def main():
    server = ThreadingHTTPServer(("127.0.0.1", PORT), Handler)
    print(f"SmartDeck demo rodando em http://localhost:{PORT}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServidor encerrado.")


if __name__ == "__main__":
    main()
