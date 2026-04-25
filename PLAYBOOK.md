# Realtor Site Playbook

Hard-won lessons from building Home Sweet Chloe (2026-04). When something feels weird while customizing this starter, check here first.

---

## gpt-image-2 (OpenAI image generation)

### Org verification gate

- Brand-new orgs get **403 "organization must be verified"** on first call to gpt-image-2
- Fix: https://platform.openai.com/settings/organization/general → Verify Organization (1-min ID check)
- After verifying, "up to 15 minutes for access to propagate" — observed 5-9 min
- Probe pattern: poll a minimal `/v1/images/generations` request and treat HTTP 200 as the success signal (not curl timeout or 0000)

### Edit endpoint legacy-locked to dall-e-2

- `POST /v1/images/edits` returns `400 Invalid value: 'gpt-image-2'. Value must be 'dall-e-2'.`
- Same for `gpt-image-1.5` — only `dall-e-2` accepted on `/v1/images/edits`
- Even with dall-e-2, `quality` parameter rejected (`400 Unknown parameter: 'quality'`)
- **Workaround:** skip `mode: "edit"` for headshot processing entirely. Place headshot at its native resolution and apply CSS `filter: grayscale(1)` for B&W treatment. Already implemented in the portfolio portrait `<Image>` elements (check for `className="... grayscale"`).
- The `realtor-portrait-bw` entry in `prompts.json` is kept as reference but will fail at runtime — documented with a `_comment`.

### Supported sizes

- `1024x1024` / `1024x1536` / `1536x1024` / `auto`
- NOT supported: `1792x1024` (older era), arbitrary dimensions

### Transient 500s

- Some prompts produce `500 The server had an error...` consistently while others work in same run
- Often triggered by: "hands holding", "developer's blueprint", certain people-feature phrasings
- Workaround: simplify the prompt (drop human-feature mentions), retry with `--only slug --force`, or use an existing image asset for that slot

### Hard cost cap

- The generate-images script has `HARD_CAP_USD = 20` built in — aborts on runaway spend
- Rough pricing (2026-04): ~$0.18/image high quality 1024×1024 · ~$0.07 medium · ~$0.03 low · 1536×1024 ≈ 1.4× base

---

## CSS / Layout gotchas

### `-z-10` on background image

- Negative z-index can put an element BEHIND `<body>`'s background, making it invisible
- Pattern that burned us: `<div className="absolute inset-0 -z-10"><Image /></div>` — invisible because body had `background: white`
- Fix: drop the `-z-10`. Use `relative` + `z-10` on the content overlay instead

### Hairline-only inputs in 5+ field forms

- `border-b + bg-transparent` (hairline style) is invisible at scale (5+ fields, multi-fieldset)
- Works for 2-3 field subscribe forms; kills conversion/usability at larger form scales
- Fix: use `.field-input` class (canvas-tinted box + 1px full border) for any form with 4+ fields. Reserve hairline for short lead-capture forms only.

### SVG logo at small sizes

- A 14409×2466 viewBox SVG rendered at `h-5` (20px) renders letterforms at ~3-4px wide → blurry sub-pixel anti-aliasing
- Fix: render brand name as Fraunces text directly via web font. No SVG needed. Already implemented in Header — see `t("hero.eyebrow")` rendered in `var(--font-display)`.

### `.type-h2` baked color override

- Setting `color: var(--color-ink)` in a utility class wins over Tailwind's `text-white` (same specificity, source-order wins)
- Symptom: H2 disappears on dark sections
- Fix: `style={{ color: "white" }}` inline on dark-bg headings, OR strip color from `.type-*` classes and rely on element selector + utility

### Tailwind v4 `@theme` vs `:root`

- Tailwind v4 requires custom properties in both `@theme {}` (for Tailwind to recognize them in classes like `bg-[var(...)]`) AND `:root {}` (for runtime CSS access)
- If you add a new color and it doesn't work in Tailwind classes, add it to `@theme` in globals.css

---

## Vercel + Domain

### Vercel CLI scope

- `vercel deploy --token X --yes` may fail with `missing_scope` in non-interactive mode
- Fix: add `--scope $VERCEL_SCOPE` (find scope slug in Vercel dashboard URL or `vercel whoami`)

### Hobby tier + Developer commit author

- Vercel Hobby blocks builds when commits have `Developer <developer@example.com>` author placeholder (Claude Code auto-mode default)
- Fix: public repo (simplest), OR rewrite commit author to user identity, OR upgrade to Pro tier
- See memory note: `feedback_vercel_hobby_commit_author.md`

### Custom domain pattern

1. Add domain in Vercel: Project → Settings → Domains
2. In Cloudflare DNS: CNAME `@` → `cname.vercel-dns.com`
3. Wait ~1 min for Vercel to verify
4. SSL auto-provisioned via Vercel + Let's Encrypt

### Cloudflare email routing

- For realtor@brandname.ca inbox: Cloudflare Email Routing → forward to Gmail
- Enables BREVO_API_KEY transactional sends FROM realtor@brandname.ca
- Set up before wiring the Brevo email notify in api/contact/route.ts

---

## Form / SEO / Editorial

### Form patterns

| Fields | Recommended style |
|--------|------------------|
| 1-3 fields | Hairline OK (`.hairline-input`) |
| 4+ fields | Visible box (`.field-input`) |
| All forms | Required indicator `*` in accent color |
| All forms | Privacy line: "No newsletter, no third-party data sales." |

### SEO essentials

- `app/sitemap.ts` + `app/robots.ts` (Next.js native — already wired)
- Per-page `generateMetadata` with canonical + openGraph + twitter (in each page.tsx)
- Single-locale indexing if KO isn't fully translated (`robots: { index: false }` — already set for `/ko/`)
- JSON-LD schemas: `RealEstateAgent` on layout (site-wide), `Person` on About, `FAQPage` on Presales
- `public/llms.txt` for AI search engines (fill in after copy is final)

### Fraunces font-variation-settings

Fraunces is a variable font with an `opsz` axis that controls stroke contrast:

| Usage | opsz value | Effect |
|-------|-----------|--------|
| Hero headline (88px) | 144 | High contrast hairline-to-fat |
| H2 (56px) | 72 | Moderate contrast |
| H3 (24px) | 36 | Subtle contrast |
| Pull quote (36px italic) | 48 | Soft italic feel |

If using a non-variable display font, remove `font-variation-settings` from all `.type-*` classes in `globals.css`.

### Eyebrow tracking

- `letter-spacing: 0.22em` (not 0.12em) for editorial / magazine register
- Scarcity rule: accent color appears 4-5 times maximum per page

---

## Data sourcing for BC realtors

When filling in PRICE_PER_SQFT for the estimator:
- Start at zealty.ca (most accessible for sold prices)
- Then rew.ca, zolo.ca
- Avoid realtor.ca in scripts — bot-block causes frequent timeouts
- Board stats PDFs (REBGV, FVREB, etc.) for monthly averages by type

---

## Performance notes

- Turbopack dev server (`next dev`) — fast HMR
- Production build (`next build`) uses standard webpack-based bundler (Next.js default for prod)
- Image optimization: all editorial images served via Next/Image with `sizes` attributes
- Font loading: `display: "swap"` on all web fonts
- Korean font (Pretendard) loaded via CDN only on `lang="ko"` pages
