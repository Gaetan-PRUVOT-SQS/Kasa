# Kasa — Front-end

Application de location de logements (projet React).

## Stack

- React 19
- React Router 6
- Vite (build + dev server)
- Vitest + Testing Library (tests)
- Sass (un fichier `.scss` à côté de chaque composant)

## Données

Les logements (20 annonces) sont chargés depuis `src/logements.json`.
Toutes les images (photos des logements et des hôtes) sont hébergées
localement dans `public/logements/`. L'application est autonome :
aucun back-end ni connexion internet n'est nécessaire.

## Prérequis

- Node.js 18+

## Installation

```bash
npm install
```

## Scripts

| Commande | Description |
|----------|-------------|
| `npm run dev` | Démarre le serveur de dev (http://localhost:5173) |
| `npm run build` | Build de production dans `dist/` |
| `npm run preview` | Sert le build de production en local |
| `npm test` | Lance les tests unitaires |
| `npm run test:watch` | Tests en mode watch |
| `npm run coverage` | Tests + rapport de couverture |

## Structure

```
public/
  logements/      images des logements et des hôtes
  banner-*.jpg    bannières des pages Home et À propos
  logo*.svg       logos du site
src/
  styles/         variables et mixins Sass partagés
  components/     composants réutilisables (Banner, Card, Carrousel, Collapse, ...)
                  + leurs styles .scss et tests (Banner.test.jsx, Collapse.test.jsx)
  pages/          pages (Home, FicheLogement, About, Error)
  logements.json  données des logements
  App.jsx         routes de l'application
```

## Gestion des erreurs

- URL inconnue → page 404 (route `*`)
- Identifiant de logement invalide (`/logement/xxx`) → redirection vers la page 404
