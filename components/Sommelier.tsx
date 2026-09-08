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
    <div className="flex flex-col rounded-[2rem] border border-cream/10 bg-bordeaux-deep/60">
      <div className="min-h-[360px] flex-1 space-y-5 overflow-y-auto p-6">
        {turns.length === 0 && (
          <div>
            <p className="text-cream/70">Bonsoir. Dites-moi ce qui vous ferait plaisir, je connais chaque ligne de la carte.</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => ask(s)}
                  className="rounded-full border border-gold/40 px-4 py-2 text-left text-sm text-gold transition hover:bg-gold hover:text-bordeaux-deep"
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
                t.role === "user" ? "bg-gold text-bordeaux-deep" : "bg-cream/10 text-cream"
              }`}
            >
              {t.content || <span className="inline-block h-4 w-8 animate-pulse rounded-full bg-cream/30" />}
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
        className="flex gap-2 border-t border-cream/10 p-4"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Votre envie, votre budget, une question…"
          className="flex-1 rounded-full border border-cream/20 bg-cream/5 px-5 py-3 text-cream placeholder:text-cream/40 focus:border-gold focus:outline-none"
        />
        <button
          disabled={busy || !input.trim()}
          className="rounded-full bg-gold px-6 py-3 text-sm uppercase tracking-[0.15em] text-bordeaux-deep transition hover:bg-cream disabled:opacity-40"
        >
          {busy ? "…" : "Envoyer"}
        </button>
      </form>
    </div>
  );
}
