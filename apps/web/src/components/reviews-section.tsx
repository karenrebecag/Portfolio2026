'use client'

import { useCallback, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { Container } from '@/components/ui/container'
import { Pill } from '@/components/ui/pill'
import { IconButton } from '@/components/ui/icon-button'
import { REVIEWS } from '@/lib/reviews'
import { usePageInit } from '@/lib/use-page-init'
import { initTestimonialSlider, type TestimonialSlider } from '@/lib/testimonial-slider'

function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

const ArrowLeft = (
  <svg viewBox="0 0 12 12" fill="none" className="w-3">
    <path
      d="M5.26512 12L6.43721 10.7746L1.48837 5.28169V6.71831L6.45581 1.22535L5.28372 0L0 6L5.26512 12ZM12 6.97183V5.02817H1.30232V6.97183H12Z"
      fill="currentColor"
    />
  </svg>
)

const ArrowRight = (
  <svg viewBox="0 0 12 12" fill="none" className="w-3">
    <path
      d="M6.73488 12L5.56279 10.7746L10.5116 5.28169V6.71831L5.54419 1.22535L6.71628 0L12 6L6.73488 12ZM0 6.97183V5.02817H10.6977V6.97183H0Z"
      fill="currentColor"
    />
  </svg>
)

export function ReviewsSection() {
  const t = useTranslations('reviews')
  const wrapRef = useRef<HTMLDivElement>(null)
  const sliderRef = useRef<TestimonialSlider | null>(null)

  usePageInit(
    useCallback(() => {
      const wrap = wrapRef.current
      if (!wrap) return
      const slider = initTestimonialSlider(wrap)
      sliderRef.current = slider
      return () => {
        sliderRef.current = null
        slider.destroy()
      }
    }, []),
  )

  return (
    <section
      data-semantic-role="testimonials"
      data-llm-context="client-testimonials-social-proof"
      data-theme-section="light"
      className="px-4 lg:px-6 py-40 lg:py-56 scroll-mt-20"
    >
      <Container>
        <Pill>{t('eyebrow')}</Pill>
        <h2 className="mt-6 max-w-[22ch] text-[clamp(1.5rem,3vw,2.5rem)] font-bold leading-[1.05] tracking-[-0.02em]">
          {t('heading')}
        </h2>
        <p className="mt-5 max-w-[55ch] text-base leading-relaxed text-foreground/70">
          {t('subheading')}
        </p>

        <div
          ref={wrapRef}
          data-testimonial-wrap
          data-autoplay="true"
          data-autoplay-duration="6000"
          className="mt-10 rounded-[1.25rem] bg-surface p-8 text-surface-foreground md:p-10 lg:p-12"
        >
          {/* Meta row: counter + label + controls */}
          <div className="flex items-center justify-between gap-6">
            <p className="text-2xs font-bold uppercase tracking-widest font-accent text-surface-foreground/50">
              <span data-current>01</span> / <span data-total>{String(REVIEWS.length).padStart(2, '0')}</span>
              <span className="mx-2 text-surface-foreground/30">—</span>
              <span className="text-surface-foreground/80">{t('label')}</span>
            </p>
            <div className="flex shrink-0 gap-2">
              <IconButton icon={ArrowLeft} aria-label={t('prev')} onClick={() => sliderRef.current?.prev()} />
              <IconButton icon={ArrowRight} aria-label={t('next')} onClick={() => sliderRef.current?.next()} />
            </div>
          </div>

          {/* Rotating testimonials */}
          <div data-testimonial-list role="list" className="relative mt-6 grid w-full min-h-[18rem] md:mt-8 md:min-h-[20rem]">
            {REVIEWS.map((review, index) => (
              <div
                key={review.name}
                data-testimonial-item
                role="listitem"
                aria-hidden={index !== 0}
                className={`col-start-1 row-start-1 flex h-full w-full flex-col justify-between gap-8 ${index === 0 ? 'is--active' : 'invisible opacity-0'}`}
              >
                <h3
                  data-testimonial-text
                  className="font-display text-[clamp(1.5rem,2.6vw,2.25rem)] font-normal leading-[1.2] tracking-[-0.02em]"
                >
                  &ldquo;{review.quote}&rdquo;
                </h3>
                <div className="flex items-center gap-4">
                  <div
                    data-testimonial-img
                    className="aspect-square w-14 shrink-0 overflow-hidden rounded-full md:w-16"
                  >
                    {review.photo ? (
                      <img
                        src={review.photo}
                        alt={review.name}
                        className="h-full w-full object-cover grayscale"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center bg-surface-foreground/10 font-accent text-sm font-bold text-surface-foreground">
                        {initials(review.name)}
                      </span>
                    )}
                  </div>
                  <div>
                    <p data-testimonial-split className="text-sm font-bold">
                      {review.name}
                    </p>
                    <p
                      data-testimonial-split
                      className="mt-0.5 text-2xs font-accent uppercase tracking-wide text-surface-foreground/60"
                    >
                      {review.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
