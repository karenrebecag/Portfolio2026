/**
 * Caso de estudio / Articulo de portafolio
 *
 * Fuente de verdad para el proyecto "Context-Driven Visual Development".
 * Markdown limpio convertido a Lexical por markdown-to-lexical.ts.
 */

export const atomWebflowMeta = {
  id: '6',
  title: 'Context-Driven Visual Development',
  slug: 'context-driven-visual-development',
  status: 'published' as const,
  category: 'web' as const,
  role: 'Product Engineer & Webflow Architect',
  year: '2026',
  featured: true,
  summary: 'Exploración de Webflow como plataforma seria de desarrollo context-driven para el sitio principal de Atomchat (new.atomchat.io).',
  tags: [
    { tag: 'Webflow' },
    { tag: 'GSAP' },
    { tag: 'Design Systems' },
    { tag: 'AI Agents' },
    { tag: 'Hybrid Architecture' },
  ],
  liveUrl: 'https://new.atomchat.io',
  repoUrl: 'https://github.com/karenrebecag/AtomWebflow_2026Site',
  services: 'Webflow Architecture, Product Engineering, Design Systems',
  coverImage: {
    url: 'https://cdn.prod.website-files.com/6889f182607452ec007a0ae1/688a1e49a704afe5e3f4a55d_Fluid%20Abstract%20Design.avif',
    alt: 'Atom Webflow',
  },
  createdAt: '2026-06-01',
  updatedAt: '2026-06-01',
}

export const atomWebflowMarkdown = `
En el rediseño del sitio principal de Atomchat decidí usar Webflow de una forma poco convencional: como la base de una arquitectura de producto real, no solo como herramienta de prototipado o publicación rápida. El resultado fue una exploración práctica de lo que significa hacer "context-driven development" dentro de una plataforma visual.

## La promesa y la trampa del no-code

Webflow promete velocidad y autonomía: marketing puede cambiar textos, publicar páginas y gestionar CMS sin esperar un deploy. Esa promesa es real y poderosa. Pero cuando el proyecto requiere interacciones de alta fidelidad, un lenguaje visual estricto de marca y componentes que se comporten de forma predecible en múltiples contextos, la promesa choca con la realidad de que el código "custom" inline es difícil de versionar, revisar y mantener con calidad.

La pregunta que guió este trabajo fue: ¿y si en vez de pelearnos con las limitaciones, diseñáramos un sistema que aprovechara lo mejor de la plataforma visual y lo mejor de la ingeniería tradicional?

## Contexto como primera clase ciudadana

Lo más interesante no fue la arquitectura técnica en sí. Lo más interesante fue cómo todo el proceso de desarrollo se volvió "context-driven".

Antes de proponer cualquier componente o interacción, el flujo consultaba un conjunto explícito de fuentes de verdad: las reglas estrictas del sistema de marca (colores, tipografía, contraste, uso del naranja solo como acento), la documentación de arquitectura del proyecto, las lecciones aprendidas de iteraciones anteriores y un orquestador que indicaba qué herramientas y patrones aplicar según el tipo de tarea.

Esto transforma la relación con las herramientas de IA. En vez de pedirle al modelo que "haga un botón bonito", el contexto le dice: respeta esta paleta, este sistema de espaciado, esta decisión previa sobre animaciones, y además verifica contra las guías oficiales de marca antes de sugerir nada. El desarrollo deja de ser una serie de decisiones ad-hoc y se convierte en la aplicación consistente de un sistema de valores y restricciones.

## Híbrido que no obliga a elegir bando

El modelo que emergió es genuinamente híbrido: Webflow sigue siendo el lugar donde se define la estructura semántica, el CMS y el contenido que marketing necesita tocar a diario. El código de comportamiento avanzado (navegaciones complejas con intención de hover, animaciones de texto por carácter, paredes de logos que responden al viewport) vive en un repositorio Git, se versiona con tags y se carga de forma controlada.

Esto significa que un cambio de copy o la publicación de una nueva página no requiere coordinación con desarrollo. Y al mismo tiempo, las interacciones críticas mantienen coherencia, performance y accesibilidad porque están sujetas a revisión, pruebas y versionado real.

## Lo que este proyecto dice sobre el futuro

Webflow (y plataformas similares) pueden ser mucho más que herramientas de marketing cuando se les da una capa de ingeniería alrededor: contexto explícito, agentes que operan dentro de ese contexto, versionado externo y una clara separación de responsabilidades.

El verdadero avance no está en elegir entre visual o código. Está en construir sistemas donde el contexto —de marca, de arquitectura, de decisiones previas— sea tan fácil de consultar y tan presente en cada paso como lo es un design token o una variable de entorno.

Este caso no es sobre una tecnología específica. Es sobre tratar el desarrollo de producto como un ejercicio de orquestación de contexto, donde cada herramienta (visual builder, agente de IA, repositorio, sistema de marca) aporta su fuerza sin obligarnos a renunciar a la calidad ni a la velocidad.
`.trim()
