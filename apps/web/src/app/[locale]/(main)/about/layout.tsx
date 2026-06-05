import type { ReactNode } from 'react'
import { handwrittenFont } from '@/lib/fonts/handwritten'

export default function AboutLayout({ children }: { children: ReactNode }) {
  return <div className={handwrittenFont.variable}>{children}</div>
}