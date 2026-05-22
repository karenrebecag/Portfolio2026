'use client'

import { useEffect, useRef, useCallback } from 'react'
import { usePageInit } from '@/lib/use-page-init'
import { useTranslations } from 'next-intl'
import { Pill } from '@/components/ui/pill'
import { Button061 } from '@/components/ui/button-061'
import { Container } from '@/components/ui/container'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const R2 = 'https://pub-3ed7c563bcaa4c7c8ed703c87bbc1631.r2.dev'

const LOGOS = [
  { name: 'Ancient Health', city: 'Houston', logo: `${R2}/AncientLogo-1.png`, logoDark: null },
  { name: 'ATFX', city: 'Hong Kong', logo: 'https://www.atfx.com/wp-content/uploads/2023/06/ATFX_logo.svg', logoDark: null },
  { name: 'Aurin', city: 'CDMX', logo: 'https://pub-d17bbbdbf8e348c5a57c8168ad69c92f.r2.dev/AurinTinyWhiteLogo.svg', logoDark: null },
  { name: 'ATOM', city: 'Panama', logo: 'https://atomchat.io/wp-content/uploads/2023/03/logo-atom-chat.png', logoDark: 'https://pub-c8d801a0ff204d758910633021fa302b.r2.dev/ATOM-horizontal-dark.svg' },
  { name: 'Spil', city: 'New York', logo: `${R2}/SpilLogo.png`, logoDark: null },
  { name: 'Opinator', city: 'Madrid', logo: `${R2}/OpinatorLogo.png`, logoDark: null },
  { name: 'ZOEK', city: 'San Francisco', logo: `${R2}/ZoekLogo.png`, logoDark: null },
]

export function LogoWall() {
  const rootRef = useRef<HTMLDivElement>(null)
  const t = useTranslations('stack')

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    function init() {
      if (!root) return

      const loopDelay = 1.5
      const duration = 0.9

      const list = root.querySelector<HTMLElement>('[data-logo-wall-list]')
      if (!list) return
      const items = Array.from(list.querySelectorAll<HTMLElement>('[data-logo-wall-item]'))

      const shuffleFront = root.getAttribute('data-logo-wall-shuffle') !== 'false'
      const originalTargets = items
        .map(item => item.querySelector('[data-logo-wall-target]'))
        .filter(Boolean) as HTMLElement[]

      let visibleItems: HTMLElement[] = []
      let visibleCount = 0
      let pool: HTMLElement[] = []
      let pattern: number[] = []
      let patternIndex = 0
      let tl: gsap.core.Timeline

      function isVisible(el: HTMLElement) {
        return window.getComputedStyle(el).display !== 'none'
      }

      function shuffleArray<T>(arr: T[]): T[] {
        const a = arr.slice()
        for (let i = a.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [a[i], a[j]] = [a[j], a[i]]
        }
        return a
      }

      function setup() {
        if (tl) tl.kill()

        visibleItems = items.filter(isVisible)
        visibleCount = visibleItems.length

        pattern = shuffleArray(Array.from({ length: visibleCount }, (_, i) => i))
        patternIndex = 0

        items.forEach(item => {
          item.querySelectorAll('[data-logo-wall-target]').forEach(old => old.remove())
        })

        pool = originalTargets.map(n => n.cloneNode(true) as HTMLElement)

        let front: HTMLElement[], rest: HTMLElement[]
        if (shuffleFront) {
          const shuffledAll = shuffleArray(pool)
          front = shuffledAll.slice(0, visibleCount)
          rest = shuffleArray(shuffledAll.slice(visibleCount))
        } else {
          front = pool.slice(0, visibleCount)
          rest = shuffleArray(pool.slice(visibleCount))
        }
        pool = front.concat(rest)

        for (let i = 0; i < visibleCount; i++) {
          const parent = visibleItems[i].querySelector('[data-logo-wall-target-parent]') || visibleItems[i]
          const node = pool.shift()
          if (node) parent.appendChild(node)
        }

        tl = gsap.timeline({ repeat: -1, repeatDelay: loopDelay })
        tl.call(swapNext)
        tl.play()
      }

      function swapNext() {
        const nowCount = items.filter(isVisible).length
        if (nowCount !== visibleCount) { setup(); return }
        if (!pool.length) return

        const idx = pattern[patternIndex % visibleCount]
        patternIndex++

        const container = visibleItems[idx]
        const parent = container.querySelector('[data-logo-wall-target-parent]') || container
        const existing = parent.querySelectorAll('[data-logo-wall-target]')
        if (existing.length > 1) return

        const current = parent.querySelector('[data-logo-wall-target]')
        const incoming = pool.shift()
        if (!incoming) return

        gsap.set(incoming, { yPercent: 50, autoAlpha: 0 })
        parent.appendChild(incoming)

        if (current) {
          gsap.to(current, {
            yPercent: -50, autoAlpha: 0, duration, ease: 'expo.inOut',
            onComplete: () => { current.remove(); pool.push(current as HTMLElement) },
          })
        }

        gsap.to(incoming, {
          yPercent: 0, autoAlpha: 1, duration, delay: 0.1, ease: 'expo.inOut',
        })
      }

      setup()

      ScrollTrigger.create({
        trigger: root,
        start: 'top bottom',
        end: 'bottom top',
        onEnter: () => tl.play(),
        onLeave: () => tl.pause(),
        onEnterBack: () => tl.play(),
        onLeaveBack: () => tl.pause(),
      })

      const handleVisibility = () => { document.hidden ? tl.pause() : tl.play() }
      document.addEventListener('visibilitychange', handleVisibility)

      return () => {
        tl.kill()
        document.removeEventListener('visibilitychange', handleVisibility)
      }
    }

    if (document.body.hasAttribute('data-page-ready')) {
      init()
    } else {
      document.addEventListener('page-ready', () => init(), { once: true })
    }

    function onNavigate() { init() }
    document.addEventListener('page-navigation-complete', onNavigate)

    return () => {
      document.removeEventListener('page-navigation-complete', onNavigate)
    }
  }, [])

  return (
    <section data-theme-section="light" className="px-4 lg:px-6 py-20 lg:pt-60 lg:pb-40">
      <Container>
      <div className="grid gap-10 md:grid-cols-12 md:gap-10">
        {/* Left -- context */}
        <div className="col-span-12 md:col-span-5">
          <div className="md:sticky md:top-28">
            <Pill>{t('pill')}</Pill>

            <h2 data-split="heading" data-split-reveal="words" className="mt-6 text-[clamp(1.75rem,3.5vw,3rem)] font-bold leading-[1.05] tracking-[-0.02em] max-w-[18ch]">
              {t('heading')}
            </h2>

            <div className="mt-6 mb-6 h-px w-full bg-border" />

            <p className="text-base leading-relaxed text-foreground max-w-[50ch]">
              {t('subheading')}
            </p>

            <div className="mt-6 mb-6 h-px w-full bg-border" />

            <p className="text-sm leading-relaxed text-foreground/80 max-w-[50ch] mb-2">
              {t('body')}
            </p>
            <p className="text-sm leading-relaxed text-foreground/80 max-w-[50ch]">
              {t('body_2')}
            </p>

            <ul className="mt-6 space-y-3 text-sm leading-relaxed text-foreground/70 max-w-[50ch]">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1 h-1 rounded-full bg-current shrink-0" />
                {t('bullet_1')}
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1 h-1 rounded-full bg-current shrink-0" />
                {t('bullet_2')}
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1 h-1 rounded-full bg-current shrink-0" />
                {t('bullet_3')}
              </li>
            </ul>

            <div className="mt-8">
              <Button061 href="#contact">{t('cta')}</Button061>
            </div>
          </div>
        </div>

        {/* Right -- logo grid 2x4 */}
        <div className="col-span-12 md:col-span-7">
          <div
            ref={rootRef}
            data-logo-wall-cycle-init
            data-logo-wall-shuffle="false"
            className="logo-wall"
          >
            <div className="logo-wall__collection">
              <div data-logo-wall-list className="logo-wall__list">
                {LOGOS.map((logo) => (
                  <div key={logo.name} data-logo-wall-item className="logo-wall__item">
                    <div data-logo-wall-target-parent className="logo-wall__logo">
                      <div className="logo-wall__logo-before" />
                      <div data-logo-wall-target className="logo-wall__logo-target">
                        <div className="flex flex-col items-center gap-3">
                          {logo.logoDark ? (
                            <>
                              <img src={logo.logo} loading="lazy" alt={logo.name} className="logo-wall__logo-img logo-wall__logo-img--light" />
                              <img src={logo.logoDark} loading="lazy" alt={logo.name} className="logo-wall__logo-img logo-wall__logo-img--dark" />
                            </>
                          ) : (
                            <img src={logo.logo} loading="lazy" alt={logo.name} className={`logo-wall__logo-img ${logo.name !== 'ATOM' ? 'logo-wall__logo-img--invertable' : ''}`} />
                          )}
                          <span className="inline-block px-2.5 py-1 text-[10px] font-bold font-accent uppercase tracking-widest bg-primary text-primary-foreground">
                            {logo.city}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      </Container>
    </section>
  )
}
