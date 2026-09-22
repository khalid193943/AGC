# Refonte 2026-2027 — Georges Claude Private Academy

## Lancer le projet
    npm install
    npm run dev      # http://localhost:3000
    npm run build    # production → dist/
    npm run lint     # vérification TypeScript

## Direction artistique « Atlantique & Encre »
- Couleurs : sel `#F4F5F2` (fond), encre `#06193A` (sections sombres), safran `#E8B04B` (accent unique), vert `#2E6B4C` (écologie).
- Typographies : Bricolage Grotesque (titres, interface) + Newsreader (texte éditorial, citations).
- Signature : images en arche, inspirées des arcades portugaises d'El Jadida.
- Tous les jetons sont dans `src/index.css` (@theme + classes .t-*, .btn, .field, .card…).

## Architecture
- `src/content/site.ts` : coordonnées, images, textes ajoutés (FR/EN), pièces du dossier, fiches espaces.
- `src/constants.ts` : traductions historiques (inchangées, fusionnées avec site.ts).
- `src/components/ui/` : boutons, accordéon, SEO, primitives d'animation (motion.tsx).
- `src/components/sections.tsx` : blocs partagés (hero de page, bandeau d'appel, vidéo, chiffres…).
- `src/pages/` : une page par route ; `src/pages/home/` : les sections de l'accueil.
- `legacy/` : anciens fichiers conservés pour référence, non compilés — supprimables.
- Administration (`/admin`) : inchangée.

## Nouvelles routes et redirections
- Nouvelle page `/contact`.
- `/admissions` → `/inscription`, `/spaces/:slug` → `/espaces/:slug`.

## À valider par l'école
1. Frise « Notre histoire » (dates dès 2010) vs mention « 5+ années d'expérience ».
2. Noms de l'équipe de direction (certains semblent être des exemples).
3. Horaires : 8h30–16h30 retenus partout (site + données structurées Google).
4. Chiffre « +500 élèves inscrits » (accueil) — à confirmer.
5. SÉCURITÉ (non corrigé, hors périmètre design) : identifiants administrateur écrits en dur dans
   `src/pages/admin/AdminLogin.tsx` et `src/firebase.ts`, mots de passe en clair dans la collection
   Firestore `admin_users` lisible publiquement. À traiter en priorité : Firebase Auth uniquement,
   règles Firestore restrictives, changement des mots de passe.
