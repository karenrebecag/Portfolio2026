/** Social Share Buttons — Osmo-style data-attribute utility. */

import { toast } from 'sonner'

type SocialShareRoot = HTMLElement & { _socialShareBound?: boolean }

const SHARE_URLS: Record<string, (u: string, t: string) => string> = {
  x: (u, t) => `https://twitter.com/intent/tweet?text=${t}&url=${u}`,
  linkedin: (u) => `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
  reddit: (u, t) => `https://www.reddit.com/submit?url=${u}&title=${t}`,
  telegram: (u, t) => `https://t.me/share/url?url=${u}&text=${t}`,
  whatsapp: (u, t) => `https://api.whatsapp.com/send?text=${t}%20${u}`,
  mail: (u, t) => `mailto:?subject=${t}&body=${t}%0A%0A${u}`,
  facebook: (u) => `https://www.facebook.com/sharer/sharer.php?u=${u}`,
  pinterest: (u, t) => `https://www.pinterest.com/pin/create/button/?url=${u}&description=${t}`,
}

export function initSocialShare() {
  if (typeof document === 'undefined') return

  document.querySelectorAll<SocialShareRoot>('[data-social-share]').forEach((root) => {
    if (root._socialShareBound) return
    root._socialShareBound = true

    const link = root.getAttribute('data-social-share-link') || location.href
    const title = root.getAttribute('data-social-share-title') || document.title
    const copiedToast = root.getAttribute('data-social-share-toast') || 'Link copied to clipboard'

    root.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-social-share-type]')
      if (!btn) return
      e.preventDefault()

      const type = btn.getAttribute('data-social-share-type')
      if (!type) return

      const u = encodeURIComponent(link)
      const t = encodeURIComponent(title)

      if (type === 'clipboard') {
        void navigator.clipboard.writeText(link).then(() => {
          btn.setAttribute('data-social-share-success', '')
          window.setTimeout(() => btn.removeAttribute('data-social-share-success'), 2000)
          toast.success(copiedToast)
        })
        return
      }

      const build = SHARE_URLS[type]
      if (build) window.open(build(u, t), '_blank', 'noopener,noreferrer')
    })
  })
}