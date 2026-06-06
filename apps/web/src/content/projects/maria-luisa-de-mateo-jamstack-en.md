> [!tip] In 30 seconds
> - **Who this is for:** Studios like Aurin and artists like María Luisa de Mateo who primarily sell and show on Artsy and Instagram and need a web presence that feels like a natural extension of their practice, not another tool to manage.
> - **Problem it solves:** Most artist and studio sites either dilute the work with generic templates or force non-technical creatives to fight a CMS, a builder, or a developer for every small change.
> - **What changes if you apply this:** A strong, modern frontend with clear templates, shared tokens, and explicit contracts—so the studio and the artist own the story, the rhythm, the selection, and the visual voice—while the architecture stays invisible and the site remains fast, bilingual, and ready for new layers.

Aurin is a small studio that works at the intersection of brand, visual experience, and artists. They don’t just design campaigns; they build contexts where art and design behave like products. María Luisa de Mateo is one of the artists they support. Her work lives on Artsy for sales and on Instagram for presence. It is intimate, textural, and precise. It does not want to feel like a corporate portfolio or a Shopify store.

My role on this project was hybrid: part product design, part frontend architecture. I was not there to “make the website for them.” I was there to build the technical ground on which the creative team could keep doing what they already do well—curate, sequence, and present work—without the technology ever becoming the main character.

## The context: telling art on the web without turning artists into publishers

> **In plain terms:** The site had to support both studio projects and individual artists without feeling like generic templates. The core team is not technical. The frontend had to be strong, but invisible to them.

María Luisa already had distribution. She sells on Artsy. She shows process and finished pieces on Instagram. What she needed was not another place to upload images and write captions. She needed a space that could read those existing channels and still feel like a gallery—quiet, intentional, hers.

The same was true for Aurin as a studio. They have multiple artists, multiple client projects, and an evolving body of work. They did not want to maintain two different logics: one for “studio work” and one for “artist pages.” They wanted one underlying system that could express different voices without becoming a Frankenstein.

For the people who actually run the site—graphic designers, art directors, the artist herself—“updating the site” had to feel like a design and content decision, not a development ticket.

## The product challenge: a living site that does not feel like just another CMS

Aurin wanted three things that are often in tension:

- A living portfolio of studio projects and individual artists.
- The ability to add new bodies of work, collections, and experiments without rebuilding pages from scratch.
- A consistent studio identity that never fights the specific voice of each artist.

The real constraint was not technology. It was sensitivity. Art direction changes. A new series might need more breathing room, different image weight, or a quieter typography moment. If every variation requires a developer, the studio loses speed and the artist loses ownership.

> “No buscábamos otro WordPress con plantilla premium; necesitábamos una estructura que se sintiera hecha a medida para la forma en que Aurin cura y presenta su trabajo.”

That sentence became the north star.

## Frontend silencioso: technical decisions the creative team never has to see

### The stack as invisible infrastructure

Aurin’s main studio site (AurinWebsite) is built in Astro with React islands where needed. The María Luisa presence is a focused Next.js site that pulls live availability from Artsy’s GraphQL, serves 47 works from Cloudflare R2, and includes a resilient Instagram strip that falls back to static images when the feed is unavailable or rate-limited. Both use GSAP for motion that supports the work instead of competing with it. Bilingual routing is handled cleanly so the same editorial logic exists in Spanish and English.

None of this is interesting to an artist or art director.

What matters to them is that a new series can appear as “another artist page” without anyone having to invent a new layout from zero. What matters to me is that the same layout contract can be reused across ten artists while still allowing each one to feel specific.

The artist sees “a page.” I see “a reusable layout with well-defined slots and constraints.”

The creative director sees “a beautiful image sequence.” I see “a component that accepts a specific set of image treatments and never lets the rhythm collapse.”

### Clear contracts: what is rigid and what is flexible

We drew a hard line early.

Rigid (the team does not touch these without a conversation):
- Primary navigation and footer
- Base typography scale and measure
- Core grid and spacing system
- Performance and accessibility baselines

Flexible (they own these every day):
- Order and presence of sections on a page
- Image selection, cropping logic, and captions
- Copy and micro-copy
- Which blocks appear together and in what sequence (within approved patterns)

This is product design wearing a frontend hat. Every technical decision was evaluated against one question: does this increase or decrease the creative team’s sense of ownership?

## Designing templates for artistic sensitivity

### Editorial structure before components

I approached the site less like a portfolio and more like a small, living magazine or gallery publication.

That meant thinking first about scroll rhythm, the alternation of text and image weight, the role of negative space, and how a viewer moves from “who is this” to “look at this work” to “here is how it was made” to “related pieces.”

Some of the sharpest lessons came from completely different domains—financial products and complex internal tools—where storytelling also has to survive real constraints. The discipline of progressive disclosure, of letting important images breathe, of never letting text fight the visual, translates directly.

> **In plain terms:** Every template answers “what story do we want this page to tell?” The artist is not thinking in 12-column grids. They are thinking “hero work, context, process, related pieces.”

### The concrete case: María Luisa’s presence

She needed three things at once:
- Her work to be the protagonist (collections and individual pieces).
- A sense of who she is and how she works, without corporate biography language.
- An intimate, slightly quiet tone that matches the work itself.

We reused base layouts from the Aurin system but tuned density, text weight, and color usage for her. The same underlying grid and token system is there, but the page breathes differently. The work is allowed to be large and quiet. The supporting text stays small and secondary. The Instagram strip and Artsy availability sit where they support discovery without ever feeling like the main event.

The result still reads as “Aurin supports this artist,” but it does not feel like a studio template with her name swapped in.

## Empowering non-technical teams without them noticing

### What ownership actually looks like from their side

The creative team can:
- Spin up a new artist page or project case from an existing template.
- Update images, captions, order of works, and descriptive text.
- Re-sequence blocks within a page (hero, context, process, related) without breaking layout or performance.
- Add a new collection or series and have it appear in the right places automatically.

When María Luisa finishes a new body of work, adding it is a curation task. When Aurin lands a new client project that deserves visibility, publishing it is an editorial decision. For them, “updating the site” is a design and content activity.

> “Para ellos, ‘actualizar el sitio’ es una tarea de diseño y contenido, no una solicitud a desarrollo.”

### What you have to build on your side for this to be real

You cannot give them freedom without guardrails and still expect coherence.

We prepared:
- Extremely clear component and block naming (no clever internal names that only the developer understands).
- Simple visual guidelines: “this block almost always follows that one,” “these two treatments never live on the same page,” “maximum of X images in this sequence.”
- Lightweight handoff artifacts in Figma and Notion that the team actually uses.
- A token system (colors, spacing, type, radii, motion curves) that feels like “Aurin’s voice” to the people choosing values, while being a hard contract on the code side.

They experience creative freedom. The system experiences consistency and scalability.

## Heavy frontend, light decisions: systems, tokens, and components

### Atomic thinking applied to sensitive work

We used a light Atomic Design lens, but always in service of the people who would actually touch the site:

- Atoms: type scale, color tokens, basic buttons and links, spacing units.
- Molecules and organisms: artwork cards, project summary modules, text + image pairings, the Instagram and Artsy connection blocks.
- Templates and pages: the reusable artist presence shape, the studio project shape, the collection view.

The power is in the remix. A new artist can use the same template language as María Luisa but with completely different image weight and text density. A studio project can feel more structured. The underlying contracts keep everything from drifting into personal taste on every page.

### Tokens as the shared language

Design tokens turned out to be the single most important piece of “silent” infrastructure.

From the creative team’s perspective, they are simply choosing from a set of styles that already feel like Aurin. From my perspective, they are enforceable contracts. When someone wants a slightly different orange for a special project, we can discuss whether it is a one-off exception or a new semantic token that should be added to the system. The conversation happens at the right level.

Without tokens, every new page slowly becomes its own micro-system and the studio identity dissolves. With tokens, the team can move fast inside a frame that protects the brand.

## A frontend ready for what comes next

Aurin is also the studio behind the conversational agent work I have written about elsewhere. The same contracts that make the current sites feel calm and intentional are what allow new interactive layers—chat experiences, guided journeys, future agent-driven surfaces—to land without fighting the existing visual and editorial system.

When a new capability appears, the artist or studio team sees “a new kind of block” or “a new section we can turn on.” They do not see a new technical project. The architecture already knows how to stay out of the way.

This is also why structuring components and tokens cleanly today makes the site a better surface for AI-assisted editing or generation tomorrow. The model has clear boundaries to respect instead of having to guess what “feels like Aurin.”

## What this actually teaches different audiences

**For studios and artists**
You do not need to understand the stack. You do need to understand the logic of templates and approved blocks. When you commission a site, ask for ownership over content and structure, not just “a finished website.” The best frontend work for creative practices is the kind you stop noticing after the first week.

**For product and UX designers**
Designing for art and artists is designing editorial and publishing systems, not portfolios. The hardest part is usually deciding what the non-technical team is allowed to touch and what must stay protected. Do that work with the frontend engineer, not after the design is “done.”

**For frontend engineers**
Modern architecture (Astro islands, clean component models, tokens, Next.js or equivalent) only matters when it becomes invisible to the people who create the actual content. Elegance in the code is table stakes. The real test is whether a designer or artist can publish something new on a Friday afternoon without sending you a Slack message.

## What I would do again (and what I am tightening)

**Would repeat:**
- Treating the creative team as the primary user of the publishing experience, even when the “users” of the public site are collectors and visitors.
- Defining rigid vs flexible areas explicitly in the first weeks, not after the third redesign request.
- Building the token system and layout contracts before any beautiful page is fully designed.
- Keeping GSAP and motion in service of the work, never as the star.
- Documenting the “why” of each contract in a place the team can actually read (short Notion pages + comments in the component files).

**Tightening next:**
- A more explicit “artist starter kit” that Aurin can hand to a new artist with almost zero explanation.
- Better preview tooling so changes to a new series can be reviewed in context before they go live.
- Tighter connection between the studio’s main Astro site and individual artist presences so shared tokens and components update in one place.

## Closing

Both this project and the work I did with Monex are about bringing order to complexity so that the people who actually do the core work—traders and relationship managers in one case, artists and art directors in the other—can operate inside a system that respects their craft instead of fighting it.

If you lead a studio, represent an artist, or run a creative practice and you need a site or platform where your team has real ownership over the story and the presentation without having to become technical or wait on development for every adjustment, this is the kind of work I do. Strong, quiet infrastructure that lets the noisy, beautiful, human part stay in charge.

The repos for the two systems discussed here are public: [AurinWebsite](https://github.com/AurinExperience/AurinWebsite) (studio platform) and [MariaLuisadeMateo](https://github.com/karenrebecag/MariaLuisadeMateo) (the artist presence). The principles are more transferable than the specific code.