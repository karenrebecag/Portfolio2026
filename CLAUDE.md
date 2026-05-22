# Karen Ortiz Portfolio 2026

Portfolio personal de Karen Ortiz. Payload CMS + Next.js.
Arquitectura clonada de atom-careers, adaptada a portafolio.

## ESTADO ACTUAL: CMS desconectado

El CMS (Payload) NO esta corriendo en produccion ni en Vercel. Todos los fetches a la API de Payload (`lib/payload.ts`) fallan gracefully y retornan arrays vacios o null. Los proyectos se muestran via `PLACEHOLDER_PROJECTS` en `lib/constants.ts`. No hacer cambios que dependan de data real del CMS hasta que se configure el backend. El `PAYLOAD_API_URL` en Vercel apunta a un placeholder URL.

## Arquitectura

```
Payload CMS (admin, proyectos, auth) --> Next.js (portfolio publico)
     |                                        |
  localhost:3100                          localhost:4100
     |                                        |
  Postgres (Docker local, puerto 5434)  ISR + webhook revalidation
```

### Monorepo (pnpm workspaces + turbo)

```
KarenOrtiz2026/
  apps/
    cms/     -- Payload CMS (Next.js, puerto 3100)
    web/     -- Portfolio publico (Next.js, puerto 4100)
  packages/
    shared/  -- Tipos y constantes compartidos
```

### Stack

| Capa | Tecnologia |
|------|-----------|
| CMS | Payload 3.x (Lexical editor, Postgres adapter) |
| Frontend | Next.js 15 App Router |
| DB | PostgreSQL 16 (Docker local) |
| Styling | Tailwind CSS 4.3 |
| Animations | GSAP 3.15 (ScrollTrigger, SplitText) |
| Smooth Scroll | Lenis |
| i18n | next-intl (es default, en) |
| Fonts | Inter Tight (sans), Grift (display), Interval (accent/mono) |

### Servicios locales

| Servicio | URL |
|----------|-----|
| Postgres | postgresql://payload:payload@localhost:5434/karen_portfolio |
| Payload Admin | http://localhost:3100/admin |
| Payload API | http://localhost:3100/api |
| Portfolio (es) | http://localhost:4100 |
| Portfolio (en) | http://localhost:4100/en |

## Frontend (apps/web)

### i18n

- `next-intl` con `localePrefix: 'as-needed'`
- `/` sirve espanol (default, sin prefijo)
- `/en` sirve ingles
- Messages en `messages/es.json` y `messages/en.json`
- Server components: `getTranslations()`, client components: `useTranslations()`
- Routing config en `src/i18n/routing.ts`, request config en `src/i18n/request.ts`
- Middleware en `src/middleware.ts`

### Paginas

- `/[locale]` -- Single-page portfolio: marquee, hero, logo wall, statement, projects, about, contact
- `/[locale]/projects/[slug]` -- Detalle de proyecto individual
- `/[locale]/projects` -- Redirect a `/#projects`
- `/api/revalidate` -- Webhook ISR (fuera de [locale])

### Tipografia

| Variable | Font | Uso |
|----------|------|-----|
| `--font-sans` / `font-sans` | Inter Tight | Body, UI, textos secundarios |
| `--font-display` / `font-display` | Grift | h1, h2, h3 (regla base CSS), hero name, nav links menu |
| `--font-accent` / `font-accent` | Interval (mono) | Pills, labels de seccion, social links hero |

- h1, h2, h3 usan Grift automaticamente via `globals.css` base rule
- Grift en `src/fonts/grift/` (18 woff2, 9 pesos + italics)
- Interval en `src/fonts/interval/` (3 woff2: Light, Regular, Bold)

### Colores (Plantation palette)

| Token | Light | Dark |
|-------|-------|------|
| background | #fdf9ed | #11221f |
| foreground | #11221f | #fdf9ed |
| primary | #11221f | #fdf9ed |
| primary-foreground | #fdf9ed | #11221f |

Palette accent: Plantation (#88C0AF, #5FA28F, #458776, #366B5E, #2C534A, #253c37, #11221f)

### Dark Mode

- Mecanismo dual: `.dark` class en `<html>` (Tailwind) + `data-theme-status` en `<body>` (animaciones CSS)
- Inline script en `<head>` previene flash (solo `.dark` class, no toca body)
- `ThemeToggle` component setea `data-theme-status` post-hidratacion (OSMO sun/moon animation)
- Persistencia: localStorage
- Shortcut: Shift+T
- Transition suave body 0.4s

### Componentes OSMO

Portados del sistema de recursos de OSMO (hellohello.is):

1. **Fixed Underlay Navigation** -- Menu lateral detras del contenido. GSAP timeline open/close, stagger, hamburger morph. Menu bg `#11221f`, text `#ededed`. Header `color: #fff`, `mix-blend-mode: difference` solo al scrollear (`.is--scrolled`). Marquee se oculta al abrir menu.

2. **CSS Marquee** -- Fixed top-0 z-99. Grift font. Show en top0/scroll-up, hide en scroll-down. Duplicacion auto, 75px/s, pausa fuera de viewport.

3. **Dark/Light Mode Toggle** -- Sun/moon icon animation (translateY + rotate bounce) + texto Light/Dark swap. CSS via `[data-theme-status]`.

4. **Button 061** -- Boton con circle reveal hover (GSAP), colores Plantation cycling. border-radius: 2px (brutalista). Variantes: `default` (dark bg) y `secondary` (white bg, dark text).

5. **Column Wipe Transition** -- 5 paneles `#253c37` en mount. Panels cubren viewport via CSS (sin flash), GSAP los desliza. Dispatch `page-ready` event al completar. Todas las animaciones esperan este evento.

6. **Logo Wall Cycle** -- Grid 2x4 con logos monocromaticos (filtro verde Plantation). Cycle aleatorio cada 1.5s con slide vertical expo.inOut. Pausa fuera de viewport y tab oculto.

7. **Masked Text Reveal (SplitText)** -- `data-split="heading"` con `data-split-reveal="lines|words|chars"`. Trigger `mount` (hero) o `scroll` (secciones). Mask overflow hidden + yPercent 110. Anti-FOUC via `visibility: hidden`.

8. **Content Reveal on Scroll** -- `data-reveal-group` en secciones. Stagger 100ms, slide-up 2em, power4.inOut. Soporte para `data-reveal-group-nested`, `data-stagger`, `data-distance`, `data-ignore`. Respeta prefers-reduced-motion.

9. **Global Parallax** -- `data-parallax="trigger"` con `data-parallax-start/end/direction/scrub/scroll-start/scroll-end/disable`. Hero image con mask 120% + target.

10. **Lenis Smooth Scroll** -- Provider global. Intercepta `a[href^="#"]` con easing quartic 1.2s.

### Atomos UI

| Componente | Path | Uso |
|------------|------|-----|
| `Container` | `ui/container.tsx` | `max-w-[1400px] mx-auto` wrapper. Wrappea contenido del hero y logo wall. |
| `Pill` | `ui/pill.tsx` | Label de seccion. Interval mono, 10px, bold, uppercase, bg-primary text-primary-foreground, cuadrado. |
| `Button061` | `ui/button-061.tsx` | CTA principal. Props: `href`, `variant`, `colors`, `children`. |

### Sync de animaciones (page-ready)

Todo espera el evento `page-ready` (dispatch por TransitionOverlay):
- CSS reveals: `animation-play-state: paused` hasta `body[data-page-ready]`
- ParallaxProvider, TextRevealProvider, ContentRevealProvider, Marquee

### Underlay Nav - Reglas

- Todo el contenido vive dentro de `[data-main]` con `relative z-[2] bg-background`
- Menu panel `z-1`, header `z-100`, marquee `z-99`, transition `z-999`
- `--menu-width`: 30em desktop, 80vw mobile
- Navbar padding-top: 3.5em desktop, 3em mobile (espacio para marquee)

### Layout

- `Container` (1400px max-width) wrappea contenido, no backgrounds
- Sections: `px-4 lg:px-6` sin max-width (backgrounds full bleed)
- Film grain: `body::after` SVG noise, opacity 0.035, z-998, pointer-events none

## Collection: Projects

**Metadata:** title, slug (auto), status (draft/published/archived), featured, category, role, year, tags (array)
**Contenido:** summary (textarea), description (richtext Lexical)
**Links:** liveUrl, repoUrl
**Media:** coverImage (required), gallery (array de imagenes con caption)
**Auto-generados:** slug (hook beforeValidate, inmutable), publishedAt (hook beforeChange al publicar)

## ISR + Revalidation

- Fetch con `next: { tags: ['projects'] }`
- Payload hook afterChange POST a `/api/revalidate`
- Shared secret en REVALIDATE_SECRET

## Comandos

```bash
pnpm db:up          # Levanta Postgres en Docker (puerto 5434)
pnpm db:down        # Para Postgres
pnpm db:reset       # Borra y recrea la DB
pnpm dev:cms        # Levanta Payload en :3100
pnpm dev:web        # Levanta portfolio en :4100
pnpm dev            # Levanta todo (turbo)
```

## Reglas

- Desarrollo local primero, siempre
- `pnpm db:up` antes de cualquier trabajo
- `.env` nunca se commitea
- Los secrets compartidos (REVALIDATE_SECRET) deben ser iguales en cms y web
- Componentes OSMO se portan tal cual, sin adaptar al design system (excepto colores que deben usar la paleta Plantation)
- Solo front en este proyecto. El CMS ya esta configurado
- Colores hardcodeados del nav/menu: `#11221f` (no #111)
- Container (1400px) wrappea contenido, no fondos
- Brand voice: Product Engineering, AI, Design Systems
