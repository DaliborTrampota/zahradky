import { createSignal, onMount, onCleanup, For, Show } from 'solid-js'
import BedPolygon from './BedPolygon.jsx'
import { toPercent } from '../utils/coords.js'

export default function GardenMap(props) {
  let outerRef
  let containerRef
  let imgEl
  const [size, setSize] = createSignal(null)

  function recalc() {
    if (!imgEl || !outerRef || !imgEl.naturalWidth) return
    const outer = outerRef.getBoundingClientRect()
    const natW = imgEl.naturalWidth
    const natH = imgEl.naturalHeight
    const scale = Math.min(outer.width / natW, outer.height / natH)
    setSize({ width: Math.floor(natW * scale), height: Math.floor(natH * scale) })
  }

  onMount(() => {
    const ro = new ResizeObserver(recalc)
    ro.observe(outerRef)
    onCleanup(() => ro.disconnect())
    if (imgEl.complete) recalc()
  })

  function handleDrawClick(e) {
    const rect = containerRef.getBoundingClientRect()
    props.onMapClick(toPercent(e.clientX, e.clientY, rect))
  }

  // Convert stored percent coords (0-100) to SVG pixel coords
  const vw = () => size()?.width || 100
  const vh = () => size()?.height || 100
  const pctToSvg = (p) => `${p.x / 100 * vw()},${p.y / 100 * vh()}`

  return (
    <div
      ref={outerRef}
      class="relative flex items-center justify-center w-full h-full bg-zinc-900 dark:bg-zinc-950 overflow-hidden select-none transition-colors duration-200"
    >
      <div
        ref={containerRef}
        class="relative"
        style={size() ? { width: `${size().width}px`, height: `${size().height}px` } : {}}
      >
        <img
          ref={imgEl}
          src="/zahradky.png"
          alt="Garden map"
          class="block w-full h-full"
          style="z-index: 0"
          draggable={false}
          onLoad={recalc}
        />

        <svg
          viewBox={`0 0 ${vw()} ${vh()}`}
          class="absolute inset-0 w-full h-full"
          style="z-index: 1"
        >
          <For each={props.beds}>
            {(bed) => (
              <BedPolygon
                bed={bed}
                vw={vw()}
                vh={vh()}
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
              points={props.draftPoints.map(pctToSvg).join(' ')}
              fill="rgba(250,204,21,0.25)"
              stroke="#fbbf24"
              stroke-width="2"
              stroke-dasharray="8 4"
              style="pointer-events: none"
            />
            <For each={props.draftPoints}>
              {(pt) => (
                <circle
                  cx={pt.x / 100 * vw()}
                  cy={pt.y / 100 * vh()}
                  r="5"
                  fill="#fbbf24"
                  stroke="#ffffff"
                  stroke-width="2"
                  style="pointer-events: none"
                />
              )}
            </For>
          </Show>
        </svg>

        <Show when={props.drawMode}>
          <div
            class="absolute inset-0 cursor-crosshair"
            style="z-index: 2"
            onClick={handleDrawClick}
          />
        </Show>
      </div>

      <Show when={props.drawMode}>
        <div
          class="absolute top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-sm font-medium px-4 py-1.5 rounded-full shadow-lg pointer-events-none"
          style="z-index: 3"
        >
          Click to place points &mdash; {props.draftPoints.length} placed
        </div>
      </Show>
    </div>
  )
}
