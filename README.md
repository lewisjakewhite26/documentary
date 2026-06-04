# MR WHITEFLIX

A child-friendly wildlife video browser (Netflix-style UI) for classroom iPads. Videos are hosted on **Supabase Storage**; the app lists and plays public MP4s by filename.

**Live site:** [mrwhiteflix.vercel.app](https://mrwhiteflix.vercel.app) (Vercel project must use this repo, root `.`, build `npm run build`, output `dist`).  
**Repo:** [documentary](https://github.com/lewisjakewhite26/documentary) — do not use `documentary.vercel.app` (that is an old unrelated SvelteKit deploy).

## Quick start

```bash
npm install
cp .env.example .env
# Edit .env with your Supabase project URL and anon key
npm run dev
```

Open `http://localhost:5173`.

## Environment variables

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Project URL (`https://….supabase.co`) |
| `VITE_SUPABASE_ANON_KEY` | Anon **public** key (Project Settings → API) |

**Local:** `.env` (gitignored).  
**Production (Vercel):** Project → Settings → Environment Variables → add both → redeploy.

## Video storage

- **Bucket:** `portfolio-images`
- **Folder:** `summer2/` (videos)
- **Folder:** `Music/` (calm nature soundscapes, `.mp3`)
- Files must be **public** (or use policies that allow anonymous read).

### Filename rules

Animal clips:

```text
{animal-slug}-{id}.mp4
```

Examples:

- `cheetah-2.mp4`
- `crocodile-3.mp4`
- `electric-eel-1.mp4`
- `great-white-shark-12.mp4`
- `polar-bear-1.mp4`

The slug matches the animal name in `src/categories.ts` (spaces → hyphens, lowercase).

**Intro / habitats:** any other `.mp4` in the folder (e.g. `savanna-sunset.mp4`) appears under **Intro** on the home page.

Supported extensions: `.mp4`, `.mov`, `.webm`, `.m4v`.

**Nature sounds:** MP3s in `Music/` — home page **Nature Sounds** card opens `/sounds` with **Play** and **Download** on each track. Wildlife videos stay silent.

## Adding a new animal

1. Upload videos to Supabase: `summer2/{slug}-{id}.mp4`
2. Add the display name to the `animals` array in `src/categories.ts`
3. Redeploy (or refresh locally)

Routes are automatic: `/watch/crocodile`, etc.

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint |
| `npm test` | Vitest unit tests |
| `npm run test:e2e` | Playwright smoke tests (builds app, mocks Supabase list) |

## Stack

React 19, TypeScript, Vite 8, Tailwind CSS 4, React Router, Supabase JS client.

## CI

GitHub Actions runs lint, tests, and build on push/PR to `main` (see `.github/workflows/ci.yml`).
