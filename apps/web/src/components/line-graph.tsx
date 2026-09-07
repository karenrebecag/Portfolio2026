'use client'

import { useMemo, useRef, useState, type PointerEvent as ReactPointerEvent, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import styles from './line-graph.module.css'

export type LineGraphSeries = {
  key: string
  /** Etiqueta larga; la que se lee en el tooltip. */
  label: string
  /** Etiqueta corta de la leyenda; por defecto, la larga. */
  legendLabel?: string
  /** Color de la serie. Por defecto, el gris de línea del tema. */
  color?: string
}

export type LineGraphPoint = {
  label: string
  /** Valor por serie. `null` corta la línea y saca la serie del tooltip. */
  values: Record<string, number | null>
}

type LineGraphProps = {
  title: string
  series: LineGraphSeries[]
  points: LineGraphPoint[]
  /** Intervalos verticales del eje. */
  steps?: number
  prefix?: string
  suffix?: string
  min?: number
  max?: number
  /** Nota al pie: de dónde salen los números. */
  hint?: string
  ariaLabel?: string
}

const VIEW_WIDTH = 1000
const VIEW_HEIGHT = 500
const HEADROOM_PERCENT = 20
const AXIS_GAP = 40
const PADDING = { top: 55, right: 45, bottom: 30, left: 35 }
/**
 * El original mide las etiquetas con getBBox para calcular el margen del eje.
 * Aquí el SVG se renderiza en el servidor, así que el ancho se estima a partir
 * del label más largo: es determinista y evita un segundo layout en cliente.
 */
const AXIS_CHAR_WIDTH = 12
const AXIS_LABEL_HEIGHT = 22

const numberFormat = new Intl.NumberFormat()

type Coordinate = { x: number; y: number; index: number }

/**
 * Curva monótona (Fritsch-Carlson): pasa exactamente por cada punto y no
 * inventa jorobas entre ellos. En un gráfico que se proyecta y se lee como
 * dato, la curva no debe sugerir valores que no existen.
 */
function buildPath(coordinates: Coordinate[]): string {
  if (coordinates.length === 1) {
    return `M ${coordinates[0].x} ${coordinates[0].y} l 0 0`
  }

  const slopes = coordinates
    .slice(1)
    .map((point, i) => (point.y - coordinates[i].y) / (point.x - coordinates[i].x))

  const tangents = coordinates.map((_, i) => {
    if (i === 0) return slopes[0]
    if (i === coordinates.length - 1) return slopes[i - 1]
    const a = slopes[i - 1]
    const b = slopes[i]
    return a * b <= 0 ? 0 : (2 * a * b) / (a + b)
  })

  let path = `M ${coordinates[0].x} ${coordinates[0].y}`

  coordinates.slice(1).forEach((point, i) => {
    const previous = coordinates[i]
    const distance = (point.x - previous.x) / 3
    path += ` C ${previous.x + distance} ${previous.y + tangents[i] * distance}, ${point.x - distance} ${point.y - tangents[i + 1] * distance}, ${point.x} ${point.y}`
  })

  return path
}

export function LineGraph({
  title,
  series,
  points,
  steps = 4,
  prefix = '',
  suffix = '',
  min: minProp,
  max: maxProp,
  hint,
  ariaLabel,
}: LineGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [hasMoved, setHasMoved] = useState(false)

  const formatValue = (value: number, compact = true) => {
    const absolute = Math.abs(value)
    let formatted: string

    if (compact && absolute >= 1e9) formatted = `${parseFloat((value / 1e9).toFixed(1))}B`
    else if (compact && absolute >= 1e6) formatted = `${parseFloat((value / 1e6).toFixed(1))}M`
    else if (compact && absolute >= 1e3) formatted = `${parseFloat((value / 1e3).toFixed(1))}K`
    else formatted = numberFormat.format(value)

    return `${prefix}${formatted}${suffix}`
  }

  const scale = useMemo(() => {
    const values = points
      .flatMap((point) => series.map(({ key }) => point.values[key]))
      .filter((value): value is number => typeof value === 'number' && Number.isFinite(value))

    const safeValues = values.length ? values : [0, 1]
    const min = Number.isFinite(minProp) ? (minProp as number) : Math.min(0, ...safeValues)
    const highest = Math.max(...safeValues)
    const range = Math.max(highest - min, Math.abs(highest || 1))
    const rawMax = Number.isFinite(maxProp)
      ? (maxProp as number)
      : highest + range * (1 / (1 - HEADROOM_PERCENT / 100) - 1)

    const roughStep = (rawMax - min) / steps
    const magnitude = 10 ** Math.floor(Math.log10(roughStep || 1))
    const step = Math.ceil(roughStep / magnitude) * magnitude
    const max = Number.isFinite(maxProp) ? (maxProp as number) : min + step * steps
    const gridValues = Array.from({ length: steps + 1 }, (_, i) =>
      Number((min + ((max - min) / steps) * i).toFixed(10)),
    )

    return { min, max, gridValues }
  }, [points, series, steps, minProp, maxProp])

  const plot = useMemo(() => {
    const longestAxisLabel = Math.max(
      ...scale.gridValues.map((value) => formatValue(value).length),
    )

    const left = longestAxisLabel * AXIS_CHAR_WIDTH + AXIS_GAP + PADDING.left
    const bottom = AXIS_LABEL_HEIGHT + AXIS_GAP + PADDING.bottom

    return {
      left,
      bottom,
      width: VIEW_WIDTH - left - PADDING.right,
      height: VIEW_HEIGHT - PADDING.top - bottom,
    }
    // formatValue depende solo de prefix/suffix, ya cubiertos por scale.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scale, prefix, suffix])

  const getX = (index: number) =>
    plot.left + (points.length === 1 ? 0 : (index / (points.length - 1)) * plot.width)
  const getY = (value: number) =>
    PADDING.top + ((scale.max - value) / (scale.max - scale.min || 1)) * plot.height

  /** Un tramo por cada corrida de valores presentes: un `null` parte la línea. */
  const seriesGeometry = useMemo(
    () =>
      series.map((item) => {
        const segments: Coordinate[][] = []
        let segment: Coordinate[] = []

        points.forEach((point, index) => {
          const value = point.values[item.key]
          if (typeof value === 'number' && Number.isFinite(value)) {
            segment.push({ x: getX(index), y: getY(value), index })
          } else if (segment.length) {
            segments.push(segment)
            segment = []
          }
        })
        if (segment.length) segments.push(segment)

        const positions: (Coordinate | null)[] = new Array(points.length).fill(null)
        segments.forEach((coordinates) => {
          coordinates.forEach((coordinate) => {
            positions[coordinate.index] = coordinate
          })
        })

        return { ...item, paths: segments.map(buildPath), positions }
      }),
    // getX/getY se derivan de plot y scale.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [series, points, plot, scale],
  )

  const activePoint = activeIndex >= 0 ? points[activeIndex] : null

  const showPointerPoint = (event: ReactPointerEvent<HTMLDivElement>) => {
    const svg = svgRef.current
    if (!svg) return

    const rect = svg.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * VIEW_WIDTH
    const progress = Math.max(0, Math.min(1, (x - plot.left) / plot.width))
    const index = Math.round(progress * (points.length - 1))

    setHasMoved(activeIndex >= 0)
    setActiveIndex(index)
  }

  const hidePoint = () => {
    setActiveIndex(-1)
    setHasMoved(false)
  }

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      hidePoint()
      return
    }
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return

    event.preventDefault()

    let index = activeIndex < 0 ? 0 : activeIndex + (event.key === 'ArrowRight' ? 1 : -1)
    if (event.key === 'Home') index = 0
    if (event.key === 'End') index = points.length - 1

    setHasMoved(activeIndex >= 0)
    setActiveIndex(Math.max(0, Math.min(points.length - 1, index)))
  }

  // El tooltip se posiciona en porcentaje del viewBox: sigue al punto sin medir
  // el DOM. El contenedor de scroll recorta, así que la posición se acota a los
  // bordes y el globo se voltea hacia abajo cuando el punto está muy arriba.
  const TOOLTIP_EDGE_PERCENT = 13
  const TOOLTIP_FLIP_PERCENT = 32

  const rawLeft = activeIndex >= 0 ? (getX(activeIndex) / VIEW_WIDTH) * 100 : 50
  const tooltipLeft = Math.max(
    TOOLTIP_EDGE_PERCENT,
    Math.min(100 - TOOLTIP_EDGE_PERCENT, rawLeft),
  )

  const activeDotY =
    activeIndex >= 0
      ? Math.min(
          ...seriesGeometry
            .map(({ positions }) => positions[activeIndex]?.y)
            .filter((y): y is number => typeof y === 'number'),
          VIEW_HEIGHT,
        )
      : 0

  const tooltipTop = (activeDotY / VIEW_HEIGHT) * 100
  const flipBelow = tooltipTop < TOOLTIP_FLIP_PERCENT

  return (
    <div className={styles.root}>
      <div className={styles.top}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.legend} aria-hidden="true">
          {series.map((item) => (
            <div key={item.key} className={styles.legendItem}>
              <div
                className={styles.legendDot}
                style={{ '--graph-series-color': item.color } as React.CSSProperties}
              />
              <span>{item.legendLabel ?? item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.box}>
        <div className={styles.scroll}>
          <div
            className={styles.visual}
            role="group"
            tabIndex={0}
            aria-label={
              ariaLabel ??
              `Gráfico interactivo: ${series.map(({ label }) => label).join(', ')} en ${points.length} puntos. Usa las flechas para recorrer los valores.`
            }
            onPointerMove={(event) => {
              if (event.pointerType !== 'touch') showPointerPoint(event)
            }}
            onPointerLeave={hidePoint}
            onClick={(event) => showPointerPoint(event as unknown as ReactPointerEvent<HTMLDivElement>)}
            onKeyDown={handleKeyDown}
            onBlur={hidePoint}
          >
            <svg
              ref={svgRef}
              className={styles.svg}
              viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
              role="img"
              aria-label={ariaLabel ?? title}
            >
              {scale.gridValues.map((value) => {
                const y = getY(value)
                return (
                  <g key={value}>
                    <line
                      x1={plot.left}
                      x2={VIEW_WIDTH - PADDING.right}
                      y1={y}
                      y2={y}
                      className={`${styles.gridLine} ${value === 0 ? styles.baseline : ''}`}
                    />
                    <text
                      x={PADDING.left}
                      y={y}
                      textAnchor="start"
                      dominantBaseline="middle"
                      className={styles.axisLabel}
                    >
                      {formatValue(value)}
                    </text>
                  </g>
                )
              })}

              {points.map((point, index) => (
                <text
                  key={point.label}
                  x={getX(index)}
                  y={VIEW_HEIGHT - PADDING.bottom}
                  textAnchor={index === 0 ? 'start' : index === points.length - 1 ? 'end' : 'middle'}
                  dominantBaseline="text-after-edge"
                  className={styles.axisLabel}
                >
                  {point.label}
                </text>
              ))}

              {[...seriesGeometry].reverse().map((item) =>
                item.paths.map((path, i) => (
                  <path
                    key={`${item.key}-${i}`}
                    d={path}
                    className={styles.line}
                    style={{ '--graph-series-color': item.color } as React.CSSProperties}
                  />
                )),
              )}

              <g className={`${styles.hover} ${activeIndex < 0 ? styles.hoverIdle : ''}`}>
                <line
                  x1={getX(Math.max(activeIndex, 0))}
                  x2={getX(Math.max(activeIndex, 0))}
                  y1={PADDING.top}
                  y2={VIEW_HEIGHT - plot.bottom}
                  className={styles.hoverLine}
                />
                {[...seriesGeometry].reverse().map((item) => {
                  const position = activeIndex >= 0 ? item.positions[activeIndex] : null
                  if (!position) return null
                  return (
                    <circle
                      key={item.key}
                      r={7}
                      cx={position.x}
                      cy={position.y}
                      className={styles.hoverDot}
                      style={{ '--graph-series-color': item.color } as React.CSSProperties}
                    />
                  )
                })}
              </g>
            </svg>

            <div
              className={`${styles.tooltip} ${flipBelow ? styles.tooltipBelow : ''} ${activeIndex >= 0 ? styles.tooltipActive : ''} ${hasMoved ? styles.tooltipMove : ''}`}
              style={{ left: `${tooltipLeft}%`, top: `${tooltipTop}%` }}
              aria-hidden={activeIndex < 0}
              aria-live="polite"
            >
              <div className={styles.tooltipLabel}>{activePoint?.label}</div>
              {seriesGeometry.map((item) => {
                const value = activePoint?.values[item.key]
                if (typeof value !== 'number' || !Number.isFinite(value)) return null
                return (
                  <div key={item.key} className={styles.tooltipRow}>
                    <div className={styles.tooltipSeries}>
                      <div
                        className={styles.tooltipDot}
                        style={{ '--graph-series-color': item.color } as React.CSSProperties}
                      />
                      <span>{item.label}</span>
                    </div>
                    <span className={styles.tooltipValue}>{formatValue(value, false)}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {hint && <p className={styles.hint}>{hint}</p>}
    </div>
  )
}
