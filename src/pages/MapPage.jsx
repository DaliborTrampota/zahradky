import { createSignal } from 'solid-js'
import { Show } from 'solid-js'
import Toolbar from '../components/Toolbar.jsx'
import GardenMap from '../components/GardenMap.jsx'
import BedPanel from '../components/BedPanel.jsx'
import { garden, addBed } from '../store/gardenStore.js'
import { initMobileDetection } from '../utils/mobile.js'

export default function MapPage() {
  initMobileDetection()
  const [drawMode, setDrawMode] = createSignal(false)
  const [draftPoints, setDraftPoints] = createSignal([])
  const [selectedBedId, setSelectedBedId] = createSignal(null)
  const [panelSide, setPanelSide] = createSignal('right')
  const [labelFields, setLabelFields] = createSignal({ name: true, owner: false, plants: false, type: false })

  function handleMapClick(percentPoint) {
    if (!drawMode()) return
    setDraftPoints((pts) => [...pts, percentPoint])
  }

  function finishDrawing() {
    if (draftPoints().length < 3) return
    addBed(draftPoints())
    setDraftPoints([])
    setDrawMode(false)
  }

  function cancelDrawing() {
    setDraftPoints([])
    setDrawMode(false)
  }

  const selectedBed = () => garden.beds.find((b) => b.id === selectedBedId())

  return (
    <div class="flex flex-col h-screen bg-zinc-100 dark:bg-zinc-950 transition-colors duration-200">
      <Toolbar
        drawMode={drawMode()}
        onToggleDraw={() => (drawMode() ? cancelDrawing() : setDrawMode(true))}
        onFinishDraw={finishDrawing}
        draftCount={draftPoints().length}
        labelFields={labelFields()}
        onToggleLabelField={(field) => setLabelFields((f) => ({ ...f, [field]: !f[field] }))}
      />
      <div class="relative flex-1 overflow-hidden">
        <GardenMap
          beds={garden.beds}
          draftPoints={draftPoints()}
          drawMode={drawMode()}
          labelFields={labelFields()}
          selectedBedId={selectedBedId()}
          onMapClick={handleMapClick}
          onBedClick={(id, xPct) => {
            setPanelSide(xPct > 50 ? 'left' : 'right')
            setSelectedBedId(id)
            setDrawMode(false)
          }}
        />
        <Show when={selectedBed()}>
          <BedPanel
            bed={selectedBed()}
            side={panelSide()}
            onClose={() => setSelectedBedId(null)}
          />
        </Show>
      </div>
    </div>
  )
}
