# Karen Ortiz Portfolio 2026

Portfolio personal de Karen Ortiz. Next.js 15 + GSAP + Tailwind CSS.
Proyectos estaticos via archivos TypeScript/Markdown en `src/content/`.

## Estado actual

- CMS eliminado. Sin Payload, sin Docker, sin Postgres.
- Proyectos viven en `src/lib/constants.ts` (metadata) y `src/content/projects/` (articulos en Markdown).
- Deploy: Vercel. Dev local: `pnpm dev:web` en puerto 4100.

## Arquitectura

```
KarenOrtiz2026/
  apps/
    web/     -- Portfolio publico (Next.js 15, puerto 4100)
  packages/
    shared/  -- Tipos compartidos
```

### Stack

| Capa | Tecnologia |
|------|-----------|
| Frontend | Next.js 15 App Router |
| Styling | Tailwind CSS 4.3 |
| Animations | GSAP 3.15 (ScrollTrigger, SplitText, Observer) |
| Smooth Scroll | Lenis |
| i18n | next-intl (es default, en) |
| Fonts | Inter Tight (sans), Grift (display), Interval (accent/mono), Gantol (handwritten) |

## i18n

- `next-intl` con `localePrefix: 'as-needed'`
- `/` sirve espanol (default, sin prefijo), `/en` sirve ingles
- Messages en `messages/es.json` y `messages/en.json`
- Server components: `getTranslations()`, client components: `useTranslations()`
- Locale toggle en navbar setea cookie `NEXT_LOCALE` y navega via `<a>` tags
- **Siempre escribir textos con acentos correctos en espanol** (UTF-8)

## Paginas

- `/[locale]` -- Home: marquee, hero, logo wall, statement, projects, about strip, contact
- `/[locale]/about` -- About me: hero, personal statement, galeria, quote, baby photo, origin story, albums, bridge, experience, volunteering, education, stack, contact
- `/[locale]/projects/[slug]` -- Detalle de proyecto individual

## Tipografia

| Variable | Font | Uso |
|----------|------|-----|
| `--font-sans` | Inter Tight | Body, UI |
| `--font-display` | Grift | h1, h2, h3, mega text |
| `--font-accent` | Interval (mono) | Pills, labels, metadata, locale toggle |
| `--font-handwritten` | Gantol | Doodle labels ("that's me") |

## Sistema de color (3 themes)

### Tokens

| Token | Plantation (light) | Night (dark) | Mono Slate |
|-------|-------------------|-------------|------------|
| `--background` | `#fdf9ed` cream | `#0c0e0a` near-black | `#e8e6e1` warm gray |
| `--foreground` | `#11221f` dark green | `#ECDFCC` warm cream | `#1c2028` navy gray |
| `--plantation` | `#366B5E` mid green | `#5FA28F` bright green | `#6a9dae` blue steel |
| `--surface` | `#11221f` | `#070806` | `#14171d` |
| `--surface-foreground` | `#fdf9ed` | `#ECDFCC` | `#d0cec9` |
| `--muted-foreground` | `#71717a` | `#697565` | `#6b7280` |
| `--border` | `#e4dfcf` | `#1e201b` | `#c8c6c1` |
| `--secondary` | `#f3eedf` | `#161814` | `#dddbd6` |

### Mecanismo

- Clases en `<html>`: sin clase = Plantation light, `.dark` = Night, `.mono` = Mono Slate
- Inline script anti-flash en `<head>` lee `localStorage.theme` y aplica clase antes de render
- `ThemeToggle` component: 3 dots de color como selector de paleta
- `Shift+T` cicla entre themes
- Persistencia: `localStorage.theme` (valores: `light`, `dark`, `mono`)

### Regla de `--plantation`

Es el accent color del sitio. Se usa para:
- Scroll highlights (`[data-highlight]` con `color-mix` al 25%)
- Rotating text color (`.rotating-text__highlight`)
- Button hover circles (leido dinamicamente via `getComputedStyle`)
- Nav active state, checkmarks, glyphs decorativos
- **Nunca hardcodear `#88C0AF` o cualquier hex de Plantation. Siempre usar `var(--plantation)`.**

### Image filters por theme

- **Mono**: `filter: grayscale(0.85) sepia(0.15) hue-rotate(180deg) saturate(0.5)` en parallax targets, marquee items, stickers, logos
- **Albums**: siempre con filtro verde-sepia oscuro (`grayscale(0.5) sepia(0.4) hue-rotate(70deg) saturate(0.4) brightness(0.7)`)

## Contenido: proyectos y articulos

### Como crear un nuevo proyecto/articulo

1. **Crear archivo de contenido** en `src/content/projects/{slug}.ts`:

```typescript
/**
 * Caso de estudio / Articulo de portafolio
 * Markdown convertido a Lexical por markdown-to-lexical.ts.
 */

export const myProjectMeta = {
  id: '7',
  title: 'Titulo Comercial (no anclado al proyecto)',
  slug: 'titulo-comercial-en-slug',
  status: 'published' as const,
  category: 'web' as const,
  role: 'Product Engineer & ...',
  year: '2026',
  featured: true,
  summary: 'Resumen de una linea del enfoque, no del proyecto especifico.',
  tags: [{ tag: 'Next.js' }, { tag: 'Design Systems' }],
  liveUrl: 'https://...',
  repoUrl: 'https://github.com/...',
  services: 'Product Engineering, Design Systems',
  coverImage: { url: 'https://...', alt: 'Descripcion' },
  createdAt: '2026-06-01',
  updatedAt: '2026-06-01',
}

export const myProjectMarkdown = `
Escribe en Markdown limpio. Usa ## para secciones.
El convertidor soporta parrafos, headings, bold, italic, listas, code blocks.
`.trim()
```

2. **Registrar en constants.ts**:

```typescript
import { myProjectMeta, myProjectMarkdown } from '@/content/projects/my-project'
import { markdownToLexical } from '@/lib/markdown-to-lexical'

// Agregar al array PLACEHOLDER_PROJECTS:
{
  ...myProjectMeta,
  description: markdownToLexical(myProjectMarkdown),
},
```

3. **Reglas de titulos**: Los titulos deben ser comerciales/headline, no anclados a un proyecto especifico. El articulo puede hablar del proyecto en detalle, pero el titulo es generico. Ejemplo: "Context-Driven Visual Development" en vez de "Atom Webflow".

### Middleware

El middleware de next-intl intercepta todas las rutas excepto las excluidas en el matcher:
```
/((?!api|_next|stickers|gallery|albums|favicon.ico|.*\\.splinecode$).*)
```
Si agregas un directorio nuevo a `public/`, agregalo a esta lista de exclusion.

## Componentes clave

| Componente | Uso |
|------------|-----|
| `ScrollHighlight` | Wrapper. Hijos con `data-highlight` se revelan con scroll (ScrollTrigger scrub). Usa `color-mix(in oklab, var(--plantation) 25%, transparent)` |
| `InfiniteGrid` | Galeria draggable infinita (fotos personales). Solo drag, sin wheel. |
| `DraggableMarqueeStrip` | Marquee horizontal draggable con overlay en hover. Usado en proyectos adicionales y albumes. Props: `items`, `duration`. |
| `AlbumMarquee` | Eliminado. Usar `DraggableMarqueeStrip` de `additional-work.tsx`. |
| `PageTransition` | Column wipe + label de pagina + loader bar. Intercepta clicks en `<a>` internos. |
| `IconButton` | Boton cuadrado con circle reveal. Soporta `href` (renderiza como `<a>`). |
| `LocaleToggle` | `ES / EN` en font-accent. Setea cookie `NEXT_LOCALE` y navega con `<a>`. |

## Comandos

```bash
pnpm dev:web        # Levanta portfolio en :4100
pnpm dev            # Levanta todo (turbo)
pnpm build          # Build de produccion
```

## Reglas

- Desarrollo local primero
- `.env` nunca se commitea
- **Nunca hardcodear colores hex.** Usar `var(--plantation)`, `var(--foreground)`, etc.
- **Botones leen `--plantation` dinamicamente** via `getComputedStyle` en cada hover. No pasar `colors` prop a menos que sea un override intencional.
- Container (1400px) wrappea contenido, no fondos
- Secciones: `px-4 lg:px-6` sin max-width (backgrounds full bleed)
- **Todos los textos visibles deben estar en los archivos de mensajes** (`messages/en.json` y `messages/es.json`), no hardcodeados en componentes
- Brand voice: Product Engineering, AI, Design Systems
- Commits: conventional commits `type(scope): description`
