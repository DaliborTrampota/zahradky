import BedForm from './BedForm.jsx'
import PlantList from './PlantList.jsx'
import { deleteBed } from '../store/gardenStore.js'

export default function BedPanel(props) {
  function handleDelete() {
    if (confirm(`Delete bed "${props.bed.name}"?`)) {
      deleteBed(props.bed.id)
      props.onClose()
    }
  }

  return (
    <aside
      class="absolute top-0 bottom-0 w-80 flex flex-col bg-white/95 backdrop-blur-sm border-stone-200 shadow-lg overflow-y-auto"
      classList={{
        'left-0 border-r': props.side === 'left',
        'right-0 border-l': props.side !== 'left',
      }}
      style="z-index: 5"
    >
      <div class="flex items-center justify-between p-4 border-b border-stone-100">
        <h2 class="font-semibold text-stone-800 truncate">{props.bed.name}</h2>
        <button
          onClick={props.onClose}
          class="cursor-pointer text-stone-400 hover:text-stone-600 text-xl leading-none ml-2 transition-colors"
          title="Close"
        >
          &times;
        </button>
      </div>

      <div class="flex-1 p-4 space-y-6">
        <BedForm bed={props.bed} />
        <hr class="border-stone-100" />
        <PlantList bed={props.bed} />
      </div>

      <div class="p-4 border-t border-stone-100">
        <button
          onClick={handleDelete}
          class="cursor-pointer w-full text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded px-3 py-2 transition-colors"
        >
          Delete this bed
        </button>
      </div>
    </aside>
  )
}
