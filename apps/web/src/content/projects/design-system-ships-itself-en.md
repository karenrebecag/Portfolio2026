> [!tip] In 30 seconds
> - **Who this is for:** Design-system and platform leads where **everyone vibecodes** (marketing, product, founders) and off-brand UI keeps landing on engineering for rescue.
> - **Problem it solves:** Agents see component metadata but not source — they invent hex values, spacing, and variants that pass visual review and ship as subtle lies about the system.
> - **What changes if you apply this:** Machine-readable tokens (**~500 → ~350**, same visual range); shadcn-style copy-not-npm; MCP split (list vs implement) → **fewer PRs with CSS outside the token system**; one source of truth instead of three competing catalogs.

An AI agent generates a button. It compiles. It renders. It looks right. The background violet is `#534AB7` -- a color that exists nowhere in the design system.

Nobody decided that. The agent had the component's metadata -- it knew a variant existed, it knew it took a size -- but it didn't have the real code. So ==it made up the rest.== A plausible hex. A 36px padding where the system uses 40px. A font-size that approximates but doesn't match. The result passes human code review because it looks correct. And it ships to production as a subtle lie about the system.

The honest path to a design system agents cannot hallucinate is **three problems in sequence** — each visible only after fixing the previous one: reinterpret an existing system for machine readers; connect agents and watch them hallucinate anyway; discover the architecture had truth duplicated in three places. Below is that sequence and what it implies for design systems and AI.

> [!info] External grounding (not just our monorepo)
> The distribution model follows [shadcn/ui's registry](https://ui.shadcn.com/docs/registry) (copy source, don't npm-install a black box). Agent access follows the [Model Context Protocol](https://modelcontextprotocol.io/specification/2025-11-25/server/tools) tool surface. Tokens follow the [W3C Design Tokens format](https://www.designtokens.org/). Company auth for MCP follows [Clerk's MCP guides](https://clerk.com/docs/guides/ai/mcp/build-mcp-server). Code snippets below show *our* wiring; the reference table is what I use when the argument has to stand outside the repo.

## Where this started: a company that vibecodes

> **In plain terms:** Everyone was generating UI with AI; engineering kept fixing the same visual drift on marketing pages.
I joined Atom at a precise moment. The product team -- a group of very talented people -- was finishing the first stage of their design system: a system with shadcn's aesthetic, built for Atom's platform. Good work, solid base. But it lived inside the product.

Atom is a multimodal-AI-agents-for-WhatsApp company. AI-first isn't a slogan there -- it's how everyone works, and that includes a practice that defines the culture: ==everyone vibecodes.== Marketing, product, founders. Generating code with AI is the norm, not the exception.

I owned the entire web pipeline, and from there I saw the other side of that culture. Vibecoded pages kept landing on my desk that needed style fixes, homogeneity across touchpoints, or that simply had badly broken code. The product design system solved consistency inside the platform -- but across the marketing touchpoints (landings, campaigns, microsites) there was nothing holding the brand together. Every generated page was a slightly different interpretation of the same thing.

I had two paths. Become the bottleneck reviewing and fixing every page by hand. Or build something that gave non-technical people the power to generate correct from the start -- and, along the way, take that work off my plate.

I took the product design system as a base and reinterpreted it. Not to replace it, but to extend it to a terrain where whoever writes the code isn't always an engineer. It started as a side project. It grew too big. And in the end ==it didn't just work for me.==

## First: a design system designed for non-human readers

> **In plain terms:** Simplifying the rulebook so humans and AI pick the same colors and spacing the first time.
The ATOM UIKit is not a copy of the product system. It's a reinterpretation -- same visual language, different architecture -- optimized for two readers at once: the developer and the LLM.

The original system had ~500 tokens. Per-platform variants, CRM tokens, interactive states mixed into the semantic layer, linear scales with steps nobody could tell apart by eye. I reduced it to ~350 tokens across three strict layers, ==without losing a single visual capability.==

The reason isn't minimalism for aesthetics. It's that a system with fewer options is easier to generate correctly -- for a human and, above all, for a model.

- Fewer tokens = fewer decisions = fewer errors. An LLM doesn't have to choose between 27 spacings when 13 cover every case.
- `bg` / `foreground` pairs for every surface = the model always knows which text color goes on which background.
- Consistent naming (BEM, kebab-case) = patterns the model learns fast.
- Pure CSS, no CSS-in-JS = the model doesn't need to understand runtime abstractions.

> [!info] The result is visually identical to the original system. The difference is in how easily a builder -- human or AI -- produces correct code on the first try.

That phrase -- "designed so AI generates correct code" -- sounds like marketing until you turn it into concrete architecture decisions. The first is how the code is distributed.

## shadcn distribution, not npm

> **In plain terms:** Why components live as visible source files instead of a hidden package AI cannot inspect.
The UIKit components are not on npm. This is written, verbatim, in the first line of the monorepo's CLAUDE.md:

> [!note] "Distributes via private registry (shadcn model) -- source copied to consumer projects, not installed as npm dependencies."

The decision has a philosophy behind it — the same one [shadcn documents for its CLI](https://ui.shadcn.com/docs/cli): components are **added to your project**, not hidden in `node_modules`. An npm dependency is a black box: you install it, you import it, and the code lives where nobody reads or modifies it. For an AI agent, a black box is exactly the worst case -- it can see the package's signature but not its inside, so ==it fills the gaps with guesses.==

The [registry model](https://ui.shadcn.com/docs/registry/getting-started) inverts that. JSON items describe files to copy; the source is yours, in plain sight, modifiable. For an agent it means the real source is reachable through a single implementation tool -- not as an opaque import, but as files it must fetch before writing.

The monorepo is organized into six independent packages:

```tree Monorepo structure
{
  "root": "atom-uikit-ds/packages/",
  "folders": [
    { "category": "tokens", "path": "tokens/", "files": ["primitives/", "semantic/", "components/"] },
    { "category": "css", "path": "css/", "files": ["pure-CSS components + foundation"] },
    { "category": "animations", "path": "animations/", "files": ["GSAP modules, init(): CleanupFn"] },
    { "category": "react", "path": "components-react/", "files": ["~60 React 19 components"] },
    { "category": "astro", "path": "components-astro/", "files": ["Astro components"] },
    { "category": "whatsapp", "path": "whatsapp/", "files": ["WCI widget as self-contained IIFE"] }
  ]
}
```

Six packages, but a single source of values. The tokens aren't tied to any framework -- they're values in a standard format, agnostic to whatever technology consumes them. That's why the same system produces components in pure CSS, in React, in Astro, and even a WhatsApp widget as a self-contained IIFE. ==That agnostic layer is what makes it special:== it's not a set of React components, it's a source many stacks derive their own from. And it's consumed two ways, designed for how client teams actually work: over MCP for agents inside the editor, and over HTTP for anyone vibecoding.

## Multi-repo documentation map

> **In plain terms:** Which repository holds tokens, components, and the agent bridge — skip if you are not implementing.
The design system is not one repository — it is ==four coordinated repos== with written contracts in each `CLAUDE.md`. This table is the index I use when onboarding engineers or agents.

| Repository | Canonical docs | What they govern |
|------------|----------------|------------------|
| `atom-uikit-ds` | Root `CLAUDE.md`, `scripts/registry-schema.ts` | Tokens (3 layers), packages, `pnpm build:registry`, `atom.discovery` vs `atom.implementation` |
| `atom-uikit-cms` | `CLAUDE.md` → *Component article standard* | Payload collections, `restricted` flag on docs, MCP-readable article sections (Button doc ID 67 = reference) |
| `atom-uikit-docs` | `src/app/api/auth/mcp-token/route.ts`, `/auth/mcp-oauth` | Clerk login, company-domain gate, CLI token exchange |
| `atom-uikit-db` | `mcp/CLAUDE.md`, `mcp/architecture.html`, `supabase/functions/get-docs` | Hosted MCP tools, OAuth 2.1, `x-restricted-access` header for restricted blocks |

**Production URLs** (from CMS `CLAUDE.md`):

| Surface | URL |
|---------|-----|
| Docs site | https://uikit.atomchat.io |
| CMS admin | https://uikit-admin.atomchat.io |
| MCP (HTTP) | https://uikit-mcp.vercel.app/mcp |
| Registry API | https://uikit.atomchat.io/api/r |

**Registry pipeline** (verbatim from DS `CLAUDE.md`):

| File | Purpose |
|------|---------|
| `registry.json` | Internal `AtomRegistryItem` schema |
| `scripts/extract-component-metadata.ts` | Pulls variants, props, `cssClasses` from source |
| `scripts/build-registry.mjs` | Writes `public/r/*.json` (shadcn-compatible) |
| `scripts/test-extract-metadata.ts` | 27 unit tests on the extractor |
| `public/r/index.json` | Discovery catalog for MCP warm start |
| `public/r/{name}.json` | Per-component files with full `atom` field |

**MCP tools registered in code** (`atom-uikit-db/mcp/src/server.ts`):

| Tool | Class | Role |
|------|-------|------|
| `atom_uikit_context` | Discovery | Bootstrap: components, tokens, auth status — call first |
| `atom_uikit_search` | Discovery | Keyword search over docs (fuzzy + synonyms) |
| `atom_uikit_component` | Discovery | Props/variants only; emits `implementationAccess: requires_atom_uikit_source` |
| `atom_uikit_get` | Discovery | Doc body by slug; optional section filter (`install`, `usage`, `props`, …) |
| `atom_uikit_list` | Discovery | All published doc slugs |
| `atom_uikit_navigation` | Discovery | Full docs nav tree |
| `atom_uikit_install` | Discovery | Install commands + imports (deduped packages) |
| `atom_uikit_source` | Implementation | **Only** tool that returns real CSS/React source (or `tokens` / `foundation`) |
| `atom_uikit_validate` | Implementation | Invalid variants/sizes, reimplemented components, unknown classes |

The anti-hallucination split is not a blog post idea — it is enforced in `component.ts` structured output and in every component doc's *Instalación* section template in the CMS skill doc.

## Tokens as a contract, not as pretty variables

> **In plain terms:** Brand rules written so mistakes are obvious, not subtle.
If shadcn distribution is the form, ==the three-layer tokens are the contract.== And a contract only works if nobody can break it by accident.

The three layers reference backward, never sideways:

```mermaid Layer hierarchy
graph TD
  P["Layer 1: Primitives -- raw values"] --> S["Layer 2: Semantic -- intent aliases"]
  S --> C["Layer 3: Component -- scoped to a component"]
```

**Primitives** are literals: a hex, a pixel number, an easing curve. 271 colors across 26 families, base-4 spacing in 13 steps, a Major Third typographic scale. They mean nothing on their own -- they just have a value.

**Semantic** tokens give the primitive intent. They don't say "use zinc-900", they say "this is the primary color". Here lives the central convention: every surface has a `-foreground` companion.

**Component** tokens scope a semantic token to a specific component, only when a state is needed that the semantic layer doesn't cover (hover, pressed, disabled).

The rule that holds the whole building up is a single one: ==a component token never references a primitive directly.== It always goes through the semantic layer. And it's not pedantry -- it's what makes dark mode work.

```mermaid Resolution chain
graph LR
  BTN["--button-bg-primary"] -->|references| PRI["--primary"]
  PRI -->|references| ZINC["--color-zinc-900"]
  ZINC -->|final value| HEX["#18181b"]
```

```css The chain in CSS
:root {
  /* Primitive: literal, references nothing */
  --color-zinc-900: #18181b;

  /* Semantic: references the primitive, changes with the theme */
  --primary: var(--color-zinc-900);
  --primary-foreground: var(--color-zinc-50);
}

[data-theme="dark"] {
  /* Same names, inverted values */
  --primary: var(--color-zinc-50);
  --primary-foreground: var(--color-zinc-900);
}

:root {
  /* Component: references the semantic, never the primitive */
  --button-bg-primary: var(--primary);
}
```

The button's CSS says `var(--button-bg-primary)`, which resolves to `var(--primary)`, which resolves to `#18181b`. When you switch themes, only the semantic token changes -- and the button updates without touching a single line of its own CSS.

> [!warning] If a component token references a primitive directly, skipping the semantic layer, dark mode breaks for that component. The primitive doesn't change with the theme. Only the semantic tokens do.

All of this follows the [W3C Design Tokens Community Group format](https://www.designtokens.org/) (`{ "$value": "...", "$type": "..." }`), which reached a [first stable specification in October 2025](https://www.w3.org/community/design-tokens/2025/10/28/design-tokens-specification-reaches-first-stable-version/). That is not cosmetic: external tools ([Style Dictionary](https://styledictionary.com/info/dtcg/), Figma exporters, MCP validators) can read the same contract. The token is machine-readable, not a convention living in someone's head.

## Second problem: the agents hallucinated anyway

> **In plain terms:** Even with good docs, AI still invented components until we changed what it was allowed to touch.
I had built a deliberately predictable system. Fewer tokens, consistent naming, source always available. And still, the first time I let an agent generate interfaces, the opening scene happened.

Not wrong as in "broken". ==Wrong as in "out of context."== The agent used a made-up violet because it seemed reasonable. It used 36px because it's a common value. It picked a font-size that almost matched. Each decision, in isolation, was defensible. Together, they were a different system impersonating mine.

The cause was structural, not the model's. I was giving the agent the component's **metadata** -- name, variants, sizes, props -- and expecting it to produce the **implementation**. But metadata doesn't contain CSS values. So the agent did the only thing it could: it invented them.

The problem wasn't that the agent knew too little. It was that ==I was asking it to do something I hadn't given it the source for.== And worse: nothing in the system stopped it from trying.

## The core idea: separate what an agent can know from what it can do

> **In plain terms:** Like a library catalog versus the keys to the archive — browse freely, change only through approved tools.
The solution is an MCP server that exposes the design system with a deliberate separation between two classes of tools — the same separation [Anthropic described when launching MCP](https://www.anthropic.com/news/model-context-protocol): give clients a **small, typed tool surface** instead of dumping opaque context. The MCP spec's [Tools](https://modelcontextprotocol.io/specification/2025-11-25/server/tools) chapter is the contract; our discovery vs implementation split is how we enforce it for CSS.

> [!note] DS `CLAUDE.md`: "This split enforces the anti-hallucination pattern: LLMs see enough to discover components but must call atom_uikit_source for actual implementation details."

Each registry item has two sections. One is visible to discovery tools. The other only to implementation tools.

```typescript registry-schema.ts
// atom.discovery -- what the agent can KNOW
{
  name, description, category,
  variants, sizes, defaultVariant, defaultSize,
  props,          // name, type, required, default
  hasAnimation
  // no CSS, no baseClass, no source
}

// atom.implementation -- what the agent needs to DO
{
  baseClass,      // real root class, e.g. "button"
  cssClasses,     // all BEM names
  peerDeps,       // e.g. "gsap"
  hasCss, hasReact
  // accessible ONLY via atom_uikit_source
}
```

The **discovery** tools (`atom_uikit_context`, `atom_uikit_component`, `atom_uikit_search`) return metadata only. An agent can list components, read their props, understand what exists -- but it never sees a line of real CSS.

The **implementation** tools in production are `atom_uikit_source` and `atom_uikit_validate` (`atom-uikit-db/mcp/src/server.ts`, v2.2.0). `atom_uikit_source` is the single tool that returns real CSS/React; `atom_uikit_validate` checks snippets against `MERGED_MANIFEST` (invalid variants, forbidden reimplementations, missing ARIA).

What closes the pattern is that discovery doesn't stay quiet about what it hides. It emits an explicit signal:

```typescript Fail-closed signal — component.ts
// Structured output (JSON Schema) — every component
implementationAccess: 'requires_atom_uikit_source',

// Text output appended per slug (verbatim in repo)
lines.push(
  `**To implement:** call \`atom_uikit_source("${slug}")\` — this is the ONLY way ` +
  `to get the actual CSS, tokens, classes, and React code. ` +
  `Do NOT invent CSS values, colors, or classes.`,
);
```

```typescript validate.ts — catches reimplementation and bad variants
for (const meta of Object.values(MERGED_MANIFEST)) {
  if (/export\s+(const|function)\s+Button\b/.test(code)) {
    errors.push({
      type: 'reimplementation',
      component: meta.name,
      detail: `${meta.name} is being reimplemented instead of imported from @atom-uikit/components-react`,
      suggestion: `Use: ${meta.import}`,
    });
  }
}
// JSX: variant="ghost" when manifest only allows primary | secondary | …
```

The complete system is a four-layer defense:

```mermaid Anti-hallucination in four layers
graph TD
  subgraph L1["1. Data minimization"]
    COMP["atom_uikit_component -- discovery: no CSS, no baseClass"]
  end
  subgraph L2["2. Single authority"]
    SRC["atom_uikit_source -- the ONLY tool with real CSS"]
  end
  subgraph L3["3. Validation"]
    VAL["atom_uikit_validate -- detects invented hex, unknown classes"]
  end
  subgraph L4["4. Fail-closed"]
    GUARD["implementationAccess: requires_atom_uikit_source"]
  end
  COMP -->|has no CSS| SRC
  COMP -->|signal| GUARD
  GUARD -->|forces the call| SRC
  SRC -->|real source| VAL
```

The change was measurable. ==Before: the agent generated `#534AB7`, 36px, wrong font-sizes. After: it uses the real zinc scale, 40px, 13px -- because it's forced to call `atom_uikit_source` before writing.== Not because the model got smarter. Because the system no longer lets it guess.

> [!tip] The right metaphor isn't "the agent knows more". It's "the agent has nowhere left to invent". The anti-hallucination pattern doesn't improve the model -- it removes the surface where the error was possible.

## Fifth layer: who is allowed to connect (Clerk, OAuth, company-only)

> **In plain terms:** Who may plug an AI tool into the design system at all — an access decision, not a design detail.
Anti-hallucination controls *what* an agent outputs. Auth controls ==who may ask at all.== The MCP is not a public CDN for the design system. It is infrastructure for people inside the company (and their approved AI clients) — with an end-to-end flow from browser login to bearer token to restricted doc bodies.

The article already had mermaid for **token layers** (primitives → semantic → component), **anti-hallucination in four steps**, and now the **auth sequence**. Below is the **platform map** — how repos and services connect — plus how layer 5 wraps everything that came before.

```mermaid ATOM UIKit MCP platform architecture
flowchart TB
  subgraph Clients["AI clients"]
    CW["Claude Web<br/>remote MCP"]
    IDE["Claude Code / Cursor<br/>stdio MCP"]
  end

  subgraph AuthPlane["Auth plane — company only"]
    Clerk["Clerk<br/>identity + SSO"]
    DocsApp["Docs app Next.js<br/>uikit.atomchat.io"]
    TokenRoutes["/api/auth/mcp-token<br/>/auth/mcp-oauth"]
    OAuthEP["MCP host OAuth<br/>/api/authorize · /api/token<br/>/.well-known/*"]
  end

  subgraph MCPPlane["MCP server — Vercel"]
    Gate["POST /mcp<br/>Bearer required"]
    DiscTools["Discovery tools<br/>context · component · search"]
    ImplTools["Implementation tools<br/>source · validate · audit"]
  end

  subgraph Sources["Sources of truth"]
    DS["DS monorepo<br/>tokens · css · react · registry"]
    RegAPI["Registry HTTP<br/>/api/r — shadcn model"]
    SB["Supabase edge<br/>get-docs · get-navigation"]
    CMS["Payload CMS<br/>doc prose + restricted flag"]
  end

  CW -->|401 triggers OAuth| OAuthEP
  IDE -->|npx mcp-uikit auth| TokenRoutes
  OAuthEP --> DocsApp
  TokenRoutes --> Clerk
  DocsApp --> Clerk
  DocsApp -->|domain gate · mint JWT| TokenRoutes
  CW --> Gate
  IDE -->|~/.config/atom-uikit/credentials.json| Gate
  Gate --> DiscTools
  Gate --> ImplTools
  DiscTools -->|anon key| SB
  ImplTools -->|Bearer on registry fetch| RegAPI
  ImplTools -->|x-restricted-access| SB
  DS -->|extractor + build sync| RegAPI
  CMS --> SB
```

```mermaid Five layers — hallucination plus access control
flowchart TB
  subgraph L1to4["Layers 1–4 — output correctness"]
    L1["1 Minimize discovery data"]
    L2["2 Single source tool"]
    L3["3 Validate output"]
    L4["4 Fail-closed signals"]
    L1 --> L2 --> L3 --> L4
  end

  subgraph L5["Layer 5 — who may call the MCP"]
    L5A["Clerk login"]
    L5B["Company email domain"]
    L5C["MCP JWT in Bearer header"]
    L5D["Restricted doc bodies"]
    L5A --> L5B --> L5C --> L5D
  end

  L4 --> L5
  L5 --> Agent["Agent receives real CSS<br/>only if human was allowed in"]
```

> [!info] Diagram index
> **Tokens:** layer hierarchy, resolution chain · **Anti-hallucination:** four tool layers · **Auth & platform:** architecture map, five-layer wrap, OAuth/CLI sequence below.

### Why Clerk instead of building login

Issuing MCP tokens is not what we sell. Neither is SAML, session hardening, MFA policies, or the long tail of auth compliance. Rolling login from scratch would mean months of security work before the first designer could call `atom_uikit_source`. ==We use Clerk for velocity and compliance we do not want to own.== Clerk documents [building an MCP server in Next.js](https://clerk.com/docs/nextjs/guides/ai/mcp/build-mcp-server), [connecting MCP clients](https://clerk.com/docs/guides/ai/mcp/connect-mcp-client), and [OAuth for third-party clients](https://clerk.com/docs/guides/configure-auth-strategies/oauth/how-clerk-implements-oauth) — we followed that playbook instead of inventing a home-grown OAuth spec.

Clerk protects the docs app (`ClerkProvider` on the Next.js site). Our routes call `auth()` and `currentUser()` before any token is minted.

### Two doors in, one gate at the server

Everyone hits the same check on the hosted MCP (`https://uikit-mcp.vercel.app/mcp`): **no Bearer token, no MCP session.** A `401` with `WWW-Authenticate: Bearer` is intentional — Claude Web uses it to start OAuth.

```typescript Hosted MCP — auth required
// api/mcp.ts
const authHeader = (req.headers['authorization'] as string) ?? '';
if (!authHeader.startsWith('Bearer ')) {
  res.writeHead(401, { 'WWW-Authenticate': 'Bearer', ... });
  return;
}
const identity = await verifyBearerToken(token);
```

`verifyBearerToken` accepts either a **Clerk session JWT** (verified with `@clerk/backend`, networkless when `CLERK_JWT_KEY` is set) or a **personal access token** — a 30-day JWT signed with `MCP_SIGNING_SECRET`, issuer `atom-uikit-mcp`, audience `atom-uikit-mcp`. Invalid or expired tokens get `invalid_token`; there is no anonymous read path.

**Path A — Claude Web / remote MCP clients (OAuth 2.1 + PKCE)**

1. Client discovers OAuth metadata at `/.well-known/oauth-authorization-server` and protected resource at `/.well-known/oauth-protected-resource/mcp`.
2. `/api/authorize` redirects to the frontend route `/auth/mcp-oauth` with `code_challenge` (S256).
3. User signs in with Clerk. If unauthenticated, they go to `/sign-in` with `redirect_url` back to the OAuth page.
4. After login, the app checks **company email** — in our deployment, `primaryEmailAddress` must end with `@atomchat.io`. Others see *Access Denied*; no code is issued.
5. The frontend mints a short-lived authorization code (JWT, issuer `atom-uikit-mcp-oauth`, embeds `code_challenge`) and redirects to the client's `redirect_uri`.
6. Client calls `POST /api/token` with the code and PKCE verifier; the server verifies the challenge and returns access + refresh tokens.

**Path B — Claude Code / Cursor / local CLI (`npx @atomchat.io/mcp-uikit auth`)**

1. CLI starts a localhost callback server and opens `GET /api/auth/mcp-token?port=PORT&state=STATE`.
2. Same Clerk sign-in and same **domain gate** on the docs API route.
3. The server does **not** put the long-lived token in the URL. It stores a **single-use exchange code** (60s TTL) and redirects to `http://127.0.0.1:PORT/callback?code=...&state=...`.
4. CLI `POST`s the code to `/api/auth/mcp-token` and receives the JWT; it saves to `~/.config/atom-uikit/credentials.json`.
5. The stdio MCP process reads that file, verifies the JWT with `MCP_SIGNING_SECRET`, and only then sets `restrictedAccess` for Supabase fetches.

```typescript Company-only token issuance (CLI path)
// atom-uikit-docs — GET /api/auth/mcp-token
const { userId } = await auth();
if (!userId) {
  return redirect(`/sign-in?redirect_url=${encodeURIComponent(returnUrl)}`);
}
const email = user?.primaryEmailAddress?.emailAddress;
if (!email?.endsWith('@atomchat.io')) {
  return new Response(
    'Access denied. Only @atomchat.io accounts can generate MCP tokens.',
    { status: 403 },
  );
}
```

The OAuth page (`/auth/mcp-oauth`) repeats the same domain check before signing the authorization code. ==Random internet users cannot complete either path, even if they discover the MCP URL.==

### Restricted docs: auth at the edge and at the database

Some CMS docs are flagged `restricted: true`. Without a valid MCP session, `get-docs` returns metadata with **empty blocks** — the agent sees that a page exists but not the implementation prose inside.

```typescript supabase/functions/get-docs/index.ts
if (doc.restricted) {
  const restrictedSecret = Deno.env.get('RESTRICTED_CONTENT_SECRET');
  const providedSecret = req.headers.get('x-restricted-access');
  if (!restrictedSecret || providedSecret !== restrictedSecret) {
    return new Response(
      JSON.stringify({ doc, blocks: [], restricted: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
}
```

When the MCP handler validates a bearer token, it passes `RESTRICTED_CONTENT_SECRET` to the Supabase client as header `x-restricted-access`. Only then does the edge function return full block content. Stdio mode does the same after JWT verification from `credentials.json`; without `MCP_SIGNING_SECRET` in dev, stderr warns that restricted content is unavailable.

So the chain is: **Clerk (human identity) → company domain (membership) → MCP JWT (machine session) → restricted header (content gate).** Not "MCP is public, please behave."

```mermaid MCP auth end to end
sequenceDiagram
  participant User as Company user
  participant Clerk as Clerk
  participant Docs as Docs app (Next.js)
  participant CLI as MCP CLI (optional)
  participant MCP as MCP server (Vercel)
  participant SB as Supabase get-docs

  User->>Clerk: Sign in
  Clerk->>Docs: Session
  Docs->>Docs: email @company domain?
  alt OAuth (Claude Web)
    Docs->>Docs: Auth code JWT + PKCE
    Docs->>MCP: POST /api/token
  else CLI (local IDE)
    Docs->>CLI: Single-use code → localhost
    CLI->>Docs: POST exchange code
    CLI->>CLI: credentials.json
  end
  MCP->>MCP: verifyBearerToken (Clerk or PAT)
  MCP->>SB: x-restricted-access
  SB-->>MCP: Full blocks for restricted docs
```

### Same pattern, two permissions

Discovery vs implementation split answers "can the model invent CSS?" Company auth answers "is this caller allowed to load our source at all?" Together they are why the system works as **internal infrastructure**: marketing and agents get speed, engineering keeps brand fidelity, and compliance stays on Clerk's roadmap instead of mine.

## Third problem: my own architecture had the truth duplicated

> **In plain terms:** Three places claimed to be “the list of components” — a recipe for silent drift.
This is where the story stops being about the agent and becomes about me.

The first version of the MCP worked, but inside it was fragile in a way I was slow to see. The component metadata lived in the DS. But the MCP re-embedded it at build time with a script (`embed-source.ts`), generated a manifest, and on top of that applied a `component-overrides.ts` file to patch fields the extractor didn't yet produce. ==The source of truth was in three places at once.==

That's exactly the kind of drift the token system was designed to prevent -- and I had reintroduced it in the distribution layer. If the DS said one thing, the embedded manifest said another, and the override a third, which one was the truth? The honest answer was: depends which you read first.

The consolidation was a four-wave process over three days. It wasn't a redesign -- it was migrating, with regression tests at every step, toward a single source.

**Wave 1 -- Enrich the registry (DS).** Make the DS registry the source of truth for metadata. An extractor (`extract-component-metadata.ts`) that pulls discovery + implementation straight from the source. 61 items enriched, 27 unit tests, 0 errors.

**Wave 2 -- Migrate the MCP tools.** Move every tool from the embedded manifest to the registry over HTTP. A three-function adapter (`getAllDiscovery`, `getComponentInfo`, `getImplementationData`). 41 regression assertions validating the anti-hallucination pattern: ==10 of 10 components verified, zero implementation-field leaks.==

**Wave 3A -- Delete the old path.** Remove the feature flag, the legacy handlers, the dead code. Seven files deleted, ~3,800 lines -- including `embed-source.ts`. The build went from an embed step to `tsc` only.

**Wave 3C -- Sync the docs site.** Replace 62 registry JSONs committed in the repo with a build-time sync from the DS. `/public/r/` added to `.gitignore`.

**Wave 4 -- Migrate the overrides.** Move the last four fields from `component-overrides.ts` into the registry + extractor. The overrides file was deleted entirely. ==Zero override debt.==

| Metric | Before (Wave 1) | After (Wave 4) |
| --- | --- | --- |
| Override entries | 10 | **0** |
| Legacy files (MCP) | 7 (~3,800 lines) | **0** |
| MCP data sources | 4 (manifest, embed, supabase, layouts) | **2 (registry, supabase)** |
| DS tests | 0 | **38** |
| MCP build | `embed-source && tsc` | **`tsc`** |
| Docs build | committed JSONs | **build-time sync** |

## The detail that signals maturity: build-time sync

> **In plain terms:** Automated checks so the catalog and the real code cannot disagree for long.
Of all the decisions, the one I like most is the smallest. The documentation site no longer commits the registry JSONs. It syncs them from the DS every time you build.

```bash docs site package.json
"build": "tsx scripts/sync-registry.ts && tsx scripts/embed-source.ts && next build"
```

The sync script has two sources with fallback: first the filesystem (the DS as a sibling repo, ~28ms), and if it's unavailable, HTTP against a registry URL. It validates that the index has at least 50 items, that each item has its `name` field, that the discovery metadata exists. It writes atomically with `.tmp` files and rename so nothing gets corrupted halfway.

==A derived artifact isn't committed. It's derived.== If the JSONs live in git, someone eventually edits one by hand, and the source of truth fractures again. By pulling them out of the repo and generating them on every build, the system guarantees that what the site publishes is, by construction, what the DS says -- not a copy someone forgot to update.

> [!caution] Anything you can derive from the source of truth and choose to commit anyway is a second source of truth waiting to diverge. Committed JSONs look harmless until the day the repo's copy and the DS's copy disagree, and nobody knows which one won.

## What changed in how I think

> **In plain terms:** Mindset shift for leaders funding design systems in AI-heavy teams.
I started believing a design system for AI was a normal design system with an API on top. I ended up understanding it's something else.

A design system for humans can tolerate ambiguity. A human sees two nearly-identical oranges and picks the right one by context, by taste, by having seen the Figma. An agent has none of that context -- ==it has exactly what the system exposes to it, not one bit more.== That turns every ambiguity in your architecture into a guaranteed error, not a probable one.

The three lessons chain together. Reducing the tokens wasn't about aesthetics -- it was reducing the surface where a generator can go wrong. Separating discovery from implementation wasn't about security -- it was recognizing that "knowing something exists" and "knowing how to build it" are distinct permissions that should be granted separately. And the four waves weren't cleanup -- they were the inevitable consequence of taking my own rule seriously: one source of truth, or none.

> [!tip] The anti-hallucination pattern isn't really about hallucinations. It's about authority: one source of truth, accessed one way, validated one way. The hallucination is just the symptom that shows up first when that authority doesn't exist.

And there's an effect I didn't anticipate. The same system I built so an agent wouldn't hallucinate turned out to be the one that lets someone in marketing vibecode a landing and have it come out on-brand on the first try. The constraint that protects the automated generator is the same one that empowers the non-technical human. That's why it stopped being my side project and became team infrastructure: ==when the system guarantees the correct outcome, it stops mattering who -- or what -- writes the code.==

## How to replicate it in your next design system

> **In plain terms:** Starter steps if you want the same guardrails without copying every technical choice.
- **The registry is the single source of truth.** All metadata -- variants, sizes, props, classes, peer deps -- is extracted from the source, not maintained by hand in parallel. If you have a manifest, an override, and the source all saying things about the same component, you already have three versions of the truth, and the question isn't whether they'll diverge but when.

- **Separate discovery from implementation.** Give agents a metadata layer to discover what exists, and a source layer -- accessible one way only -- to build it. Have the discovery layer explicitly declare that it hides the code and how to ask for it. An agent that knows not to invent is half the solution; a system that won't let it invent is the other half.

- **Layered tokens, with one inviolable rule.** Primitives, semantic, component. The component never touches the primitive. That single rule is the difference between a dark mode that works and one that breaks in the hardest places to spot.

- **Don't commit what you can derive.** If an artifact can be generated from the source at build time, generate it. Every derived JSON living in git is an invitation to hand-edit it and fracture the truth.

- **Fail-closed by default.** The system shouldn't depend on the agent "behaving". It should make the correct outcome the only available path. The `requires_atom_uikit_source` signal doesn't ask the model to be responsible -- it takes away the option not to be.

- **Gate the MCP like a product API.** Auth before tools run; company domain before tokens mint; never ship long-lived secrets in URLs. Use Clerk (or equivalent) when login is not your differentiator — ship the design system, not a compliance program.

> [!info] This system's codebase fits in your head. Six packages, one registry, an MCP with a handful of tools. The complexity doesn't live in the code -- it lives in the constraints and in who owns the truth.

## References (external — worth bookmarking)

> **In plain terms:** Industry references behind the MCP and token decisions.
| Topic | Source |
|-------|--------|
| shadcn: copy vs npm install | [shadcn/ui — CLI](https://ui.shadcn.com/docs/cli) |
| Registry format & HTTP distribution | [shadcn/ui — Registry](https://ui.shadcn.com/docs/registry) |
| Registry item JSON schema | [shadcn/ui — registry-item.json](https://ui.shadcn.com/docs/registry/registry-item-json) |
| Private / authenticated registries | [shadcn/ui — Registry authentication](https://ui.shadcn.com/docs/registry/authentication) |
| MCP launch + motivation | [Anthropic — Model Context Protocol](https://www.anthropic.com/news/model-context-protocol) |
| MCP Tools specification | [MCP Spec — Server tools](https://modelcontextprotocol.io/specification/2025-11-25/server/tools) |
| MCP getting started | [modelcontextprotocol.io — Intro](https://modelcontextprotocol.io/docs/getting-started/intro) |
| Design Tokens format (DTCG) | [designtokens.org](https://www.designtokens.org/) |
| DTCG first stable release | [W3C Design Tokens CG — Oct 2025](https://www.w3.org/community/design-tokens/2025/10/28/design-tokens-specification-reaches-first-stable-version/) |
| Style Dictionary + DTCG | [Style Dictionary — DTCG](https://styledictionary.com/info/dtcg/) |
| Clerk: build MCP server (Next.js) | [Clerk Docs — Build MCP server](https://clerk.com/docs/nextjs/guides/ai/mcp/build-mcp-server) |
| Clerk: connect MCP clients | [Clerk Docs — Connect MCP client](https://clerk.com/docs/guides/ai/mcp/connect-mcp-client) |
| Clerk MCP changelog (product direction) | [Clerk Changelog — MCP server](https://clerk.com/changelog/2025-06-25-mcp-server-nextjs) |
| Remote MCP + auth patterns | [Kapa.ai — Remote MCP best practices](https://www.kapa.ai/blog/remote-mcp-servers-hosting-authentication-best-practices) |
| Sharing components: copy vs install (industry essay) | [Bit.dev — Copy vs install](https://dev.to/bitdev_/sharing-ui-components-copy-vs-install-4mii) |

## The real lesson

> **In plain terms:** A design system for AI-era teams is a permissions story as much as a color palette.
Design systems don't fail in the component. They fail at the question "which is the correct version of this?" when there's more than one possible answer. A human navigates that ambiguity without noticing. An AI agent turns it into `#534AB7` in production.

Building so a machine can read your system isn't an annoying constraint -- it's the exercise that forces you to make explicit everything you used to resolve with judgment. When the only possible reader is one without your context, you have no choice but to put the context into the system. And a system where the context is explicit turns out to be better for humans too.

There's a line I use to evaluate whether a design system is finished: ==if two parts of the system can say different things about the same component, you don't have a design system yet -- you have several opinions sharing a repository.==
