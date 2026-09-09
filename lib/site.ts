export const site = {
  name: "P'tit Paris",
  tagline: "Un air de Paris à Ouagadougou",
  city: "Ouagadougou, Burkina Faso",
  neighbourhood: "Gounghin",
  menuUrl: "https://menu.ptitparis.com/menu",
  socials: [
    { label: "Facebook", handle: "P'TIT PARIS", href: "https://www.facebook.com/search/top?q=p%27tit%20paris%20ouagadougou" },
    { label: "Instagram", handle: "@ptit_paris", href: "https://www.instagram.com/ptit_paris" },
    { label: "TikTok", handle: "@ptit_paris_official", href: "https://www.tiktok.com/@ptit_paris_official" },
    { label: "Snapchat", handle: "P'TIT PARIS", href: "https://www.snapchat.com/add/ptitparis" },
  ],
  /** Numéro WhatsApp (format international sans +). Défini via NEXT_PUBLIC_WHATSAPP_NUMBER. */
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
  /** Fuseau d'Ouagadougou. */
  timeZone: "Africa/Ouagadougou",
};
