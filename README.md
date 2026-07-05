# Kasa

Application web de location de logements entre particuliers, développée en React.

Projet réalisé dans le cadre de la formation Testeur Logiciel (OpenClassrooms) — [Coding guidelines Kasa](https://course.oc-static.com/projects/Front-End+V2/P9+React+1/Coding+guidelines+Kasa+FR.pdf).

## Contexte

Kasa est une plateforme fictive de location d'appartements. L'objectif est d'implémenter le front-end en respectant les maquettes Figma et les contraintes techniques du brief.

**Maquettes :** [UI Design Kasa (Figma)](https://www.figma.com/file/bAnXDNqRKCRRP8mY2gcb5p/UI-Design-Kasa-FR?node-id=4%3A1)

## Fonctionnalités

| Page | Route | Description |
|------|-------|-------------|
| Accueil | `/` | Bannière + grille des 20 logements |
| Fiche logement | `/logement/:id` | Carrousel, tags, note, hôte, collapses |
| À propos | `/about` | Bannière + 4 collapses (valeurs Kasa) |
| Erreur | `*` | Page 404 avec lien retour accueil |

### Carrousel

- Défilement en boucle (première ↔ dernière image)
- Flèches et compteur masqués s'il n'y a qu'une seule photo
- Hauteur fixe, images recadrées (`object-fit: cover`)
- Compteur visible sur desktop, masqué sur mobile

### Collapse

- Fermé par défaut à l'initialisation
- Ouverture / fermeture au clic avec animation CSS
- Chevron animé à la rotation

### Cards (accueil)

- Lien vers la fiche logement
- Overlay sombre au survol

## Stack technique

| Technologie | Rôle |
|-------------|------|
| React 19 | Composants fonctionnels, props, state, events |
| React Router 6 | Navigation et paramètres d'URL |
| Sass | Styles (variables, mixins, nesting) |
| Vite | Build et serveur de développement |
| Vitest + Testing Library | Tests unitaires |

> **Note :** le brief OC mentionne Create React App, remplacé ici par Vite (CRA étant obsolète). Aucune librairie React externe n'est utilisée en dehors de React Router.

## Données

Les 20 logements sont chargés depuis `frontend/src/logements.json`.
Toutes les images (logements et hôtes) sont hébergées localement dans `frontend/public/logements/`.
L'application est autonome : aucun back-end ni connexion internet n'est nécessaire.

## Prérequis

- Node.js 18+
- npm

## Installation

```bash
cd frontend
npm install
```

## Scripts

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur de dev → http://localhost:5173 |
| `npm run build` | Build de production dans `dist/` |
| `npm run preview` | Sert le build de production en local |
| `npm test` | Lance les tests unitaires |
| `npm run test:watch` | Tests en mode watch |
| `npm run coverage` | Tests + rapport de couverture |

## Structure du projet

```
Kasa/
└── frontend/
    ├── public/
    │   ├── logements/          photos des logements et des hôtes
    │   ├── banner-*.jpg        bannières Accueil et À propos
    │   └── logo*.svg           logos du site
    └── src/
        ├── styles/
        │   ├── _variables.scss   couleurs, breakpoints
        │   └── _mixins.scss    mixin responsive @include mobile
        ├── components/
        │   ├── Banner.jsx/.scss
        │   ├── Card.jsx/.scss
        │   ├── Carrousel.jsx/.scss
        │   ├── Collapse.jsx/.scss   (+ Collapse.test.jsx)
        │   ├── Footer.jsx/.scss
        │   ├── Header.jsx/.scss
        │   ├── Host.jsx/.scss
        │   ├── Layout.jsx/.scss
        │   ├── Logo.jsx/.scss
        │   ├── Rating.jsx/.scss
        │   └── Tag.jsx/.scss
        ├── pages/
        │   ├── Home.jsx/.scss
        │   ├── FicheLogement.jsx/.scss
        │   ├── About.jsx/.scss
        │   └── Error.jsx/.scss
        ├── logements.json      données des 20 annonces
        ├── App.jsx             routes centralisées
        ├── index.scss          styles globaux
        └── main.jsx            point d'entrée
```

## Routes

Toute la logique de routage est centralisée dans `frontend/src/App.jsx` :

```
/                  → Accueil
/about             → À propos
/logement/:id      → Fiche logement
*                  → Page 404
```

## Gestion des erreurs

- URL inconnue → page 404 (route `*`)
- Identifiant de logement invalide (`/logement/xxx`) → redirection vers `/404`

## Tests

Les composants `Banner` et `Collapse` sont couverts par des tests unitaires :

```bash
cd frontend
npm test
```

## Conformité au brief OC

- Composants modulaires (un composant par fichier)
- Props, state, gestion d'événements, listes avec `.map()`
- Routes gérées par React Router avec paramètre `:id`
- Styles en Sass
- Pas de librairie React externe
- Aucune erreur à la compilation ni aux tests
