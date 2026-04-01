import { For, Show } from 'solid-js'

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

  const fillColor = () => props.bed.color + (props.selected ? '77' : '33')
  const center = () => centroid(props.bed.points, props.vw, props.vh)
  const title = () => props.bed.owner ? `${props.bed.name} - ${props.bed.owner}` : props.bed.name

  return (
    <g
      style="pointer-events: all; cursor: pointer"
      onClick={(e) => {
        e.stopPropagation()
        props.onClick(e)
      }}
    >
      <polygon
        points={pointsStr()}
        fill={fillColor()}
        stroke={props.bed.color}
        stroke-width={(props.selected ? 3 : 2) / props.zoom}
      />

      {/* Label at centroid — scales inversely with zoom to stay constant screen size */}
      <Show when={props.showLabels}>
      <text
        x={center().x}
        y={center().y}
        text-anchor="middle"
        dominant-baseline="central"
        style="pointer-events: none"
      >
        <tspan
          x={center().x}
          dy="-0.3em"
          font-size={13 / props.zoom}
          font-weight="600"
          fill="white"
          stroke="rgba(0,0,0,0.5)"
          stroke-width={3 / props.zoom}
          paint-order="stroke"
        >
          {title()}
        </tspan>
        <For each={props.bed.plants}>
          {(plant) => (
            <tspan
              x={center().x}
              dy="1.2em"
              font-size={11 / props.zoom}
              fill="white"
              stroke="rgba(0,0,0,0.4)"
              stroke-width={2.5 / props.zoom}
              paint-order="stroke"
            >
              {plant.name}
            </tspan>
          )}
        </For>
      </text>
      </Show>
    </g>
  )
}
