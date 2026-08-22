# Portfolio2026

Personal site of **Karen Rebeca Ortiz** — product engineering, design systems, and AI-native tooling, told through case studies and long-form writing in **Spanish and English**.

**Live:** [karenrebecaortiz.com](https://karenrebecaortiz.com) · English: [karenrebecaortiz.com/en](https://karenrebecaortiz.com/en)

This repository is public on purpose. Recruiters and hiring managers who open it should get the same clarity as the site: who the work is for, how the system is built, and where the deeper technical evidence lives.

---

## Who this is for

People evaluating:

- **Product / platform engineering** with strong frontend and systems taste  
- **Design systems** that must survive vibecode and agent-generated UI  
- **AI tooling** (MCP servers, agent workflows) grounded in real constraints  
- Bilingual communication (ES default, EN peer)

The site is the narrative. The other public repos are the proof.

---

## Product decisions (short)

| Choice | Rationale |
|--------|-----------|
| **No CMS** | Single author. Content is Markdown + TypeScript in-repo — reviewable, no Postgres/Payload in production. |
| **One content model** | Case studies and articles share the same entry shape; `canonicalRoute` picks `/projects/…` or `/articulos/…`. |
| **One listing** | Home is the catalog. `/projects` and `/articulos` redirect there. |
| **Locale** | `es` unprefixed by default; `en` under `/en`. Middleware prefers IP geolocation; a manual toggle sets `NEXT_LOCALE`. |
| **Themes** | Plantation (light), Night (dark), Mono Slate — accent always via `var(--plantation)`. |
| **Motion** | GSAP, Lenis, page transitions as part of the craft story, not a plugin pile-on. |

Longer product notes: [`docs/PRODUCT.md`](docs/PRODUCT.md).

---

## Related public repositories

These are the projects most often linked from the portfolio and from conversations with recruiters:

| Repository | What it demonstrates |
|------------|----------------------|
| [atom-uikit-ds](https://github.com/karenrebecag/atom-uikit-ds) | Production marketing design system: 3-layer tokens, registry, MCP anti-hallucination, Webflow — **brand integrity under vibecode**. |
| [Companion](https://github.com/karenrebecag/Companion) | Spec-driven native **macOS** voice companion (Swift 6): personal product judgment, architecture, honest scope. |
| [PowerAutomate_MCP](https://github.com/karenrebecag/PowerAutomate_MCP) | Local MCP for **personal** Power Automate flows via the undocumented service API — probe-first tools, dry-run writes. |

Each repo has its own README written for the same audience: problem → decisions → trade-offs → how to run.

---

## Stack

| Layer | Choice |
|-------|--------|
| App | Next.js App Router, React Server Components |
| Monorepo | pnpm workspaces + Turborepo (`apps/web`, `packages/shared`) |
| i18n | `next-intl` — `es` default, `en` |
| Styling | Tailwind CSS v4, Base UI primitives |
| Motion | GSAP, Lenis, Spline runtime (3D) |
| Content | TypeScript metadata + Markdown → lexical-style blocks for rich articles |
| Email | Resend (`POST /api/contact`) |
| Hosting | Vercel (Analytics + Speed Insights) |
| Typography | Inter Tight, Grift, Interval, Gantol |

---

## Content model

Every piece of work is one entry (see `PLACEHOLDER_PROJECTS` / `apps/web/src/content/projects/`). What differs is the canonical URL:

- `canonicalRoute: 'article'` → `/articulos/<articleSlug>` (and `/en/articulos/…`)
- `canonicalRoute: 'project'` (default) → `/projects/<slug>`

`getProjectHref()` resolves the right path so listings stay dumb. Legacy article URLs can redirect when a piece is recanonicalized under `/projects/*`.

Sitemap and structured data are generated from the same entries.

**Editorial rule:** titles are commercial headlines, not internal codenames. The body can name the system; the title sells the idea.

---

## Architecture sketch

```
apps/web/src/
  app/[locale]/(main)/      home, about, listing redirects, proposals
  app/[locale]/(project)/   case study / article detail shells
  app/api/contact/          Resend + rate limit
  app/sitemap.ts            from content entries
  content/projects/         meta + markdown (es/en)
  content/about/            about copy per locale
  lib/seo/                  metadata + JSON-LD
  lib/navigation/           transition orchestrator, scroll policy
  components/               UI, motion, article blocks
packages/shared/            shared types/constants
```

Agent-oriented rules (themes, tokens, i18n, how to add a case study): [`CLAUDE.md`](CLAUDE.md).

---

## Running locally

```bash
pnpm install
cp apps/web/.env.example apps/web/.env.local   # optional: RESEND_API_KEY
pnpm dev:web        # site on the port configured for web (see package)
# or
pnpm dev            # all workspaces via turbo
```

Without `RESEND_API_KEY` the site still renders; only the contact form fails.

```bash
pnpm typecheck
pnpm test
pnpm build
```

---

## Documentation map

| Doc | Audience |
|-----|----------|
| [README.md](README.md) | Recruiters, peers, first-time clone |
| [docs/PRODUCT.md](docs/PRODUCT.md) | Product decisions and related repos |
| [CLAUDE.md](CLAUDE.md) | Agents / contributors editing the site |
| [CHANGELOG.md](CHANGELOG.md) | Historical build log (scaffold → current) |

---

## License

[MIT](LICENSE). Content and brand assets remain attributable to Karen Ortiz; the code is open so the engineering choices are inspectable.

---

*Built and maintained by [Karen Ortiz](https://karenrebecaortiz.com) · Contact via the site form or channels listed there.*
