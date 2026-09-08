# P'tit Paris — site vitrine, carte interactive & sommelier IA

Site Next.js (App Router) pensé pour Vercel, pour P'tit Paris, Gounghin, Ouagadougou.

## Ce qu'il y a dedans

| Route | Ce que ça fait |
| --- | --- |
| `/` | Page d'accueil cinématique : logo, statut « en service / fermé » calculé sur l'heure d'Ouagadougou, les trois cartes, les spécialités maison, la cave. |
| `/menu` | La carte complète (≈ 330 références) avec recherche instantanée, filtres 👑 spécialités / 🌿 végétarien / 🌶️ spicy, rail de rubriques collant, URL partageable (`?book=dej&tag=veg`). |
| `/menu/[slug]` | Une page par plat, avec photo, prix, tags, suggestions de la même rubrique, bouton « Que boire avec ? » et partage natif. |
| `/menu/[slug]/opengraph-image` | Image Open Graph générée à la volée (photo + nom + prix) pour chaque plat : les liens partagés sur WhatsApp / Instagram ressemblent à une page de magazine. |
| `/sommelier` | Chat en streaming avec Claude, qui ne connaît **que** la carte (prompt système mis en cache) : accords, menus à budget, options sans porc, etc. |
| `/reserver` | Formulaire de réservation qui compose un message prêt à envoyer sur WhatsApp (ou à copier). |
| `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest`, `/icon` | SEO et installation sur écran d'accueil. |

Vercel Analytics et Speed Insights sont branchés dans `app/layout.tsx`.

## Données

Toute la carte vit dans `lib/menu.ts` (transcription du PDF `menu.ptitparis.com`, septembre 2026). Les photos ont été extraites de la carte et sont dans `public/photos/`.
Pour changer un prix ou ajouter un plat, c'est le seul fichier à toucher.

## Lancer en local

```bash
npm install
cp .env.example .env.local   # puis renseigner les clés
npm run dev
```

## Déployer sur Vercel

1. Importer le dépôt sur Vercel (framework détecté : Next.js).
2. Renseigner les variables d'environnement :
   - `ANTHROPIC_API_KEY` — active le sommelier ;
   - `NEXT_PUBLIC_WHATSAPP_NUMBER` — numéro du restaurant, format international sans `+` ;
   - `NEXT_PUBLIC_SITE_URL` — URL publique (pour les cartes Open Graph).
3. Déployer. Sans les clés, le site fonctionne ; seules les deux fonctions correspondantes affichent un message.

## Pistes pour la suite

- Déposer une empreinte de carte à la réservation (Stripe) et un vrai compteur de couverts (Vercel KV / Supabase).
- Mode « table » avec QR code par table qui ouvre la carte directement en mode commande.
- Fiches Instagram automatiques : `/menu/[slug]/opengraph-image` sert déjà de visuel 1200×630.
