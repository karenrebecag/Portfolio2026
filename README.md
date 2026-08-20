# Portfolio2026

> Personal site of Karen Rebeca Ortiz — case studies and long-form articles served from one content model, in Spanish and English.

**Live:** [karenrebecaortiz.com](https://karenrebecaortiz.com)

---

## Stack

| | |
|---|---|
| Framework | Next.js App Router, React Server Components |
| Monorepo | pnpm workspaces + Turborepo (`apps/web`, `packages/shared`) |
| i18n | `next-intl`, locales `es` (default, unprefixed) and `en` |
| Styling | Tailwind CSS v4, Base UI primitives |
| Motion | GSAP, Lenis smooth scroll, Spline runtime for 3D |
| Email | Resend, via `POST /api/contact` |
| Hosting | Vercel, with Analytics and Speed Insights |

## Content model

Every piece of work is one entry in `PLACEHOLDER_PROJECTS`. What differs is where its canonical URL lives:

- `canonicalRoute: 'article'` — the long-form piece is the destination, at `/articulos/<articleSlug>`
- `canonicalRoute: 'project'` (default) — the case study is the destination, at `/projects/<slug>`

`getProjectHref()` resolves the right URL, so listings never need to know which kind they are rendering. `getClientWorkRedirectForArticleSlug()` keeps legacy `/articulos/*` URLs alive when a piece was later recanonicalized under `/projects/*`.

This is why there are no separate index pages: `/projects` and `/articulos` both redirect to the single listing on the home page. The routing rules live in `apps/web/src/content/projects/project-routing.ts`.

## Locale selection

The middleware picks the locale by IP geolocation, not `Accept-Language`. A manual choice from the toggle writes `NEXT_LOCALE`, which the middleware honors from then on.

## Running it

```bash
pnpm install
cp apps/web/.env.example apps/web/.env.local   # then fill RESEND_API_KEY
pnpm dev            # all workspaces
pnpm dev:web        # just the site
```

Without `RESEND_API_KEY` everything renders; only the contact form fails.

```bash
pnpm typecheck
pnpm test
pnpm build
```

## Layout

```
apps/web/src/
  app/[locale]/(main)/     home, about, listings
  app/[locale]/(project)/  case studies and articles
  app/api/contact/         Resend handler
  app/sitemap.ts           generated from the same entries
  content/projects/        entries and routing rules
  lib/seo/                 metadata helpers and structured data
packages/shared/           types and constants shared across workspaces
```
