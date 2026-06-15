> [!tip] En 30 segundos
> - **Para quién es:** Design engineers y leads en sitios Webflow que superaron el custom code pegado (animaciones, módulos, tokens) pero necesitan que marketing publique copy sin ingeniería.
> - **Qué problema resuelve:** JavaScript de producción en un área de texto de Webflow no tiene historial git, no hay entornos y cada publish va directo a producción.
> - **Qué cambia si aplicas esto:** Contrato dual-control — Webflow posee CMS/SEO; Git posee tokens y `src/js/modules/*`. Despliega JS con un solo **`git push`** — el CI sube un tag de versión, regenera el loader y purga el CDN (~minutos) — en lugar de un republish completo de Webflow; los cambios de copy nunca tocan el repo.

Hay un momento específico en casi todos los proyectos Webflow. No está en el onboarding. No está en el primer publish. Aparece cuando alguien del equipo abre los custom code settings del sitio por primera vez y pega un bloque de JavaScript en un área de texto.

En ese momento, sin que nadie lo decida explícitamente, ==el proyecto acaba de adquirir deuda técnica.==

El código que acaba de pegarse no tiene historial. No tiene author. No tiene diff. No se puede hacer rollback. Si algo se rompe, la única forma de saberlo es que un usuario lo reporte -- o que tú, con suerte, lo notes antes de que llegue a producción. Pero lo más probable es que no lo notes, porque Webflow no tiene entornos. ==El publish es directo a producción. Siempre.==

Pasé bastante tiempo en esto construyendo el sitio de producción de un cliente — animaciones de alta fidelidad, lenguaje de marca estricto y un equipo de contenido que publica sin coordinar con desarrollo en cada titular. Tres requisitos que Webflow por default contradice. El workflow de abajo es **reutilizable en cualquier proyecto Webflow**, no específico de ese cliente: pegar JavaScript de producción en un área de texto debería sentirse tan mal como desplegar por FTP después de aprender git — señal de que el límite entre sistemas no existe.

> [!info] Documentación de industria que respalda el workflow
> Webflow documenta [custom code en head y footer](https://help.webflow.com/hc/en-us/articles/33961357265299-Custom-code-in-head-and-body-tags) y [límites de embed](https://help.webflow.com/hc/en-us/articles/33961332238611-Custom-code-embed). [jsDelivr](https://www.jsdelivr.com/documentation) documenta URLs de GitHub `@main` y [purge de cache](https://www.jsdelivr.com/documentation#id-purge-cache). Cloudflare documenta [Rocket Loader](https://developers.cloudflare.com/speed/optimization/content/rocket-loader/) y [`data-cfasync="false"`](https://developers.cloudflare.com/speed/optimization/content/rocket-loader/ignore-javascripts/). El mapa del repo es nuestra implementación; la tabla al final es lo que envío a equipos que evalúan el mismo split.

## Primero, entender por qué Webflow se comporta así

> **En pocas palabras:** Webflow está hecho para marketing, no para lógica de app compleja — y eso está bien hasta que el proyecto cruza la línea.
Antes de hablar de soluciones, quiero ser justa con Webflow porque tiene muy mala reputación por razones que en realidad son decisiones de diseño correctas para su caso de uso original.

Webflow fue construido para dar autonomía a equipos de marketing y contenido. La promesa central es: puedes lanzar y actualizar un sitio web de alta calidad sin depender de un developer cada vez que necesitas cambiar un título o agregar una página. Esa promesa funciona. Funciona muy bien, de hecho, para el 80% de los casos de uso.

El problema es que ==el 20% restante== -- proyectos que requieren comportamientos complejos, componentes con lógica específica, animaciones que dependen de eventos, integraciones con APIs externas -- ese 20% necesita las primitivas de un codebase de verdad. Y Webflow, en su configuración default, no las tiene.

No es un fallo de diseño. Es un límite de scope. El problema real es que los equipos llegan a ese límite y en lugar de diseñar una solución, improvisan. Pegan código. Agregan más custom code. Crean dependencias implícitas entre páginas. Y en algún momento tienen un sitio que funciona pero que nadie entiende completamente -- incluyendo la persona que lo construyó.

La pregunta que me hice fue: ==qué pasa si en lugar de luchar contra ese límite, lo respetamos?== Si diseñamos un sistema donde Webflow haga exactamente lo que mejor sabe hacer, y todo lo demás viva en su lugar natural?

## La idea central: control dual

> **En pocas palabras:** Marketing conserva el sitio; ingeniería conserva el código en git — dos carriles que no se bloquean.
La respuesta es lo que llamo un modelo de control dual. Dos sistemas con responsabilidades completamente separadas, un contrato explícito entre ellos, y ninguna área de ambigüedad sobre quién es dueño de qué.

```mermaid Arquitectura de control dual
flowchart LR
  subgraph WF["Webflow"]
    direction TB
    WF1["Estructura HTML"]
    WF2["Contenido CMS"]
    WF3["SEO y metadata"]
    WF4["Flujo de publish"]
  end

  subgraph GIT["Repositorio GitHub"]
    direction TB
    G1["Design tokens"]
    G2["Módulos JS"]
    G3["CSS por sección"]
    G4["Docs y restricciones"]
  end

  JSD["CDN jsDelivr"]
  SITE["Sitio en producción"]

  WF --> WFC["CDN Webflow"]
  WFC --> SITE
  GIT -->|"git push → CI"| JSD
  JSD -->|"loader @latest → CSS y JS @vX.Y.Z"| SITE
  WF -.->|"URL fija del loader"| JSD
  GIT -.->|"el CI tagea + purga"| JSD
```

**Webflow es dueño de:** la estructura HTML y la semántica de páginas, el contenido CMS y las colecciones, SEO, metadata, og tags, y el workflow de publicación -- marketing puede hacer publish cuando quiera, sin coordinar con nadie.

**El repositorio Git es dueño de:** design tokens (colores, tipografía, espaciado, curvas de animación), módulos de JavaScript (uno por feature), CSS global por sección y por componente, documentación de arquitectura, restricciones y decisiones, y el pipeline de deploy y el versionado.

Lo que hace que esto funcione no es la tecnología -- ==es el contrato.== El acuerdo explícito de que un cambio de copy nunca toca el repositorio, y un refactor de animación nunca requiere que marketing espere. Los dos sistemas corren en paralelo, se despliegan de forma independiente, y ninguno bloquea al otro.

El punto de conexión entre ambos es [jsDelivr](https://www.jsdelivr.com/documentation), un CDN que sirve archivos desde GitHub ([documentación GitHub en jsDelivr](https://www.jsdelivr.com/documentation#id-github)). Webflow referencia un solo archivo con una URL fija. Lo que cambia -- tras push, con el CI cortando un nuevo tag de versión y [purgando](https://www.jsdelivr.com/documentation#id-purge-cache) el CDN -- es el contenido que resuelve esa URL.

> [!tip] git push origin main -> el CI tagea, regenera el loader, purga y verifica jsDelivr -> sitio actualizado. Sin republish de Webflow. Sin coordinación. Marketing ni sabe que ocurrió porque no necesita saberlo.

## Mapa del repositorio — documentación que hace cumplir el contrato

> **En pocas palabras:** Dónde viven las reglas escritas para que equipos nuevos (humanos o IA) no peguen código donde no toca.
El workflow vive en [AtomWebflow_2026Site](https://github.com/karenrebecag/AtomWebflow_2026Site). El repo no existe para "mucho código" — existe para ==límites escritos== para que Webflow, jsDelivr y agentes no peleen el mismo territorio.

| Ruta | Qué documenta |
|------|----------------|
| `CLAUDE.md` (raíz) | Contrato dual-control; Webflow Site ID `6890d2a7153362eed21e1c49`; un solo embed en Head `@latest/loader.js` con `data-cfasync="false"` |
| `.mcp.json` | Token Webflow MCP + `WEBFLOW_SITE_ID` para tareas Designer/API desde este repo |
| `ORCHESTRATOR.md` | Qué skills del agente cargar para CMS, auditorías de assets, safe publish |
| `.agents/skills/` | 34 skills por categoría (constraints citados en la sección de agentes más abajo) |
| `src/css/base/tokens.css` | Tokens sincronizados con el DS del cliente; `#000000` prohibido en texto (comentario en archivo) |
| `src/css/site.css` | Entry: importa base, sections, components |
| `src/js/site.js` | Module loader v1.2.0: `[data-module]`, `autoDetect`, `data-page` en `<body>` |
| `src/js/modules/*.js` | Un archivo por feature (`mega-nav`, `marquee`, `button-041`, `gsap-slider`, …) |
| `loader.js` (raíz) | Entry generado por el CI — inyecta CSS y JS desde el tag inmutable `@vX.Y.Z`; nunca se edita a mano |
| `.github/workflows/release.yml` | CI: sube el tag patch, regenera `loader.js`, commitea, tagea, purga `@latest` + verifica |

**El deploy es un solo comando** (el CI hace el resto — documentado en el repo, no conocimiento tribal):

```bash
git push origin main
# CI (release.yml): sube vX.Y.(Z+1) → regenera loader.js → commit + tag →
# purga @latest/loader.js en jsDelivr → verifica que sirve la versión nueva (con reintentos)
```

**Contrato lado Webflow** (`CLAUDE.md` — Site Settings > Custom Code, Head):

```html
<script data-cfasync="false"
  src="https://cdn.jsdelivr.net/gh/karenrebecag/AtomWebflow_2026Site@latest/loader.js"></script>
```

Un solo tag, fijo para siempre. `loader.js` inyecta el `<link>` de CSS y el script `type="module"`, ambos fijados al tag inmutable `@vX.Y.Z` que el CI acaba de publicar. El Footer Code queda vacío. `data-cfasync="false"` excluye el loader del defer de Rocket Loader (GSAP sigue necesitando `waitForGSAP` para el tag GSAP de Webflow). HTML y publish del CMS siguen en Webflow; ==el comportamiento rastrea a un tag de git cortado por el CI, no a un publish del Designer.==

**Por qué existe `autoDetect`** (documentado en `CLAUDE.md`): Webflow elimina `data-*` en la *raíz* del componente tras publicar. Las skills y el orchestrator dicen a los agentes que enlacen selectores internos como `[data-css-marquee]` — ese detalle es el tipo de hecho de producción que dejamos de dejar solo en Slack.

## Cómo funcionan de verdad las referencias del CDN: loader @latest, assets inmutables

> **En pocas palabras:** Una decisión aburrida de CDN que, tras una lección de producción, terminó siendo lo opuesto de lo que publiqué primero.
Este es uno de esos detalles que parece trivial hasta que lo aprendes de la manera difícil -- y luego lo aprendes una segunda vez, más difícil. La primera versión de este artículo te decía con seguridad que usaras `@main` y nunca `@latest`. Producción no estuvo de acuerdo. Esto es lo que pasó en realidad, porque la versión incorrecta de esta regla sigue siendo el consejo más repetido en internet.

El razonamiento original era sólido sobre el papel. jsDelivr tiene dos formas de referenciar archivos de GitHub: **@latest** resuelve al último release de npm (undefined sin releases y cacheado agresivamente), mientras que **@main** resuelve al último commit y un purge debería limpiarlo. Así que la v1 de este sitio referenciaba los assets con `@main` y purgaba después de cada push.

Entonces producción dio la lección: ==jsDelivr no solo cachea el *archivo* -- cachea la *resolución del ref mutable*.== Para una rama, `@main → commit` se cachea hasta 12 horas (`s-maxage=43200`), y purgar el archivo **no** vuelve a resolver el ref. Así que `@main` seguía sirviendo un commit viejo durante horas tras un push y purge limpios. El consejo que yo había repetido era, en mi propia producción, incorrecto.

La solución es una estrategia de dos archivos donde cada uno usa el tipo de referencia que encaja con su trabajo:

- **`loader.js` se referencia con `@latest`.** Es la única URL que Webflow ve, y nunca debe cambiar. `@latest` resuelve al **tag SemVer más alto** -- y como el CI corta un tag nuevo en cada deploy, los tags son una señal más fuerte y mejor refrescada para jsDelivr que un ref de rama. El loader es diminuto y solo apunta a tags inmutables, así que la agresividad de cache de `@latest` aquí es inofensiva.
- **Los assets (`site.css`, `site.js`) se referencian con un tag inmutable `@vX.Y.Z`.** El loader escribe esas URLs en tiempo de deploy. Un tag de versión nunca muta, así que siempre está fresco y nunca necesita purge.

La regla se invirtió, pero por una razón precisa:

| Referencia | Úsala para | Nunca para |
|------------|-----------|------------|
| `@latest` | el diminuto `loader.js` (URL fija en Webflow) | assets -- cachea el contenido agresivamente |
| `@vX.Y.Z` (tag) | `site.css` / `site.js` -- inmutable, siempre fresco | — |
| `@main` | evitar -- la resolución de rama se cachea hasta 12h, el purge no la refresca | cualquier cosa en producción |
| `@{commit}` | debug urgente / rollback | el estado estable |

> [!warning] No referencies assets con @latest, y no confíes en @main + purge en producción -- purgar el archivo no vuelve a resolver un ref de rama, así que @main puede servir un commit viejo durante horas. Fija los assets a un tag inmutable @vX.Y.Z y deja que un loader diminuto en @latest apunte a él.

Y lo mejor: ==nada de esto es manual ya.== Un `git push` dispara el CI, que sube el tag patch, regenera `loader.js` para apuntar a él, purga `@latest`, y verifica con reintentos que jsDelivr realmente sirve la versión nueva. Si algo se rompe, `git revert` y push -- el CI corta un tag nuevo y re-apunta el loader; o fija el loader a un `@vX.Y.Z` conocido para un rollback instantáneo. El tag inmutable siempre está fresco como fallback.

```mermaid Pipeline de deploy (manejado por CI)
sequenceDiagram
  participant Eng as Engineer
  participant GH as GitHub
  participant CI as GitHub Actions
  participant JD as jsDelivr
  participant Browser as Navegador

  Eng->>GH: git push main
  GH->>CI: dispara release.yml
  CI->>CI: sube vX.Y.(Z+1)
  CI->>GH: regenera loader.js + commit + tag
  CI->>JD: purga @latest/loader.js
  JD-->>CI: verifica que sirve la versión nueva (reintentos)
  Note over Browser: HTML sin cambios — sin republish Webflow
  Browser->>JD: pide loader.js (@latest) → assets (@vX.Y.Z)
  JD-->>Browser: assets actualizados e inmutables
```

## Design tokens: el único artefacto compartido

> **En pocas palabras:** Colores y espaciados que ambos lados respetan — el apretón de manos entre diseño y sitio en vivo.
Si el modelo de control dual es la arquitectura, ==los design tokens son el lenguaje compartido== entre los dos sistemas.

Los tokens no son "variables de CSS con nombres bonitos." Son el contrato que garantiza que lo que el diseñador configura en Webflow y lo que el código externo produce son exactamente la misma cosa. Sin ese contrato, la deriva entre sistemas es inevitable -- y es sutil, que es lo peor. Colores que se aproximan pero no coinciden. Espaciados que se parecen pero son distintos. Animaciones que tienen timing ligeramente diferente dependiendo de quién tocó qué.

```css tokens.css — comentario de cabecera en repo
/* Webflow — Design Tokens
   Sincronizan con el DS del cliente. Negro puro #000000 prohibido en texto. */

:root {
  --color-brand:        #FF6600;
  --color-brand-hover:  #e65c00;
  --color-violet:       #8023FF;
  --gradient-brand:     linear-gradient(90deg, #8023FF, #FF6600);

  /* Texto — #000000 prohibido, usar estos */
  --color-text-heading: #222020;
  --color-text-body:    #27272A;
  --color-text-muted:   #71717A;

  /* Espaciado */
  --space-1:  0.25rem;
  --space-2:  0.5rem;
  --space-4:  1rem;
  --space-8:  2rem;
  --space-16: 4rem;

  /* Movimiento */
  --ease-out:        cubic-bezier(0.16, 1, 0.3, 1);
  --duration-fast:   200ms;
  --duration-normal: 400ms;
}
```

Lo que me encanta de este archivo es que ==cada restricción está codificada, no documentada en otro lado.== El comentario "naranja es solo acento, nunca fondo ni CTA" no está en un Figma que alguien olvidó actualizar. Está en el mismo archivo que cualquier developer va a abrir la primera vez que toque el proyecto.

## El module loader: elegante por necesidad

> **En pocas palabras:** Cómo el sitio carga solo el JavaScript que cada página necesita en lugar de un script gigante en todas partes.
Webflow no tiene una forma nativa de decirle a JavaScript "inicializa este componente cuando aparezca en la página." La solución común es un archivo enorme que ejecuta todo en cada página -- lo cual es tanto ineficiente como frágil.

La solución que construí es un entry point de 54 líneas que hace una sola cosa: escanea el DOM, identifica qué módulos necesita la página actual, y los importa dinámicamente. Solo esos. Solo cuando los necesita.

```javascript site.js — entry v1.2.0 (repo de producción)
const modules = {
  'nav': () => import('./modules/nav.js'),
  'animations': () => import('./modules/animations.js'),
  'scroll-animations': () => import('./modules/scroll-animations.js'),
  'faq': () => import('./modules/faq.js'),
  'button-041': () => import('./modules/button-041.js'),
};

document.querySelectorAll('[data-module]').forEach(el => {
  const name = el.dataset.module;
  if (modules[name]) {
    modules[name]().then(m => m.init && m.init(el));
  }
});

const autoDetect = {
  '[data-button-041]': () => import('./modules/button-041.js'),
  '[data-css-marquee]': () => import('./modules/marquee.js'),
  '[data-menu-wrap]': () => import('./modules/mega-nav.js'),
  '[data-tabs-init]': () => import('./modules/tabs.js'),
  '[data-gsap-slider-init]': () => import('./modules/gsap-slider.js'),
};

Object.entries(autoDetect).forEach(([selector, loader]) => {
  if (document.querySelector(selector)) {
    loader().then(m => m.init && m.init(document));
  }
});
```

Sin bundler. Sin build step. ==Sin JavaScript viajando a páginas donde no se usa.== El navegador resuelve los imports ESM nativamente.

La distinción entre los dos patrones tiene una razón muy específica: ==Webflow no publica atributos data-* en el elemento raíz de componentes reutilizables.== Si pones `data-module="mi-componente"` en el root de un componente de Webflow, ese atributo simplemente desaparece después del publish. El patrón de autoDetect resuelve esto buscando selectores más adentro del árbol del DOM, donde Webflow sí los preserva.

## GSAP + Cloudflare Rocket Loader: el bug que solo existe en producción

> **En pocas palabras:** Historia real de lanzamiento: animaciones OK en staging y rotas en vivo por una función del hosting que nadie recordó.
Quiero hablar de este problema con algo de cariño porque fue el más frustrante de resolver y también el que más me enseñó sobre lo que significa hacer ingeniería de producción.

El setup es el siguiente: Webflow carga GSAP automáticamente desde su propio CDN. Nuestros módulos JS externos dependen de que `window.gsap` exista para inicializar. En local, en staging, en cualquier ambiente de prueba -- todo funciona perfectamente.

En producción, con [Cloudflare Rocket Loader](https://developers.cloudflare.com/speed/optimization/content/rocket-loader/) activo, ==las animaciones fallan silenciosamente en ~30% de las cargas.== La guía de Cloudflare pide marcar scripts críticos con [`data-cfasync="false"`](https://developers.cloudflare.com/speed/optimization/content/rocket-loader/ignore-javascripts/) — lo usamos en nuestro entry *y* seguimos con `waitForGSAP` porque el tag GSAP de Webflow es otro script que Rocket Loader puede diferir.

Sin error en consola. Sin mensaje. Las animaciones simplemente no aparecen.

> [!caution] Rocket Loader difiere la ejecución de todos los scripts externos de forma impredecible. Si tu módulo busca window.gsap al cargar, lo encontrará vacío el 30% de las veces.

La solución, una vez que entiendes la causa, es completamente obvia:

```javascript button-041.js — Rocket Loader + GSAP 3.15 de Webflow
function waitForGSAP(timeout = 5000) {
  return new Promise((resolve, reject) => {
    if (window.gsap) return resolve(window.gsap);
    const start = Date.now();
    const check = setInterval(() => {
      if (window.gsap) { clearInterval(check); resolve(window.gsap); }
      else if (Date.now() - start > timeout) {
        clearInterval(check);
        reject(new Error('[ds] gsap not found — Webflow GSAP may be disabled'));
      }
    }, 50);
  });
}
```

Lo que me importa de este ejemplo no es la función de polling -- eso es trivial. Lo que me importa es que esa función, y la explicación de por qué existe, vive en el CLAUDE.md del repositorio. No en un mensaje de Slack de hace ocho meses. ==Documentar las decisiones difíciles dentro del codebase es la diferencia entre un proyecto que escala y uno que solo funciona mientras la persona original está disponible.==

## El sistema de agentes: IA con restricciones explícitas

> **En pocas palabras:** Cómo los asistentes de IA reciben un reglamento para mejorar el repo en lugar de improvisar en Webflow.
El repositorio incluye un sistema de orquestación de agentes -- un conjunto de 34 skills organizadas en categorías con un ORCHESTRATOR que decide qué skills cargar según el tipo de tarea.

Pero antes de hablar de la implementación, necesito hablar de la filosofía detrás de ella.

La primera vez que dejé un agente de IA operar sobre el proyecto sin restricciones explícitas, tomó decisiones razonables. Código limpio, buenas prácticas generales, output que funcionaba. Y aun así estaba mal.

No mal como "roto" -- ==mal como "fuera de contexto."== El agente usó #000000 en un texto porque es el negro estándar. Puso `@latest` en la URL de un *asset* -- el único lugar donde cachea demasiado agresivamente -- porque es la forma más común. Modificó una página que no era la especificada porque asumió que era la principal.

Nada de eso es un error del agente. Es un error de diseño del sistema -- específicamente, un error de no haber diseñado el sistema con restricciones explícitas desde el inicio.

| Restricción | Dónde se aplica |
| --- | --- |
| Sin negro puro en texto | Codificado en tokens.css |
| Naranja solo como acento | Documentado en CLAUDE.md, validado por agente |
| @latest solo para el loader, nunca para assets | Regla en orquestador, bloqueado en review |
| GSAP debe verificar prefers-reduced-motion | Requerido en cada módulo de animación |
| Nunca publicar sin safe-publish | Regla del orquestador, no opcional |
| Nunca modificar página no especificada | Scope enforcement, pregunta antes de actuar |

El resultado es un agente que puedo dejar correr en tareas de CMS, auditorías de assets y deploys controlados sin revisar cada output línea por línea -- no porque confíe ciegamente, sino porque ==el sistema de restricciones hace que los errores sean detectables, reversibles y, la mayoría de las veces, imposibles.==

## Qué gana el equipo

> **En pocas palabras:** La ganancia organizacional: menos emergencias, ownership claro, campañas más rápidas.
Sin este workflow, cada semana aparecen interrupciones del tipo "oye, puedes cambiar este texto en Webflow?" que en realidad no son cambios de texto -- son cambios que alguien no se atreve a hacer solo porque la última vez que tocó algo en Webflow se rompió otra cosa. El developer se convierte en el guardián del sitio no porque sea necesario sino porque nadie tiene confianza en los límites del sistema.

Con este workflow, ==esa categoría de interrupción desaparece.== Marketing sabe exactamente qué puede tocar -- el Designer, el CMS, las páginas -- y sabe que sus cambios no van a romper nada del repositorio porque el repositorio es un sistema separado con su propio ciclo de vida. Engineering sabe que puede iterar en código con total confianza porque tiene git history, code review y rollback inmediato. Nadie bloquea a nadie.

En las primeras dos semanas después de dibujar el límite con claridad, esos pings dejaron de aparecer en standup -- no porque corrimos un estudio de tiempo formal, sino porque la categoría de miedo simplemente desapareció. Los cambios de copy salieron desde el CMS sin un hilo en Slack pidiendo una "revisión rápida." Los fixes de animación salieron por git y jsDelivr sin republish de Webflow. El argumento no necesita una hoja de horas ahorradas para ser creíble; se nota cuando el impuesto de coordinación ya no está.

## Cómo replicarlo en tu próximo proyecto

> **En pocas palabras:** Checklist práctica si quieres el mismo split en otro sitio Webflow.
- **Repositorio con estructura clara.** `src/css/` y `src/js/`. Dentro de CSS: `base/` para tokens, reset y utilidades; `sections/` para nav, hero, footer; `components/` para componentes con lógica propia. Un `site.css` como entry point que importa todo. Un `site.js` con el patrón de module loader. Si te saltas esta separación, cada feature nueva se vuelve una negociación ad-hoc sobre si vive en Webflow o en Git -- hasta que alguien rompe producción y nadie puede decir quién es dueño del fix.

```tree Estructura del repositorio
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
    { "category": "entry", "path": "", "files": ["loader.js (generado por CI)"] },
    { "category": "ci", "path": ".github/workflows/", "files": ["release.yml"] },
    { "category": "docs", "path": "", "files": ["CLAUDE.md", "ORCHESTRATOR.md", ".agents/skills/"] }
  ]
}
```

- **tokens.css primero, siempre.** Antes de escribir cualquier otro CSS, define tus tokens. Todos los valores de diseño viven aquí y solo aquí. Incluye comentarios que expliquen las restricciones, no solo los valores. Si los tokens viven en tres lugares (notas de Figma, estilos de Webflow y un CSS suelto), la deriva es inevitable; el primer redesign mandará dos naranjas ligeramente distintas y nadie sabrá cuál es la canónica.

- **Un loader diminuto en @latest, assets en tags inmutables.** Apunta Webflow una sola vez a `@latest/loader.js` y no vuelvas a tocar ese campo. El loader inyecta CSS/JS fijados a un tag `@vX.Y.Z`. No referencies assets con `@main` -- purgar el archivo no vuelve a resolver la rama, así que sirve commits viejos durante horas -- y nunca con `@latest`, que cachea el contenido del asset agresivamente. El tipo de referencia es una decisión por archivo, no una regla global.

- **Automatiza el release en CI.** Un GitHub Action convierte el deploy en un solo `git push`: sube el tag patch, regenera `loader.js` para apuntar a él, commitea, tagea, purga `@latest`, y verifica con reintentos que jsDelivr sirve la versión nueva. Sin esto, cada deploy es un purge manual que eventualmente olvidarás -- y un compañero "arreglará" algo que ya estaba arreglado pero atascado en cache.

- **CLAUDE.md en la raíz.** Documenta el contrato entre Webflow y el repositorio, las convenciones de naming, los patrones prohibidos con su justificación, el workflow de deploy, y las decisiones arquitectónicas con el contexto de por qué se tomaron así. Sin eso, la siguiente persona -- o el siguiente agente -- volverá a decidir cada límite desde cero, y tú serás el README viviente otra vez.

- **data-* como único mecanismo de activación.** Nunca uses clases de Webflow como selectores en JavaScript. Las clases cambian en redesigns. Los atributos `data-*` son contratos explícitos que Webflow preserva -- pero recuerda: pon tus atributos en elementos internos, no en el root del componente. Si amarras el JS a nombres de clase, la primera vez que alguien reorganice el Designer pasarás una hora rastreando por qué el módulo de nav dejó de disparar.

> [!tip] Todo el codebase externo de este sitio en producción tiene menos de 400 líneas de CSS y 300 de JavaScript. La arquitectura es deliberadamente mínima. La complejidad vive en las restricciones y el workflow, no en el código.

## Referencias (externas — para guardar)

> **En pocas palabras:** Docs de proveedores para equipos que validan el enfoque.
| Tema | Fuente |
|------|--------|
| Custom code en head/footer del sitio | [Webflow Help — Custom code in head and body](https://help.webflow.com/hc/en-us/articles/33961357265299-Custom-code-in-head-and-body-tags) |
| Límites de embed / custom code | [Webflow Help — Custom code embed](https://help.webflow.com/hc/en-us/articles/33961332238611-Custom-code-embed) |
| Límites de caracteres (contexto) | [Webflow Updates](https://webflow.com/updates/increased-custom-code-character-limit) |
| jsDelivr + GitHub (`@main`) | [jsDelivr — GitHub](https://www.jsdelivr.com/documentation#id-github) |
| Purge de cache tras deploy | [jsDelivr — Purge cache](https://www.jsdelivr.com/documentation#id-purge-cache) |
| Comportamiento Rocket Loader | [Cloudflare — Rocket Loader](https://developers.cloudflare.com/speed/optimization/content/rocket-loader/) |
| Excluir script de Rocket Loader | [Cloudflare — Ignore JavaScripts](https://developers.cloudflare.com/speed/optimization/content/rocket-loader/ignore-javascripts/) |
| Automatizar deploys en CI | [GitHub Actions documentation](https://docs.github.com/en/actions) |
| Registry estilo shadcn (paralelo con DS) | [shadcn/ui — Registry](https://ui.shadcn.com/docs/registry) |
| Estándar design tokens | [W3C — Design Tokens stable](https://www.w3.org/community/design-tokens/2025/10/28/design-tokens-specification-reaches-first-stable-version/) |
| Webflow para desarrolladores / API | [Webflow Developers](https://developers.webflow.com/) |

## El aprendizaje real

> **En pocas palabras:** Respeta la fortaleza de Webflow; pon el trabajo de ingeniería donde ya existen git y revisión.
Los proyectos de software fallan en los límites entre herramientas, no dentro de ellas. Webflow funciona. Git funciona. jsDelivr funciona. Los agentes de IA funcionan. ==El punto de falla es cuando no está claro quién es dueño de qué==, y dos sistemas terminan compitiendo sobre el mismo territorio sin reglas explícitas.

Diseñar ese límite desde el inicio no es sobreingeniería. Es exactamente el trabajo que hace que todo lo demás sea predecible -- que marketing pueda publicar con confianza, que engineering pueda iterar con confianza, que un agente de IA pueda operar con confianza, y que tú puedas irte de vacaciones sin dejar tu número de teléfono "por si algo se rompe."

Hay una frase que uso como estándar para evaluar si un sistema está bien diseñado: ==si el sistema requiere que estés disponible para que funcione, no es un sistema todavía -- es una dependencia personal.==

Un workflow es replicable cuando está documentado con suficiente contexto para que alguien que nunca trabajó en el proyecto pueda extenderlo sin romperlo. El conocimiento vive en el repositorio, en los tokens, en el CLAUDE.md. La siguiente persona hereda el sistema, no una deuda de preguntas sin responder.
