'use client'

const TOOLS = [
  'Next.js', 'React', 'TypeScript', 'Astro', 'Tailwind CSS',
  'Figma', 'GSAP', 'Payload CMS', 'Supabase', 'Vercel',
  'Node.js', 'PostgreSQL', 'Docker', 'Python', 'Git',
]

export function WhyToolsMarquee() {
  return (
    <div
      data-marquee-scroll-direction-target=""
      data-marquee-duplicate="1"
      data-marquee-direction="right"
      data-marquee-status="normal"
      data-marquee-speed="18"
      data-marquee-scroll-speed="8"
      className="marquee-advanced why-tools-marquee flex overflow-hidden flex-1"
    >
      <div data-marquee-scroll-target="" className="marquee-advanced__scroll flex w-full relative will-change-transform">
        <div data-marquee-collection-target="" className="marquee-advanced__collection flex relative will-change-transform">
          <div className="marquee-advanced__item flex items-center flex-none">
            {TOOLS.map((tool) => (
              <div key={tool} className="flex items-center gap-3 flex-none pr-4">
                <span className="marquee__advanced__p whitespace-nowrap text-xs font-semibold font-display text-[#fdf9ed]/70 m-0">
                  {tool}
                </span>
                <span className="w-1 h-1 rounded-full bg-[#fdf9ed]/20 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}