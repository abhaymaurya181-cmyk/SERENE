# SERENE

A cinematic web experience built with Next.js, Three.js, and Framer Motion.

## Stack

- **Next.js 14** (App Router)
- **Three.js** via `@react-three/fiber` and `@react-three/drei`
- **Framer Motion**
- **Tailwind CSS**
- **TypeScript**
- **Cloudflare R2** for video storage

## Local Development

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` — it redirects to `/serene`.
s
## Deploy on Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo
3. No environment variables needed
4. Click Deploy

## Video Storage

Videos are served from Cloudflare R2:
`https://pub-448c0393c0554348831f3e393b0c14c7.r2.dev`

To swap in a custom domain, update the base URL across the `episodes` array in `app/serene/page.tsx`.

## Project Structure

```
app/
  serene/page.tsx       # Main experience page
  layout.tsx            # Root layout + fonts
  globals.css
components/
  serene/
    Intro.tsx           # Opening screen
    Galaxy.tsx          # Three.js star field
    Episode.tsx         # Video chapter cards
    Interval.tsx        # Intermission scene
    Montage.tsx         # Photo montage
    Outro.tsx           # Closing scene
    AudioManager.tsx    # Background music control
public/
  serene/               # Images and static assets
```
