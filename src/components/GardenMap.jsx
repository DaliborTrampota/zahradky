import { createSignal, onMount, onCleanup, For, Show } from 'solid-js'
import BedPolygon from './BedPolygon.jsx'
import { toPercent } from '../utils/coords.js'
import { t } from '../utils/i18n.js'
import { setMapReady } from '../store/appState.js'

const MIN_ZOOM = 1
const MAX_ZOOM = 6
const ZOOM_STEP = 1.15

export default function GardenMap(props) {
  let outerRef
  let containerRef
  let imgEl
  const [size, setSize] = createSignal(null)
  const [zoom, setZoom] = createSignal(1)
  const [pan, setPan] = createSignal({ x: 0, y: 0 })
  const [tooltip, setTooltip] = createSignal(null)

  function handleBedHover(bed, e) {
    if (!bed) { setTooltip(null); return }
    const rect = outerRef.getBoundingClientRect()
    setTooltip({
      bed,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  function handleMouseMoveForTooltip(e) {
    if (!tooltip()) return
    const rect = outerRef.getBoundingClientRect()
    setTooltip((t) => t ? { ...t, x: e.clientX - rect.left, y: e.clientY - rect.top } : null)
  }

  // --- Image sizing ---
  function recalc() {
    if (!imgEl || !outerRef || !imgEl.naturalWidth) return
    const outer = outerRef.getBoundingClientRect()
    const natW = imgEl.naturalWidth
    const natH = imgEl.naturalHeight
    const s = Math.min(outer.width / natW, outer.height / natH)
    setSize({ width: Math.floor(natW * s), height: Math.floor(natH * s) })
  }

  onMount(() => {
    const ro = new ResizeObserver(recalc)
    ro.observe(outerRef)
    onCleanup(() => ro.disconnect())
    if (imgEl.complete) recalc()
  })

  // --- Wheel: pinch = zoom, scroll = pan ---
  function handleWheel(e) {
    e.preventDefault()
    if (e.ctrlKey || e.metaKey) {
      // Pinch-to-zoom on touchpad (or Ctrl+scroll with mouse)
      // deltaY is continuous on touchpad — use it proportionally for smooth zoom
      const rect = outerRef.getBoundingClientRect()
      const mx = e.clientX - rect.left
      const my = e.clientY - rect.top
      const factor = Math.pow(2, -e.deltaY / 100)
      applyZoom(factor, mx, my)
    } else {
      // Two-finger scroll → pan
      setPan((p) => ({ x: p.x - e.deltaX, y: p.y - e.deltaY }))
    }
  }

  // The map is centered via flexbox. This returns the offset from
  // the outer container's top-left to the map's top-left at zoom=1, pan=0.
  function getCenterOffset() {
    if (!size()) return { x: 0, y: 0 }
    const outer = outerRef.getBoundingClientRect()
    return {
      x: (outer.width - size().width) / 2,
      y: (outer.height - size().height) / 2,
    }
  }

  function applyZoom(factor, pivotX, pivotY) {
    const oldZ = zoom()
    const newZ = Math.min(Math.max(oldZ * factor, MIN_ZOOM), MAX_ZOOM)
    if (newZ === oldZ) return
    if (newZ <= 1) {
      setPan({ x: 0, y: 0 })
      setZoom(1)
      return
    }
    // Convert pivot from outer-container coords to map-origin coords
    const offset = getCenterOffset()
    const mapPivotX = pivotX - offset.x
    const mapPivotY = pivotY - offset.y
    const p = pan()
    setPan({
      x: mapPivotX - (mapPivotX - p.x) * (newZ / oldZ),
      y: mapPivotY - (mapPivotY - p.y) * (newZ / oldZ),
    })
    setZoom(newZ)
  }

  function resetView() {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  // --- Pan (drag) ---
  let dragging = false
  let dragStart = { x: 0, y: 0 }
  let panStart = { x: 0, y: 0 }
  let dragMoved = false
  let touchCount = 0

  function handlePointerDown(e) {
    if (props.drawMode) return
    if (e.button !== 0) return
    if (e.target.closest('button')) return
    // Track active touches — don't start drag if pinching
    if (e.pointerType === 'touch') {
      touchCount++
      if (touchCount > 1) {
        // Cancel any in-progress drag when second finger lands
        dragging = false
        window.removeEventListener('pointermove', handlePointerMove)
        return
      }
    }
    dragging = true
    dragMoved = false
    dragStart = { x: e.clientX, y: e.clientY }
    panStart = { ...pan() }
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
  }

  function handlePointerMove(e) {
    if (!dragging || touchCount > 1) return
    const dx = e.clientX - dragStart.x
    const dy = e.clientY - dragStart.y
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) dragMoved = true
    if (dragMoved) {
      setPan({ x: panStart.x + dx, y: panStart.y + dy })
    }
  }

  function handlePointerUp(e) {
    if (e.pointerType === 'touch') touchCount = Math.max(0, touchCount - 1)
    if (touchCount <= 0) {
      dragging = false
      touchCount = 0
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }

  // --- Touch: pinch-to-zoom + two-finger pan ---
  let lastTouchDist = 0
  let lastTouchCx = 0
  let lastTouchCy = 0

  function handleTouchStart(e) {
    if (e.touches.length === 2) {
      e.preventDefault()
      const t1 = e.touches[0], t2 = e.touches[1]
      const dx = t2.clientX - t1.clientX
      const dy = t2.clientY - t1.clientY
      lastTouchDist = Math.sqrt(dx * dx + dy * dy)
      lastTouchCx = (t1.clientX + t2.clientX) / 2
      lastTouchCy = (t1.clientY + t2.clientY) / 2
    }
  }

  function handleTouchMove(e) {
    if (e.touches.length !== 2) return
    e.preventDefault()

    const t1 = e.touches[0], t2 = e.touches[1]
    const dx = t2.clientX - t1.clientX
    const dy = t2.clientY - t1.clientY
    const dist = Math.sqrt(dx * dx + dy * dy)
    const cx = (t1.clientX + t2.clientX) / 2
    const cy = (t1.clientY + t2.clientY) / 2

    if (lastTouchDist > 0) {
      const factor = dist / lastTouchDist
      const oldZ = zoom()
      const newZ = Math.min(Math.max(oldZ * factor, MIN_ZOOM), MAX_ZOOM)

      // Pinch center relative to the outer container, adjusted for flex centering
      const rect = outerRef.getBoundingClientRect()
      const offset = getCenterOffset()
      const mapPivotX = cx - rect.left - offset.x
      const mapPivotY = cy - rect.top - offset.y

      // Pan delta from finger movement
      const panDx = cx - lastTouchCx
      const panDy = cy - lastTouchCy

      const p = pan()
      if (newZ <= 1) {
        setZoom(1)
        setPan({ x: 0, y: 0 })
      } else {
        // Combined: zoom around pivot + pan from finger movement
        setZoom(newZ)
        setPan({
          x: mapPivotX - (mapPivotX - p.x) * (newZ / oldZ) + panDx,
          y: mapPivotY - (mapPivotY - p.y) * (newZ / oldZ) + panDy,
        })
      }
    }

    lastTouchDist = dist
    lastTouchCx = cx
    lastTouchCy = cy
  }

  function handleTouchEnd(e) {
    if (e.touches.length < 2) {
      lastTouchDist = 0
    }
  }

  // --- Draw click ---
  function handleDrawClick(e) {
    const rect = containerRef.getBoundingClientRect()
    props.onMapClick(toPercent(e.clientX, e.clientY, rect))
  }

  // --- SVG helpers ---
  const vw = () => size()?.width || 100
  const vh = () => size()?.height || 100
  const pctToSvg = (p) => `${p.x / 100 * vw()},${p.y / 100 * vh()}`

  // --- Transform style ---
  const transformStyle = () => {
    if (!size()) return {}
    return {
      width: `${size().width}px`,
      height: `${size().height}px`,
      transform: `translate(${pan().x}px, ${pan().y}px) scale(${zoom()})`,
      'transform-origin': '0 0',
    }
  }

  return (
    <div
      ref={outerRef}
      class="relative flex items-center justify-center w-full h-full bg-zinc-900 dark:bg-zinc-950 overflow-hidden select-none transition-colors duration-200 touch-none"
      classList={{ 'cursor-grab': !props.drawMode && !dragging, 'cursor-grabbing': dragging }}
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseMove={handleMouseMoveForTooltip}
    >
      <div
        ref={containerRef}
        class="relative"
        style={transformStyle()}
      >
        <img
          ref={imgEl}
          src="/zahradky1.png"
          alt={t('gardenMap')}
          class="block w-full h-full"
          style="z-index: 0"
          draggable={false}
          onLoad={() => { recalc(); setMapReady(true) }}
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
                zoom={zoom()}
                labelFields={props.labelFields}
                selected={bed.id === props.selectedBedId}
                hoveredId={tooltip()?.bed?.id}
                onHover={handleBedHover}
                onClick={(e) => {
                  if (dragMoved) return
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
              stroke-width={1.5 / zoom()}
              stroke-dasharray={`${6 / zoom()} ${3 / zoom()}`}
              style="pointer-events: none"
            />
            <For each={props.draftPoints}>
              {(pt) => (
                <circle
                  cx={pt.x / 100 * vw()}
                  cy={pt.y / 100 * vh()}
                  r={3 / zoom()}
                  fill="#fbbf24"
                  stroke="#ffffff"
                  stroke-width={1 / zoom()}
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

      {/* Draw mode hint */}
      <Show when={props.drawMode}>
        <div
          class="absolute top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-sm font-medium px-4 py-1.5 rounded-full shadow-lg pointer-events-none"
          style="z-index: 10"
        >
          {t('clickToPlace', props.draftPoints.length)}
        </div>
      </Show>

      {/* Zoom controls */}
      <div
        class="absolute bottom-4 right-4 flex flex-col gap-1.5"
        style="z-index: 10"
      >
        <Show when={zoom() !== 1 || pan().x !== 0 || pan().y !== 0}>
          <button
            onClick={resetView}
            class="cursor-pointer w-9 h-9 flex items-center justify-center rounded-full bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 shadow-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors duration-150"
            title={t('resetView')}
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
            </svg>
          </button>
        </Show>
        <button
          onClick={() => {
            const rect = outerRef.getBoundingClientRect()
            applyZoom(ZOOM_STEP, rect.width / 2, rect.height / 2)
          }}
          class="cursor-pointer w-9 h-9 flex items-center justify-center rounded-full bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 shadow-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors duration-150"
          title={t('zoomIn')}
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
        <button
          onClick={() => {
            const rect = outerRef.getBoundingClientRect()
            applyZoom(1 / ZOOM_STEP, rect.width / 2, rect.height / 2)
          }}
          class="cursor-pointer w-9 h-9 flex items-center justify-center rounded-full bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 shadow-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors duration-150"
          title={t('zoomOut')}
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15" />
          </svg>
        </button>
      </div>

      {/* Zoom level indicator */}
      <Show when={zoom() !== 1}>
        <div
          class="absolute bottom-4 left-4 bg-black/50 text-white text-xs font-medium px-2.5 py-1 rounded-full pointer-events-none"
          style="z-index: 10"
        >
          {Math.round(zoom() * 100)}%
        </div>
      </Show>

      {/* Bed hover tooltip */}
      <Show when={tooltip()}>
        {(() => {
          const tip = tooltip()
          const bed = tip.bed
          return (
            <div
              class="absolute pointer-events-none bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-700 px-4 py-3 min-w-40 max-w-56"
              style={{
                'z-index': '20',
                left: `${tip.x + 16}px`,
                top: `${tip.y + 16}px`,
              }}
            >
              <div class="flex items-center gap-2 mb-1">
                <div class="w-3 h-3 rounded-full shrink-0" style={{ background: bed.color }} />
                <span class="text-sm font-semibold text-zinc-800 dark:text-zinc-100 truncate">{bed.name}</span>
              </div>
              <Show when={bed.owner}>
                <p class="text-xs text-zinc-500 dark:text-zinc-400">{bed.owner}</p>
              </Show>
              <Show when={bed.plants?.length > 0}>
                <ul class="mt-1.5 space-y-0.5">
                  <For each={bed.plants}>
                    {(plant) => (
                      <li class="text-xs text-zinc-600 dark:text-zinc-300">
                        {plant.name}
                      </li>
                    )}
                  </For>
                </ul>
              </Show>
            </div>
          )
        })()}
      </Show>
    </div>
  )
}
