import { setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import { Container } from '@/components/ui/container'
import { ContactSection } from '@/components/contact-section'
import { Pill } from '@/components/ui/pill'
import { Button061 } from '@/components/ui/button-061'
import { MermaidDiagram } from '@/components/mermaid-diagram'
import { ArticleTOC } from '@/components/article-toc'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Webflow como plataforma de desarrollo context-driven | Karen Ortiz',
    description: 'Exploración técnica de Webflow como herramienta seria de context-driven development. Arquitectura híbrida, agentes de IA, design systems y custom code en producción para new.atomchat.io.',
  }
}

export default async function AtomWebflowArticlePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <>
      {/* Hero — dark, matching about page visual language */}
      <section data-theme-section="dark" className="relative px-4 lg:px-6 pt-40 pb-20 bg-surface text-surface-foreground">
        <Container>
          <div className="mb-6">
            <Button061 href="/#projects" arrow="left">
              Volver a proyectos
            </Button061>
          </div>

          <Pill>Artículo • 2026</Pill>

          <h1 className="mt-6 text-[clamp(2rem,5vw,4rem)] font-bold leading-[1.05] tracking-tight max-w-[22ch]">
            Webflow como plataforma de desarrollo context-driven
          </h1>

          <p className="mt-8 text-base leading-relaxed text-surface-foreground/70 max-w-[55ch]">
            En el rediseño del sitio principal de Atomchat (new.atomchat.io) decidí usar Webflow de una forma poco convencional: como la base de una arquitectura de producto real. Una exploración práctica y técnica de lo que significa hacer context-driven development dentro de una plataforma visual.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <span className="px-3 py-1.5 text-xs font-accent bg-white/10 text-surface-foreground">Webflow</span>
            <span className="px-3 py-1.5 text-xs font-accent bg-white/10 text-surface-foreground">GSAP + ScrollTrigger</span>
            <span className="px-3 py-1.5 text-xs font-accent bg-white/10 text-surface-foreground">Design Systems</span>
            <span className="px-3 py-1.5 text-xs font-accent bg-white/10 text-surface-foreground">AI Agents + MCP</span>
            <span className="px-3 py-1.5 text-xs font-accent bg-white/10 text-surface-foreground">Hybrid Architecture</span>
          </div>

          <div className="mt-10 flex gap-4">
            <Button061 href="https://new.atomchat.io" target="_blank" rel="noopener noreferrer">
              Ver sitio en vivo
            </Button061>
            <Button061 href="https://github.com/karenrebecag/AtomWebflow_2026Site" target="_blank" rel="noopener noreferrer" variant="secondary">
              Ver repositorio
            </Button061>
          </div>
        </Container>
      </section>

      {/* Table of Contents + Article Content */}
      <section data-theme-section="light" className="px-4 lg:px-6 py-16 lg:py-24">
        <Container>
          <ArticleTOC
            title="On this page"
            levels="h2,h3"
            offset={80}
          >
            {/* All article content lives here — headings (h2/h3) are auto-scanned for the TOC */}
            <div className="toc-article-content space-y-6 text-[15px] leading-relaxed text-foreground/85">
              <h2>La promesa y la trampa del no-code</h2>
              <p>
                Webflow promete velocidad y autonomía: marketing puede cambiar textos, publicar páginas y gestionar CMS sin esperar un deploy. Esa promesa es real y poderosa. Pero cuando el proyecto requiere interacciones de alta fidelidad, un lenguaje visual estricto de marca y componentes que se comporten de forma predecible en múltiples contextos, la promesa choca con la realidad de que el código "custom" inline es difícil de versionar, revisar y mantener con calidad.
              </p>
              <p>
                La pregunta que guió este trabajo fue: ¿y si en vez de pelearnos con las limitaciones, diseñáramos un sistema que aprovechara lo mejor de la plataforma visual y lo mejor de la ingeniería tradicional?
              </p>

              <h2>Contexto como primera clase ciudadana</h2>
              <p>
                Lo más interesante no fue la arquitectura técnica en sí (código externo versionado servido por CDN, componentes con data-attributes, GSAP integrado respetando las peculiaridades de Webflow y Rocket Loader). Lo más interesante fue cómo todo el proceso de desarrollo se volvió <strong>context-driven</strong>.
              </p>
              <p>
                Antes de proponer cualquier componente o interacción, el flujo de trabajo consultaba un conjunto explícito de fuentes de verdad:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Las reglas estrictas del sistema de marca vía atom-docs MCP (colores, tipografía Inter como única autorizada, contraste, orange #FF6600 solo como acento, nunca negro puro #000000).</li>
                <li>La documentación de arquitectura del proyecto (CLAUDE.md + ORCHESTRATOR.md).</li>
                <li>Las lecciones aprendidas de iteraciones anteriores (CHANGELOG + skills).</li>
                <li>Un "orquestador" que indicaba qué skills y patrones aplicar según el tipo de tarea (GSAP vs Webflow MCP vs Code Component workflow).</li>
              </ul>
              <p>
                Esto transforma la relación con las herramientas de IA. En vez de pedirle al modelo que "haga un botón bonito", el contexto le dice: respeta esta paleta, este sistema de espaciado, esta decisión previa sobre animaciones, y además verifica contra las guías oficiales de marca antes de sugerir nada. El desarrollo deja de ser una serie de decisiones ad-hoc y se convierte en la aplicación consistente de un sistema de valores y restricciones.
              </p>

              <h2>Híbrido que no obliga a elegir bando</h2>
              <p>
                El modelo que emergió es genuinamente híbrido:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Webflow</strong> sigue siendo el lugar donde se define la estructura semántica, el CMS y el contenido que marketing necesita tocar a diario.</li>
                <li>El código de comportamiento avanzado (navegaciones complejas con intención de hover + morph, animaciones de texto por carácter con SplitText, paredes de logos con shuffle + ScrollTrigger pause, mega-nav con full keyboard + resize handling) vive en un repositorio Git, se versiona con tags y se carga de forma controlada vía jsDelivr (nunca @latest).</li>
              </ul>
              <p>
                Esto significa que un cambio de copy o la publicación de una nueva página no requiere coordinación con desarrollo. Y al mismo tiempo, las interacciones críticas mantienen coherencia, performance y accesibilidad porque están sujetas a revisión, pruebas y versionado real.
              </p>

              {/* Technical diagram - more technical as requested */}
              <div className="my-10 not-prose">
                <div className="text-[11px] font-accent text-muted-foreground uppercase tracking-wide mb-2">Arquitectura</div>
                <MermaidDiagram
                  chart={`graph TD
subgraph WF["Webflow (Visual + CMS)"]
    V[Visual Builder + CMS]
    P[Publish Cycle]
end

subgraph EXT["External Code (Git + CDN)"]
    G[Git + Version Tags]
    C[jsDelivr CSS/JS]
    M[Modules + autoDetect]
end

subgraph AGT["Agent Context Layer"]
    O[ORCHESTRATOR.md]
    S[GSAP / Webflow skills]
    B[Brand Rules MCP]
end

WF <-->|Custom Code Contract| EXT
AGT -->|Context + Brand| WF
AGT -->|Patterns + Constraints| EXT
EXT -->|Enhanced behaviors| WF
`}
                />
                <p className="text-xs text-muted-foreground mt-2">Diagrama de la arquitectura híbrida context-driven: Webflow como base visual + código externo versionado + agentes/MCP como capa de contexto.</p>
              </div>

              <h2>Contexto técnico que vale la pena defender</h2>
              <h3>GSAP + Webflow constraints (no trivial)</h3>
              <p>
                Webflow bundlea GSAP 3.15 + ScrollTrigger de forma nativa. Cloudflare Rocket Loader reescribe los scripts, por lo que <code>window.gsap</code> puede no existir cuando nuestro <code>type="module"</code> se ejecuta. La solución es un <code>waitForGSAP</code> con polling + carga UMD solo para plugins que no vienen (SplitText). Nunca asumir ESM desde jsDelivr (no existen los archivos .esm.min.js).
              </p>

              <h3>Data attributes como contrato</h3>
              <p>
                Webflow no publica <code>data-module</code> en el root de los componentes reutilizables. Por eso usamos <code>autoDetect</code> por selectores propios (<code>[data-button-041]</code>, <code>[data-logo-wall-cycle-init]</code>, <code>[data-menu-wrap]</code>). El diseñador controla la estructura en el Designer; el código solo reacciona a los atributos que el diseñador pone en los elementos internos.
              </p>

              <h3>Versionado real en producción</h3>
              <p>
                Nunca <code>@latest</code>. jsDelivr cachea agresivamente. Usamos tags semánticos (<code>@v1.3.0</code>) o commit hash para iteración rápida. El script tag lleva <code>data-cfasync="false"</code> para evitar Rocket Loader.
              </p>

              <h2>Lo que este proyecto dice sobre el futuro (más técnico)</h2>
              <p>
                Webflow puede ser una plataforma de ingeniería seria cuando se le da una capa de contexto explícito alrededor: brand-as-code (MCP + docs), decision frameworks (ORCHESTRATOR), versioning externo y una clara separación de responsabilidades entre lo que el visual builder maneja bien y lo que necesita código real.
              </p>
              <p>
                El verdadero avance no está en elegir entre visual o código. Está en construir sistemas donde el contexto —reglas de marca, arquitectura, aprendizajes previos, constraints de performance— sea tan fácil de consultar y tan presente en cada paso como lo es un design token.
              </p>

              <h2>Colophon</h2>
              <p>
                Este artículo usa el Table of Contents component (data-attr driven + GSAP ScrollTrigger) como fixture. El diagrama de arquitectura está generado con Mermaid. Todo el código del sitio (incluyendo este artículo) vive en el mismo repo que el sistema de skills del agente.
              </p>
            </div>
          </ArticleTOC>
        </Container>
      </section>

      {/* Contact */}
      <ContactSection />
    </>
  )
}
