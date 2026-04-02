import { Show } from 'solid-js'

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

      <Show when={props.showLabels}>
        <text
          x={center().x}
          y={center().y}
          text-anchor="middle"
          dominant-baseline="central"
          font-size={9 / props.zoom}
          font-weight="600"
          fill="white"
          stroke="rgba(0,0,0,0.5)"
          stroke-width={2 / props.zoom}
          paint-order="stroke"
          style="pointer-events: none"
        >
          {props.bed.name}
        </text>
      </Show>
    </g>
  )
}
