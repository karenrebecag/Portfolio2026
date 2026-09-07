/**
 * Datos de la página de propuesta de servicios.
 *
 * Todo el texto visible vive en messages/{es,en}.json bajo el namespace
 * `proposals` y se lee con next-intl (`t.raw(...)`). Aquí solo quedan los datos
 * de presentación que no son lenguaje: gradientes y el flag de paquete destacado.
 */

export type ProposalService = {
  title: string
  /** Línea de posicionamiento: para quién está pensado el servicio. */
  tagline: string
  /** Bullets de "qué incluye". */
  includes: string[]
  /** Etiqueta corta para la meta de la card (efecto fan). */
  category: string
}

/** Texto del paquete (proveniente de los mensajes); el estilo se fusiona aparte. */
export type ProposalPackageText = {
  name: string
  /** One-liner comercial (subtítulo de la card). */
  tagline: string
  /** Posicionamiento: para quién es el tier. */
  audience: string
  /** Encabezado de la lista, con la nota de herencia entre tiers. */
  includesLabel: string
  features: string[]
  /** Aclaración de alcance al pie de la card; opcional, solo en tiers que la necesitan. */
  disclaimer?: string
  /** Nota al pie de la card (syncs, visitas, acompañamiento); opcional. */
  footerNote?: string
  ctaLabel: string
}

/**
 * Estilo de cada paquete, fusionado por índice con el texto de los mensajes.
 * `gradient.bg` es un linear-gradient del pack "Gradient Abstract Geometric
 * Shapes"; `gradient.text` es el color de texto oscuro de la misma familia.
 * `featured` resalta el paquete recomendado en el grid.
 */
export type ProposalPackagePresentation = {
  featured?: boolean
  /** Precio mensual en MXN (dato, no idioma). */
  priceMonthly: number
  /**
   * Tiers medidos por unidad: proyectos base incluidos por mes.
   * El precio por proyecto extra = total ÷ projectsPerMonth.
   */
  projectsPerMonth?: number
  /**
   * Tiers medidos por capacidad: horas de ingeniería incluidas por mes.
   * El precio por hora extra = total ÷ hoursPerMonth. Excluye projectsPerMonth.
   */
  hoursPerMonth?: number
  /** Tiers que incluyen visita semanal opcional al studio. */
  weeklyVisit?: boolean
  gradient: { bg: string; text: string }
}

export type ProposalPackage = ProposalPackageText & ProposalPackagePresentation

/** Paquete con strings de pricing ya formateados (construidos en la página). */
export type ProposalPackageView = ProposalPackage & {
  /** Precio mensual formateado para el odometer, ej. "$20,000". */
  priceValue: string
  /** Unidad bajo el precio, ej. "MXN / mes". */
  priceUnit: string
  /** Nota del costo por proyecto adicional (precio ÷ projectsPerMonth). */
  extraProjectNote: string
  /** Cupo mensual de proyectos incluidos, ej. "5 proyectos / mes". */
  projectsIncludedNote: string
  /** Nota de visita semanal, presente solo en los tiers que la incluyen. */
  weeklyVisitNote?: string
}

export type ProposalProcessStep = {
  step: string
  title: string
  description: string
}

export type ProposalFaq = {
  q: string
  /** Una respuesta de un párrafo, o varios párrafos. */
  a: string | string[]
}

export type ProposalProjectPricingText = {
  title: string
  tagline: string
  includes: string[]
  category: string
  /** One-liner de "para quién es este proyecto", al pie de la card. */
  audience: string
  /** Entrega estimada, mostrada bajo el precio, ej. "Entrega estimada: 2–3 semanas". */
  timeline: string
}

export type ProposalProjectPricingPresentation = {
  /** Precio fijo en MXN por proyecto. Con `priceMax`, es el piso de un rango. */
  price: number
  /**
   * Techo del rango (MXN). Solo en proyectos cotizados como estimado con dos
   * alcances (ej. jamstack vs. e-commerce): la card muestra `price – priceMax`.
   */
  priceMax?: number
  /**
   * Estilo de la card, del mismo pack "Gradient Abstract Geometric Shapes"
   * usado en services-fan-cards y en las packages de pigmento-studio.
   * `gradient.text` es el color oscuro de la misma familia. No son tokens de
   * tema (igual que ahí): es decoración de marca, no theming.
   */
  gradient: { bg: string; text: string }
}

/** Item de pricing por proyecto, con precio y estilo fusionados por índice. */
export type ProposalProjectPricingView = ProposalProjectPricingText & ProposalProjectPricingPresentation & {
  priceValue: string
  priceUnit: string
}

/** Presentación de precios fijos, en el mismo orden que `proposalsProject.pricing` en los mensajes: solo tintas.zip. Pigmento Studio es card de 2 opciones — ver `PIGMENTO_PRICING_PRESENTATION`. */
export const PROJECT_PRICING_PRESENTATION: ProposalProjectPricingPresentation[] = [
  {
    price: 10000,
    gradient: {
      bg: 'linear-gradient(150deg, #ffd2ec 0%, #ff9ecb 52%, #ff5fa8 100%)',
      text: '#52102f',
    },
  },
]

/** Gradiente de la card compartida de Pigmento Studio (mismo verde que tenía cuando era una sola card). */
export const PIGMENTO_CARD_GRADIENT = {
  bg: 'linear-gradient(150deg, #ddf2a8 0%, #b9e85f 52%, #93d62f 100%)',
  text: '#2c4014',
}

/** Presentación de las dos opciones, en el mismo orden que `proposalsProject.pigmento_options`: + Page Builder CMS, + CMS (sin page builder). */
export const PIGMENTO_PRICING_PRESENTATION: ProposalDualOptionPresentation[] = [
  { price: 50000 },
  { price: 38000 },
]

/**
 * Card compartida con 2 opciones de precio apiladas (no una card por opción).
 * Usada en ronda01-pigmento para el 2do slot (e-commerce: Jamstack vs.
 * Shopify + Stripe) y el 4to slot (maori: reparación vs. recreación) — mismo
 * patrón porque ambos proyectos plantean dos caminos técnicos con precio
 * propio, no un rango genérico.
 */
export type ProposalDualOptionText = {
  /** Etiqueta corta de la opción dentro de la card compartida, ej. "Opción A". */
  label: string
  title: string
  tagline: string
  /** One-liner de "para quién es esta opción", al pie de la columna. */
  audience: string
  /** Entrega estimada, mostrada bajo el precio, ej. "Entrega estimada: 1–2 semanas". */
  timeline: string
}

export type ProposalDualOptionPresentation = {
  /** Precio fijo en MXN. Con `priceMax`, es el piso de un rango. */
  price: number
  priceMax?: number
}

/** Gradiente único de la card compartida de maori — mismo pack "Gradient Abstract Geometric Shapes". */
export const MAORI_CARD_GRADIENT = {
  bg: 'linear-gradient(150deg, #ffe7b0 0%, #ffbf5c 52%, #ff9a33 100%)',
  text: '#5a3408',
}

/** Presentación de las dos opciones, en el mismo orden que `proposalsMaori.options` en los mensajes: reparación WooCommerce, recreación Shopify. */
export const MAORI_PRICING_PRESENTATION: ProposalDualOptionPresentation[] = [
  { price: 14000 },
  { price: 38000 },
]

/** Mismo azul que ya usaba este proyecto cuando era una sola card de rango. */
export const ECOMMERCE_CARD_GRADIENT = {
  bg: 'linear-gradient(150deg, #bdeffe 0%, #7fd6f4 52%, #33b6ec 100%)',
  text: '#0a3a52',
}

/** Presentación de las dos opciones, en el mismo orden que `proposalsProject.ecommerce_options` en los mensajes: Jamstack, Shopify + Stripe. */
export const ECOMMERCE_PRICING_PRESENTATION: ProposalDualOptionPresentation[] = [
  { price: 24000 },
  { price: 38000 },
]

/** Texto de la card full-width del retainer en ronda01-pigmento (alternativa a cotizar por proyecto), en `proposalsProject.retainer`. */
export type ProposalRetainerText = {
  label: string
  title: string
  /** Prefijo del precio, ej. "Desde" (el precio es el piso de los paquetes). */
  price_prefix: string
  price_unit: string
  tagline: string
  includes: string[]
  /** One-liner de "para quién es esta alternativa", al pie de la card. */
  note: string
  cta: string
}

/** Mismo morado del paquete Growth (featured) de la primera propuesta, para ligar visualmente la alternativa con esa página. */
export const RETAINER_CARD_GRADIENT = {
  bg: 'linear-gradient(150deg, #e7cef5 0%, #c08fee 50%, #8a4fe6 100%)',
  text: '#260b52',
}

/** Presentación de los paquetes, en el mismo orden que `proposals.packages` en los mensajes. */
export const PACKAGE_PRESENTATION: ProposalPackagePresentation[] = [
  {
    priceMonthly: 18000,
    projectsPerMonth: 5,
    gradient: {
      bg: 'linear-gradient(150deg, #d9c4ff 0%, #a7b6ff 52%, #6f8cff 100%)',
      text: '#171a52',
    },
  },
  {
    featured: true,
    priceMonthly: 35000,
    projectsPerMonth: 5,
    gradient: {
      bg: 'linear-gradient(150deg, #e7cef5 0%, #c08fee 50%, #8a4fe6 100%)',
      text: '#260b52',
    },
  },
  {
    priceMonthly: 54000,
    hoursPerMonth: 36,
    gradient: {
      bg: 'linear-gradient(150deg, #ffd9b0 0%, #ff9d5c 52%, #ff7a33 100%)',
      text: '#5a2408',
    },
  },
]

/** Texto de cada tier de la propuesta de MoEasy, en `proposalsMoeasy.tiers`. */
export type ProposalTierText = {
  /** Etiqueta corta de posicionamiento, ej. "Para lanzar rápido". */
  label: string
  name: string
  tagline: string
  /** Entrega estimada, mostrada bajo el precio. */
  timeline: string
  /**
   * El caso de negocio del paquete: qué compra y qué deja sin resolver. Va
   * arriba de las features porque es lo que Pigmento repite en la junta.
   */
  rationale: string
  /**
   * Las dimensiones donde los tres paquetes se separan, con el mismo `label` y
   * el mismo orden en los tres. Vive dentro de la card para que la comparación
   * se lea sin salir a una tabla aparte.
   */
  diff: ProposalTierDiff[]
  features: string[]
  /**
   * Dónde deja de alcanzar el paquete. Es el campo que diferencia los tiers:
   * la línea de corte entre uno y otro es un límite operativo verificable, no
   * una promesa sobre el futuro.
   */
  limits: string
  /** Lo que no entra sin cotizar aparte. Protege el precio cuando el alcance crece. */
  excludes: string[]
  /** Infraestructura que paga el cliente final directo al proveedor. No lleva margen. */
  recurring: string
  /** One-liner de "para quién es este paquete", al pie de la card. */
  audience: string
}

export type ProposalTierPresentation = {
  /** Precio fijo en MXN por proyecto: lo que se le factura a Pigmento. */
  price: number
  /**
   * Sugerencia de reventa al cliente final, en MXN. No es un precio mío ni una
   * condición: existe para que Pigmento no subvalore el trabajo técnico al
   * cotizar. El número final lo decide la agencia.
   */
  suggestedMin: number
  suggestedTarget: number
  /** Resalta el paquete recomendado en el grid. */
  featured?: boolean
  gradient: { bg: string; text: string }
}

export type ProposalTier = ProposalTierText & ProposalTierPresentation

/** Un criterio de comparación resuelto dentro de un tier: qué cambia aquí. */
export type ProposalTierDiff = {
  label: string
  value: string
}

/**
 * Presentación de los tiers, en el mismo orden que `proposalsMoeasy.tiers` en
 * los mensajes: express (Webflow), a la medida (Next + Payload), plataforma de
 * inventario. Ordenados de menor a mayor con el recomendado en medio, igual que
 * los paquetes de pigmento-studio.
 *
 * HACK: precios sin confirmar con Pigmento (septiembre 2026); son mi estimación
 * anclada a ronda01. Actualizarlos al cerrar la ronda — este array es el único
 * lugar que se toca.
 */
export const MOEASY_TIER_PRESENTATION: ProposalTierPresentation[] = [
  {
    price: 26000,
    suggestedMin: 45000,
    suggestedTarget: 58000,
    gradient: {
      bg: 'linear-gradient(150deg, #bdeffe 0%, #7fd6f4 52%, #33b6ec 100%)',
      text: '#0a3a52',
    },
  },
  {
    price: 38000,
    suggestedMin: 68000,
    suggestedTarget: 88000,
    gradient: {
      bg: 'linear-gradient(150deg, #e7cef5 0%, #c08fee 50%, #8a4fe6 100%)',
      text: '#260b52',
    },
  },
  {
    price: 48000,
    suggestedMin: 92000,
    suggestedTarget: 115000,
    featured: true,
    gradient: {
      bg: 'linear-gradient(150deg, #ffd9b0 0%, #ff9d5c 52%, #ff7a33 100%)',
      text: '#5a2408',
    },
  },
]

/** Card full-width de áreas de margen para Pigmento — verde, para separarla visualmente de los tiers. */
export const MARGIN_CARD_GRADIENT = {
  bg: 'linear-gradient(150deg, #ddf2a8 0%, #b9e85f 52%, #93d62f 100%)',
  text: '#2c4014',
}

/**
 * Shapes multicolor del image trail de los heroes de propuestas (en public/shapes/).
 * Vive aquí para no repetir el array en cada página de propuesta.
 */
export const PROPOSAL_TRAIL_SHAPES = [
  '/shapes/flower.png',
  '/shapes/clover.png',
  '/shapes/petals.png',
  '/shapes/bloom.png',
  '/shapes/donut.png',
  '/shapes/arrow.png',
  '/shapes/metaball.png',
  '/shapes/energy.png',
  '/shapes/star-sparkles.png',
  '/shapes/sparkle-circle.png',
  '/shapes/connection.png',
  '/shapes/semi-circle.png',
  '/shapes/blue-flower.png',
  '/shapes/blue-smile.png',
  '/shapes/blue-pink-circle.png',
  '/shapes/blue-x.png',
  '/shapes/black-spades.png',
  '/shapes/black-ellipse.png',
  '/shapes/orange-asterisk.png',
  '/shapes/orange-hearts.png',
  '/shapes/orange-diamond.png',
  '/shapes/orange-pin.png',
  '/shapes/pink-flower.png',
  '/shapes/pink-bang-star.png',
  '/shapes/pink-fish.png',
  '/shapes/pink-click.png',
  '/shapes/purple-star.png',
  '/shapes/purple-petals.png',
  '/shapes/purple-windmill.png',
  '/shapes/purple-gear.png',
  '/shapes/purple-six-flower.png',
  '/shapes/purple-chat.png',
]
