import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Container } from '@/components/ui/container'
import { ContactSection } from '@/components/contact-section'
import { Pill } from '@/components/ui/pill'
import { Button061 } from '@/components/ui/button-061'
import { IconButton } from '@/components/ui/icon-button'
import { ScrollHighlight } from '@/components/scroll-highlight'
import { InfiniteGrid } from '@/components/infinite-grid'
import { DraggableMarqueeStrip } from '@/components/additional-work'

const ALBUMS = [
  { title: 'Djent Is Not a Genre', type: 'Periphery', image: '/albums/periphery-v.webp' },
  { title: 'DATA', type: 'Tainy', image: '/albums/tainy-data.webp' },
  { title: 'Quest for Fire', type: 'Skrillex', image: '/albums/skrillex-quest.webp' },
  { title: 'To Pimp a Butterfly', type: 'Kendrick Lamar', image: '/albums/kendrick-tpab.jpg' },
  { title: 'The Life of Pablo', type: 'Kanye West', image: '/albums/kanye-tlop.jpg' },
  { title: 'Fauna', type: 'Haken', image: '/albums/haken-fauna.jpg' },
  { title: 'Alive 2007', type: 'Daft Punk', image: '/albums/daftpunk-alive.webp' },
  { title: 'Post Human: Nex Gen', type: 'Bring Me the Horizon', image: '/albums/bmth-nexgen.webp' },
  { title: 'All Eyez on Me', type: '2Pac', image: '/albums/2pac-alleyez.webp' },
  { title: 'Terraformer', type: 'Thank You Scientist', image: '/albums/tys-terraformer.jpg' },
  { title: 'Black Radio 2', type: 'Robert Glasper Experiment', image: '/albums/glasper-blackradio2.webp' },
  { title: 'Volition', type: 'Protest the Hero', image: '/albums/pth-volition.webp' },
  { title: 'Meteora', type: 'Linkin Park', image: '/albums/lp-meteora.webp' },
  { title: 'AM', type: 'Arctic Monkeys', image: '/albums/am-am.jpg' },
]

const EXPERIENCE = [
  {
    period: 'Feb 2026 - Present',
    title: 'Web Engineer',
    subtitle: 'Growth & Infrastructure',
    company: 'Atom',
    location: 'South Carolina, US (Remote)',
    highlights: [
      'Sole technical owner of the web marketing pipeline for a WhatsApp funnel automation SaaS across 14+ LATAM countries.',
      'Architected a token-first design system with custom npm packages: 1,865 tokens, 46 components, 4 frameworks, indexed for AI consumption via MCP server.',
      'Empowered non-technical growth teams to compose high-converting landing pages autonomously via Starlight docs and vibe-code snippets.',
      'Manage hybrid web infrastructure across Vercel and Cloudflare: DNS, rulesets, workers, CDN caching for Astro/Next.js and legacy stacks.',
    ],
  },
  {
    period: 'Dec 2025 - Present',
    title: 'Senior Web Platform Architect',
    subtitle: 'LATAM Regional Lead',
    company: 'ATFX',
    location: 'Mexico City (Hybrid)',
    highlights: [
      'Tech lead of the LATAM web pipeline: marketing sites, lead-gen funnels, email workflows, Salesforce integrations, and MCP skills.',
      'Architected ATFX Educacao, a Brazilian financial education SaaS, proposing Next.js + Supabase + Stripe over WordPress + WooCommerce.',
      'Design and maintain dual Figma design systems for 5 LATAM countries with tokens mirrored in code.',
      'Implement lead-gen and webinar funnels end-to-end: Figma flows, accessible HTML/CSS/JS, Power Automate, GA4 attribution, consent management.',
    ],
  },
  {
    period: 'Jun 2025 - Present',
    title: 'Founder & Lead Product/Design Engineer',
    subtitle: 'AI Automation & Web Systems',
    company: 'Draft Studio',
    location: 'Remote',
    highlights: [
      'Founded a remote creative studio with 5 specialists delivering AI-powered automation, scalable web platforms and e-commerce flows.',
      'Designed a zero-trust LLM architecture where AI acts purely as a reasoning engine with tool-calling.',
      'Built intelligent appointment systems integrating Google Calendar with automated proposal and booking flows.',
    ],
  },
  {
    period: 'Jul 2024 - Feb 2026',
    title: 'Full-Stack Developer & UX/UI Consultant',
    subtitle: 'AI Automation & Internal Tools',
    company: 'Aurin',
    location: 'Cuernavaca, MX',
    highlights: [
      'Engineered the Aurin.mx platform (Astro + AI chatbot) achieving 95+ Lighthouse score and <1.5s TTI.',
      'Built 8 production automation workflows processing 1,500+ monthly operations, reducing manual work by 25 hrs/week.',
      'Delivered a full-stack case-management system for a 292-attorney Chambers-ranked firm on Next.js, Supabase and Clerk.',
    ],
  },
  {
    period: 'Jul 2024 - Feb 2026',
    title: 'UX/UI Design Consultant',
    subtitle: 'Fintech & Banking Interfaces',
    company: 'Ancient Technologies',
    location: 'Austin, TX (Remote)',
    highlights: [
      'Led UX engineering for ancient.global, a marketing platform serving 15+ countries across LATAM, US and Europe.',
      'Architected a unified design system for 4 fintech products: 80+ reusable Figma components with comprehensive design tokens.',
      'Engineered a GPT-4 conversational chatbot with modular multi-assistant orchestration across 15+ service pages.',
    ],
  },
  {
    period: 'Apr - Nov 2024',
    title: 'UX/UI Designer & Frontend Developer',
    subtitle: 'E-commerce & Shopify',
    company: 'Spil Creative',
    location: 'Brooklyn, NY (Remote)',
    highlights: [
      'Designed and developed Shopify storefronts for Goslings Rum Bermuda, Health-Ade Kombucha and Leaders in Global Energy Insurance.',
      'Built custom Shopify templates using Liquid with flexible, brand-specific component architectures.',
    ],
  },
  {
    period: 'Apr - Nov 2023',
    title: 'Web Designer',
    subtitle: 'Wix Studio & Google Partnership',
    company: 'Zoek Marketing',
    location: 'San Francisco, CA (Remote)',
    highlights: [
      'Coordinated UX, design and development teams for website redesign projects across US clients.',
      'Translated Figma designs into production Wix Studio implementations with improved visual quality and responsiveness.',
    ],
  },
]

const VOLUNTEERING = [
  {
    period: 'Oct 2024 - Present',
    title: 'Senior UX Designer',
    company: 'Athenis AI',
    label: 'Education',
    text: 'Design UX for an AI-powered e-learning platform with immersive 3D simulations, personalized learning paths, and real-time AI guidance.',
  },
  {
    period: 'Feb - Apr 2025',
    title: 'Frontend Developer',
    company: 'Opinator',
    label: 'CX Technology',
    text: 'Designed and implemented interactive, branded CX feedback interfaces (OPIs) for major clients across Europe and the Americas, working with the Madrid core team.',
  },
  {
    period: 'Apr - Oct 2024',
    title: 'Computer Science Teacher',
    company: 'Algorithmics Global',
    label: 'Education',
    text: 'Taught web design, Python, programming logic and digital literacy to 50+ students ages 6-17 through engaging, age-appropriate lessons.',
  },
  {
    period: 'Mar 2023 - May 2024',
    title: 'Software Engineer',
    company: 'CCyTEM',
    label: 'Social Impact',
    text: 'Programmed NAO robots with Python/C++ for 1,200+ students across 15+ underserved rural communities via the Science Trailer mobile outreach program.',
  },
]

const INVOLVEMENT = [
  { text: 'Designed AWE Nites CDMX website (awexr.mx) for Mexico City\'s largest XR/VR/AI community (425+ members). Awarded GSAP \'Site of the Day\'.', label: 'Community' },
  { text: 'Taught web design, Python and programming logic to 50+ students (ages 6-17) through Algorithmics Global.', label: 'Education' },
  { text: 'Programmed NAO robots with Python/C++ for 1,200+ students across 15+ underserved rural communities via CCyTEM\'s mobile science museum.', label: 'Social Impact' },
]

const EDUCATION = [
  'M.S. Software Engineering Management (UTEL, 2024)',
  'B.S. Computer Software Engineering (UTEL, 2023)',
  'AI Certificate (MIT via Santander Open Academy, 2024)',
  'IoT Certificate (MIT via Santander Open Academy, 2024)',
  'Data Science (BEDU + Microsoft + TecnolochicasPro)',
  'Film & Cinema Studies (UAM, 2022)',
  'Advanced English C1 (Platzi)',
  'Machine Learning with Python (Platzi, 2024)',
  'AWS & Azure Cloud Certifications (Platzi)',
  'Fullstack JS + React (Platzi)',
]

const STACK = {
  'Product & Design': ['Figma', 'Figma AI', 'Design Tokens', 'Atomic Design', 'Radix UI', 'Shadcn/UI', 'WCAG 2.1 AA', 'Spline', 'Three.js'],
  'Frontend': ['Next.js', 'React', 'Astro', 'TypeScript', 'Tailwind CSS', 'GSAP', 'Framer Motion', 'Zustand', 'Shopify Liquid'],
  'Marketing & Analytics': ['GA4', 'GTM', 'Salesforce', 'Resend', 'UTM', 'Conversion Tracking', 'Meta Ads', 'Google Ads', 'Power Automate'],
  'CMS & APIs': ['Payload', 'Strapi', 'Webflow', 'WordPress (headless)', 'GraphQL', 'REST', 'n8n', 'OpenAI API', 'Claude API'],
  'Infrastructure': ['Vercel', 'Cloudflare', 'Supabase', 'PostgreSQL', 'Docker', 'Sentry', 'CI/CD', 'AWS', 'GCP'],
  'AI & Automation': ['MCP Servers', 'LLM Orchestration', 'n8n', 'Python', 'Tool-calling Agents'],
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('about')

  return (
    <>
      {/* Hero */}
      <section data-theme-section="dark" className="relative min-h-[53vh] md:min-h-[64vh] lg:min-h-[71vh] px-4 lg:px-6 pt-20 overflow-hidden flex flex-col justify-center text-white">
        <div
          data-parallax="trigger"
          data-parallax-scroll-start="top top"
          data-parallax-start="0"
          data-parallax-end="40"
          className="absolute inset-0 z-0 h-[120%]"
        >
          <img
            data-parallax="target"
            src="https://pub-3ed7c563bcaa4c7c8ed703c87bbc1631.r2.dev/melight.webp"
            alt=""
            className="w-full h-full object-cover object-bottom"
          />
        </div>
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/20 via-black/30 via-40% to-transparent" />
        <Container className="relative z-[1] mb-6">
          <Pill>{t('eyebrow')}</Pill>
          <h1
            data-rotating-title
            data-step-duration="1.5"
            className="mt-6 text-[clamp(2rem,5vw,4rem)] font-bold leading-[1.05] tracking-tight max-w-[25ch]"
          >
            <span
              data-rotating-words="Hello, Hola, Bonjour, Ciao, Hallo, Ola, Namaste, Merhaba, Hej, Aloha, Salut, Ahoj, Sawubona, Jambo, Kamusta, Saluton, Ndewo, Szia, Xin chao, Sawasdee, Annyeong, Konnichiwa, Ni hao, Shalom, Privet, Salam"
              className="rotating-text__highlight"
            >Hello</span>, I'm Karen.
          </h1>

          {/* Divider */}
          <div className="mt-8 mb-8 h-[5px] w-full bg-current" />

          <div className="flex items-center gap-3">
            <IconButton
              href="https://www.instagram.com/karenrebeca.og/"
              target="_blank" rel="noopener noreferrer"
              aria-label="Instagram"
              variant="secondary"
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M21.94 7.88C21.9206 7.0503 21.7652 6.2294 21.48 5.45C21.2283 4.78181 20.8322 4.17742 20.32 3.68C19.8226 3.16776 19.2182 2.77166 18.55 2.52C17.7706 2.23484 16.9497 2.07945 16.12 2.06C15.06 2 14.72 2 12 2C9.28 2 8.94 2 7.88 2.06C7.0503 2.07945 6.2294 2.23484 5.45 2.52C4.78181 2.77166 4.17742 3.16776 3.68 3.68C3.16743 4.17518 2.77418 4.78044 2.53 5.45C2.23616 6.22734 2.07721 7.04915 2.06 7.88C2 8.94 2 9.28 2 12C2 14.72 2 15.06 2.06 16.12C2.07721 16.9508 2.23616 17.7727 2.53 18.55C2.77418 19.2196 3.16743 19.8248 3.68 20.32C4.17742 20.8322 4.78181 21.2283 5.45 21.48C6.2294 21.7652 7.0503 21.9206 7.88 21.94C8.94 22 9.28 22 12 22C14.72 22 15.06 22 16.12 21.94C16.9497 21.9206 17.7706 21.7652 18.55 21.48C19.2134 21.219 19.816 20.8242 20.3201 20.3201C20.8242 19.816 21.219 19.2134 21.48 18.55C21.7652 17.7706 21.9206 16.9497 21.94 16.12C21.94 15.06 22 14.72 22 12C22 9.28 22 8.94 21.94 7.88ZM20.14 16C20.1327 16.6348 20.0178 17.2637 19.8 17.86C19.6327 18.2913 19.3773 18.683 19.0501 19.0101C18.723 19.3373 18.3313 19.5927 17.9 19.76C17.3037 19.9778 16.6748 20.0927 16.04 20.1C15.04 20.15 14.67 20.16 12.04 20.16C9.41 20.16 9.04 20.16 8.04 20.1C7.38073 20.1148 6.72401 20.0132 6.1 19.8C5.66869 19.6327 5.27698 19.3773 4.94985 19.0501C4.62272 18.723 4.36734 18.3313 4.2 17.9C3.97775 17.2911 3.86271 16.6482 3.86 16C3.86 15 3.8 14.63 3.8 12C3.8 9.37 3.8 9 3.86 8C3.86271 7.35178 3.97775 6.70893 4.2 6.1C4.36734 5.66869 4.62272 5.27698 4.94985 4.94985C5.27698 4.62272 5.66869 4.36734 6.1 4.2C6.70893 3.97775 7.35178 3.86271 8 3.86C9 3.86 9.37 3.8 12 3.8C14.63 3.8 15 3.8 16 3.86C16.6348 3.86728 17.2637 3.98225 17.86 4.2C18.2913 4.36734 18.683 4.62272 19.0101 4.94985C19.3373 5.27698 19.5927 5.66869 19.76 6.1C19.9959 6.7065 20.1245 7.34942 20.14 8C20.19 9 20.2 9.37 20.2 12C20.2 14.63 20.19 15 20.14 16Z"/><path d="M12 6.86C10.9834 6.86 9.98964 7.16146 9.14437 7.72625C8.2991 8.29104 7.64029 9.0938 7.25126 10.033C6.86222 10.9722 6.76044 12.0057 6.95876 13.0028C7.15709 13.9998 7.64663 14.9157 8.36547 15.6345C9.08431 16.3534 10.0002 16.8429 10.9972 17.0412C11.9943 17.2396 13.0278 17.1378 13.967 16.7487C14.9062 16.3597 15.709 15.7009 16.2738 14.8556C16.8385 14.0104 17.14 13.0166 17.14 12C17.14 10.6368 16.5985 9.32941 15.6345 8.36547C14.6706 7.40153 13.3632 6.86 12 6.86ZM12 15.33C11.3414 15.33 10.6976 15.1347 10.15 14.7688C9.60234 14.4029 9.17552 13.8828 8.92348 13.2743C8.67144 12.6659 8.6055 11.9963 8.73399 11.3503C8.86247 10.7044 9.17963 10.111 9.64533 9.64533C10.111 9.17963 10.7044 8.86247 11.3503 8.73399C11.9963 8.6055 12.6659 8.67144 13.2743 8.92348C13.8828 9.17552 14.4029 9.60234 14.7688 10.15C15.1347 10.6976 15.33 11.3414 15.33 12C15.33 12.4373 15.2439 12.8703 15.0765 13.2743C14.9092 13.6784 14.6639 14.0454 14.3547 14.3547C14.0454 14.6639 13.6784 14.9092 13.2743 15.0765C12.8703 15.2439 12.4373 15.33 12 15.33Z"/><path d="M17.34 5.46001C17.1027 5.46001 16.8707 5.53039 16.6733 5.66224C16.476 5.7941 16.3222 5.98152 16.2313 6.20079C16.1405 6.42006 16.1168 6.66134 16.1631 6.89411C16.2094 7.12689 16.3236 7.34071 16.4915 7.50853C16.6593 7.67636 16.8731 7.79065 17.1059 7.83695C17.3387 7.88325 17.5799 7.85949 17.7992 7.76866C18.0185 7.67784 18.2059 7.52403 18.3378 7.32669C18.4696 7.12935 18.54 6.89734 18.54 6.66001C18.54 6.34175 18.4136 6.03652 18.1885 5.81148C17.9635 5.58643 17.6583 5.46001 17.34 5.46001Z"/></svg>}
            />
            <IconButton
              href="https://www.linkedin.com/in/karen-rebeca-ortiz-b5a860282"
              target="_blank" rel="noopener noreferrer"
              aria-label="LinkedIn"
              variant="secondary"
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.9 20.9H17.166V15.053C17.166 13.659 17.138 11.865 15.222 11.865C13.277 11.865 12.98 13.382 12.98 14.95V20.9H9.249V8.87699H12.833V10.516H12.881C13.2402 9.90278 13.7588 9.39838 14.3818 9.05643C15.0048 8.71447 15.7088 8.54775 16.419 8.57399C20.199 8.57399 20.898 11.062 20.898 14.3V20.9H20.9ZM5.036 7.23199C4.60732 7.23259 4.1881 7.10603 3.83137 6.86832C3.47463 6.63061 3.19641 6.29244 3.03191 5.89658C2.8674 5.50072 2.824 5.06497 2.9072 4.64444C2.99039 4.22392 3.19644 3.83751 3.49928 3.53411C3.80212 3.23071 4.18815 3.02395 4.60852 2.93998C5.02889 2.85601 5.46473 2.8986 5.86089 3.06237C6.25705 3.22615 6.59573 3.50374 6.8341 3.86003C7.07246 4.21633 7.1998 4.63532 7.2 5.06399C7.20039 5.34847 7.14472 5.63024 7.03615 5.89319C6.92759 6.15615 6.76827 6.39512 6.5673 6.59647C6.36633 6.79781 6.12764 6.95757 5.86489 7.06662C5.60214 7.17567 5.32048 7.23186 5.036 7.23199ZM6.906 20.9H3.165V8.87699H6.906V20.9Z"/></svg>}
            />
            <IconButton
              href="https://github.com/karenrebecag"
              target="_blank" rel="noopener noreferrer"
              aria-label="GitHub"
              variant="secondary"
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.247C9.62482 2.24599 7.32683 3.09045 5.51745 4.62917C3.70808 6.16789 2.50547 8.30041 2.12495 10.6449C1.74442 12.9894 2.21083 15.3928 3.44066 17.4248C4.67049 19.4568 6.58343 20.9847 8.83701 21.735C9.33701 21.829 9.52101 21.52 9.52101 21.254C9.52101 21.017 9.51201 20.387 9.50801 19.554C6.72701 20.154 6.14001 18.212 6.14001 18.212C5.9554 17.6074 5.56062 17.0889 5.02701 16.75C4.12201 16.13 5.09801 16.142 5.09801 16.142C5.41478 16.1858 5.71737 16.3013 5.9827 16.4798C6.24803 16.6583 6.46908 16.8951 6.62901 17.172C6.7649 17.4186 6.94832 17.6359 7.16868 17.8112C7.38904 17.9866 7.64197 18.1165 7.91284 18.1935C8.18371 18.2705 8.46715 18.293 8.74679 18.2598C9.02642 18.2266 9.2967 18.1383 9.54201 18C9.58642 17.493 9.81098 17.0187 10.175 16.663C7.95401 16.413 5.62001 15.553 5.62001 11.721C5.60586 10.7289 5.97437 9.76951 6.64901 9.042C6.33796 8.18271 6.36947 7.23668 6.73701 6.4C6.73701 6.4 7.57401 6.132 9.48701 7.425C11.1232 6.97435 12.8508 6.97435 14.487 7.425C16.387 6.132 17.224 6.4 17.224 6.4C17.5874 7.23872 17.6231 8.18324 17.324 9.047C17.9972 9.77674 18.3641 10.7373 18.349 11.73C18.349 15.572 16.012 16.417 13.787 16.663C14.024 16.9061 14.2066 17.1967 14.323 17.5156C14.4394 17.8345 14.4867 18.1744 14.462 18.513C14.462 19.852 14.449 20.927 14.449 21.252C14.449 21.514 14.624 21.827 15.137 21.727C17.3976 20.9868 19.3197 19.464 20.5576 17.4329C21.7955 15.4017 22.2679 12.9954 21.8897 10.647C21.5115 8.29856 20.3076 6.16221 18.4947 4.62233C16.6817 3.08245 14.3787 2.24015 12 2.247Z"/></svg>}
            />
            <IconButton
              href="https://music.apple.com/profile/karenrebecaog"
              target="_blank" rel="noopener noreferrer"
              aria-label="Apple Music"
              variant="secondary"
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M7.49 22.582C7.05698 22.2931 6.67253 21.9374 6.351 21.528C6.0001 21.1049 5.67454 20.6615 5.376 20.2C4.67432 19.1743 4.12495 18.0523 3.745 16.869C3.30403 15.5873 3.07404 14.2424 3.064 12.887C3.03332 11.5788 3.35009 10.2859 3.982 9.14C4.43392 8.31399 5.09811 7.62356 5.906 7.14C6.688 6.65496 7.58599 6.38902 8.506 6.37C8.85534 6.37351 9.20294 6.41985 9.541 6.508C9.807 6.581 10.128 6.7 10.522 6.847C11.022 7.039 11.3 7.158 11.392 7.186C11.6255 7.27993 11.8735 7.33239 12.125 7.341C12.3265 7.3285 12.5254 7.28846 12.716 7.222C12.849 7.176 13.1 7.094 13.458 6.938C13.811 6.81 14.092 6.7 14.314 6.618C14.6292 6.51763 14.9505 6.43779 15.276 6.379C15.6237 6.323 15.9768 6.3079 16.328 6.334C16.9359 6.37441 17.5346 6.50378 18.105 6.718C19.0223 7.07273 19.8082 7.70118 20.356 8.518C20.1198 8.66398 19.8976 8.83135 19.692 9.018C19.2452 9.4146 18.8647 9.88016 18.565 10.397C18.1722 11.1024 17.969 11.8976 17.975 12.705C17.9683 13.6351 18.2362 14.5464 18.745 15.325C19.1117 15.8858 19.59 16.3651 20.15 16.733C20.389 16.9011 20.6476 17.0394 20.92 17.145C20.81 17.488 20.689 17.823 20.549 18.153C20.2331 18.8922 19.8495 19.6005 19.403 20.269C19.008 20.846 18.696 21.277 18.46 21.561C18.1495 21.9445 17.7854 22.2813 17.379 22.561C16.9846 22.8221 16.522 22.9612 16.049 22.961C15.7288 22.9742 15.4086 22.9351 15.101 22.845C14.836 22.758 14.574 22.66 14.317 22.545C14.0482 22.422 13.7712 22.3178 13.488 22.233C13.14 22.1424 12.7816 22.0974 12.422 22.099C12.0635 22.0983 11.7064 22.1426 11.359 22.231C11.0757 22.3126 10.7981 22.4128 10.528 22.531C10.143 22.692 9.891 22.797 9.745 22.843C9.44967 22.9304 9.1454 22.9841 8.838 23.003C8.35384 22.9994 7.88097 22.8564 7.476 22.591L7.49 22.582ZM13.769 5.67C13.2152 5.96786 12.5897 6.10632 11.962 6.07C11.8801 5.43579 11.9653 4.7912 12.209 4.2C12.4202 3.6365 12.7304 3.1153 13.125 2.661C13.545 2.1855 14.0521 1.7948 14.619 1.51C15.1534 1.22087 15.7438 1.05033 16.35 1.01C16.4221 1.65252 16.3437 2.30302 16.121 2.91C15.9103 3.49616 15.6005 4.04176 15.205 4.523C14.8035 5.00179 14.3093 5.39434 13.752 5.677L13.769 5.67Z"/></svg>}
            />
          </div>

          <p className="mt-8 text-base leading-relaxed text-white/70 max-w-[55ch]">
            I'm a product engineer who lives between design and code. I build web experiences, design systems, and AI-powered tools for teams across LATAM, the US, and Europe. I care about craft, speed, and shipping things that actually work.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button061 href="#personal">Read more about me</Button061>
            <Button061 href="#professional" variant="secondary">My professional profile</Button061>
          </div>
        </Container>
      </section>


      {/* Personal statement */}
      <section id="personal" data-theme-section="light" className="px-4 lg:px-6 py-32 lg:py-48 scroll-mt-20">
        <ScrollHighlight>
          <Container>
            <p className="font-display text-[clamp(1.75rem,4.5vw,4rem)] font-bold leading-[1.15] tracking-tight">
              I fell in love with <span data-highlight>code</span> and <span data-highlight>design</span> at the same time, and I never saw a reason to pick just one. I care about the <span data-highlight>architecture underneath</span> as much as the <span data-highlight>experience on top</span>. For me, the best products come from people who <span data-highlight>obsess over both</span>.
            </p>
            <p className="mt-12 text-sm leading-relaxed text-muted-foreground max-w-[48ch]">
              I started programming robots for underserved communities, taught kids to code, and eventually found my way into product engineering. Every project since then has been about the same thing: making technology feel human, intentional, and worth using.
            </p>
          </Container>
        </ScrollHighlight>
      </section>

      {/* Gallery */}
      <InfiniteGrid />

      {/* Personal quote */}
      <section data-theme-section="light" className="px-4 lg:px-6 py-32 lg:py-48">
        <ScrollHighlight>
          <Container className="flex flex-col items-center text-center">
            <span className="text-[10px] font-bold uppercase tracking-widest font-accent text-muted-foreground">Karen Rebeca Ortiz -- Product/Design Engineer</span>
            <p className="mt-10 font-display text-[clamp(1.75rem,4.5vw,4rem)] font-bold leading-[1.15] tracking-tight max-w-[22ch]">
              I believe that <span data-highlight>curiosity</span> is stronger than talent, and that <span data-highlight>showing up every day</span>, no matter how hard, is the <span data-highlight>most honest form</span> of craft I know.
            </p>
          </Container>
        </ScrollHighlight>
      </section>

      {/* Baby photo — emotional */}
      <section data-theme-section="light" data-reveal-group className="px-4 lg:px-6 py-10 lg:py-14 overflow-hidden">
        <Container className="flex flex-col items-center">
          <div className="relative inline-block">
            {/* Photo with slight rotation */}
            <div className="relative bg-white p-3 shadow-[0_2px_20px_rgba(0,0,0,0.08)] rotate-[-2deg] max-w-[320px] md:max-w-[380px]">
              <img
                src="/gallery/baby.png"
                alt=""
                className="w-full"
              />
            </div>

            {/* "that's me" label + arrow — handwritten font */}
            <div className="absolute -top-16 -left-36 md:-left-52 flex items-end gap-2">
              <span className="text-5xl md:text-7xl text-foreground/50 whitespace-nowrap" style={{ fontFamily: 'var(--font-handwritten)' }}>that&apos;s me</span>
              <svg width="48" height="32" viewBox="0 0 48 32" fill="none" className="text-foreground/40 translate-y-1">
                <path d="M2 4C8 8 18 16 30 18C34 18.5 38 18 40 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                <path d="M36 12L41 17L35 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            </div>

            {/* Doodle — hand-drawn flower */}
            <svg className="absolute -right-32 md:-right-56 -bottom-8 md:-bottom-12 w-64 md:w-80 h-auto text-[var(--plantation)]" viewBox="0 0 120 140" fill="none">
              <path d="M60 20C65 10 75 5 80 15C85 25 75 30 70 25C65 20 55 10 60 20Z" stroke="currentColor" strokeWidth="2" fill="none" />
              <path d="M70 25C80 20 90 25 85 35C80 45 70 40 68 33C66 26 60 30 70 25Z" stroke="currentColor" strokeWidth="2" fill="none" />
              <path d="M68 33C75 40 72 55 63 50C54 45 58 38 62 36C66 34 61 26 68 33Z" stroke="currentColor" strokeWidth="2" fill="none" />
              <path d="M62 36C52 32 45 38 50 48C55 58 62 52 63 46C64 40 68 46 62 36Z" stroke="currentColor" strokeWidth="2" fill="none" />
              <path d="M63 46C55 52 50 48 52 38C54 28 62 30 63 36C64 42 70 35 63 46Z" stroke="currentColor" strokeWidth="2" fill="none" />
              <path d="M60 50C58 65 55 80 52 100C50 110 48 120 50 130" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
              <path d="M54 85C48 78 40 80 45 88C50 96 56 90 54 85Z" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>

            {/* Star doodle */}
            <svg className="absolute -top-20 -right-4 w-16 h-16 text-foreground/30" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L12 22M2 12L22 12M4.93 4.93L19.07 19.07M19.07 4.93L4.93 19.07" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            </svg>
          </div>

          {/* Origin story */}
          <ScrollHighlight>
            <div className="mt-16 max-w-[72ch]">
              <p className="text-base md:text-lg leading-[2] text-foreground/80">
                I was born in <span data-highlight>Cuernavaca, Morelos</span> in 2001, a city of eternal spring, surrounded by mountains and jacarandas. I'm the oldest of three sisters, and one of my <span data-highlight>earliest memories</span> is sitting in front of my family's computer, completely absorbed by a videogame I barely understood. That's how it started: not with a lesson, but with a feeling. The screen did something, and I needed to know why.
              </p>
              <p className="mt-8 text-base md:text-lg leading-[2] text-foreground/80">
                I remember pulling apart <span data-highlight>old electronics</span> to see what was inside, building little experiments with whatever I found, and staying up way too late reading things I was probably too young to understand. These moments weren't just about curiosity. They were about <span data-highlight>finding a world that made sense to me</span>, one where logic and imagination could live together.
              </p>
              <p className="mt-10 text-sm leading-relaxed text-muted-foreground/60 max-w-[48ch]">
                What shaped me most, though, wasn't the technology. It was the warmth of my family, the patience of my mom letting me take things apart, and a feeling that whatever I built, no matter how small, was worth building.
              </p>
            </div>
          </ScrollHighlight>
        </Container>
      </section>

      {/* Separator */}
      <div className="px-4 lg:px-6">
        <Container><div className="h-px w-full bg-border" /></Container>
      </div>

      {/* Music albums */}
      <section data-theme-section="light" className="py-20 lg:py-28">
        <div className="px-4 lg:px-6 mb-8">
          <Container>
            <span className="text-[10px] font-bold uppercase tracking-widest font-accent text-muted-foreground">On repeat</span>
            <h2 className="mt-4 text-[clamp(1.25rem,2.5vw,2rem)] font-bold leading-[1.1] tracking-tight">The soundtrack to this adventure</h2>
          </Container>
        </div>
        <DraggableMarqueeStrip items={ALBUMS} duration="30" />
      </section>

      {/* Bridge + Experience */}
      <section id="professional" data-theme-section="light" data-reveal-group className="px-4 lg:px-6 py-24 lg:py-40 scroll-mt-20">
        <ScrollHighlight>
        <Container>
          <p
            data-rotating-title
            data-step-duration="2"
            className="font-display text-[clamp(1.5rem,3.5vw,3rem)] font-bold leading-[1.15] tracking-tight max-w-[22ch]"
          >
            That curiosity turned into a{' '}
            <span
              data-rotating-words="career, craft, mission, lifestyle, purpose"
              className="rotating-text__highlight"
            >career</span>.
          </p>

          <div className="mt-16 mb-16 h-px w-full bg-border" />

          <span className="text-[10px] font-bold uppercase tracking-widest font-accent text-muted-foreground">Experience</span>
          <h2
            data-rotating-title
            data-step-duration="2.5"
            className="mt-4 text-[clamp(1.25rem,2.5vw,2rem)] font-bold leading-[1.1] tracking-tight max-w-[24ch]"
          >
            Where I've{' '}
            <span
              data-rotating-words="shipped, built, grown, learned, led"
              className="rotating-text__highlight"
            >shipped</span>
          </h2>

          <div className="mt-16 space-y-0">
            {EXPERIENCE.map((item, idx) => (
              <div key={item.company} className={`grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 py-10 ${idx < EXPERIENCE.length - 1 ? 'border-b border-border' : ''}`}>
                {/* Left col */}
                <div className="md:col-span-3">
                  <p className="text-sm font-semibold"><span data-highlight>{item.company}</span></p>
                  <span className="text-[11px] font-accent text-muted-foreground uppercase tracking-wide mt-1 block">{item.period}</span>
                  <span className="text-[11px] font-accent text-muted-foreground/50 block">{item.location}</span>
                </div>
                {/* Right col */}
                <div className="md:col-span-9">
                  <h3 className="text-base font-bold leading-snug">{item.title}</h3>
                  {item.subtitle && <p className="text-xs text-muted-foreground mt-1 font-accent uppercase tracking-wide">{item.subtitle}</p>}
                  <ul className="mt-5 space-y-2.5">
                    {item.highlights.map((h, i) => (
                      <li key={i} className="text-sm leading-[1.8] text-foreground/70">{h}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </Container>
        </ScrollHighlight>
      </section>

      {/* Beyond work + Education */}
      <section data-theme-section="light" data-reveal-group className="px-4 lg:px-6 py-24 lg:py-40">
        <ScrollHighlight>
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-10">
            {/* Volunteering */}
            <div className="md:col-span-7">
              <span className="text-[10px] font-bold uppercase tracking-widest font-accent text-muted-foreground">Volunteering</span>
              <h2
                data-rotating-title
                data-step-duration="2.5"
                className="mt-4 text-[clamp(1.25rem,2.5vw,2rem)] font-bold leading-[1.1] tracking-tight"
              >
                Beyond{' '}
                <span
                  data-rotating-words="work, code, the screen, the job"
                  className="rotating-text__highlight"
                >work</span>
              </h2>
              <div className="mt-10 space-y-0">
                {VOLUNTEERING.map((item, idx) => (
                  <div key={item.company} className={`py-6 ${idx < VOLUNTEERING.length - 1 ? 'border-b border-border' : ''}`}>
                    <div className="flex items-baseline gap-2">
                      <p className="text-sm font-semibold"><span data-highlight>{item.company}</span></p>
                      <span className="text-[10px] font-accent text-muted-foreground uppercase tracking-wide">{item.label}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{item.title} / {item.period}</p>
                    <p className="mt-3 text-sm leading-[1.8] text-foreground/70">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Education + Stack */}
            <div className="md:col-span-5">
              <span className="text-[10px] font-bold uppercase tracking-widest font-accent text-muted-foreground">Education</span>
              <div className="mt-6 space-y-3">
                {EDUCATION.map((item) => (
                  <p key={item} className="text-sm leading-relaxed text-foreground/70">{item}</p>
                ))}
              </div>

              <div className="mt-16">
                <span className="text-[10px] font-bold uppercase tracking-widest font-accent text-muted-foreground">Stack</span>
                <div className="mt-6 space-y-8">
                  {Object.entries(STACK).map(([category, tools]) => (
                    <div key={category}>
                      <span className="text-[11px] font-accent text-muted-foreground/60 uppercase tracking-wide">{category}</span>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {tools.map((tech) => (
                          <span key={tech} className="px-2.5 py-1 text-[11px] font-accent bg-secondary text-secondary-foreground">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
        </ScrollHighlight>
      </section>

      {/* Contact */}
      <ContactSection />
    </>
  )
}
