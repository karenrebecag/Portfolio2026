There is a specific moment in nearly every Webflow project. It is not during onboarding. It is not during the first publish. It happens when someone on the team opens the site's custom code settings for the first time and pastes a block of JavaScript into a text area.

At that moment, without anyone deciding it explicitly, ==the project has just acquired technical debt.==

The code that was just pasted has no history. No author. No diff. No rollback. If something breaks, the only way to know is for a user to report it -- or for you to catch it before it reaches production. But chances are you will not catch it, because Webflow has no environments. ==The publish goes straight to production. Always.==

I spent a lot of time thinking about this problem while working on the Atomchat site -- an AI product that needed a site with high-fidelity animations, a very specific brand visual language, and a content team that could publish autonomously without coordinating with development every time. Three requirements that, within default Webflow, contradict each other.

This article documents what I built to solve it. It is not a solution specific to Atomchat -- it is a workflow any engineer or design engineer can bring to their next Webflow project. After you read it, pasting production JavaScript into a Webflow text area should feel as wrong as deploying over FTP after you have learned git -- not as a punchline, but as a signal that the boundary is missing.

## First, understanding why Webflow behaves this way

Before talking about solutions, I want to be fair to Webflow because it has a bad reputation for reasons that are actually correct design decisions for its original use case.

Webflow was built to give autonomy to marketing and content teams. The core promise is: you can launch and update a high-quality website without depending on a developer every time you need to change a title or add a page. That promise works. It works very well, in fact, for 80% of use cases.

The problem is that ==the remaining 20%== -- projects that require complex behaviors, components with specific logic, event-driven animations, integrations with external APIs -- that 20% needs the primitives of a real codebase. And Webflow, in its default configuration, does not have them.

It is not a design flaw. It is a scope limit. The real problem is that teams reach that limit and instead of designing a solution, they improvise. They paste code. They add more custom code. They create implicit dependencies between pages. And at some point they have a site that works but that nobody fully understands -- including the person who built it.

The question I asked myself was: ==what if instead of fighting against that limit, we respected it?== What if we designed a system where Webflow does exactly what it does best, and everything else lives in its natural place?

## The core idea: dual control

The answer is what I call a dual-control model. Two systems with completely separated responsibilities, an explicit contract between them, and no ambiguity about who owns what.

```mermaid Dual control architecture
flowchart LR
  subgraph WF["Webflow"]
    direction TB
    WF1["HTML structure"]
    WF2["CMS content"]
    WF3["SEO & metadata"]
    WF4["Publish workflow"]
  end

  subgraph GIT["GitHub repository"]
    direction TB
    G1["Design tokens"]
    G2["JS modules"]
    G3["CSS by section"]
    G4["Docs & constraints"]
  end

  JSD["jsDelivr CDN"]
  SITE["Production site"]

  WF --> WFC["Webflow CDN"]
  WFC --> SITE
  GIT -->|"git push"| JSD
  JSD -->|"@main CSS & JS"| SITE
  WF -.->|"fixed asset URLs"| JSD
  GIT -.->|"purge cache"| JSD
```

**Webflow owns:** the HTML structure and page semantics, CMS content and collections, SEO, metadata, og tags, and the publishing workflow -- marketing can publish whenever they want, without coordinating with anyone.

**The Git repository owns:** design tokens (colors, typography, spacing, animation curves), JavaScript modules (one per feature), global CSS by section and component, architecture documentation, constraints and decisions, and the deploy pipeline and versioning.

What makes this work is not the technology -- ==it is the contract.== The explicit agreement that a copy change never touches the repository, and an animation refactor never requires marketing to wait. The two systems run in parallel, deploy independently, and neither blocks the other.

The connection point between both is jsDelivr, a CDN that serves files directly from GitHub. Webflow references assets from there with a URL that never changes. What does change -- after a push and a cache purge -- is the content that URL resolves to.

> [!tip] git push origin main -> curl purge jsDelivr cache -> site updated. No Webflow republish. No coordination. Marketing does not even know it happened because they do not need to.

## Why @main and not @latest

This is one of those details that seems trivial until you learn it the hard way.

jsDelivr has two ways to reference GitHub files that look equivalent and are not at all:

- **@latest** resolves to the last release published with npm. If you do not have releases configured, the behavior is undefined. And jsDelivr caches aggressively -- meaning even if you push a change, jsDelivr may keep serving the previous version for hours or days.

- **@main** resolves to the latest commit on the main branch. After an explicit cache purge, it resolves immediately to the most recent SHA.

> [!warning] Never use @latest in production. jsDelivr caches aggressively and the behavior without npm releases is undefined.

The rule is simple: in production, always @main plus manual purge. Never @latest. And this rule lives documented in the repository, not in anyone's memory.

```bash
# After each push
curl -s https://purge.jsdelivr.net/gh/user/repo@main/src/css/site.css
curl -s https://purge.jsdelivr.net/gh/user/repo@main/src/js/site.js
```

Two lines. The site is updated. And if something goes wrong, `git revert` and another purge. ==Complete rollback in under two minutes.==

```mermaid Deploy pipeline
sequenceDiagram
  participant Eng as Engineer
  participant GH as GitHub
  participant JD as jsDelivr
  participant WF as Webflow CDN
  participant Browser as User browser

  Eng->>GH: git push main
  GH-->>Eng: new commit SHA
  Eng->>JD: purge cache (@main)
  JD->>JD: resolve latest SHA
  Note over WF,Browser: HTML unchanged — no Webflow republish
  Browser->>WF: load page HTML
  Browser->>JD: fetch site.css & site.js
  JD-->>Browser: updated assets
```

## Design tokens: the only shared artifact

If the dual-control model is the architecture, ==design tokens are the shared language== between the two systems.

Tokens are not "CSS variables with nice names." They are the contract that guarantees what the designer configures in Webflow and what the external code produces are exactly the same thing. Without that contract, drift between systems is inevitable -- and it is subtle, which is the worst part. Colors that approximate but do not match. Spacing that looks similar but is different. Animations with slightly different timing depending on who touched what.

```css tokens.css
:root {
  /* Brand -- orange is accent only, never background or CTA */
  --color-brand:        #FF6600;
  --color-brand-hover:  #e65c00;
  --color-violet:       #8023FF;

  /* Text -- pure black (#000) is prohibited */
  --color-text-heading: #222020;
  --color-text-body:    #27272A;
  --color-text-muted:   #71717A;

  /* Spacing */
  --space-1:  0.25rem;
  --space-2:  0.5rem;
  --space-4:  1rem;
  --space-8:  2rem;
  --space-16: 4rem;

  /* Motion */
  --ease-out:        cubic-bezier(0.16, 1, 0.3, 1);
  --duration-fast:   200ms;
  --duration-normal: 400ms;
}
```

What I love about this file is that ==every constraint is encoded, not documented somewhere else.== The comment "orange is accent only, never background or CTA" is not in a Figma that someone forgot to update. It is in the same file that any developer will open the first time they touch the project.

## The module loader: elegant by necessity

Webflow has no native way to tell JavaScript "initialize this component when it appears on the page." The common solution is one massive file that runs everything on every page -- which is both inefficient and fragile.

The solution I built is a 54-line entry point that does one thing: scans the DOM, identifies which modules the current page needs, and dynamically imports them. Only those. Only when needed.

```javascript site.js
// Pattern 1: modules activated by data-module
const modules = {
  'nav':              () => import('./modules/nav.js'),
  'animations':       () => import('./modules/animations.js'),
  'scroll-animations':() => import('./modules/scroll-animations.js'),
  'faq':              () => import('./modules/faq.js'),
};

// Pattern 2: auto-detect by component selector
const autoDetect = {
  '[data-button-041]':      () => import('./modules/button-041.js'),
  '[data-css-marquee]':     () => import('./modules/marquee.js'),
  '[data-menu-wrap]':       () => import('./modules/mega-nav.js'),
  '[data-tabs-init]':       () => import('./modules/tabs.js'),
};

// Only load what exists in the DOM
for (const [sel, loader] of Object.entries(autoDetect)) {
  if (document.querySelector(sel)) loader();
}
```

No bundler. No build step. ==No JavaScript traveling to pages where it is not used.== The browser resolves ESM imports natively.

The distinction between the two patterns has a very specific reason: ==Webflow does not publish data-* attributes on the root element of reusable components.== If you put `data-module="my-component"` on the root of a Webflow component, that attribute simply disappears after publish. The autoDetect pattern solves this by looking for selectors deeper in the DOM tree, where Webflow does preserve them.

## GSAP + Cloudflare Rocket Loader: the bug that only exists in production

I want to talk about this problem with some affection because it was the most frustrating to solve and also the one that taught me the most about what it means to do production engineering.

The setup: Webflow loads GSAP automatically from its own CDN. Our external JS modules depend on `window.gsap` existing to initialize. In local, in staging, in any test environment -- everything works perfectly.

In production, under certain network conditions with Cloudflare Rocket Loader active, ==animations silently fail on approximately 30% of page loads.==

No console error. No message. The animations simply do not appear.

> [!caution] Rocket Loader defers execution of all external scripts unpredictably. If your module looks for window.gsap on load, it will find it empty 30% of the time.

The solution, once you understand the cause, is completely obvious:

```javascript
function waitForGSAP(timeout = 5000) {
  return new Promise((resolve, reject) => {
    if (window.gsap) return resolve(window.gsap);
    const start = Date.now();
    const check = setInterval(() => {
      if (window.gsap) {
        clearInterval(check);
        resolve(window.gsap);
      } else if (Date.now() - start > timeout) {
        clearInterval(check);
        reject(new Error('[atom] gsap not found'));
      }
    }, 50);
  });
}
```

What matters about this example is not the polling function -- that is trivial. What matters is that this function, and the explanation of why it exists, lives in the repository's CLAUDE.md. Not in a Slack message from eight months ago. ==Documenting hard decisions inside the codebase is the difference between a project that scales and one that only works while the original person is available.==

## The agent system: AI with explicit constraints

The repository includes an agent orchestration system -- a set of 34 skills organized by category with an ORCHESTRATOR that decides which skills to load based on the task type.

But before talking about the implementation, I need to talk about the philosophy behind it.

The first time I let an AI agent operate on the project without explicit constraints, it made reasonable decisions. Clean code, good general practices, output that worked. And it was still wrong.

Not wrong as in "broken" -- ==wrong as in "out of context."== The agent used #000000 for text because it is the standard black. It used @latest in a jsDelivr reference because it is the most common pattern. It modified a page that was not specified because it assumed it was the main page.

None of that is an agent error. It is a system design error -- specifically, a failure to design the system with explicit constraints from the start.

| Constraint | Where it is enforced |
| --- | --- |
| No pure black in text | Encoded in tokens.css |
| Orange only as accent | Documented in CLAUDE.md, validated by agent |
| jsDelivr never with @latest | Rule in orchestrator, blocked in review |
| GSAP must check prefers-reduced-motion | Required in every animation module |
| Never publish without safe-publish | Orchestrator rule, not optional |
| Never modify unspecified page | Scope enforcement, asks before acting |

The result is an agent I can let run on CMS tasks, asset audits, and controlled deploys without reviewing every output line by line -- not because I trust it blindly, but because ==the constraint system makes errors detectable, reversible, and most of the time, impossible.==

## What the team gains

Without this workflow, every week there are interruptions of the kind "hey, can you change this text in Webflow?" that are not actually text changes -- they are changes someone does not dare to make alone because the last time they touched something in Webflow, something else broke. The developer becomes the site's guardian not because it is necessary but because nobody has confidence in the system's boundaries.

With this workflow, ==that category of interruption disappears.== Marketing knows exactly what they can touch -- the Designer, the CMS, the pages -- and knows their changes will not break anything in the repository because the repository is a separate system with its own lifecycle. Engineering knows they can iterate on code with full confidence because they have git history, code review, and immediate rollback. Nobody blocks anyone.

In the first two weeks after we drew the boundary explicitly, those pings stopped showing up in standup -- not because we ran a formal time study, but because the fear category simply went away. Copy updates shipped from the CMS without a Slack thread asking for a "quick sanity check." Animation fixes went out via git and jsDelivr without a Webflow republish. The argument does not need a hours-saved spreadsheet to be credible; you notice when the coordination tax is gone.

## How to replicate it on your next project

- **Repository with clear structure.** `src/css/` and `src/js/`. Inside CSS: `base/` for tokens, reset and utilities; `sections/` for nav, hero, footer; `components/` for components with their own logic. A `site.css` as entry point that imports everything. A `site.js` with the module loader pattern. If you skip this split, every new feature becomes an ad-hoc negotiation about whether it lives in Webflow or Git -- until someone breaks production and nobody can say who owns the fix.

```tree Repository structure
{
  "root": "repository/",
  "folders": [
    { "category": "base", "path": "src/css/base/", "files": ["tokens.css", "reset.css", "utilities.css"] },
    { "category": "sections", "path": "src/css/sections/", "files": ["nav.css", "hero.css", "footer.css"] },
    { "category": "components", "path": "src/css/components/", "files": ["button.css", "marquee.css", "faq.css"] },
    { "category": "modules", "path": "src/js/modules/", "files": ["nav.js", "animations.js", "faq.js", "mega-nav.js"] }
  ],
  "entries": [
    { "category": "entry", "path": "src/css/", "files": ["site.css"] },
    { "category": "entry", "path": "src/js/", "files": ["site.js"] },
    { "category": "docs", "path": "", "files": ["CLAUDE.md", "ORCHESTRATOR.md", ".agents/skills/"] }
  ]
}
```

- **tokens.css first, always.** Before writing any other CSS, define your tokens. All design values live here and only here. Include comments that explain the constraints, not just the values. If tokens live in three places (Figma notes, Webflow styles, and a CSS file), drift is guaranteed; the first redesign will ship two slightly different oranges and nobody will know which one is canonical.

- **jsDelivr with @main + purge script.** Configure the references in Webflow once pointing to @main. Create a purge script and run it after each push. If you use @latest instead, you will push a fix, wait hours, wonder why nothing changed, and learn about npm releases and aggressive CDN caching the hard way.

- **CLAUDE.md at the root.** Document the contract between Webflow and the repository, naming conventions, prohibited patterns with their justification, the deploy workflow, and architectural decisions with the context of why they were made that way. Without it, the next person -- or the next agent -- will re-decide every boundary from scratch, and you will become the living README again.

- **data-* as the only activation mechanism.** Never use Webflow classes as selectors in JavaScript. Classes change on redesigns. `data-*` attributes are explicit contracts that Webflow preserves -- but remember: put your attributes on inner elements, not on the component root. If you bind to class names, the first time someone reorganizes the Designer you will spend an hour tracing why the nav module stopped firing.

> [!tip] The entire external codebase for this production site is under 400 lines of CSS and 300 lines of JavaScript. The architecture is deliberately minimal. Complexity lives in the constraints and the workflow, not in the code.

## The real takeaway

Software projects fail at the boundaries between tools, not inside them. Webflow works. Git works. jsDelivr works. AI agents work. ==The point of failure is when it is not clear who owns what==, and two systems end up competing over the same territory without explicit rules.

Designing that boundary from the start is not overengineering. It is exactly the work that makes everything else predictable -- that marketing can publish with confidence, that engineering can iterate with confidence, that an AI agent can operate with confidence, and that you can go on vacation without leaving your phone number "in case something breaks."

There is a phrase I use as a standard for evaluating whether a system is well designed: ==if the system requires you to be available for it to work, it is not a system yet -- it is a personal dependency.==

A workflow is replicable when it is documented with enough context that someone who never worked on the project can extend it without breaking it. Knowledge lives in the repository, in the tokens, in the CLAUDE.md. The next person inherits the system, not a debt of unanswered questions.
