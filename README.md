# Realtor Site Starter

Generic Next.js 16 + Tailwind v4 + next-intl scaffold for a single-realtor brand site, extracted from the Home Sweet Chloe build (2026-04). Reuses the editorial component set, the gpt-image-2 image generation pipeline, full SEO/JSON-LD coverage, and Vercel deploy config.

The concept: a magazine-style editorial site for any realtor, not a generic IDX portal. Content is i18n-driven so most brand customization happens in `messages/en.json` and `DESIGN.md`.

---

## Workflow for a new realtor

### 1. Brainstorm + DESIGN.md (~30 min)

Run the `realtor-site-brainstorm` skill in Claude Code, or fill in `DESIGN.md.template` directly.

Key decisions per realtor:
- Brand identity (name, realtor, brokerage, tagline)
- Visual mood (editorial magazine / quiet luxury / boutique / warm modernist)
- Color palette (3-5 colors)
- Typography pair (display + sans)
- Service area
- Concept anchor (the idea that holds the magazine together — e.g., "Field Notes", "Notebook", "Atlas", "The Studio")

### 2. Clone + customize (~15 min)

```bash
cp -r realtor-site-starter clients/{realtor-name}/website
cd clients/{realtor-name}/website
```

Then:
1. Move `DESIGN.md.template` → `DESIGN.md`, fill in all sections
2. Replace ALL placeholder values in `messages/en.json` (and `messages/ko.json` if KO needed)
3. Update CSS color tokens in `app/globals.css` @theme and :root blocks
4. Replace logo files in `public/logo/` (favicon set required; brokerage logo optional)
5. Place realtor headshot at `scripts/headshot-source.jpg` (portrait, min 1024px wide)
6. Copy `.env.example` → `.env.local`, fill in `OPENAI_API_KEY` and `NEXT_PUBLIC_SITE_URL`

### 3. Generate images (~10 min)

```bash
npm install
# Customize scripts/prompts.json — stylePreset and image entries to match brand
npm run gen-images
```

Preview the generated images in dev:
```bash
npm run dev
# Visit http://localhost:3000/en/review
```

Reroll any weak images:
```bash
npm run gen-images -- --only slug1,slug2 --force
```

See `PLAYBOOK.md` for known gpt-image-2 quirks (org verify gate, edit endpoint legacy lock, transient 500s).

**Portrait handling:** The gpt-image-2 edit endpoint is locked to dall-e-2 (see PLAYBOOK.md). Use the headshot directly with CSS `filter: grayscale(1)` — it's already applied in the About and home page portrait `<img>` elements.

### 4. Customize estimator pricing (~5 min)

In `components/EstimatorForm.tsx` and `app/api/estimate/route.ts`, fill in:
- `PRICE_PER_SQFT` lookup with current local market $/sqft per neighborhood × property type
- Neighborhood `<option>` list in the select

Source pricing from: recent MLS board stats, Zealty.ca, or local board reports.

If the estimator doesn't fit (e.g., luxury market where estimates feel presumptuous), remove the `/value` route and update the nav in `messages/en.json`.

### 5. SEO finalization (~5 min)

In `app/[locale]/layout.tsx`:
- Confirm `NEXT_PUBLIC_SITE_URL` is set correctly
- Customize the `RealEstateAgent` JSON-LD (name, phone, areaServed, brokerage address)
- Update `themeColor` to match brand accent

In `app/[locale]/about/page.tsx`:
- Customize the `Person` JSON-LD

In `app/sitemap.ts` + `app/robots.ts`:
- Confirm `NEXT_PUBLIC_SITE_URL` is set

In `public/llms.txt`:
- Replace all placeholder content with realtor's actual bio + page list

### 6. Deploy (~5 min)

```bash
# Recommended: push to GitHub → Vercel auto-deploys
git add -A
git commit -m "init: [brand name] realtor site"
git push origin main

# Or direct CLI deploy:
vercel deploy --prod --token $VERCEL_API_TOKEN --yes --scope $VERCEL_SCOPE
```

Then in Vercel dashboard: Settings → Domains → add custom domain.
In Cloudflare DNS: add CNAME `@` → `cname.vercel-dns.com`.

---

## File structure

```
realtor-site-starter/
├── app/
│   ├── [locale]/          # EN + KO routes
│   │   ├── layout.tsx     # Metadata, fonts, JSON-LD, locale layout
│   │   ├── page.tsx       # Homepage
│   │   ├── about/
│   │   ├── presales/
│   │   ├── value/         # Home value estimator
│   │   └── contact/
│   ├── api/
│   │   ├── contact/       # Contact form webhook
│   │   └── estimate/      # Estimator server-side recompute + webhook
│   ├── globals.css        # Tailwind v4 + CSS custom properties + type scale
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── ContactForm.tsx
│   ├── EstimatorForm.tsx  # Home value estimator — fill in PRICE_PER_SQFT
│   ├── LangToggle.tsx
│   └── editorial/         # DropCap, PullQuote, FieldNote, FigureWithCaption, etc.
├── messages/
│   ├── en.json            # All EN copy — fill in {{PLACEHOLDER}} values
│   └── ko.json            # KO copy (stub — translate or remove)
├── public/
│   ├── images/editorial/  # Generated images go here (gitignored until generated)
│   └── logo/              # Favicon set + brokerage logo
├── scripts/
│   ├── generate-images.ts # gpt-image-2 generation script
│   └── prompts.json       # Image prompts — customize stylePreset + entries
├── i18n/                  # next-intl routing config
├── DESIGN.md.template     # Brand guidelines template — copy to DESIGN.md + fill
├── PLAYBOOK.md            # Hard-won gotchas from the HSC build
├── .env.example           # Environment variable reference
└── README.md              # This file
```

---

## Editorial components included

`components/editorial/`:
- `DropCap` — float-left first letter, display font, accent color
- `PullQuote` — italic quote + attribution + hairline. Magazine register.
- `FieldNote` — numbered card with title + body. Used for services grid and presale checklist.
- `FigureWithCaption` — image + italic below-left caption. Essay-style image placement.
- `TableOfContents` — magazine-style numbered anchor list for homepage.
- `EditorialImage` — Next/Image wrapper with framing presets (wide / square / portrait).
- `JsonLd` — schema.org JSON-LD injection helper.

---

## Known patterns

See `PLAYBOOK.md` for:
- gpt-image-2 quirks (org verify gate, edit endpoint lock, sizes, transient 500s)
- Common CSS gotchas from this lineage (z-index, hairline inputs, SVG logo sizing)
- Vercel + Cloudflare setup pattern
- Form patterns (hairline vs visible inputs)
- SEO essentials
- Fraunces font-variation-settings

---

## Stack

- Next.js 16 App Router (Turbopack)
- React 19
- TypeScript 5.7 strict
- Tailwind v4 beta
- next-intl 4.9 (path-based, EN + optional KO)
- Vitest + React Testing Library
- OpenAI SDK 6.x for gpt-image-2

---

## License

Internal — not for redistribution. © Dan Jeong / CREAL.
