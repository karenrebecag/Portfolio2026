/**
 * One-off: insert plain-language line after each ## heading if missing.
 * Run: node scripts/add-section-plain-language.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectsDir = path.join(__dirname, '../src/content/projects')

/** @type {Record<string, Record<string, { en: string, es: string }>>} */
const SECTIONS = {
  aurin: {
    'First, why embedded chatbots break the stack': {
      en: 'Off-the-shelf chat tools install fast, but your team does not own bookings, calendars, or customer data when someone wants a real meeting.',
      es: 'Los chats empaquetados se instalan rápido, pero tu equipo no posee reservas, calendarios ni datos del cliente cuando alguien quiere una reunión de verdad.',
    },
    'Primero: por qué los chatbots embebidos rompen el stack': {
      en: '',
      es: 'Los chats empaquetados se instalan rápido, pero tu equipo no posee reservas, calendarios ni datos del cliente cuando alguien quiere una reunión de verdad.',
    },
    'The three-layer model': {
      en: 'Think browser, middle server, and automation brain — each with a clear job so one team can fix chat copy without breaking payments or secrets.',
      es: 'Piensa en navegador, servidor intermedio y cerebro de automatización — cada uno con un rol claro para que un cambio no rompa secretos ni reservas.',
    },
    'El modelo de tres capas': {
      en: '',
      es: 'Piensa en navegador, servidor intermedio y cerebro de automatización — cada uno con un rol claro para que un cambio no rompa secretos ni reservas.',
    },
    'Repository map': {
      en: 'A table of which files do what — useful if you are technical; skip if you only care about outcomes.',
      es: 'Tabla de qué archivo hace qué — útil si eres técnica; puedes saltarla si solo te importan resultados.',
    },
    'Mapa del repositorio': {
      en: '',
      es: 'Tabla de qué archivo hace qué — útil si eres técnica; puedes saltarla si solo te importan resultados.',
    },
    'Layer 2 — SSR proxy as security and product logic': {
      en: 'The website’s middle layer hides passwords and rules — like a receptionist who decides what the AI is allowed to do before it answers.',
      es: 'La capa intermedia del sitio oculta contraseñas y reglas — como una recepcionista que decide qué puede hacer la IA antes de responder.',
    },
    'Capa 2 — Proxy SSR como seguridad y lógica de producto': {
      en: '',
      es: 'La capa intermedia del sitio oculta contraseñas y reglas — como una recepcionista que decide qué puede hacer la IA antes de responder.',
    },
    'Layer 1 — Session, resilience, and SSR safety': {
      en: 'What happens in the visitor’s browser when Wi‑Fi drops or the tab reloads — keeping the conversation from resetting randomly.',
      es: 'Qué pasa en el navegador del visitante si se cae el Wi‑Fi o recarga la pestaña — para que la conversación no se reinicie al azar.',
    },
    'Capa 1 — Sesión, resiliencia y seguridad SSR': {
      en: '',
      es: 'Qué pasa en el navegador del visitante si se cae el Wi‑Fi o recarga la pestaña — para que la conversación no se reinicie al azar.',
    },
    'Distributed intent detection — booking state in the frontend': {
      en: 'How the site knows someone is trying to book a call even when the AI speaks in friendly sentences, not database codes.',
      es: 'Cómo el sitio sabe que alguien quiere agendar aunque la IA hable con frases amables, no con códigos de sistema.',
    },
    'Detección distribuida de intents — estado de booking en el frontend': {
      en: '',
      es: 'Cómo el sitio sabe que alguien quiere agendar aunque la IA hable con frases amables, no con códigos de sistema.',
    },
    'Detección de intents distribuida — el estado del booking en el frontend': {
      en: '',
      es: 'Cómo el sitio sabe que alguien quiere agendar aunque la IA hable con frases amables, no con códigos de sistema.',
    },
    'Layer 3 — Self-hosted n8n on a VPS': {
      en: 'Where the “thinking” and workflow live on infrastructure the client pays for — and what breaks if someone forgets to turn the workflow on.',
      es: 'Dónde vive el “pensamiento” y el flujo en infraestructura propia — y qué se rompe si alguien olvida activar el workflow.',
    },
    'Capa 3 — n8n self-hosted en un VPS': {
      en: '',
      es: 'Dónde vive el “pensamiento” y el flujo en infraestructura propia — y qué se rompe si alguien olvida activar el workflow.',
    },
    'Capa 3 — n8n self-hosted en VPS': {
      en: '',
      es: 'Dónde vive el “pensamiento” y el flujo en infraestructura propia — y qué se rompe si alguien olvida activar el workflow.',
    },
    'Spanish and English on the same stack': {
      en: 'How bilingual marketing pages and one chat experience stay aligned without duplicating entire products per language.',
      es: 'Cómo páginas bilingües y un solo chat se mantienen alineados sin duplicar productos enteros por idioma.',
    },
    'Español e inglés en el mismo stack': {
      en: '',
      es: 'Cómo páginas bilingües y un solo chat se mantienen alineados sin duplicar productos enteros por idioma.',
    },
    'Payload CMS and what the agent actually knows': {
      en: 'Who updates website copy versus who updates what the bot is allowed to say — and why those are intentionally separate today.',
      es: 'Quién actualiza el copy del sitio versus qué puede decir el bot — y por qué hoy esas dos cosas van separadas a propósito.',
    },
    'Payload CMS y qué sabe realmente el agente': {
      en: '',
      es: 'Quién actualiza el copy del sitio versus qué puede decir el bot — y por qué hoy esas dos cosas van separadas a propósito.',
    },
    'What I would do again (and what I would tighten)': {
      en: 'Honest retrospective: what paid off for the business and what I would formalize next for fewer surprises.',
      es: 'Retro honesta: qué funcionó para el negocio y qué formalizaría después para menos sorpresas.',
    },
    'Qué repetiría (y qué apretaría)': {
      en: '',
      es: 'Retro honesta: qué funcionó para el negocio y qué formalizaría después para menos sorpresas.',
    },
    'References (external — worth bookmarking)': {
      en: 'Official documentation links for readers who want to verify claims or brief their engineering team.',
      es: 'Enlaces a documentación oficial para quien quiera verificar afirmaciones o informar a ingeniería.',
    },
    'Referencias (externas — para guardar)': {
      en: '',
      es: 'Enlaces a documentación oficial para quien quiera verificar afirmaciones o informar a ingeniería.',
    },
    Closing: {
      en: 'The business takeaway: own the conversation path instead of renting a black box.',
      es: 'Conclusión de negocio: poseer el camino de la conversación en lugar de alquilar una caja negra.',
    },
    Cierre: {
      en: '',
      es: 'Conclusión de negocio: poseer el camino de la conversación en lugar de alquilar una caja negra.',
    },
  },
  atom: {
    'First, understanding why Webflow behaves this way': {
      en: 'Webflow is built for marketers, not for complex app logic — and that is fine until a project crosses the line.',
      es: 'Webflow está hecho para marketing, no para lógica de app compleja — y eso está bien hasta que el proyecto cruza la línea.',
    },
    'Primero, entender por qué Webflow se comporta así': {
      en: '',
      es: 'Webflow está hecho para marketing, no para lógica de app compleja — y eso está bien hasta que el proyecto cruza la línea.',
    },
    'The core idea: dual control': {
      en: 'Marketing keeps the website; engineering keeps code in git — two lanes that do not block each other.',
      es: 'Marketing conserva el sitio; ingeniería conserva el código en git — dos carriles que no se bloquean.',
    },
    'La idea central: control dual': {
      en: '',
      es: 'Marketing conserva el sitio; ingeniería conserva el código en git — dos carriles que no se bloquean.',
    },
    'Repository map — documentation that enforces the contract': {
      en: 'Where the written rules live so new teammates (human or AI) do not paste code into the wrong place.',
      es: 'Dónde viven las reglas escritas para que equipos nuevos (humanos o IA) no peguen código donde no toca.',
    },
    'Mapa del repositorio — documentación que hace cumplir el contrato': {
      en: '',
      es: 'Dónde viven las reglas escritas para que equipos nuevos (humanos o IA) no peguen código donde no toca.',
    },
    'Why @main and not @latest': {
      en: 'A boring CDN choice that prevents surprise breakages when someone publishes unrelated work.',
      es: 'Una decisión aburrida de CDN que evita roturas sorpresa cuando alguien publica trabajo no relacionado.',
    },
    'Por qué @main y no @latest': {
      en: '',
      es: 'Una decisión aburrida de CDN que evita roturas sorpresa cuando alguien publica trabajo no relacionado.',
    },
    'Design tokens: the only shared artifact': {
      en: 'Colors and spacing both sides agree on — the handshake between design and the live site.',
      es: 'Colores y espaciados que ambos lados respetan — el apretón de manos entre diseño y sitio en vivo.',
    },
    'Design tokens: el único artefacto compartido': {
      en: '',
      es: 'Colores y espaciados que ambos lados respetan — el apretón de manos entre diseño y sitio en vivo.',
    },
    'The module loader: elegant by necessity': {
      en: 'How the site loads only the JavaScript each page needs instead of one giant script everywhere.',
      es: 'Cómo el sitio carga solo el JavaScript que cada página necesita en lugar de un script gigante en todas partes.',
    },
    'El module loader: elegante por necesidad': {
      en: '',
      es: 'Cómo el sitio carga solo el JavaScript que cada página necesita en lugar de un script gigante en todas partes.',
    },
    'GSAP + Cloudflare Rocket Loader: the bug that only exists in production': {
      en: 'A real launch story: animations worked in staging and broke live because of a hosting feature nobody remembered.',
      es: 'Historia real de lanzamiento: animaciones OK en staging y rotas en vivo por una función del hosting que nadie recordó.',
    },
    'GSAP + Cloudflare Rocket Loader: el bug que solo existe en producción': {
      en: '',
      es: 'Historia real de lanzamiento: animaciones OK en staging y rotas en vivo por una función del hosting que nadie recordó.',
    },
    'The agent system: AI with explicit constraints': {
      en: 'How AI helpers get a rulebook so they improve the repo instead of improvising in Webflow.',
      es: 'Cómo los asistentes de IA reciben un reglamento para mejorar el repo en lugar de improvisar en Webflow.',
    },
    'El sistema de agentes: IA con restricciones explícitas': {
      en: '',
      es: 'Cómo los asistentes de IA reciben un reglamento para mejorar el repo en lugar de improvisar en Webflow.',
    },
    'What the team gains': {
      en: 'The organizational win: fewer emergencies, clearer ownership, faster campaigns.',
      es: 'La ganancia organizacional: menos emergencias, ownership claro, campañas más rápidas.',
    },
    'Qué gana el equipo': {
      en: '',
      es: 'La ganancia organizacional: menos emergencias, ownership claro, campañas más rápidas.',
    },
    'How to replicate it on your next project': {
      en: 'A practical checklist if you want the same split on another Webflow site.',
      es: 'Checklist práctica si quieres el mismo split en otro sitio Webflow.',
    },
    'Cómo replicarlo en tu próximo proyecto': {
      en: '',
      es: 'Checklist práctica si quieres el mismo split en otro sitio Webflow.',
    },
    'References (external — worth bookmarking)': {
      en: 'Vendor docs for teams validating the approach.',
      es: 'Docs de proveedores para equipos que validan el enfoque.',
    },
    'Referencias (externas — para guardar)': {
      en: '',
      es: 'Docs de proveedores para equipos que validan el enfoque.',
    },
    'The real takeaway': {
      en: 'Respect Webflow’s strength; put engineering work where git and review already exist.',
      es: 'Respeta la fortaleza de Webflow; pon el trabajo de ingeniería donde ya existen git y revisión.',
    },
    'La conclusión real': {
      en: '',
      es: 'Respeta la fortaleza de Webflow; pon el trabajo de ingeniería donde ya existen git y revisión.',
    },
    'El aprendizaje real': {
      en: '',
      es: 'Respeta la fortaleza de Webflow; pon el trabajo de ingeniería donde ya existen git y revisión.',
    },
  },
  ds: {
    'Where this started: a company that vibecodes': {
      en: 'Everyone was generating UI with AI; engineering kept fixing the same visual drift on marketing pages.',
      es: 'Todos generaban UI con IA; ingeniería seguía corrigiendo el mismo desvío visual en páginas de marketing.',
    },
    'Dónde empezó esto: una empresa que vibecodea': {
      en: '',
      es: 'Todos generaban UI con IA; ingeniería seguía corrigiendo el mismo desvío visual en páginas de marketing.',
    },
    'First: a design system designed for non-human readers': {
      en: 'Simplifying the rulebook so humans and AI pick the same colors and spacing the first time.',
      es: 'Simplificar el reglamento para que humanos e IA elijan los mismos colores y espaciados a la primera.',
    },
    'Primero: un design system pensado para lectores no humanos': {
      en: '',
      es: 'Simplificar el reglamento para que humanos e IA elijan los mismos colores y espaciados a la primera.',
    },
    'Primero: un design system diseñado para lectores que no son humanos': {
      en: '',
      es: 'Simplificar el reglamento para que humanos e IA elijan los mismos colores y espaciados a la primera.',
    },
    'Distribución shadcn, no npm': {
      en: '',
      es: 'Por qué los componentes viven como archivos visibles en lugar de un paquete oculto que la IA no puede inspeccionar.',
    },
    'shadcn distribution, not npm': {
      en: 'Why components live as visible source files instead of a hidden package AI cannot inspect.',
      es: 'Por qué los componentes viven como archivos visibles en lugar de un paquete oculto que la IA no puede inspeccionar.',
    },
    'Multi-repo documentation map': {
      en: 'Which repository holds tokens, components, and the agent bridge — skip if you are not implementing.',
      es: 'Qué repositorio guarda tokens, componentes y el puente del agente — sáltalo si no vas a implementar.',
    },
    'Mapa de documentación multi-repo': {
      en: '',
      es: 'Qué repositorio guarda tokens, componentes y el puente del agente — sáltalo si no vas a implementar.',
    },
    'Tokens as a contract, not as pretty variables': {
      en: 'Brand rules written so mistakes are obvious, not subtle.',
      es: 'Reglas de marca escritas para que los errores se noten, no se escondan.',
    },
    'Tokens como contrato, no como variables bonitas': {
      en: '',
      es: 'Reglas de marca escritas para que los errores se noten, no se escondan.',
    },
    'Los tokens como contrato, no como variables bonitas': {
      en: '',
      es: 'Reglas de marca escritas para que los errores se noten, no se escondan.',
    },
    'Second problem: the agents hallucinated anyway': {
      en: 'Even with good docs, AI still invented components until we changed what it was allowed to touch.',
      es: 'Aun con buena documentación, la IA seguía inventando componentes hasta cambiar qué podía tocar.',
    },
    'Segundo problema: los agentes alucinaban igual': {
      en: '',
      es: 'Aun con buena documentación, la IA seguía inventando componentes hasta cambiar qué podía tocar.',
    },
    'Segundo problema: los agentes alucinaban de todos modos': {
      en: '',
      es: 'Aun con buena documentación, la IA seguía inventando componentes hasta cambiar qué podía tocar.',
    },
    'The core idea: separate what an agent can know from what it can do': {
      en: 'Like a library catalog versus the keys to the archive — browse freely, change only through approved tools.',
      es: 'Como catálogo de biblioteca versus llaves del archivo — mirar libre, cambiar solo con herramientas aprobadas.',
    },
    'La idea central: separar lo que un agente puede saber de lo que puede hacer': {
      en: '',
      es: 'Como catálogo de biblioteca versus llaves del archivo — mirar libre, cambiar solo con herramientas aprobadas.',
    },
    'Fifth layer: who is allowed to connect (Clerk, OAuth, company-only)': {
      en: 'Who may plug an AI tool into the design system at all — an access decision, not a design detail.',
      es: 'Quién puede conectar una herramienta de IA al design system — decisión de acceso, no detalle de diseño.',
    },
    'Quinta capa: quién puede conectar (Clerk, OAuth, solo empresa)': {
      en: '',
      es: 'Quién puede conectar una herramienta de IA al design system — decisión de acceso, no detalle de diseño.',
    },
    'Quinta capa: quién puede conectarse (Clerk, OAuth, solo la empresa)': {
      en: '',
      es: 'Quién puede conectar una herramienta de IA al design system — decisión de acceso, no detalle de diseño.',
    },
    'Third problem: my own architecture had the truth duplicated': {
      en: 'Three places claimed to be “the list of components” — a recipe for silent drift.',
      es: 'Tres sitios decían ser “la lista de componentes” — receta para desvío silencioso.',
    },
    'Tercer problema: mi arquitectura tenía la verdad duplicada': {
      en: '',
      es: 'Tres sitios decían ser “la lista de componentes” — receta para desvío silencioso.',
    },
    'The detail that signals maturity: build-time sync': {
      en: 'Automated checks so the catalog and the real code cannot disagree for long.',
      es: 'Chequeos automáticos para que catálogo y código real no se contradigan mucho tiempo.',
    },
    'El detalle que marca madurez: sync en build': {
      en: '',
      es: 'Chequeos automáticos para que catálogo y código real no se contradigan mucho tiempo.',
    },
    'El detalle que comunica madurez: build-time sync': {
      en: '',
      es: 'Chequeos automáticos para que catálogo y código real no se contradigan mucho tiempo.',
    },
    'What changed in how I think': {
      en: 'Mindset shift for leaders funding design systems in AI-heavy teams.',
      es: 'Cambio de mentalidad para quienes financian design systems en equipos con mucha IA.',
    },
    'Qué cambió en cómo pienso': {
      en: '',
      es: 'Cambio de mentalidad para quienes financian design systems en equipos con mucha IA.',
    },
    'How to replicate it in your next design system': {
      en: 'Starter steps if you want the same guardrails without copying every technical choice.',
      es: 'Pasos iniciales si quieres las mismas barandillas sin copiar cada decisión técnica.',
    },
    'Cómo replicarlo en tu próximo design system': {
      en: '',
      es: 'Pasos iniciales si quieres las mismas barandillas sin copiar cada decisión técnica.',
    },
    'References (external — worth bookmarking)': {
      en: 'Industry references behind the MCP and token decisions.',
      es: 'Referencias de industria detrás de las decisiones de MCP y tokens.',
    },
    'Referencias (externas — para guardar)': {
      en: '',
      es: 'Referencias de industria detrás de las decisiones de MCP y tokens.',
    },
    'The real lesson': {
      en: 'A design system for AI-era teams is a permissions story as much as a color palette.',
      es: 'Un design system para equipos con IA es historia de permisos tanto como de paleta.',
    },
    'La lección real': {
      en: '',
      es: 'Un design system para equipos con IA es historia de permisos tanto como de paleta.',
    },
    'El aprendizaje real': {
      en: '',
      es: 'Un design system para equipos con IA es historia de permisos tanto como de paleta.',
    },
  },
  cdd: {
    'What the industry taught me about developing with AI': {
      en: 'How the conversation moved from “fun demos” to “who owns the rules when everyone codes with AI.”',
      es: 'Cómo pasó la conversación de “demos divertidos” a “quién posee las reglas cuando todos codean con IA”.',
    },
    'Lo que la industria me enseñó sobre desarrollar con IA': {
      en: '',
      es: 'Cómo pasó la conversación de “demos divertidos” a “quién posee las reglas cuando todos codean con IA”.',
    },
    'The problem with vibecoding without context': {
      en: 'Symptoms hiring managers recognize: repeated rework, mysterious breakages, nobody sure what changed last week.',
      es: 'Síntomas que reconocen hiring managers: retrabajo, roturas misteriosas, nadie seguro de qué cambió la semana pasada.',
    },
    'El problema con el vibecoding sin contexto': {
      en: '',
      es: 'Síntomas que reconocen hiring managers: retrabajo, roturas misteriosas, nadie seguro de qué cambió la semana pasada.',
    },
    'El problema con vibecodear sin contexto': {
      en: '',
      es: 'Síntomas que reconocen hiring managers: retrabajo, roturas misteriosas, nadie seguro de qué cambió la semana pasada.',
    },
    'Enabling vibecoding inside client companies': {
      en: 'What changes when product and growth can ship inside guardrails instead of throwing work over the wall to engineering.',
      es: 'Qué cambia cuando producto y growth publican dentro de barandillas en lugar de tirar todo a ingeniería.',
    },
    'Habilitar vibecoding dentro de empresas cliente': {
      en: '',
      es: 'Qué cambia cuando producto y growth publican dentro de barandillas en lugar de tirar todo a ingeniería.',
    },
    'Habilitar el vibecoding dentro de empresas cliente': {
      en: '',
      es: 'Qué cambia cuando producto y growth publican dentro de barandillas en lugar de tirar todo a ingeniería.',
    },
    'The spec-and-orchestration phase (hours before a single line of code)': {
      en: 'The unglamorous planning hours that prevent expensive AI rewrites later.',
      es: 'Las horas de planificación poco glamorosas que evitan reescrituras caras de IA después.',
    },
    'La fase de specs y orquestación (horas antes de la primera línea de código)': {
      en: '',
      es: 'Las horas de planificación poco glamorosas que evitan reescrituras caras de IA después.',
    },
    'A workshop story: the migration that looked fine': {
      en: 'A true classroom moment: green checkmarks in the UI hid a database history mess.',
      es: 'Momento real en taller: palomitas en la UI escondían un desorden en el historial de base de datos.',
    },
    'Una historia de taller: la migración que se veía bien': {
      en: '',
      es: 'Momento real en taller: palomitas en la UI escondían un desorden en el historial de base de datos.',
    },
    'Historia de taller: la migración que se veía bien': {
      en: '',
      es: 'Momento real en taller: palomitas en la UI escondían un desorden en el historial de base de datos.',
    },
    'How this differs from my other context pieces': {
      en: 'Where this article sits next to Webflow and design-system work — different problem, same discipline.',
      es: 'Dónde encaja esta pieza junto al trabajo Webflow y design system — problema distinto, misma disciplina.',
    },
    'Cómo se diferencia de mis otras piezas de contexto': {
      en: '',
      es: 'Dónde encaja esta pieza junto al trabajo Webflow y design system — problema distinto, misma disciplina.',
    },
    'What I would do again (and what I am tightening)': {
      en: 'Lessons for leaders budgeting workshops and engineering oversight.',
      es: 'Lecciones para quienes presupuestan talleres y supervisión de ingeniería.',
    },
    'Qué repetiría (y qué estoy apretando)': {
      en: '',
      es: 'Lecciones para quienes presupuestan talleres y supervisión de ingeniería.',
    },
    'References (current, worth bookmarking)': {
      en: 'Sources I cite when teaching or defending the approach to executives.',
      es: 'Fuentes que cito al enseñar o defender el enfoque ante ejecutivos.',
    },
    'Referencias (actuales — para guardar)': {
      en: '',
      es: 'Fuentes que cito al enseñar o defender el enfoque ante ejecutivos.',
    },
    'Referencias (actuales, para guardar)': {
      en: '',
      es: 'Fuentes que cito al enseñar o defender el enfoque ante ejecutivos.',
    },
    Closing: {
      en: 'Fast AI coding plus shared rules beats either extreme: ban AI or trust it blindly.',
      es: 'Codificación rápida con IA más reglas compartidas vence los extremos: prohibir IA o confiar a ciegas.',
    },
    Cierre: {
      en: '',
      es: 'Codificación rápida con IA más reglas compartidas vence los extremos: prohibir IA o confiar a ciegas.',
    },
  },
  decoupled: {
    'Decoupling is not the same as "more services"': {
      en: 'More microservices is not automatically more freedom — the goal is fewer surprise side effects.',
      es: 'Más microservicios no es automáticamente más libertad — el objetivo es menos efectos secundarios sorpresa.',
    },
    'Desacoplar no es lo mismo que "más servicios"': {
      en: '',
      es: 'Más microservicios no es automáticamente más libertad — el objetivo es menos efectos secundarios sorpresa.',
    },
    'The ownership model: three planes': {
      en: 'Three zones: what marketing edits, what money touches, what lawyers care about — kept apart on purpose.',
      es: 'Tres zonas: lo que edita marketing, lo que toca dinero, lo que importa a legal — separadas a propósito.',
    },
    'El modelo de ownership: tres planos': {
      en: '',
      es: 'Tres zonas: lo que edita marketing, lo que toca dinero, lo que importa a legal — separadas a propósito.',
    },
    'Team Topologies mapped to software boundaries': {
      en: 'How org chart and system diagram should rhyme so teams do not step on each other.',
      es: 'Cómo organigrama y diagrama deberían rimar para que los equipos no se pisen.',
    },
    'Team Topologies mapeado a límites de software': {
      en: '',
      es: 'Cómo organigrama y diagrama deberían rimar para que los equipos no se pisen.',
    },
    'Team Topologies aplicado a límites de software': {
      en: '',
      es: 'Cómo organigrama y diagrama deberían rimar para que los equipos no se pisen.',
    },
    'Patterns that implement ownership decoupling': {
      en: 'Concrete patterns (headless CMS, API middle layer, row-level security) in plain business language.',
      es: 'Patrones concretos (CMS headless, capa API, seguridad por fila) en lenguaje de negocio.',
    },
    'Patrones que implementan desacople por ownership': {
      en: '',
      es: 'Patrones concretos (CMS headless, capa API, seguridad por fila) en lenguaje de negocio.',
    },
    'Patrones que implementan desacoplamiento por ownership': {
      en: '',
      es: 'Patrones concretos (CMS headless, capa API, seguridad por fila) en lenguaje de negocio.',
    },
    'Failure modes architects should recognize': {
      en: 'Red flags in reviews — when “decoupled” still means one team blocks another.',
      es: 'Banderas rojas en reviews — cuando “desacoplado” sigue significando que un equipo bloquea a otro.',
    },
    'Modos de fallo que arquitectos deben reconocer': {
      en: '',
      es: 'Banderas rojas en reviews — cuando “desacoplado” sigue significando que un equipo bloquea a otro.',
    },
    'Modos de fallo que el arquitecto debe reconocer': {
      en: '',
      es: 'Banderas rojas en reviews — cuando “desacoplado” sigue significando que un equipo bloquea a otro.',
    },
    'Compliance as an architectural constraint (not a legal footnote)': {
      en: 'Privacy law shapes where data lives — not something you paste on at the end.',
      es: 'La ley de privacidad define dónde viven los datos — no algo que pegas al final.',
    },
    'Compliance como restricción arquitectónica (no nota legal al pie)': {
      en: '',
      es: 'La ley de privacidad define dónde viven los datos — no algo que pegas al final.',
    },
    'Reference architecture: regulated LMS (from proposal)': {
      en: 'Example: financial education in Brazil — marketing site separate from enrollments and payments.',
      es: 'Ejemplo: educación financiera en Brasil — sitio de marketing separado de matrículas y pagos.',
    },
    'Arquitectura de referencia: LMS regulado (desde propuesta)': {
      en: '',
      es: 'Ejemplo: educación financiera en Brasil — sitio de marketing separado de matrículas y pagos.',
    },
    'Reference architecture: editorial vs automation (production site)': {
      en: 'Example: live marketing site where editors publish copy and automation handles chat separately.',
      es: 'Ejemplo: sitio en vivo donde editores publican copy y la automatización del chat va aparte.',
    },
    'Arquitectura de referencia: editorial vs automatización (sitio en producción)': {
      en: '',
      es: 'Ejemplo: sitio en vivo donde editores publican copy y la automatización del chat va aparte.',
    },
    'Checklist: architecture review before build': {
      en: 'Questions to ask in the room before anyone commits to a vendor stack.',
      es: 'Preguntas para la sala antes de que alguien se comprometa con un stack de proveedores.',
    },
    'Checklist: revisión de arquitectura antes de construir': {
      en: '',
      es: 'Preguntas para la sala antes de que alguien se comprometa con un stack de proveedores.',
    },
    'Checklist: revision de arquitectura antes de construir': {
      en: '',
      es: 'Preguntas para la sala antes de que alguien se comprometa con un stack de proveedores.',
    },
    'What to measure after launch': {
      en: 'Simple metrics executives can track — not only uptime charts for engineers.',
      es: 'Métricas simples que ejecutivos pueden seguir — no solo gráficas de uptime para ingeniería.',
    },
    'Qué medir después del lanzamiento': {
      en: '',
      es: 'Métricas simples que ejecutivos pueden seguir — no solo gráficas de uptime para ingeniería.',
    },
    'References (external — core reading)': {
      en: 'Foundational reading if you want to go deeper with your architecture team.',
      es: 'Lectura base si quieres profundizar con tu equipo de arquitectura.',
    },
    'Referencias (externas — lectura núcleo)': {
      en: '',
      es: 'Lectura base si quieres profundizar con tu equipo de arquitectura.',
    },
    Closing: {
      en: 'Pick boundaries by who must change what — frameworks come second.',
      es: 'Elige límites por quién debe cambiar qué — los frameworks van después.',
    },
    Cierre: {
      en: '',
      es: 'Elige límites por quién debe cambiar qué — los frameworks van después.',
    },
  },
}

const FILE_MAP = [
  ['aurin-chatbot-three-layer-en.md', 'aurin', 'en'],
  ['aurin-chatbot-three-layer-es.md', 'aurin', 'es'],
  ['atom-webflow-en.md', 'atom', 'en'],
  ['atom-webflow-es.md', 'atom', 'es'],
  ['design-system-ships-itself-en.md', 'ds', 'en'],
  ['design-system-ships-itself-es.md', 'ds', 'es'],
  ['context-driven-vibecoding-en.md', 'cdd', 'en'],
  ['context-driven-vibecoding-es.md', 'cdd', 'es'],
  ['decoupled-ownership-platforms-en.md', 'decoupled', 'en'],
  ['decoupled-ownership-platforms-es.md', 'decoupled', 'es'],
]

function getIntro(group, title, lang) {
  const entry = SECTIONS[group]?.[title]
  if (!entry) return null
  const text = lang === 'en' ? entry.en : entry.es
  if (!text) return null
  const label = lang === 'en' ? 'In plain terms' : 'En pocas palabras'
  return `> **${label}:** ${text}\n\n`
}

function processFile(filename, group, lang) {
  const filePath = path.join(projectsDir, filename)
  let content = fs.readFileSync(filePath, 'utf8')
  const lines = content.split('\n')
  const out = []
  let i = 0
  let inserted = 0
  while (i < lines.length) {
    out.push(lines[i])
    const m = lines[i].match(/^## (.+)$/)
    if (m) {
      const title = m[1]
      i++
      // skip blank lines after heading
      const blanks = []
      while (i < lines.length && lines[i].trim() === '') {
        blanks.push(lines[i])
        i++
      }
      // already has plain language?
      const next = lines[i] ?? ''
      if (
        next.includes('In plain terms') ||
        next.includes('En pocas palabras')
      ) {
        out.push(...blanks, next)
        i++
        continue
      }
      const intro = getIntro(group, title, lang)
      if (intro) {
        out.push(...blanks)
        out.push(intro.trimEnd())
        inserted++
      } else {
        out.push(...blanks)
        console.warn(`  missing intro: ${filename} :: ${title}`)
      }
      continue
    }
    i++
  }
  fs.writeFileSync(filePath, out.join('\n'))
  return inserted
}

let total = 0
for (const [file, group, lang] of FILE_MAP) {
  const n = processFile(file, group, lang)
  console.log(`${file}: ${n} intros`)
  total += n
}
console.log(`Total: ${total}`)