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
  /** Precio mensual en MXN (dato, no idioma). El precio por proyecto extra = total ÷ projectsPerMonth. */
  priceMonthly: number
  /** Sitios incluidos por mes en el retainer. */
  projectsPerMonth: number
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
    priceMonthly: 50000,
    projectsPerMonth: 3,
    gradient: {
      bg: 'linear-gradient(150deg, #ffd9b0 0%, #ff9d5c 52%, #ff7a33 100%)',
      text: '#5a2408',
    },
  },
]
