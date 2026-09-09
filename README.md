# P'tit Paris — site, carte interactive, commande à table & sommelier IA

Site Next.js (App Router) pensé pour Vercel, pour P'tit Paris, Gounghin, Ouagadougou.

## Ce qu'il y a dedans

| Route | Ce que ça fait |
| --- | --- |
| `/` | Accueil lumineux et animé : logo, statut « en service / fermé » calculé sur l'heure d'Ouagadougou, bandeau défilant des plats, photos flottantes en parallaxe, les trois cartes, spécialités, galerie du lieu, pâtisserie, sommelier. |
| `/menu` | La carte complète (≈ 320 références) : recherche instantanée, filtres 👑 / 🌿 / 🌶️, rail de rubriques collant, bouton « Ajouter » sur chaque plat, URL partageable (`?book=dej&tag=veg`). |
| `/menu/[slug]` | Une page par plat : photo, prix, tailles, « Ajouter à ma commande », « Que boire avec ? », partage natif, image Open Graph générée à la volée. |
| `/commander` | **Commande à table.** Ouvert par le QR de la table (`/t/12`), table pré-remplie, prénom, recherche, panier flottant, envoi en cuisine. |
| `/commande/[id]` | Suivi en direct de la commande : reçue → en cuisine → prête → servie, annulation tant que la cuisine n'a pas commencé. |
| `/cuisine` | **Écran équipe** (PIN). Tableau des commandes en 3 colonnes, chrono par commande, alerte sonore à chaque nouvelle commande, changement de statut en un tap. |
| `/cuisine/qr` | Feuille imprimable de QR codes, un par table. |
| `/sommelier` | Chat en streaming avec Claude, qui ne connaît **que** la carte (prompt système mis en cache). |
| `/reserver` | Réservation ou commande de gâteau via un message WhatsApp prêt à envoyer. |

## Commande à table : comment ça marche

1. L'équipe ouvre `/cuisine`, entre le PIN, puis `/cuisine/qr`, choisit le nombre de tables et imprime.
2. Le client scanne le QR de sa table → `/t/12` → `/commander?table=12`. Il choisit, met son prénom, envoie.
3. La cuisine voit la commande apparaître (bip + carte qui clignote), la passe « En cuisine », « Prête », « Servie ».
4. Le client suit tout ça sur sa page de commande, qui se rafraîchit toute seule.

**PIN initial : `240926`.** Changez-le depuis l'écran cuisine (bouton « Changer le PIN »). Après 20 mauvais essais en 10 minutes, le PIN se verrouille 10 minutes.

### Où sont les données

Dans Supabase, projet `kaj-system` (`uvcibhbslsvakmjcfzwx`), tables préfixées `ptp_` (`ptp_orders`, `ptp_settings`, `ptp_pin_failures`).
Les tables sont verrouillées (RLS sans policy) : tout passe par des fonctions SQL `ptp_*` en `security definer` qui valident chaque appel. La clé « publishable » embarquée dans `lib/db.ts` est publique par conception et ne donne accès à rien d'autre.

Pour déplacer les commandes vers un projet Supabase dédié : rejouez le SQL de `supabase/ptit_paris_orders.sql`, puis renseignez `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_KEY` sur Vercel.

### Développer sans Supabase

```bash
PTP_MOCK_DB=1 npm run dev
```

Les commandes tournent alors en mémoire (perdues au redémarrage), PIN `240926`.

## Données de la carte

Toute la carte vit dans `lib/menu.ts` (transcription de `menu.ptitparis.com`, édition novembre 2025). Les photos des plats sont dans `public/photos/`, celles du lieu dans `public/interior/`. Pour changer un prix ou ajouter un plat, c'est le seul fichier à toucher.

## Lancer en local

```bash
npm install
cp .env.example .env.local   # puis renseigner les clés
npm run dev
```

## Déployer sur Vercel

1. Importer le dépôt (framework Next.js, `vercel.json` le verrouille).
2. Variables d'environnement :
   - `ANTHROPIC_API_KEY` — active le sommelier ;
   - `NEXT_PUBLIC_WHATSAPP_NUMBER` — numéro du restaurant, format international sans `+` ;
   - `NEXT_PUBLIC_SITE_URL` — URL publique (cartes Open Graph, QR codes).
3. Déployer. Sans les clés, le site et la commande à table fonctionnent ; seules les deux fonctions correspondantes affichent un message.
