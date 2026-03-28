export default function BedPolygon(props) {
  const pointsStr = () => props.bed.points.map((p) => `${p.x},${p.y}`).join(' ')

  // Append '55' to hex color for ~33% alpha fill, 'aa' for selected
  const fillColor = () => props.bed.color + (props.selected ? 'aa' : '55')

  return (
    <polygon
      points={pointsStr()}
      fill={fillColor()}
      stroke={props.bed.color}
      stroke-width={props.selected ? '1' : '0.5'}
      style="pointer-events: all; cursor: pointer"
      onClick={(e) => {
        e.stopPropagation()
        props.onClick(e)
      }}
    />
  )
}
