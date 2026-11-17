# Kasa

English · [Français](README.fr.md)

Peer-to-peer housing rental web app (React + Express).

## Description

Kasa shows a housing catalogue. The home page lists the rentals. Each listing page shows the gallery, tags, rating, host, description, and amenities. The site also has an about page and a 404 page. The interface is in French.

Designs: [UI Design Kasa (Figma)](https://www.figma.com/file/bAnXDNqRKCRRP8mY2gcb5p/UI-Design-Kasa-FR?node-id=4%3A1)

## Stack

- Node.js 26 (version pinned in `.nvmrc`)
- UI: React 19, TypeScript, Vite, React Router
- API: Express, Helmet
- Quality: ESLint with typescript-eslint (type-checked rules), Vitest, Testing Library, Supertest, Playwright

## Run the project

Node.js 26.13.0 and npm are required. From the repository root:

```bash
nvm use
```

Terminal 1, the API:

```bash
cd backend
npm ci
npm run dev
```

The API listens on http://127.0.0.1:8080.

Terminal 2, the UI:

```bash
cd frontend
npm ci
npm run dev
```

Open http://127.0.0.1:5173. During development, Vite forwards `/api` requests to the local API.

To serve a build, start the API, then the UI. Unless `VITE_API_URL` is set at build time, the browser calls `http://localhost:8080`.

```bash
cd backend
npm ci
npm run build
npm start
```

```bash
cd frontend
npm ci
npm run build
npm run preview
```

Vite prints the preview URL (port 4173 by default).

## Tests

Backend:

```bash
cd backend
npm run lint
npm run typecheck
npm run test:coverage
npm run build
```

Frontend:

```bash
cd frontend
npm run lint
npm run typecheck
npm run test:coverage
npx playwright install --with-deps chromium
npm run test:e2e
npm run build
```

`npm run test:coverage` runs the tests and fails if line coverage drops below 90%. The Playwright smoke test opens the home page, a listing, the about page, and an unknown URL.

On every push to `main`, GitHub Actions runs lint, typecheck, tests, the coverage gate, the build, and the smoke test.

## Preview

![Home page, housing grid](docs/screenshots/accueil.png)

![A housing page](docs/screenshots/logement.png)

![About page](docs/screenshots/a-propos.png)

![404 page](docs/screenshots/404.png)

## License

MIT
