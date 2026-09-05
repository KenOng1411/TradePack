# TradePack

An independent content hub reviewing crypto exchanges, starting with [Fomo](https://fomo.family). Built with
[Astro](https://astro.build) (static output) + TypeScript + Tailwind CSS. TradePack is **not affiliated with,
endorsed by, or acting on behalf of Fomo** — see [`/disclaimer`](src/pages/disclaimer.astro).

The site is structured so a second exchange review can be added later without restructuring pages or components —
see `src/lib/site.ts`, where exchange data (fees, chains, referral link, funding, etc.) is centralized in one typed
`ExchangeProfile` object rather than hard-coded throughout the UI.

## Stack

- **Astro** (static output, no server/database needed)
- **TypeScript** (strict)
- **Tailwind CSS v4** (CSS-first config, see `src/styles/global.css`)
- **Astro Content Collections** for blog posts (`src/content/blog/`)
- **@astrojs/sitemap** for `sitemap.xml` with per-locale hreflang alternates

## Getting started

```bash
npm install
npm run dev
```

The dev server runs at `http://localhost:4321`.

```bash
npm run build    # static build to dist/
npm run preview  # preview the production build locally
```

`npm run build` does not require any environment variables or API keys — the whole site is static.

## i18n

Five locales: English (default, no URL prefix), Korean (`/ko/`), German (`/de/`), Vietnamese (`/vi/`), and
Traditional Chinese (`/zh-hant/`).

- **English**: full site (all 7 static pages + blog with pagination/tag filtering).
- **Vietnamese**: also a full site, at **localized URL slugs** — `/vi/danh-gia` (review), `/vi/ma-gioi-thieu`
  (referral-code), `/vi/phi-giao-dich` (fees), `/vi/bat-dau` (how-to-start), `/vi/hoi-dap` (faq), `/vi/mien-tru`
  (disclaimer) — plus its own blog index/pagination. These are deliberately not transliterations of the English
  paths; that's a content/SEO decision from the Vietnamese content pack, not an inconsistency.
  ⚠️ Per the content pack's own notes, Vietnamese content still has an open legal-review flag before scaling up
  publishing/promotion — see the tracker spreadsheet.
- **Korean / German / Traditional Chinese**: UI shell (header/footer/language switcher) + one translated sample
  home page + one sample blog post, to prove routing/hreflang end-to-end. More content lands incrementally.
  ⚠️ **German/EU is intentionally on hold** — Fomo is not (yet) on the MiCA/CASP licensed-provider list, confirmed
  via casptracker.eu; don't add new `/de` pages until that changes.

- **UI strings** (nav, footer, buttons, disclaimer): `src/i18n/{locale}.json`, loaded via `src/i18n/ui.ts`.
- **Page content**: written directly in each locale's `.astro` file, or as Markdown in `src/content/blog/{locale}/`.
- **Routing/translation registry**: `src/i18n/routes.ts` uses abstract `PageId` strings (e.g. `"review"`,
  `"blog:how-to-trade"`) resolved per-locale through a `LOCALE_PATHS` table — never assume a locale's path is the
  English path with a prefix. Adding a translated static page is a two-step process:
  1. Create the page file (e.g. `src/pages/ko/fees.astro`).
  2. Add its path under `ko` in `LOCALE_PATHS` (`src/i18n/routes.ts`), keyed by `PAGE_KEYS.fees`.

  Blog posts translate via `BLOG_GROUPS` (a topic-id → per-locale-slug map), since translated posts often use
  completely different slugs per locale (see "Adding a new blog post" below) — not by filename matching.

Header/footer navigation links resolve via `navTargetUrl()`, which sends visitors to the real translated page when
one exists, or to the English version otherwise (rather than bouncing them to their locale's homepage). The language
switcher itself falls back to the target locale's homepage when the current page has no translation, per spec.

## Adding a new blog post

1. Add a Markdown file under `src/content/blog/<locale>/<slug>.md` with frontmatter matching the schema in
   [`src/content.config.ts`](src/content.config.ts):

   ```md
   ---
   title: "..."
   description: "..."
   locale: "en"
   publishDate: 2026-03-01
   tags: ["fomo", "guide"]
   author: "TradePack Team"
   ---

   Post content in Markdown...
   ```

2. Posts are picked up automatically by that locale's `/blog` (listing, tag filter, pagination) and `/blog/<slug>`
   route — every locale that has any posts gets its own blog index for free (see `src/pages/vi/blog/[...page].astro`).
3. To make a post available as a translation of an existing one, add its entry to `BLOG_GROUPS` in
   `src/i18n/routes.ts` (a topic-id → per-locale-slug map) — the slug does **not** need to match across locales
   (e.g. `how-to-trade-on-fomo-app-beginners-guide` in English is
   `huong-dan-giao-dich-fomo-cho-nguoi-moi` in Vietnamese). This is what makes the language switcher and hreflang
   treat the two files as translations of the same article. A post with no `BLOG_GROUPS` entry just has no
   cross-locale alternates, which is fine for English-only content.

## Brand assets

The logo, favicon, and OG image are **real, final assets** supplied directly by the project owner (not
AI-generated placeholders):

- `src/assets/brand/logo-icon.png` — the transparent logo mark, rendered in the header/footer via `astro:assets`
  (`Header.astro`, `Footer.astro`).
- `public/favicon-32x32.png`, `public/favicon-16x16.png`, `public/apple-touch-icon.png` — generated from that same
  source icon with `sharp` (see the one-off resize commands in git history; re-run manually with `sharp` if the
  source logo ever changes).
- `public/images/og-image.png` — cropped from the owner's gradient logo banner to the standard 1200×630 OG ratio.

### Generating the hero illustration (`npm run gen:brand`)

`scripts/generate-brand-assets.ts` calls the Gemini image API to generate the home page's hero illustration — the
only brand asset still AI-generated — then resizes it locally with `sharp`. It is **not** run automatically by
`npm run build` — image generation costs API quota and every generated image should be reviewed by a human before
it ships.

```bash
cp .env.example .env
# edit .env and set GEMINI_API_KEY

npm run gen:brand   # generates hero-illustration.png into src/assets/brand/
```

The prompt lives in `scripts/brand-prompts.json`, tuned to match the real logo's blue/violet gradient. Raw output
lands in `src/assets/brand/raw/`; optimized output goes to `src/assets/brand/`. Nothing is wired into a page
automatically — review the image, then import it where you want it.

## SEO

- Per-page `<title>`, meta description, Open Graph, and Twitter Card tags — see `src/components/Seo.astro`.
- `hreflang` alternates (all 5 locales + `x-default`) computed from the same routing registry used by the language
  switcher, so they never point at a 404.
- JSON-LD: `FAQPage` on `/faq`, `Review` on `/review`, `Article` on every blog post.
- `sitemap.xml` (via `@astrojs/sitemap`) and `robots.txt` (`public/robots.txt`).
- Canonical URLs are automatic and locale-aware.

## Environment variables

See `.env.example`. Two values are placeholders you need to fill in yourself before going to production:

- `PUBLIC_SITE_URL` — the real production domain (currently `https://tradepack.local`). Used for canonical URLs,
  hreflang, the sitemap, and Open Graph tags.
- `GEMINI_API_KEY` — only needed to run `npm run gen:brand`.

`robots.txt` also hard-codes a `Sitemap:` URL (it's a static file, so it can't read env vars at build time) — update
it once you have the real domain.

## Deploy

This is a static Astro site (`output: 'static'`) — it can deploy to any static host (Netlify, Vercel, Cloudflare
Pages, etc.). Steps intentionally left blank for the project owner to fill in:

- [ ] Purchase/confirm the production domain and set `PUBLIC_SITE_URL`
- [ ] Connect the repo to a hosting provider and set the build command (`npm run build`) / output dir (`dist`)
- [ ] Set `PUBLIC_SITE_URL` (and any other secrets) in the host's environment variable settings
- [ ] Register the real domain in Google Search Console and add verification (see the TODO in
      `src/components/Seo.astro` / `.env.example`)
- [ ] Set up Google Ads conversion tracking on `/referral-code` once the campaign is ready

## Project structure

```
src/
  components/       Reusable UI: Button, Card, StatBadge, FAQAccordion, TrustBar,
                     RiskDisclaimer, FeeCalculator, LanguageSwitcher, Header, Footer, Seo
  content/blog/      Blog posts, one folder per locale
  i18n/              routes.ts (translation registry), ui.ts (loader), {locale}.json (UI strings)
  layouts/           BaseLayout.astro
  lib/site.ts        Site + exchange config (extensible to future exchanges)
  pages/             English pages at the root; ko/de/vi/zh-hant/ for locale pages
scripts/
  generate-brand-assets.ts   Gemini image generation + sharp optimization (npm run gen:brand)
  brand-prompts.json         Editable prompts, one per asset
```
