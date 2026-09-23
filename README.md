# Georges Claude Private Academy — site web (refonte 2026)

React 19 · Vite 6 · Tailwind v4 · Motion · Firebase (Firestore / Auth / Storage) · déployé sur Vercel.

## Démarrer
```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production → dist/
npm run lint       # vérification TypeScript
```

## Mettre en ligne (Vercel)
1. Pousser le dépôt sur GitHub (ou glisser le dossier dans Vercel).
2. Vercel détecte Vite : commande `npm run build`, dossier de sortie `dist`. Le fichier `vercel.json` gère les routes (SPA).
3. Variable d'environnement facultative : `VITE_GOOGLE_ANALYTICS_ID` (GA4).
4. Domaine : `agc.ma` (les balises canoniques, le sitemap et les données structurées pointent déjà dessus).

Le dossier `dist/` fourni dans l'archive est déjà construit : il peut aussi être déposé tel quel sur n'importe quel hébergement statique (avec une règle de réécriture vers `index.html`).

## Où modifier le contenu
| Quoi | Où |
|---|---|
| Titres, sous-titres, textes ajoutés (FR/EN) | `src/content/site.ts` → `EXTRA.copy` et `EXTRA.ui` |
| Coordonnées, horaires, réseaux, vidéo | `src/content/site.ts` → `SITE` |
| Photos (CDN) et façade locale | `src/content/site.ts` → `IMG`, `src/assets/campus-hero.jpg` |
| Questions fréquentes (accueil + inscription + données structurées) | `src/content/faq.ts` |
| Textes historiques FR/EN (cycles, académie, vie scolaire…) | `src/constants.ts` → `TRANSLATIONS` |
| Fiches espaces, pièces du dossier d'inscription | `src/content/site.ts` → `SPACES`, `REQUIREMENTS` |
| Actualités, événements, galerie, inscriptions, messages, newsletter, recrutement, comptes | administration `/admin` (Firebase, temps réel) |
| Écran d'ouverture (durée) | `src/components/Preloader.tsx` → `DURATION` |
| Couleurs, typographie, composants de base | `src/index.css` |

## Structure
```
src/
  components/    Header, Footer, Preloader, sections partagées, ui/ (boutons, motion…)
  content/       site.ts (données + textes), faq.ts
  pages/         une page par route ; pages/home/ = sections de l'accueil ; pages/admin/ = administration (inchangée)
  assets/        façade de l'école
public/          robots.txt, sitemap.xml, llms.txt
preview/         mocks pour la version d'aperçu autonome (voir REDESIGN.md)
legacy/          ancien code, conservé pour référence, non compilé
```

## Administration (`/admin`)
Interface refaite (`src/admin/`) : tableau de bord avec compteurs et activité en temps réel, actualités (éditeur, image compressée automatiquement, « à la une »), événements (à venir / passés), galerie (glisser-déposer multiple, vidéos via Storage), demandes d'inscription et messages (boîte de réception, statuts nouveau / lu / traité, réponse par email, WhatsApp, export Excel), newsletter (copie des adresses, export), recrutement (postes + candidatures, CV téléchargeables), utilisateurs.
- Base de données : les mêmes collections Firestore qu'avant (`news`, `events`, `moments`, `messages`, `applications`, `jobs`, `admin_users`, `users`) et les règles `firestore.rules` inchangées : aucune migration.
- Connexion : soit **email + mot de passe Firebase Authentication** (recommandé), soit les identifiants historiques (compatibilité). Pour basculer proprement : créer chaque membre dans Firebase Console → Authentication, l'ajouter dans `users/{uid}` avec `role: "admin"`, puis supprimer la table `LEGACY` dans `src/admin/auth.ts` et la collection `admin_users`.
- Les images sont stockées compressées (data URL) dans Firestore, comme avant ; les vidéos vont dans Firebase Storage.
- L'ancienne administration est conservée dans `legacy/admin/` pour référence.

## Points à valider par l'école avant publication
- Chiffres affichés en grand : piscine semi-olympique, 15 000 ouvrages, 4 laboratoires, +500 élèves, « 5+ années » vs frise historique depuis 2010.
- Noms de l'équipe de direction (page Académie).
- Légende du hero : « Georges Claude, physicien et inventeur français (1870 – 1960) » suppose que l'école porte le nom de l'inventeur du tube néon ; à confirmer (texte dans `src/pages/home/Hero.tsx`).
- Section « Et après le bac ? » : les établissements listés (`src/content/site.ts` → `AFTER_BAC`) sont présentés comme des filières préparées, pas comme des admissions effectives ; ajouter des chiffres réels si l'école en dispose.
- Sécurité : les identifiants historiques (`src/admin/auth.ts`, `src/firebase.ts`) et les mots de passe en clair dans `admin_users` restent en place pour la compatibilité ; basculer vers Firebase Authentication dès que possible (voir section Administration).

Voir `REDESIGN.md` pour la direction artistique, le design system et l'aperçu autonome.
