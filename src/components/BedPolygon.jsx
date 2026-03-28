export default function BedPolygon(props) {
  const pointsStr = () =>
    props.bed.points.map((p) => `${p.x / 100 * props.vw},${p.y / 100 * props.vh}`).join(' ')

  const fillColor = () => props.bed.color + (props.selected ? 'aa' : '55')

  return (
    <polygon
      points={pointsStr()}
      fill={fillColor()}
      stroke={props.bed.color}
      stroke-width={props.selected ? '3' : '2'}
      style="pointer-events: all; cursor: pointer"
      onClick={(e) => {
        e.stopPropagation()
        props.onClick(e)
      }}
    />
  )
}
