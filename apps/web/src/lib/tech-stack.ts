export type TechStackItem = {
  name: string
  href: string
  icon: string
  cursorLabel: string
  /** Skip brightness/invert filter (e.g. pre-colored PNG logos). */
  nativeIcon?: boolean
}

/** Footer marquee — curated stack for this portfolio + project deps. */
export const TECH_STACK: TechStackItem[] = [
  { name: 'Next.js', href: 'https://nextjs.org', icon: '/Icons/Next.js.svg', cursorLabel: 'Next.js · App framework' },
  { name: 'React', href: 'https://react.dev', icon: '/Icons/React.svg', cursorLabel: 'React · Interactive UI' },
  { name: 'TypeScript', href: 'https://www.typescriptlang.org', icon: '/Icons/Typescript.svg', cursorLabel: 'TypeScript · Typed DX' },
  { name: 'Tailwind CSS', href: 'https://tailwindcss.com', icon: '/Icons/Tailwind CSS.svg', cursorLabel: 'Tailwind · Design system' },
  { name: 'GSAP', href: 'https://gsap.com', icon: '/Icons/gsap-white.svg', cursorLabel: 'GSAP · Motion design' },
  { name: 'Osmo', href: 'https://www.osmo.supply', icon: '/Icons/osmo.svg', cursorLabel: 'Osmo · Motion & web craft' },
  { name: 'Figma', href: 'https://www.figma.com', icon: '/Icons/Figma.svg', cursorLabel: 'Figma · UI design' },
  { name: 'Resend', href: 'https://resend.com', icon: '/Icons/Resend.svg', cursorLabel: 'Resend · Transactional email' },
  { name: 'Cloudflare', href: 'https://www.cloudflare.com', icon: '/Icons/Cloudflare.svg', cursorLabel: 'Cloudflare · Security & edge' },
  { name: 'Vercel', href: 'https://vercel.com', icon: '/Icons/Vercel.svg', cursorLabel: 'Vercel · Deployment & edge' },
  { name: 'Cursor', href: 'https://cursor.com', icon: '/Icons/Cursor.png', cursorLabel: 'Cursor · Primary IDE', nativeIcon: true },
  { name: 'Claude', href: 'https://claude.ai', icon: '/Icons/claude.svg', cursorLabel: 'Claude · AI assistance' },
  { name: 'Perplexity', href: 'https://www.perplexity.ai', icon: '/Icons/perplexity-color.svg', cursorLabel: 'Perplexity · Research copilot' },
]