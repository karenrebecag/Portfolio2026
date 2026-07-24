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

/** Presentación de precios fijos, en el mismo orden que `proposalsProject.pricing` en los mensajes: Landing, Agencia + CMS. El e-commerce (antes en medio) ahora es card de 2 opciones — ver `ECOMMERCE_PRICING_PRESENTATION`. */
export const PROJECT_PRICING_PRESENTATION: ProposalProjectPricingPresentation[] = [
  {
    price: 10000,
    gradient: {
      bg: 'linear-gradient(150deg, #ffd2ec 0%, #ff9ecb 52%, #ff5fa8 100%)',
      text: '#52102f',
    },
  },
  {
    price: 50000,
    gradient: {
      bg: 'linear-gradient(150deg, #ddf2a8 0%, #b9e85f 52%, #93d62f 100%)',
      text: '#2c4014',
    },
  },
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
