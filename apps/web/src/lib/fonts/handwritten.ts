import localFont from 'next/font/local'

/** Gantol — only used on /about (loaded via about/layout.tsx). */
export const handwrittenFont = localFont({
  src: [{ path: '../../fonts/gantol/Gantol.otf', weight: '400', style: 'normal' }],
  variable: '--font-handwritten',
  display: 'swap',
  preload: true,
})