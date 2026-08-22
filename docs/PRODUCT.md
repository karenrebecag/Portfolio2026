# Product notes — karenrebecaortiz.com

Why this site is shaped the way it is. Operational detail for agents lives in
`CLAUDE.md`; this file is for humans (and recruiters) reading the repo.

## Job to be done

Convince a technical hiring manager or founder in a few minutes that the author
ships **product engineering** work: systems, design systems, AI tooling, and
clear writing — not only visual polish.

The live site does the persuasion. The GitHub repo is the backstage: stack,
content model, and related public repositories.

## Product decisions

| Decision | Why |
|----------|-----|
| **No CMS in production** | Early scaffold used Payload + Postgres. For a single-author portfolio the operational cost was higher than the benefit. Content is TypeScript metadata + Markdown in the repo: reviewable in PRs, deployable on Vercel without a database. |
| **One content model for case studies and articles** | Listings should not care whether a piece is “project” or “article.” `canonicalRoute` chooses `/projects/<slug>` or `/articulos/<slug>`; helpers resolve hrefs and legacy redirects. |
| **Single home listing** | `/projects` and `/articulos` redirect home. Separate index pages duplicated the same decision surface. |
| **Spanish default, English peer** | Primary audience and voice are Spanish; English is first-class for international recruiters (`/en`, full message catalogs). |
| **Locale via geolocation + explicit toggle** | Cookie `NEXT_LOCALE` wins after a manual choice. Default discovery uses IP geolocation rather than trusting `Accept-Language` alone (browsers lie; travelers misconfigure). |
| **Three themes (Plantation / Night / Mono)** | Brand expression, not a dark-mode afterthought. Accent is always `var(--plantation)` — no hardcoded Plantation hex in components. |
| **Motion as product, not decoration** | GSAP + Lenis + structured page transitions are part of the craft story the site tells about frontend work. Prefer reduced-motion respect where interactions are non-essential. |
| **Contact via Resend** | Simple API route; site still renders without `RESEND_API_KEY`. Rate limiting on the route. |

## Content rules (editorial)

- Titles are **commercial headlines**, not internal project codenames. The body can name the client or system; the title sells the idea.
- Case studies and long-form pieces share SEO helpers, sitemap generation, and structured data from the same entry list.
- UI chrome strings live in `messages/es.json` and `messages/en.json` — not hardcoded in components.

## What this repo is not

- Not a multi-author publishing platform.
- Not the source of truth for Atom’s design system (that is `atom-uikit-ds`).
- Not a substitute for reading the other public repos linked from the site and README.

## Related public work

| Repo | Signal |
|------|--------|
| [atom-uikit-ds](https://github.com/karenrebecag/atom-uikit-ds) | Production design system + agent distribution |
| [Companion](https://github.com/karenrebecag/Companion) | Spec-driven native macOS voice product |
| [PowerAutomate_MCP](https://github.com/karenrebecag/PowerAutomate_MCP) | Personal MCP over undocumented Flow APIs |

Together with this site they show the same pattern: **define the problem, constrain the system, document the trade-offs, ship.**
