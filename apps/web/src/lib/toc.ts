// Table of Contents component logic - ported from Osmo spec
// Uses data attributes for declarative setup.
// Expects GSAP + ScrollTrigger to be available (registered globally or on window).

declare global {
  interface Window {
    ScrollTrigger?: any
    gsap?: any
  }
}

export function initTableOfContents() {
  if (typeof document === 'undefined') return

  document.querySelectorAll<HTMLElement>('[data-toc-wrap]').forEach((root) => {
    const contentEl = root.querySelector<HTMLElement>('[data-toc-content]')
    const listEl = root.querySelector<HTMLElement>('[data-toc-list]')
    const templateLink = listEl?.querySelector<HTMLAnchorElement>('[data-toc-link]')

    if (!contentEl || !listEl || !templateLink) return

    const levelsAttr = root.getAttribute('data-toc-levels') || 'h2,h3'
    const levels = levelsAttr
      .split(',')
      .map((l) => l.trim().toLowerCase())
      .filter((l) => /^h[1-6]$/.test(l))

    const levelSelector = levels.join(', ')
    if (!levelSelector) return

    const offset = parseInt(root.getAttribute('data-toc-offset') || '80', 10)
    const marker = '{skip}'

    const slugCounts = new Map<string, number>()

    function slugify(text: string): string {
      let slug = text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')

      if (!slug) slug = 'section'

      const count = slugCounts.get(slug) || 0
      slugCounts.set(slug, count + 1)
      return count === 0 ? slug : `${slug}-${count + 1}`
    }

    function stripMarker(el: HTMLElement) {
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
      let node: Node | null
      while ((node = walker.nextNode())) {
        if (node.textContent?.includes(marker)) {
          node.textContent = node.textContent.replace(marker, '').trim()
        }
      }
    }

    const allHeadings = Array.from(contentEl.querySelectorAll<HTMLElement>(levelSelector))
    const headings: HTMLElement[] = []

    allHeadings.forEach((heading) => {
      if (heading.hasAttribute('data-toc-ignore')) return
      if (heading.textContent?.includes(marker)) {
        stripMarker(heading)
        return
      }
      const text = heading.textContent?.trim()
      if (!text) return
      headings.push(heading)
    })

    if (!headings.length) return

    // Ensure IDs
    headings.forEach((heading) => {
      if (!heading.id) {
        heading.id = slugify(heading.textContent?.trim() || '')
      }
    })

    const tocLinks: HTMLAnchorElement[] = []

    headings.forEach((heading) => {
      const clone = templateLink.cloneNode(true) as HTMLAnchorElement
      const textTarget = clone.querySelector('[data-toc-text]') || clone
      textTarget.textContent = heading.textContent?.trim() || ''

      clone.href = '#' + heading.id
      clone.removeAttribute('data-toc-link')
      clone.setAttribute('data-toc-item', '')

      const level = parseInt(heading.tagName.charAt(1), 10)
      clone.setAttribute('data-toc-depth', String(level))

      listEl.appendChild(clone)
      tocLinks.push(clone)
    })

    // Remove the original template link(s)
    listEl.querySelectorAll('[data-toc-link]').forEach((el) => el.remove())

    // Active state via ScrollTrigger (if available)
    const ST = (typeof window !== 'undefined' && window.ScrollTrigger) || null

    function setActive(index: number) {
      tocLinks.forEach((link) => link.setAttribute('data-toc-status', ''))
      if (tocLinks[index]) tocLinks[index].setAttribute('data-toc-status', 'active')
    }

    if (ST) {
      headings.forEach((heading, i) => {
        const nextHeading = headings[i + 1]

        ST.create({
          trigger: heading,
          start: `top ${offset + 1}px`,
          endTrigger: nextHeading || contentEl,
          end: nextHeading ? `top ${offset + 1}px` : 'bottom top',
          onToggle: (self: any) => {
            if (self.isActive) setActive(i)
          },
        })
      })

      // Initial active state
      requestAnimationFrame(() => {
        const firstRect = headings[0].getBoundingClientRect()
        if (window.scrollY <= firstRect.top + window.scrollY - offset) {
          setActive(0)
        }
      })
    } else {
      // Fallback: simple scroll listener if no ScrollTrigger
      const onScroll = () => {
        let activeIndex = 0
        const scrollPos = window.scrollY + offset + 1

        headings.forEach((heading, i) => {
          const top = heading.getBoundingClientRect().top + window.scrollY
          if (scrollPos >= top) activeIndex = i
        })
        setActive(activeIndex)
      }
      window.addEventListener('scroll', onScroll, { passive: true })
      onScroll()
    }

    // Click handler with smooth scroll (Lenis aware)
    listEl.addEventListener('click', (e) => {
      const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('[data-toc-item]')
      if (!link) return

      e.preventDefault()
      e.stopPropagation()

      const id = link.getAttribute('href')?.slice(1)
      if (!id) return

      const target = document.getElementById(id)
      if (!target) return

      const lenis = typeof window !== 'undefined' ? (window as any).lenis : undefined

      if (lenis && typeof lenis.scrollTo === 'function') {
        lenis.scrollTo(target, { offset: -offset })
      } else {
        const y = target.getBoundingClientRect().top + window.scrollY - offset
        window.scrollTo({ top: y, behavior: 'smooth' })
      }

      // Update active immediately on click
      const clickedIndex = tocLinks.indexOf(link)
      if (clickedIndex !== -1) setActive(clickedIndex)
    })
  })
}
