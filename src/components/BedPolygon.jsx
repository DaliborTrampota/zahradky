import { Show, For } from 'solid-js'
import { t } from '../utils/i18n.js'

function centroid(points, vw, vh) {
  const n = points.length
  if (n === 0) return { x: 0, y: 0 }
  return {
    x: points.reduce((s, p) => s + p.x, 0) / n / 100 * vw,
    y: points.reduce((s, p) => s + p.y, 0) / n / 100 * vh,
  }
}

export default function BedPolygon(props) {
  const pointsStr = () =>
    props.bed.points.map((p) => `${p.x / 100 * props.vw},${p.y / 100 * props.vh}`).join(' ')

  const hovered = () => props.hoveredId === props.bed.id
  const fillColor = () => props.bed.color + (props.selected ? '77' : hovered() ? '55' : '33')
  const center = () => centroid(props.bed.points, props.vw, props.vh)

  const hasAnyLabel = () => Object.values(props.labelFields).some(Boolean)

  const lines = () => {
    const f = props.labelFields
    const result = []
    if (f.name) result.push({ text: props.bed.name, bold: true })
    if (f.owner && props.bed.owner) result.push({ text: props.bed.owner, bold: false })
    if (f.type && props.bed.type) result.push({ text: t('bedTypes')[props.bed.type], bold: false })
    if (f.plants) {
      for (const plant of props.bed.plants) {
        result.push({ text: plant.name, bold: false })
      }
    }
    return result
  }

  return (
    <g
      style="pointer-events: all; cursor: pointer"
      onMouseEnter={(e) => props.onHover(props.bed, e)}
      onMouseLeave={() => props.onHover(null)}
      onClick={(e) => {
        e.stopPropagation()
        props.onClick(e)
      }}
    >
      <polygon
        points={pointsStr()}
        fill={fillColor()}
        stroke={props.bed.color}
        stroke-width={(props.selected ? 3 : hovered() ? 2.5 : 2) / props.zoom}
      />

      <Show when={hasAnyLabel()}>
        <text
          x={center().x}
          y={center().y}
          text-anchor="middle"
          dominant-baseline="central"
          style="pointer-events: none"
        >
          <For each={lines()}>
            {(line, i) => (
              <tspan
                x={center().x}
                dy={i() === 0 ? `${-(lines().length - 1) * 0.55}em` : '1.1em'}
                font-size={(line.bold ? 9 : 7.5) / props.zoom}
                font-weight={line.bold ? '600' : '400'}
                fill="white"
                stroke="rgba(0,0,0,0.5)"
                stroke-width={(line.bold ? 2 : 1.5) / props.zoom}
                paint-order="stroke"
              >
                {line.text}
              </tspan>
            )}
          </For>
        </text>
      </Show>
    </g>
  )
}
