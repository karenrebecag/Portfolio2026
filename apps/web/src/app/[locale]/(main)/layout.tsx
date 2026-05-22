import type { ReactNode } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Marquee } from '@/components/marquee'

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Marquee />
      <Navbar />
      <div data-main className="relative z-[2] flex min-h-screen min-w-0 flex-col bg-background text-foreground overflow-x-hidden">
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </>
  )
}
