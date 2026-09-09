// Génère le SQL d'amorçage de la carte à partir de lib/menu.ts (source imprimée).
// Usage : node --experimental-strip-types scripts/seed-menu.ts > supabase/seed_menu.sql
import { books, slugify } from "../lib/menu.ts";

const q = (s: string | null | undefined) => (s == null ? "null" : `'${String(s).replace(/'/g, "''")}'`);
const arr = (a: string[]) => `'{${a.map((x) => `"${x.replace(/"/g, '\\"')}"`).join(",")}}'`;

type Sec = { id: string; books: Set<string>; title: string; tagline?: string; note?: string; dual?: string; gallery: string[]; items: Map<string, { name: string; desc?: string; price: number; price2: number | null; tags: string[]; photo?: string }> };
const sections = new Map<string, Sec>();
let pos = 0;
const secPos: string[] = [];
for (const b of books) {
  for (const s of b.sections) {
    let sec = sections.get(s.id);
    if (!sec) {
      sec = { id: s.id, books: new Set(), title: s.title, tagline: s.tagline, note: s.note, dual: s.dual, gallery: s.gallery ?? [], items: new Map() };
      sections.set(s.id, sec);
      secPos.push(s.id);
    }
    sec.books.add(b.id);
    for (const it of s.items) {
      const slug = slugify(it.name);
      if (![...sections.values()].some((x) => x.items.has(slug)))
        sec.items.set(slug, { name: it.name, desc: it.desc, price: Array.isArray(it.price) ? it.price[0] : it.price, price2: Array.isArray(it.price) ? it.price[1] : null, tags: it.tags ?? [], photo: it.photo });
    }
  }
}
const out: string[] = ["begin;"];
for (const id of secPos) {
  const s = sections.get(id)!;
  out.push(`insert into public.ptp_sections (id, books, title, tagline, note, dual, gallery, position) values (${q(s.id)}, ${arr([...s.books])}, ${q(s.title)}, ${q(s.tagline)}, ${q(s.note)}, ${q(s.dual)}, ${q(JSON.stringify(s.gallery))}::jsonb, ${pos++}) on conflict (id) do nothing;`);
  let ipos = 0;
  for (const [slug, it] of s.items) {
    out.push(`insert into public.ptp_items (section_id, slug, name, description, price, price2, tags, photo, position) values (${q(s.id)}, ${q(slug)}, ${q(it.name)}, ${q(it.desc)}, ${it.price}, ${it.price2 ?? "null"}, ${arr(it.tags)}, ${q(it.photo)}, ${ipos++}) on conflict (slug) do nothing;`);
  }
}
out.push("commit;");
process.stdout.write(out.join("\n") + "\n");
