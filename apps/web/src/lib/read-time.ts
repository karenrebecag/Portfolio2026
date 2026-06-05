/** Display Read Time — scans article text and writes minutes into matched targets. */

const DEFAULT_WORDS_PER_MINUTE = 200

export function initDisplayReadTime(wordsPerMinute = DEFAULT_WORDS_PER_MINUTE) {
  if (typeof document === 'undefined') return

  const articles = document.querySelectorAll<HTMLElement>('[data-read-time-article]')

  articles.forEach((article, index) => {
    const matchValue = article.getAttribute('data-read-time-article')
    const text = article.textContent?.trim() ?? ''

    const wordCount = text.split(/\s+/).filter(Boolean).length
    const minutes = Math.max(1, Math.ceil(wordCount / wordsPerMinute))

    let targets: NodeListOf<HTMLElement> | HTMLElement[] = []

    if (matchValue) {
      targets = document.querySelectorAll<HTMLElement>(
        `[data-read-time-target="${matchValue}"]`,
      )
    } else {
      const emptyTargets = document.querySelectorAll<HTMLElement>(
        '[data-read-time-target=""], [data-read-time-target]:not([data-read-time-target*="-"])',
      )
      targets = emptyTargets[index] ? [emptyTargets[index]] : []
    }

    targets.forEach((target) => {
      target.textContent = String(minutes)
    })
  })
}