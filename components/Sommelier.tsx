"use client";

import { useEffect, useRef, useState } from "react";

type Turn = { role: "user" | "assistant"; content: string };

const suggestions = [
  "Un dîner pour deux à 25 000 F, avec un verre de vin",
  "Que boire avec le Tchep d'Agneau au Riz Soumbala ?",
  "Je suis végétarienne et j'aime le fromage",
  "Un petit-déjeuner copieux sans porc",
  "Un cocktail pas trop sucré, plutôt frais",
  "Le meilleur menu pour 4 personnes à 40 000 F",
];

export function Sommelier({ initialQuestion }: { initialQuestion?: string }) {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState(initialQuestion ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [turns]);

  useEffect(() => {
    if (initialQuestion && !started.current) {
      started.current = true;
      void ask(initialQuestion);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function ask(question: string) {
    const q = question.trim();
    if (!q || busy) return;
    setError(null);
    setInput("");
    const history: Turn[] = [...turns, { role: "user", content: q }];
    setTurns([...history, { role: "assistant", content: "" }]);
    setBusy(true);
    try {
      const res = await fetch("/api/sommelier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      if (!res.ok || !res.body) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? `Erreur ${res.status}`);
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setTurns([...history, { role: "assistant", content: acc }]);
      }
    } catch (e) {
      setTurns(history);
      setError(e instanceof Error ? e.message : "Erreur inconnue");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col rounded-[2rem] bg-white shadow-2xl ring-1 ring-ink/5">
      <div className="min-h-[360px] flex-1 space-y-5 overflow-y-auto p-6">
        {turns.length === 0 && (
          <div>
            <p className="text-muted">Bonjour. Dites-moi ce qui vous ferait plaisir, je connais chaque ligne de la carte.</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => ask(s)}
                  className="rounded-full bg-mint-soft px-4 py-2 text-left text-sm font-medium text-sage transition hover:bg-mint hover:text-ink"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {turns.map((t, i) => (
          <div key={i} className={`flex ${t.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] whitespace-pre-wrap rounded-3xl px-5 py-3 leading-relaxed ${
                t.role === "user" ? "bg-candy text-white" : "bg-marble text-ink"
              }`}
            >
              {t.content || <span className="inline-block h-4 w-8 animate-pulse rounded-full bg-ink/20" />}
            </div>
          </div>
        ))}
        {error && <p className="rounded-2xl border border-amber-400/40 bg-amber-400/10 px-4 py-3 text-sm text-amber-200">{error}</p>}
        <div ref={bottomRef} />
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void ask(input);
        }}
        className="flex gap-2 border-t border-ink/10 p-4"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Votre envie, votre budget, une question…"
          className="flex-1 rounded-full bg-marble px-5 py-3 text-ink placeholder:text-muted/70 focus:ring-2 focus:ring-candy focus:outline-none"
        />
        <button
          disabled={busy || !input.trim()}
          className="btn-shine rounded-full bg-candy px-6 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-white transition hover:-translate-y-0.5 disabled:opacity-40"
        >
          {busy ? "…" : "Envoyer"}
        </button>
      </form>
    </div>
  );
}
