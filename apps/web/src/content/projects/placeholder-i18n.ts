export type ProjectLocaleFields = {
  title: string
  summary: string
  role: string
  services: string
}

export const PLACEHOLDER_PROJECT_I18N: Record<string, { en: ProjectLocaleFields; es: ProjectLocaleFields }> = {
  'monex-one-mobile-banking': {
    en: {
      title: 'Monex One | Mobile Banking UX/UI for Mexico',
      summary:
        'Eight months embedded with Aurin and Ancient Global designing Monex One—the mobile banking app for Monex’s Mexico division. Shipped on the App Store within a year.',
      role: 'UX/UI Designer',
      services: 'UX/UI Design, Mobile Product',
    },
    es: {
      title: 'Monex One | UX/UI de banca móvil para México',
      summary:
        'Ocho meses integrada con Aurin y Ancient Global diseñando Monex One—la app de banca móvil de la división México de Monex. En App Store al año del proyecto.',
      role: 'Diseñadora UX/UI',
      services: 'Diseño UX/UI, Producto móvil',
    },
  },
  'aurin-task-manager': {
    en: {
      title: 'Aurin Task Manager | One Hub for Remote-First Agency Ops',
      summary:
        'A distributed agency cannot run on spreadsheet handoffs and scattered Slack threads. I led UX engineering on Aurin’s internal platform—Kanban and table views, per-task chat with Gemini summaries, time tracking, client share links, and an n8n assistant for natural-language task control.',
      role: 'UX Engineer & Product Designer',
      services: 'UX Engineering, Product Design, Full-Stack',
    },
    es: {
      title: 'Aurin Task Manager | Un hub para operar una agencia remote-first',
      summary:
        'Una agencia distribuida no puede operar con spreadsheets y hilos sueltos en Slack. Lideré UX engineering en la plataforma interna de Aurin—Kanban y tabla, chat por tarea con Gemini, time tracking, enlaces para clientes y asistente n8n en lenguaje natural.',
      role: 'UX Engineer & Product Designer',
      services: 'UX Engineering, Diseño de producto, Full-Stack',
    },
  },
  'maria-luisa-de-mateo-jamstack': {
    en: {
      title: 'María Luisa de Mateo | Artsy & Instagram as the CMS',
      summary:
        'Most artist sites ship with a CMS the creator never opens. This one pulls live inventory from Artsy and Instagram—47 works on R2, bilingual Next.js, GSAP galleries—so María Luisa keeps selling where she already sells.',
      role: 'UX Engineer & Product Designer',
      services: 'UX Engineering, Product Design, JAMstack',
    },
    es: {
      title: 'María Luisa de Mateo | Artsy e Instagram como CMS',
      summary:
        'La mayoría de sitios para artistas traen un CMS que nadie abre. Este tira inventario vivo de Artsy e Instagram—47 obras en R2, Next.js bilingüe, galerías con GSAP—para que María Luisa siga vendiendo donde ya vende.',
      role: 'UX Engineer & Product Designer',
      services: 'UX Engineering, Diseño de producto, JAMstack',
    },
  },
}