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
| `/admin` | **Centre de contrôle** (mot de passe). Carte (rubriques, plats, prix, photos, ruptures, ordre), annonces (plat du jour, annonce, partenaire, pub), infos & réseaux, photos, sécurité. |
| `/media/[id]` | Sert les photos téléversées depuis le centre de contrôle. |
| `/sommelier` | Chat en streaming avec Claude, qui ne connaît **que** la carte (prompt système mis en cache). |
| `/reserver` | Réservation ou commande de gâteau via un message WhatsApp prêt à envoyer. |

## Centre de contrôle (/admin)

**Mot de passe initial : `paris2026`.** Changez-le dès la première connexion (Sécurité).

- **La carte** : ajoutez, modifiez, masquez, réordonnez rubriques et plats ; deux prix possibles (moyenne / grande, verre / bouteille) ; tags 👑 🌿 🌶️ ; bouton « Disponible aujourd'hui » pour signaler une rupture sans supprimer le plat. Chaque changement est en ligne immédiatement.
- **Annonces & pubs** : quatre types. *Plat du jour* (grande carte commandable, avec prix), *Annonce* (bandeau défilant sous le menu), *Partenaire* (logo dans « Ils nous accompagnent »), *Publicité* (carte sponsorisée sur l'accueil et au fil de la carte). Dates de début et de fin optionnelles.
- **Infos & réseaux** : devise, WhatsApp, téléphone, adresse, horaires, liste des réseaux sociaux.
- **Photos** : téléversement (redimensionnées à 1 600 px, recompressées), bibliothèque, suppression. Les photos de la carte imprimée restent disponibles.
- **Sécurité** : mot de passe du centre de contrôle et PIN de l'écran cuisine.

Le contenu vit dans Supabase (tables `ptp_sections`, `ptp_items`, `ptp_posts`, `ptp_media`, `ptp_site`), amorcé depuis `lib/menu.ts` par `scripts/seed-menu.ts`. Si la base est injoignable, le site retombe sur la carte imprimée du code.

## Commande à table : comment ça marche

1. L'équipe ouvre `/cuisine`, entre le PIN, puis `/cuisine/qr`, choisit le nombre de tables et imprime.
2. Le client scanne le QR de sa table → `/t/12` → `/commander?table=12`. Il choisit, met son prénom, envoie.
3. La cuisine voit la commande apparaître (bip + carte qui clignote), la passe « En cuisine », « Prête », « Servie ».
4. Le client suit tout ça sur sa page de commande, qui se rafraîchit toute seule.

**PIN initial : `240926`.** Changez-le depuis l'écran cuisine (bouton « Changer le PIN »). Après 20 mauvais essais en 10 minutes, le PIN se verrouille 10 minutes.

### Où sont les données

Dans Supabase, projet `kaj-system` (`uvcibhbslsvakmjcfzwx`), tables préfixées `ptp_` (commandes, carte, annonces, médias, réglages).
Les tables sont verrouillées (RLS sans policy) : tout passe par des fonctions SQL `ptp_*` en `security definer` qui valident chaque appel. La clé « publishable » embarquée dans `lib/db.ts` est publique par conception et ne donne accès à rien d'autre.

Pour déplacer les données vers un projet Supabase dédié : rejouez `supabase/ptit_paris_orders.sql`, `supabase/ptit_paris_content.sql` puis `supabase/seed_menu.sql`, et renseignez `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_KEY` sur Vercel.

### Développer sans Supabase

```bash
PTP_MOCK_DB=1 npm run dev
```

Tout tourne alors en mémoire (perdu au redémarrage) : PIN cuisine `240926`, mot de passe admin `paris2026`, carte amorcée depuis le code.

## Données de la carte

La carte imprimée est transcrite dans `lib/menu.ts` (secours et amorçage). Au quotidien, on la modifie depuis `/admin`, pas dans le code. Les photos d'origine sont dans `public/photos/`, celles du lieu dans `public/interior/`.

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
