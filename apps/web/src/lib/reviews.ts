export type Review = {
  name: string
  role: string
  quote: string
  /** Public path to a square headshot; falls back to a monogram when absent. */
  photo?: string
}

export const REVIEWS: Review[] = [
  {
    name: 'Elias Aquique',
    role: 'CEO, Sodio Comunicacion Visual',
    quote:
      'Her constant willingness to learn has kept her at the forefront of her field. Karen has shown excellent communication skills with both team members and clients, ensuring timely delivery of high-quality projects.',
    photo: '/reviews/elias-aquique.webp',
  },
  {
    name: 'Nayeli Quinto',
    role: 'Art Director, Aurin',
    quote:
      'Karen took complex requirements, broke them down, and turned them into clear, functional interfaces. She proposed UX improvements and ensured brand guidelines, accessibility, and performance were respected across every deliverable.',
    photo: '/reviews/nayeli-quinto.webp',
  },
  {
    name: 'Andrea Blass',
    role: 'Fullstack Developer & Community Lead',
    quote:
      'Karen stands out for her intelligence, attention to detail, and ability to learn fast. She consistently brought clear solutions, meaningful improvements, and a strong user-centered perspective to every project.',
    photo: '/reviews/andrea-blass.webp',
  },
  {
    name: 'Jovani Olguin',
    role: 'UX/UI Designer, Ancient',
    quote:
      'Working alongside Karen at Ancient was effortless. She bridges design and engineering better than anyone I have paired with. She turned our interface into a consistent, scalable system and pushed every detail until it simply felt right.',
    photo: '/reviews/jovani-olguin.webp',
  },
  {
    name: 'Anthony Rafael Gomez Pacheco',
    role: 'CEO, Athenis AI',
    quote:
      'Karen demonstrated outstanding expertise in UX/UI design, standing out for her proactivity and strategic mindset. Her ability to align product vision with brand identity made a significant impact on our business.',
    photo: '/reviews/anthony-gomez.webp',
  },
  {
    name: 'Dr. Honnor Da Silva',
    role: 'CEO, TECOTV',
    quote:
      'Her ability to work as part of a team, her creativity, and her attention to detail were key aspects that stood out in her performance. Her support and guidance were invaluable, allowing me to grow professionally.',
    photo: '/reviews/honnor-da-silva.webp',
  },
  {
    name: 'Damian Dominguez',
    role: 'Founder & Director, Spil Creative',
    quote:
      'An excellent colleague! Always cheerful, incredibly creative, and highly punctual. Her contributions to Spil Creative have been invaluable.',
    photo: '/reviews/damian-dominguez.webp',
  },
  {
    name: 'Ana Villanueva',
    role: 'Frontend Development Teacher, Tecnolochicas Pro',
    quote:
      'Karen has demonstrated a deep commitment to excellence, consistently delivering high-quality frontend solutions. Her solid technical knowledge and ability to innovate set her apart.',
    photo: '/reviews/ana-villanueva.webp',
  },
  {
    name: 'Rene Chavez',
    role: "Museographer & Director, Science's Trailer",
    quote:
      'Dedicated and proactive, always eager to learn. Karen has done an outstanding job in every project, and I truly enjoy working with her.',
    photo: '/reviews/rene-chavez.webp',
  },
  {
    name: 'Irving Estrada',
    role: 'Photographer & Videographer',
    quote:
      'Her commitment and professional ethics were fundamental to the success of our projects. She is an exceptional professional who brings value and quality to every project she is involved in.',
    photo: '/reviews/irving-estrada.webp',
  },
]
