# Fix: ScrollTrigger pin en `/proposals` (elementos que desaparecen/saltan)

## Síntoma

En la página de propuesta de servicios (`/proposals`), los componentes con
efectos de scroll (las **fan cards** y el **marquee** MWG-024 en su modo full
pinned) se comportaban mal: desde la carga, el contenido pinneado **desaparecía
al scrollear** y **reaparecía de golpe** en lapsos. Los reveal-group cercanos
también parecían revelarse a destiempo.

El home (`/`) no tenía el problema — porque **no usa `pin`** en ningún
ScrollTrigger.

## Causa raíz

El layout `(main)` envuelve toda la página en `[data-main]`:

```tsx
// src/app/[locale]/(main)/layout.tsx
<div data-main className="relative z-[2] ... overflow-x-clip">
```

La **navbar** anima ese contenedor para el menú lateral y, al montar, ejecuta:

```ts
// src/components/layout/navbar.tsx
gsap.set(mainEl, { x: 0 }) // mainEl = [data-main]
```

`gsap.set(..., { x: 0 })` escribe `transform: translate(0px, 0px)` **inline** en
`[data-main]`, y ese transform persiste desde la carga.

Un ancestro con `transform` (también `filter`, `perspective`, `will-change:
transform` o `contain`) **crea un containing block nuevo**: cualquier
`position: fixed` descendiente se posiciona **relativo a ese ancestro**, no al
viewport.

ScrollTrigger, cuando el scroller es la ventana, **pinea con `position: fixed`**
por defecto (`pinType: 'fixed'`). Como el elemento pinneado vive dentro de
`[data-main]` (transformado), el "fixed" deja de ser fijo respecto al viewport:
se mueve con el scroll (→ desaparece) y los cálculos de start/end quedan mal
(→ aparece de golpe).

> Regla general: **un pin de ScrollTrigger no funciona con `position: fixed` si
> algún ancestro está transformado.**

## Fix

Forzar a ScrollTrigger a pinear con **transform** en lugar de fixed, en cada
trigger que use `pin`:

```ts
scrollTrigger: {
  trigger: pinHeight,
  start: 'top top',
  end: 'bottom bottom',
  pin: container,
  pinType: 'transform', // <-- clave: funciona dentro de ancestros transformados
  scrub: true,
  invalidateOnRefresh: true,
}
```

`pinType: 'transform'` simula el pin trasladando el elemento con `transform`
dentro de su flujo normal (con su pin-spacer), sin depender de `position:
fixed`. Funciona aunque `[data-main]` esté transformado.

### Por qué no `pinReparent: true`

La otra solución de GSAP para este caso es `pinReparent: true`, que **mueve el
elemento pinneado al `<body>`** durante el pin para escapar del ancestro
transformado. Aquí no sirve: la página fija su paleta con un wrapper
`data-palette="night"` (tokens dark scopeados por subtree). Reparentar al body
**saca el elemento de ese scope** y perdería los tokens de color. `pinType:
'transform'` mantiene el elemento en su lugar en el DOM. → se conserva el theme.

## Integración con el ciclo global de ScrollTrigger

Aparte del `pinType`, los componentes nuevos se alinearon al patrón del proyecto
para no descolocar a los demás triggers:

- **`usePageInit(...)`** en vez de `useEffect`: corre el init en la fase
  orquestada (tras `page-ready` en primera carga, o al completar la transición
  en navegación cliente), igual que `ContentRevealProvider`. Evita crear
  triggers/pines antes de que el DOM/posiciones estén listos.
- **`scheduleScrollTriggerRefresh(true)`** (refresh debounced compartido) en vez
  de `ScrollTrigger.refresh()` directo: un solo refresh coalescido recalcula
  todas las posiciones **después** de que los pines insertaron sus spacers, así
  los reveal-group de más abajo no quedan con start/end stale.

## Archivos tocados

- `src/components/services-fan-cards.tsx` — `pinType: 'transform'`, `usePageInit`,
  `scheduleScrollTriggerRefresh`.
- `src/components/scroll-swap-marquee.tsx` — íd. (modo full pinned). El modo
  `compact` usa un scrub **sin pin**, por lo que no le aplica el problema.

## Notas / contexto del entorno

- Scroll suave: **Lenis** con scroll **nativo** (sin scroller-proxy de
  transform), wired en `src/components/lenis-provider.tsx`
  (`lenis.on('scroll', ScrollTrigger.update)` + `gsap.ticker`). Por eso el pin
  funciona con el scroller window una vez resuelto el ancestro transformado.
- Si en el futuro **otro** ancestro común recibe `transform`/`filter`/
  `will-change`, cualquier pin nuevo deberá usar `pinType: 'transform'` por la
  misma razón.
