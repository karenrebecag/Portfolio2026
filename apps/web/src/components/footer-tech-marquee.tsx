'use client'

import { useCssMarquee } from '@/lib/use-css-marquee'
import { TECH_STACK } from '@/lib/tech-stack'

export function FooterTechMarquee() {
  const { trackRef, groupRef } = useCssMarquee([TECH_STACK.map((tool) => tool.name).join('|')])

  return (
    <div
      data-css-marquee
      data-footer-marquee
      className="footer-tech-marquee marquee-css overflow-hidden bg-surface text-surface-foreground"
    >
      <div ref={trackRef} className="marquee-rail bg-surface">
        <div ref={groupRef} className="marquee-advanced__item flex items-center flex-none">
          {TECH_STACK.map((tool) => (
            <div key={tool.name} className="flex items-center flex-none pr-2.5">
              <a
                href={tool.href}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-tech-marquee__logo"
                data-cursor-text={tool.cursorLabel}
                aria-label={tool.name}
                title={tool.name}
              >
                <img
                  src={tool.icon}
                  alt={`${tool.name} logo`}
                  className={`footer-tech-marquee__logo-img${tool.nativeIcon ? ' footer-tech-marquee__logo-img--native' : ''}`}
                  loading="lazy"
                  draggable={false}
                />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}