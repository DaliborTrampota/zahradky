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
      class="absolute top-2 bottom-2 w-80 flex flex-col bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-y-auto border border-zinc-200/50 dark:border-zinc-700/50 transition-colors duration-200"
      classList={{
        'left-2': props.side === 'left',
        'right-2': props.side !== 'left',
      }}
      style="z-index: 5"
    >
      <div class="flex items-center justify-between px-5 py-4">
        <h2 class="text-base font-semibold text-zinc-900 dark:text-zinc-100 truncate">
          {props.bed.name}
        </h2>
        <button
          onClick={props.onClose}
          class="cursor-pointer w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 dark:text-zinc-500 transition-colors duration-150"
          title="Close"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="flex-1 px-5 pb-4 space-y-5">
        <BedForm bed={props.bed} />
        <div class="border-t border-zinc-100 dark:border-zinc-800" />
        <PlantList bed={props.bed} />
      </div>

      <div class="px-5 py-4 border-t border-zinc-100 dark:border-zinc-800">
        <button
          onClick={handleDelete}
          class="cursor-pointer w-full text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg px-4 py-2.5 transition-colors duration-150"
        >
          Delete this bed
        </button>
      </div>
    </aside>
  )
}
