# Changelog

## 2026-05-21 -- Scaffold inicial + Frontend completo

### Scaffold del monorepo

- Scaffoldeado monorepo completo desde atom-careers como template
- pnpm workspaces + turbo, Payload 3.46 CMS, Next.js 15, PostgreSQL 16 Docker
- Puertos desplazados: CMS :3100, Web :4100, DB :5434 (sin conflicto con atom-careers)
- Collection `Projects` adaptada a portafolio
- ISR + webhook revalidation cableado entre CMS y frontend
- Docker Compose, .env, .gitignore, turbo.json configurados

### Frontend single-page

- Home como single-page: marquee, hero banner, logo wall, statement bridge, projects grid, about, contact
- Hero banner: giant display type (Grift, 11vw inline), divider 5px, info grid 16 cols
- Project cards cinematograficas: imagen full-bleed 16:9, texto overlaid con gradient, tags blur
- Footer OSMO: tagline giant, copyright masivo, grid 16 cols
- `/projects/[slug]` para detalle, `/projects` redirect a `/#projects`

### Brand voice

- Titulo: "Diseno y construyo productos web impulsados por IA, de la arquitectura al ultimo pixel"
- Posicionamiento: Software Engineer / Product Engineering / AI / Design Systems
- Hero reestructurado: titulo, subtitle, 3 bullets tecnicos, CTA Button061, subcopy
- Statement bridge: "De la arquitectura al ultimo pixel"
- Marquee actualizado: Product Engineering, AI Integrations, MCP Servers, etc.

### Tipografia

- Inter Tight (Google Fonts) `--font-sans` para body
- Grift (local, 18 woff2) `--font-display` para h1/h2/h3 (regla base CSS)
- Interval monospace (local, 3 woff2) `--font-accent` para pills, labels, social links
- Quetzalli evaluada y descartada (no legible para pills)

### Colores -- Paleta Plantation

- Light bg: #fdf9ed, dark bg: #11221f (era #1f1f1f, cambiado a verde oscuro Plantation)
- Foregrounds invertidos: #11221f light, #fdf9ed dark
- Nav/menu hardcoded: #11221f (coherente con paleta)
- Corners/borders overlay: #11221f
- Column wipe panels: #253c37 (Plantation 900)
- Logos: filtro monocromatico verde via CSS (sepia + hue-rotate)

### Dark mode

- Sistema dual: `.dark` class en html (Tailwind) + `data-theme-status` en body
- ThemeToggle OSMO: sun/moon icon rotate+bounce, texto Light/Dark swap
- Anti-flash inline script en `<head>`
- Shortcut Shift+T, persistencia localStorage
- Transicion suave body 0.4s
- Fix hydration mismatch: `data-theme-status` se setea post-hidratacion

### Navigation -- OSMO Fixed Underlay

- Menu lateral fijo detras del contenido (z-1)
- GSAP timeline: open con stagger, close independiente
- Hamburger morph a X con back.out easing
- Menu bg #11221f, text #ededed, active link orange #f85931
- Header: color #fff, mix-blend-mode: difference solo al scrollear (.is--scrolled)
- Marquee se oculta (translateY -100%) al abrir menu, vuelve al cerrar
- Navbar padding-top: 3.5em desktop, 3em mobile (espacio para marquee fijo)
- Responsive: 30em desktop, 80vw mobile
- Cierra con: toggle, click overlay, Escape, click en link

### Marquee de servicios

- Fixed top-0 z-99, Grift font, dot separators
- Show en top0 y scroll-up, hide en scroll-down (translateY)
- Duplicacion auto, 75px/s, pausa fuera de viewport
- Montado en layout (fuera de [data-main]) para que fixed funcione

### Hero

- Background image full-bleed con parallax OSMO (mask 120%, data-parallax trigger/target)
- Gradient overlay reforzado: from-black/80 via-black/50 via-40%
- Texto siempre blanco (text-white en section)
- Info grid con labels dimmed (opacity-50) vs contenido bright
- Social links en Interval monospace
- Button061 secondary variant (white bg, green text) para contraste

### Logo Wall -- Selected Collaborations

- Layout dos columnas (grid 12 cols): texto sticky izq (7), logos der (5)
- Pill component (Interval mono, cuadrado, bg-primary)
- Heading con text-reveal words
- Subheading + body + bullets con dividers h-px entre secciones
- CTA Button061 al final
- Grid 2x4 vertical con bordes 1px brutalistas
- Logos monocromaticos filtro verde Plantation
- Cycle GSAP cada 1.5s, slide vertical expo.inOut
- 16 logos tech stack (Next.js, React, TS, Astro, Tailwind, Figma, Node, Postgres, Docker, Git, Vercel, Supabase, Vue, Python, Linux, GitHub)

### Animaciones -- Sistema completo

**Column Wipe Transition (mount)**
- 5 paneles #253c37, panels cubren viewport via CSS (sin flash)
- GSAP desliza al montar, dispatch `page-ready` al completar
- Todas las animaciones downstream esperan este evento

**Masked Text Reveal (SplitText)**
- `data-split="heading"` con `data-split-reveal="lines|words|chars"`
- Trigger: `mount` (hero h1, h2) o `scroll` (secciones)
- Anti-FOUC: visibility hidden en CSS, autoAlpha 1 pre-animacion
- Espera `page-ready`

**Content Reveal on Scroll**
- `data-reveal-group` en secciones post-hero
- Stagger 100ms default, slide-up 2em, power4.inOut
- Soporte nested groups, custom stagger/distance, data-ignore
- Aplicado: statement, projects, about (skills nested stagger 50ms), contact, footer
- Espera `page-ready`

**Global Parallax (OSMO)**
- `data-parallax="trigger"` con atributos configurables
- Hero image: start 0, end 40, scroll-start top top
- Espera `page-ready`

**Lenis Smooth Scroll**
- Provider global, intercepta anchor links con easing quartic 1.2s

### Atomos UI

- `Container` (ui/container.tsx): max-w-[1400px] mx-auto, wrappea hero content y logo wall
- `Pill` (ui/pill.tsx): Interval mono, 10px, bold, uppercase, bg-primary, cuadrado
- `Button061` (ui/button-061.tsx): circle reveal hover, Plantation colors, variantes default/secondary, border-radius 2px

### i18n

- next-intl instalado y configurado
- Routing: `/` espanol (default sin prefijo), `/en` ingles
- `localePrefix: 'as-needed'`
- Messages: `messages/es.json`, `messages/en.json`
- Namespaces: metadata, nav, hero, statement, stack, projects, about, contact, footer, project_detail, theme, marquee
- Server components: `getTranslations()`, client: `useTranslations()`
- Menu/Close traducido por locale
- Middleware detecta Accept-Language

### Layout y spacing

- Container 1400px para pantallas grandes (wrappea contenido, no backgrounds)
- Sections: px-4 lg:px-6, py-40 (spacing japones amplio)
- Logo wall: py-20 mobile, lg:pt-60 lg:pb-40 desktop
- Film grain: body::after SVG noise, opacity 0.035, z-998
- Hero: min-h-[75vh], flex-col justify-end

### Dependencias

- turbo, typescript, gsap 3.15, lenis, next-intl
- lucide-react, clsx, tailwind-merge, class-variance-authority, tw-animate-css
- @base-ui/react, shadcn
- Payload CMS stack completo
- sass evaluado y descartado
