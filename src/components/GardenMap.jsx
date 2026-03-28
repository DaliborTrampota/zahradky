import { For, Show } from 'solid-js'
import BedPolygon from './BedPolygon.jsx'
import { toPercent } from '../utils/coords.js'

export default function GardenMap(props) {
  let containerRef

  function handleDrawClick(e) {
    const rect = containerRef.getBoundingClientRect()
    props.onMapClick(toPercent(e.clientX, e.clientY, rect))
  }

  return (
    <div
      ref={containerRef}
      class="relative w-full h-full overflow-hidden select-none"
    >
      {/* Background image */}
      <img
        src="/garden.jpg"
        alt="Garden map"
        class="absolute inset-0 w-full h-full object-cover"
        style="z-index: 0"
        draggable={false}
      />

      {/* SVG polygon overlay */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        class="absolute inset-0 w-full h-full"
        style="z-index: 1"
      >
        <For each={props.beds}>
          {(bed) => (
            <BedPolygon
              bed={bed}
              selected={bed.id === props.selectedBedId}
              onClick={(e) => {
                const rect = containerRef.getBoundingClientRect()
                const xPct = ((e.clientX - rect.left) / rect.width) * 100
                props.onBedClick(bed.id, xPct)
              }}
            />
          )}
        </For>

        <Show when={props.draftPoints.length > 0}>
          <polygon
            points={props.draftPoints.map((p) => `${p.x},${p.y}`).join(' ')}
            fill="rgba(250,204,21,0.25)"
            stroke="#fbbf24"
            stroke-width="0.5"
            stroke-dasharray="2 1"
            style="pointer-events: none"
          />
          <For each={props.draftPoints}>
            {(pt) => (
              <circle
                cx={pt.x}
                cy={pt.y}
                r="0.8"
                fill="#fbbf24"
                stroke="#ffffff"
                stroke-width="0.3"
                style="pointer-events: none"
              />
            )}
          </For>
        </Show>
      </svg>

      {/* Draw mode: transparent overlay captures clicks for placing points */}
      <Show when={props.drawMode}>
        <div
          class="absolute inset-0 cursor-crosshair"
          style="z-index: 2"
          onClick={handleDrawClick}
        />
        <div
          class="absolute top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-sm font-medium px-3 py-1 rounded-full shadow pointer-events-none"
          style="z-index: 3"
        >
          Click to place points &mdash; {props.draftPoints.length} placed
        </div>
      </Show>
    </div>
  )
}
