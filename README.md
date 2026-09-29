# Nimma's Multispeciality Dental Clinic

A single-page marketing website for Nimma's Multispeciality Dental Clinic
(Kamareddy, Telangana) — built with React 19, TypeScript, Vite, and Tailwind
CSS v4. The whole site is a self-contained, client-side app: interactive
before/after slider, services guide, appointment-booking flow, clinic
location map, team bios, FAQ, and reviews. There is no backend and nothing
to configure — it just runs.

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or later (includes npm)

## Run locally

```bash
npm install
npm run dev
```

The dev server starts at `http://localhost:3000`.

## Build for production

```bash
npm run build
```

This outputs a fully static site to `dist/` — plain HTML, CSS, and JS, no
server required. Preview the production build locally with:

```bash
npm run preview
```

## Deploy

Because the build output is fully static, `dist/` can be deployed to any
static host: Netlify, Vercel, Cloudflare Pages, GitHub Pages, S3 + CloudFront,
or a plain Nginx/Apache server. Most of these platforms (Netlify, Vercel,
Cloudflare Pages) can also build directly from this repository — just point
them at it; they'll detect Vite automatically and run `npm run build` for you.

## Project structure

```
├── index.html          Entry HTML (title, meta tags, favicon)
├── public/              Static assets served as-is
│   ├── favicon.svg
│   └── images/           Photos actually used on the site
├── src/
│   ├── main.tsx          App entry point
│   ├── App.tsx            All page sections/components
│   ├── index.css          Tailwind import + theme (brand colors, fonts)
│   └── assets/images/     A few unused spare/reference photos kept from
│                          the original export — safe to delete or swap in
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## Tech stack

- **React 19** + **TypeScript**
- **Vite 6** — dev server & build
- **Tailwind CSS v4** — styling, theme defined in `src/index.css`
- **Motion** (`motion/react`) — scroll/animation effects
- **lucide-react** — icons
