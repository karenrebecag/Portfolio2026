# CLAUDE.md — Portfolio2026 (karenrebecaortiz.com)

Personal portfolio of Karen Ortiz. **Next.js 15** App Router, GSAP, Lenis, Tailwind v4, `next-intl`.

Public narrative for recruiters: [`README.md`](README.md) · product decisions: [`docs/PRODUCT.md`](docs/PRODUCT.md).

## Current state (production)

- **No CMS.** Payload, Docker, and Postgres from the original scaffold are gone.
- Content lives in the repo: TypeScript metadata + Markdown under `apps/web/src/content/`.
- Deploy: **Vercel**. Local: `pnpm dev:web` → **http://localhost:4100**.
- Contact form needs `RESEND_API_KEY` (and related vars in `apps/web/.env.example`); the site still renders without them.

## Architecture

```
Portfolio2026/
  apps/web/          public site (Next.js 15, port 4100)
  packages/shared/   shared types/constants
  docs/              human product notes
```

### Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15 App Router, React 19 |
| Styling | Tailwind CSS 4 |
| Animations | GSAP 3 (ScrollTrigger, SplitText, Observer, etc.) |
| Smooth scroll | Lenis |
| i18n | next-intl (`es` default unprefixed, `en` under `/en`) |
| 3D | Spline runtime |
| Email | Resend |
| Fonts | Inter Tight (sans), Grift (display), Interval (accent/mono), Gantol (handwritten) |

## i18n

- `localePrefix: 'as-needed'` — `/` is Spanish, `/en` is English. `/es` and `/es/*` redirect to the unprefixed Spanish canonical.
- Messages: `apps/web/messages/es.json`, `apps/web/messages/en.json`.
- Server: `getTranslations()` · Client: `useTranslations()`.
- **Locale selection (middleware):**
  1. Cookie `NEXT_LOCALE` (set by the locale toggle) always wins.
  2. Otherwise **IP geolocation** via `x-vercel-ip-country` (Spanish-speaking LATAM + ES → stay on default `es`; others → `/en`).
  3. Crawlers are **not** geo-redirected so both language trees stay indexable.
  4. Unknown geo (e.g. local dev) keeps Spanish default.
- Do **not** document this as Accept-Language-only — that is outdated.
- Always write Spanish UI strings with correct accents (UTF-8).

## Pages

| Route | Purpose |
|-------|---------|
| `/[locale]` | Home: marquee, hero, collaborations, statement, projects listing, about strip, contact |
| `/[locale]/about` | Full about |
| `/[locale]/projects/[slug]` | Case study (canonical when `canonicalRoute: 'project'`) |
| `/[locale]/articulos/[slug]` | Long-form article (when `canonicalRoute: 'article'`) |
| `/[locale]/projects`, `/[locale]/articulos` | Redirect to home listing |
| `/[locale]/proposals/*` | Client proposal pages (e.g. Pigmento) |
| `POST /api/contact` | Resend handler + rate limit |

## Typography

| Variable | Font | Use |
|----------|------|-----|
| `--font-sans` | Inter Tight | Body, UI |
| `--font-display` | Grift | h1–h3, mega type |
| `--font-accent` | Interval | Pills, labels, metadata, locale toggle |
| `--font-handwritten` | Gantol | Doodle labels |

## Color system (3 themes)

| Token | Plantation (light) | Night (dark) | Mono Slate |
|-------|--------------------|--------------|------------|
| `--background` | `#fdf9ed` | `#0c0e0a` | `#e8e6e1` |
| `--foreground` | `#11221f` | `#ECDFCC` | `#1c2028` |
| `--plantation` | `#366B5E` | `#5FA28F` | `#6a9dae` |
| `--surface` | `#11221f` | `#070806` | `#14171d` |
| `--surface-foreground` | `#fdf9ed` | `#ECDFCC` | `#d0cec9` |
| `--muted-foreground` | `#71717a` | `#697565` | `#6b7280` |
| `--border` | `#e4dfcf` | `#1e201b` | `#c8c6c1` |
| `--secondary` | `#f3eedf` | `#161814` | `#dddbd6` |

### Mechanism

- `<html>` classes: none = Plantation light, `.dark` = Night, `.mono` = Mono Slate.
- Anti-flash script in `<head>` reads `localStorage.theme` before paint.
- `ThemeToggle`: three palette dots. `Shift+T` cycles themes.
- Persist: `localStorage.theme` ∈ `light` | `dark` | `mono`.

### `--plantation` rule

Site accent. Use for scroll highlights, rotating text, button hover circles (`getComputedStyle`), nav active, decorative glyphs.

**Never hardcode Plantation hex values.** Always `var(--plantation)` (or other semantic tokens).

### Image filters

- **Mono:** grayscale / sepia / hue-rotate stack on parallax, marquee, stickers, logos.
- **Albums:** fixed green-sepia treatment (see globals / album components).

## Content: projects and articles

### Model

One entry shape for case studies and articles. Routing via `canonicalRoute` and helpers in `apps/web/src/content/projects/project-routing.ts` and listing helpers (`getProjectHref`, legacy article redirects).

### Add a new piece

1. Create `apps/web/src/content/projects/{slug}.ts` (+ `{slug}-es.md` / `{slug}-en.md` as used by existing entries).
2. Export meta (`id`, `title`, `slug`, `status`, `category`, `role`, `year`, `featured`, `summary`, `tags`, URLs, cover, dates, optional `articleSlug`, `canonicalRoute`).
3. Register in `apps/web/src/lib/constants.ts` inside `PLACEHOLDER_PROJECTS` (markdown → description via `markdownToLexical` where applicable).
4. **Titles:** commercial headlines, not internal project codenames.

### Middleware / public assets

Matcher skips `api`, `_next`, static public folders, and extensioned files. If you add a new top-level folder under `apps/web/public/`, ensure it is excluded from locale middleware (see `middleware.ts` `matcher` and `servePublicFile`).

## Key components / systems

| Piece | Role |
|-------|------|
| `ScrollHighlight` | Scroll-scrub highlight using `var(--plantation)` |
| `InfiniteGrid` | Draggable infinite photo grid |
| `DraggableMarqueeStrip` | Horizontal draggable marquee |
| Navigation orchestrator (`lib/navigation/`) | Page transitions, scroll policy, link interceptor |
| Article block renderers | Code, mermaid, tables, callouts, images |
| `LocaleToggle` / `ThemeToggle` | Preference controls |

## Commands

```bash
pnpm dev:web     # portfolio on :4100
pnpm dev         # turbo all workspaces
pnpm build
pnpm typecheck
pnpm test
```

## Rules

- Prefer local verification before relying on production only.
- Never commit `.env` / `.env.local`.
- **No hardcoded brand hex** in components — use CSS variables.
- Buttons that animate with the accent should read `--plantation` at runtime unless an intentional override is required.
- Container (~1400px) wraps **content**, not full-bleed backgrounds.
- Sections: horizontal padding without forcing max-width on backgrounds.
- Visible chrome copy belongs in `messages/*.json`, not hardcoded in components.
- Brand voice: Product Engineering, AI, Design Systems.
- Commits: conventional `type(scope): description`.
