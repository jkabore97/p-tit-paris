import Anthropic from "@anthropic-ai/sdk";
import { getMenu, getSite } from "@/lib/content";
import { SOMMELIER_MODEL, sommelierSystem } from "@/lib/sommelier";

export const runtime = "nodejs";
export const maxDuration = 60;

type Turn = { role: "user" | "assistant"; content: string };

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      { error: "Le sommelier n'est pas encore branché : ajoutez ANTHROPIC_API_KEY dans les variables d'environnement Vercel." },
      { status: 503 },
    );
  }

  let turns: Turn[];
  try {
    const body = (await req.json()) as { messages?: Turn[] };
    turns = (body.messages ?? [])
      .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
      .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }))
      .slice(-12);
  } catch {
    return Response.json({ error: "Requête invalide." }, { status: 400 });
  }
  if (!turns.length || turns[turns.length - 1].role !== "user") {
    return Response.json({ error: "Il manque votre question." }, { status: 400 });
  }

  const [menuBooks, siteData] = await Promise.all([getMenu(), getSite()]);
  const system = sommelierSystem(menuBooks, siteData.tagline);
  const client = new Anthropic();
  const messages: Anthropic.MessageParam[] = turns.map((t) => ({ role: t.role, content: t.content }));

  const stream = client.messages.stream({
    model: SOMMELIER_MODEL,
    max_tokens: 1500,
    thinking: { type: "adaptive" },
    output_config: { effort: "low" },
    system: [{ type: "text", text: system, cache_control: { type: "ephemeral" } }],
    messages,
  });

  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        const final = await stream.finalMessage();
        if (final.stop_reason === "refusal") {
          controller.enqueue(encoder.encode("\n\nJe préfère rester sur la carte : que puis-je vous conseiller ?"));
        }
      } catch (err) {
        const msg =
          err instanceof Anthropic.RateLimitError
            ? "Le sommelier est très sollicité, réessayez dans un instant."
            : err instanceof Anthropic.AuthenticationError
              ? "Clé API invalide côté serveur."
              : "Le sommelier a perdu le fil, réessayez.";
        controller.enqueue(encoder.encode(`\n\n${msg}`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  });
}
