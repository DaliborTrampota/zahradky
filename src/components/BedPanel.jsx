import BedForm from './BedForm.jsx'
import PlantList from './PlantList.jsx'
import { deleteBed } from '../store/gardenStore.js'
import { t } from '../utils/i18n.js'
import { isMobile } from '../utils/mobile.js'

export default function BedPanel(props) {
  function handleDelete() {
    if (confirm(t('confirmDelete', props.bed.name))) {
      deleteBed(props.bed.id)
      props.onClose()
    }
  }

  return (
    <aside
      class="absolute flex flex-col bg-white dark:bg-zinc-900 shadow-2xl overflow-y-auto border border-zinc-200/50 dark:border-zinc-700/50 transition-colors duration-200"
      classList={{
        // Mobile: bottom sheet
        'inset-x-0 bottom-0 rounded-t-2xl max-h-[70vh]': isMobile(),
        // Desktop: side panel
        'top-2 bottom-2 w-80 rounded-2xl': !isMobile(),
        'left-2': !isMobile() && props.side === 'left',
        'right-2': !isMobile() && props.side !== 'left',
      }}
      style="z-index: 5"
    >
      {/* Drag handle on mobile */}
      {isMobile() && (
        <div class="flex justify-center pt-2 pb-1">
          <div class="w-10 h-1 rounded-full bg-zinc-300 dark:bg-zinc-600" />
        </div>
      )}

      <div class="flex items-center justify-between px-5 py-3 sm:py-4">
        <h2 class="text-base font-semibold text-zinc-900 dark:text-zinc-100 truncate">
          {props.bed.name}
        </h2>
        <button
          onClick={props.onClose}
          class="cursor-pointer w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 dark:text-zinc-500 transition-colors duration-150"
          title={t('close')}
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

      <div class="px-5 py-3 sm:py-4 border-t border-zinc-100 dark:border-zinc-800">
        <button
          onClick={handleDelete}
          class="cursor-pointer w-full text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg px-4 py-2.5 transition-colors duration-150"
        >
          {t('deleteBed')}
        </button>
      </div>
    </aside>
  )
}
