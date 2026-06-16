> [!tip] In 30 seconds
> - **Who this is for:** Estudios como Aurin y artistas como María Luisa de Mateo que venden y muestran principalmente en Artsy e Instagram y necesitan una presencia web que se sienta como una extensión natural de su práctica, no como otra herramienta que hay que aprender.
> - **Problem it solves:** La mayoría de sitios para artistas o estudios o diluyen la obra con plantillas genéricas, o obligan a equipos no técnicos a pelear con un CMS, un builder o un desarrollador por cada ajuste.
> - **What changes if you apply this:** Un frontend moderno y sólido, con plantillas claras, tokens compartidos y contratos explícitos, para que el estudio y la artista controlen la historia, el ritmo, la selección y la voz visual, mientras la arquitectura permanece invisible y el sitio sigue siendo rápido, bilingüe y preparado para nuevas capas.

Aurin es un estudio pequeño que trabaja en la intersección de marca, experiencia visual y artistas. No solo diseñan campañas: construyen contextos donde el arte y el diseño se comportan como productos. María Luisa de Mateo es una de las artistas a las que acompañan. Su trabajo vive en Artsy para la venta y en Instagram para la presencia. Es íntimo, textural y preciso. No quiere sentirse como un portafolio corporativo ni como una tienda.

Mi rol en este proyecto fue híbrido: parte diseño de producto, parte arquitectura frontend. No estaba ahí para “hacerles el sitio”. Estaba ahí para construir el suelo técnico sobre el que el equipo creativo pudiera seguir haciendo lo que ya sabe hacer bien—curar, secuenciar y presentar obra—sin que la tecnología se volviera protagonista.

## El contexto: contar arte en la web sin convertir a los artistas en editores

> **En pocas palabras:** El sitio tenía que soportar tanto proyectos de estudio como artistas individuales sin sentirse como plantillas genéricas. El equipo principal no es técnico. El frontend tenía que ser fuerte, pero invisible para ellos.

María Luisa ya tenía distribución. Vende en Artsy. Muestra proceso y piezas terminadas en Instagram. Lo que necesitaba no era otro lugar para subir imágenes y escribir captions. Necesitaba un espacio que pudiera leer esos canales existentes y aun así sentirse como una galería: silencioso, intencional, suyo.

Lo mismo aplicaba para Aurin como estudio. Tienen varios artistas, varios proyectos de cliente y un cuerpo de trabajo en evolución. No querían mantener dos lógicas distintas: una para “trabajo de estudio” y otra para “páginas de artista”. Querían un sistema subyacente que pudiera expresar voces diferentes sin convertirse en un Frankenstein.

Para las personas que realmente operan el sitio—diseñadoras gráficas, directoras de arte, la propia artista—“actualizar el sitio” tenía que sentirse como una decisión de diseño y contenido, no como un ticket de desarrollo.

## El reto de producto: un sitio vivo que no se sienta como “otro CMS”

Aurin quería tres cosas que suelen estar en tensión:

- Un portafolio vivo de proyectos de estudio y artistas individuales.
- Poder sumar nuevos cuerpos de obra, colecciones y experimentos sin tener que rehacer páginas desde cero.
- Una identidad de estudio sólida que nunca compita con la voz específica de cada artista.

La restricción real no era tecnológica. Era de sensibilidad. La dirección de arte cambia. Una serie nueva puede necesitar más aire, otro peso de imagen o un momento de tipografía más silencioso. Si cada variación requiere un desarrollador, el estudio pierde velocidad y la artista pierde ownership.

> “No buscábamos otro WordPress con plantilla premium; necesitábamos una estructura que se sintiera hecha a medida para la forma en que Aurin cura y presenta su trabajo.”

Esa frase se volvió la estrella polar.

## Frontend silencioso: decisiones técnicas que el equipo creativo nunca tiene que ver

### El stack como infraestructura invisible

El sitio principal del estudio de Aurin (AurinWebsite) está construido en Astro con islas de React donde hace falta. La presencia de María Luisa es un sitio enfocado en Next.js que consume disponibilidad en vivo desde la GraphQL de Artsy, sirve 47 obras desde Cloudflare R2 e incluye una franja de Instagram resistente que cae a imágenes estáticas cuando el feed falla o se limita. Ambos usan GSAP para motion que acompaña la obra en lugar de competir con ella. El routing bilingüe está resuelto de forma limpia para que la misma lógica editorial exista en español y en inglés.

Nada de esto le interesa a una artista o a una directora de arte.

Lo que les importa es que una serie nueva pueda aparecer como “otra página de artista” sin que nadie tenga que inventar un layout desde cero. Lo que me importa a mí es que el mismo contrato de layout pueda reutilizarse en diez artistas y que cada uno siga sintiéndose específico.

La artista ve “una página”. Yo veo “un layout reutilizable con slots y restricciones bien definidos”.

La directora creativa ve “una secuencia hermosa de imágenes”. Yo veo “un componente que acepta un conjunto específico de tratamientos de imagen y nunca deja que el ritmo se rompa”.

### Contratos claros: qué es rígido y qué es flexible

Trazamos una línea dura desde el principio.

Rígido (el equipo no toca esto sin conversación):
- Navegación principal y footer
- Escala tipográfica base y medida
- Sistema de grid y espaciado nuclear
- Líneas base de performance y accesibilidad

Flexible (ellos lo deciden todos los días):
- Orden y presencia de secciones en una página
- Selección de imágenes, lógica de recorte y captions
- Copy y micro-copy
- Qué bloques aparecen juntos y en qué secuencia (dentro de patrones aprobados)

Esto es diseño de producto con sombrero de frontend. Cada decisión técnica se evaluó con una sola pregunta: ¿esto aumenta o disminuye la sensación de ownership del equipo creativo?

## Diseñar plantillas para sensibilidad artística

### Estructura editorial antes que componentes

Abordé el sitio menos como un portafolio y más como una pequeña revista o publicación de galería viva.

Eso significó pensar primero en el ritmo de scroll, la alternancia de peso entre texto e imagen, el rol del espacio en blanco y cómo se mueve un visitante desde “quién es” hasta “mira esta obra”, “así es como se hizo” y “piezas relacionadas”.

Algunas de las lecciones más afiladas vinieron de dominios completamente distintos—productos financieros y herramientas internas complejas—donde el storytelling también tiene que sobrevivir restricciones reales. La disciplina de progressive disclosure, de dejar que las imágenes importantes respiren, de no dejar que el texto pelee con lo visual, se traduce directo.

> **En pocas palabras:** Cada plantilla responde a “qué historia queremos que cuente esta página”. La artista no piensa en grids de 12 columnas. Piensa en “obra destacada, contexto, proceso, piezas relacionadas”.

### El caso concreto: la presencia de María Luisa

Necesitaba tres cosas al mismo tiempo:
- Que su obra fuera la protagonista (colecciones y piezas individuales).
- Una idea clara de quién es y cómo trabaja, sin lenguaje de biografía corporativa.
- Un tono íntimo y algo silencioso que acompañara el trabajo mismo.

Reutilizamos layouts base del sistema de Aurin pero ajustamos densidad, peso de texto y uso de color para ella. El mismo grid subyacente y sistema de tokens están ahí, pero la página respira distinto. La obra puede ser grande y silenciosa. El texto de apoyo se queda pequeño y secundario. La franja de Instagram y la disponibilidad de Artsy aparecen donde apoyan el descubrimiento sin sentirse nunca como el evento principal.

El resultado sigue leyéndose como “Aurin acompaña a esta artista”, pero no se siente como una plantilla del estudio con su nombre cambiado.

## Empoderar equipos no técnicos sin que se den cuenta

### Cómo se ve el ownership desde su lado

El equipo creativo puede:
- Crear una nueva página de artista o caso de proyecto a partir de una plantilla existente.
- Actualizar imágenes, captions, orden de obras y textos descriptivos.
- Re-secuenciar bloques dentro de una página (hero, contexto, proceso, relacionados) sin romper el layout ni el performance.
- Agregar una nueva colección o serie y que aparezca en los lugares correctos de forma automática.

Cuando María Luisa termina un nuevo cuerpo de trabajo, sumarlo es una tarea de curaduría. Cuando Aurin cierra un proyecto de cliente que merece visibilidad, publicarlo es una decisión editorial. Para ellos, “actualizar el sitio” es una actividad de diseño y contenido.

> “Para ellos, ‘actualizar el sitio’ es una tarea de diseño y contenido, no una solicitud a desarrollo.”

### Qué tienes que preparar tú para que eso funcione de verdad

No puedes darles libertad sin guardrails y esperar que la coherencia se mantenga sola.

Preparamos:
- Nombres de componentes y bloques extremadamente claros (nada de nombres internos ingeniosos que solo entienda el desarrollador).
- Guidelines visuales simples: “este bloque casi siempre va después de este otro”, “estos dos tratamientos nunca conviven en la misma página”, “máximo de X imágenes en esta secuencia”.
- Artefactos de handoff livianos en Figma y Notion que el equipo realmente usa.
- Un sistema de tokens (colores, espaciados, tipografías, radios, curvas de movimiento) que se siente como “la voz de Aurin” para quien elige los valores, mientras es un contrato duro del lado del código.

Ellos experimentan libertad creativa. El sistema experimenta consistencia y escalabilidad.

## Frontend pesado, decisiones ligeras: sistemas, tokens y componentes

### Pensamiento atómico aplicado a trabajo sensible

Usamos una lente ligera de Atomic Design, pero siempre al servicio de las personas que realmente iban a tocar el sitio:

- Átomos: escala tipográfica, tokens de color, botones y links básicos, unidades de espaciado.
- Moléculas y organismos: tarjetas de obra, módulos de resumen de proyecto, apareamientos de texto + imagen, los bloques de conexión con Instagram y Artsy.
- Plantillas y páginas: la forma reutilizable de presencia de artista, la de proyecto de estudio, la vista de colección.

El poder está en el remezcle. Una nueva artista puede usar el mismo lenguaje de plantilla que María Luisa pero con peso de imagen y densidad de texto completamente distintos. Un proyecto de estudio puede sentirse más estructurado. Los contratos subyacentes evitan que todo derive hacia el gusto personal en cada página.

### Los tokens como lenguaje compartido

Los design tokens terminaron siendo la pieza de infraestructura “silenciosa” más importante.

Desde la perspectiva del equipo creativo, simplemente están eligiendo de un conjunto de estilos que ya se sienten como Aurin. Desde mi perspectiva, son contratos exigibles. Cuando alguien quiere un naranja ligeramente distinto para un proyecto especial, podemos discutir si es una excepción puntual o un nuevo token semántico que debería entrar al sistema. La conversación pasa en el nivel correcto.

Sin tokens, cada página nueva se convierte lentamente en su propio micro-sistema y la identidad del estudio se diluye. Con tokens, el equipo puede moverse rápido dentro de un marco que protege la marca.

## Un frontend preparado para lo que viene después

Aurin es también el estudio detrás del trabajo de agente conversacional que conté en otro artículo. Los mismos contratos que hacen que los sitios actuales se sientan calmados e intencionales son los que permiten que nuevas capas interactivas—experiencias de chat, recorridos guiados, superficies futuras impulsadas por agentes—aterricen sin pelear con el sistema visual y editorial existente.

Cuando aparece una nueva capacidad, el artista o el equipo del estudio ve “un nuevo tipo de bloque” o “una sección nueva que podemos activar”. No ven un nuevo proyecto técnico. La arquitectura ya sabe cómo quedarse fuera del camino.

Por eso estructurar componentes y tokens con claridad hoy también hace que el sitio sea una mejor superficie para edición o generación asistida por IA mañana. El modelo tiene límites claros que respetar en lugar de tener que adivinar qué “se siente como Aurin”.

## Lo que esto enseña realmente a diferentes audiencias

**Para estudios y artistas**
No necesitas entender el stack. Sí necesitas entender la lógica de plantillas y bloques aprobados. Cuando encargas un sitio, pide ownership sobre contenido y estructura, no solo “un sitio terminado”. El mejor trabajo de frontend para prácticas creativas es el que dejas de notar después de la primera semana.

**Para diseñadores de producto y UX**
Diseñar para arte y artistas es diseñar sistemas editoriales y de publicación, no portafolios. La parte más difícil suele ser decidir qué puede tocar el equipo no técnico y qué debe quedar protegido. Haz ese trabajo junto con el frontend engineer, no después de que el diseño esté “listo”.

**Para frontend engineers**
La arquitectura moderna (islas en Astro, modelos de componentes limpios, tokens, Next.js o equivalente) solo importa cuando se vuelve invisible para las personas que crean el contenido real. La elegancia en el código es lo mínimo. La prueba real es si una diseñadora o una artista puede publicar algo nuevo un viernes por la tarde sin tener que mandarte un mensaje por Slack.

## Las decisiones que lo sostienen

**Decisiones que se sostuvieron:**
- Tratar al equipo creativo como el usuario principal de la experiencia de publicación, incluso cuando los “usuarios” del sitio público son coleccionistas y visitantes.
- Definir explícitamente las zonas rígidas vs flexibles en las primeras semanas, no después del tercer pedido de rediseño.
- Construir el sistema de tokens y los contratos de layout antes de que cualquier página bonita esté completamente diseñada.
- Mantener GSAP y el motion al servicio de la obra, nunca como protagonista.
- Documentar el “porqué” de cada contrato en un lugar que el equipo realmente pueda leer (páginas cortas de Notion + comentarios en los archivos de componentes).

**En el roadmap:**
- Un “kit de inicio para artistas” más explícito que Aurin pueda entregar a una nueva artista con casi cero explicación.
- Mejor tooling de preview para que los cambios de una serie nueva se puedan revisar en contexto antes de que salgan en vivo.
- Conexión más estrecha entre el sitio principal del estudio en Astro y las presencias individuales de artistas para que los tokens y componentes compartidos se actualicen en un solo lugar.

## Cierre

Tanto este proyecto como el trabajo que hice con Monex se tratan de poner orden en la complejidad para que las personas que realmente hacen el trabajo central—traders y relationship managers en un caso, artistas y directoras de arte en el otro—puedan operar dentro de un sistema que respeta su oficio en lugar de pelear con él.

Si lideras un estudio, representas a una artista o diriges una práctica creativa y necesitas un sitio o plataforma donde tu equipo tenga ownership real sobre la historia y la presentación sin tener que volverse técnico ni esperar a desarrollo por cada ajuste, este es el tipo de trabajo que hago. Infraestructura fuerte y silenciosa que permite que la parte ruidosa, hermosa y humana siga al mando.

Los repos de los dos sistemas que se mencionan aquí son públicos: [AurinWebsite](https://github.com/AurinExperience/AurinWebsite) (plataforma del estudio) y [MariaLuisadeMateo](https://github.com/karenrebecag/MariaLuisadeMateo) (la presencia de la artista). Los principios son más transferibles que el código específico.