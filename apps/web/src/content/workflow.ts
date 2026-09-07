/**
 * Datos de la página de workflow (charla interna de Atom).
 *
 * Todo el texto visible vive en messages/{es,en}.json bajo el namespace
 * `workflow` y se lee con next-intl (`t.raw(...)`). Aquí solo quedan los datos
 * que no son lenguaje: las series de las gráficas.
 */

/** Pregunta del filtro; se fusiona con el flip 3D de RotatingSteps. */
export type WorkflowStep = {
  title: string
  description: string
}

/** Capa reutilizable: lo que se construyó una vez y ya no se vuelve a hacer. */
export type WorkflowLayerText = {
  title: string
  body: string
  /** Lo que esa capa ahorra en cada proyecto nuevo. */
  payoff: string
}

/** Paso de la aproximación a un problema, ya decidido que vale la pena. */
export type WorkflowApproachStep = {
  title: string
  description: string
  /** Qué puede hacer con ese paso alguien del equipo que no es técnico. */
  handoff: string
}

/**
 * Series de las dos gráficas de la sección del filtro. Los números son datos,
 * no idioma; las etiquetas de cada punto viven en los mensajes y se fusionan
 * por índice.
 *
 * ESTIMACIONES, no mediciones, y la nota al pie de cada gráfica lo dice. Las
 * del payoff están ancladas a hechos reales: el design system tomó siete meses
 * y una landing pasó de días a horas.
 */

/** Pareto: % acumulado del tiempo por tipo de pedido, de mayor a menor. */
export const PARETO_CUMULATIVE = [46, 71, 83, 90, 96, 100]

/** Contraste: cómo se vería el mismo eje si todos los pedidos pesaran igual. */
export const PARETO_EVEN = [16.7, 33.3, 50, 66.7, 83.3, 100]

/**
 * Horas acumuladas construyendo el UIKit, cada dos meses. Se aplana al séptimo
 * mes, cuando la herramienta queda lista.
 */
export const PAYOFF_INVESTED = [0, 70, 140, 205, 250, 272, 280]

/**
 * Horas acumuladas ahorradas por esa misma construcción: cada landing pasó de
 * días a horas, así que el ahorro se acelera conforme crece el volumen. Cruza
 * a la inversión cerca del mes nueve.
 */
export const PAYOFF_SAVED = [0, 10, 35, 85, 175, 300, 460]

/**
 * Shape por paso de la aproximación, elegido por lo que sugiere: conversación,
 * búsqueda, idea escrita y ensamblaje. Viven en public/shapes.
 */
export const APPROACH_STEP_SHAPES = [
  '/shapes/purple-chat.png',
  '/shapes/orange-pin.png',
  '/shapes/sparkle-circle.png',
  '/shapes/purple-gear.png',
]

/** Color de la serie protagonista; la de referencia usa el gris del tema. */
export const GRAPH_ACCENT_COLOR = 'var(--plantation)'
