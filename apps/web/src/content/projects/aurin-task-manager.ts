/**
 * Client work case study: Aurin Task Manager (internal ops platform)
 */

import esMarkdown from './aurin-task-manager-es.md'
import enMarkdown from './aurin-task-manager-en.md'

export const aurinTaskManagerMeta = {
  id: '2',
  slug: 'aurin-task-manager',
  canonicalRoute: 'project' as const,
  status: 'published' as const,
  category: 'web' as const,
  role: 'UX Engineer & Product Designer',
  year: '2024',
  featured: true,
  tags: [
    { tag: 'Next.js' },
    { tag: 'Firestore' },
    { tag: 'Clerk' },
    { tag: 'Kanban' },
    { tag: 'Gemini' },
    { tag: 'n8n' },
    { tag: 'Messaging' },
  ],
  liveUrl: 'https://aurin-task-manager.vercel.app',
  repoUrl: 'https://github.com/KarenRebecaOrtiz/Aurin-Task-Manager',
  services: 'UX Engineering, Product Design, Full-Stack',
  coverImage: {
    url: 'https://cdn.prod.website-files.com/6889f182607452ec007a0ae1/688a1e349d92acc75bd79fa8_Minimalist%20Green%20Stools.avif',
    alt: 'Aurin Task Manager',
  },
  createdAt: '2023-09-01',
  updatedAt: '2026-06-05',
}

export const aurinTaskManagerI18n = {
  en: {
    title: 'Aurin Task Manager | One Hub for Remote-First Agency Ops',
    summary:
      'A distributed agency cannot run on spreadsheet handoffs and scattered Slack threads. I led UX engineering on Aurin’s internal platform—Kanban and table views, per-task chat with Gemini summaries, time tracking, client share links, and an n8n assistant for natural-language task control. The essay walks through why real-time Firestore beat “another Notion,” how modular Next.js scaled to 15+ feature modules, and what changed when remote-first became the default—not the exception.',
  },
  es: {
    title: 'Aurin Task Manager | Un hub para operar una agencia remote-first',
    summary:
      'Una agencia distribuida no puede operar con spreadsheets y hilos sueltos en Slack. Lideré UX engineering en la plataforma interna de Aurin—vistas Kanban y tabla, chat por tarea con resúmenes Gemini, time tracking, enlaces públicos para clientes y asistente n8n en lenguaje natural. El ensayo recorre por qué Firestore en tiempo real ganó a “otro Notion,” cómo un Next.js modular escaló a 15+ módulos de features, y qué cambió cuando remote-first dejó de ser excepción.',
  },
}

export const aurinTaskManagerMarkdown_es = esMarkdown
export const aurinTaskManagerMarkdown_en = enMarkdown