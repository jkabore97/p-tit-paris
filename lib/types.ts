/** Types partagés client/serveur (aucune dépendance serveur ici). */

export type OrderStatus = "new" | "preparing" | "ready" | "served" | "cancelled";
export type OrderLine = { key: string; slug: string; name: string; qty: number; price: number };
export type Order = {
  id: string;
  code: string;
  table_no: number;
  guest_name: string;
  note: string | null;
  items: OrderLine[];
  total: number;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
};

export type PostKind = "plat_du_jour" | "annonce" | "partenaire" | "pub";
export type Post = {
  id: string;
  kind: PostKind;
  title: string;
  body: string | null;
  image: string | null;
  link: string | null;
  cta: string | null;
  price: number | null;
  starts_at: string | null;
  ends_at: string | null;
  active: boolean;
  position: number;
  created_at?: string;
};
export const POST_KIND_LABEL: Record<PostKind, string> = {
  plat_du_jour: "Plat du jour",
  annonce: "Annonce",
  partenaire: "Partenaire",
  pub: "Publicité",
};

export type Social = { label: string; handle: string; href: string };
export type SiteData = {
  tagline?: string;
  whatsapp?: string;
  phone?: string;
  address?: string;
  hours?: string;
  socials?: Social[];
};

export type MediaInfo = { id: string; name: string; mime: string; size: number; created_at: string };

export type Stats = {
  today_orders: number;
  today_total: number;
  open_orders: number;
  week_orders: number;
  items: number;
  sections: number;
  posts: number;
  top: { name: string; qty: number }[];
};
