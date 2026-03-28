import { createSignal, For } from 'solid-js'
import { addPlant, removePlant } from '../store/gardenStore.js'

export default function PlantList(props) {
  const [name, setName] = createSignal('')
  const [date, setDate] = createSignal(new Date().toISOString().slice(0, 10))

  function handleAdd() {
    if (!name().trim()) return
    addPlant(props.bed.id, { name: name().trim(), datePlanted: date() })
    setName('')
  }

  return (
    <div>
      <h3 class="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-3">
        Plants
      </h3>
      <ul class="space-y-1.5 mb-4">
        <For
          each={props.bed.plants}
          fallback={
            <li class="text-sm text-zinc-400 dark:text-zinc-500 italic py-2">No plants yet</li>
          }
        >
          {(plant) => (
            <li class="flex items-center justify-between text-sm bg-zinc-50 dark:bg-zinc-800 rounded-xl px-3.5 py-2.5 transition-colors duration-150">
              <div class="min-w-0">
                <span class="font-medium text-zinc-800 dark:text-zinc-200">{plant.name}</span>
                <span class="ml-2 text-zinc-400 dark:text-zinc-500 text-xs">{plant.datePlanted}</span>
              </div>
              <button
                onClick={() => removePlant(props.bed.id, plant.id)}
                class="cursor-pointer w-7 h-7 flex items-center justify-center rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-zinc-300 dark:text-zinc-600 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-150 ml-2 shrink-0"
                title="Remove plant"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </li>
          )}
        </For>
      </ul>
      <div class="space-y-2">
        <div class="flex gap-2">
          <input
            placeholder="Plant name"
            value={name()}
            onInput={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            class="flex-1 min-w-0 border border-zinc-300 dark:border-zinc-600 bg-transparent rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-green-500 dark:focus:border-green-400 focus:ring-1 focus:ring-green-500 dark:focus:ring-green-400 transition-colors duration-150"
          />
          <input
            type="date"
            value={date()}
            onInput={(e) => setDate(e.target.value)}
            class="w-32 shrink-0 border border-zinc-300 dark:border-zinc-600 bg-transparent rounded-lg px-2 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-green-500 dark:focus:border-green-400 focus:ring-1 focus:ring-green-500 dark:focus:ring-green-400 transition-colors duration-150"
          />
        </div>
        <button
          onClick={handleAdd}
          class="cursor-pointer w-full bg-green-600 hover:bg-green-700 active:bg-green-800 text-white rounded-lg px-4 py-2.5 text-sm font-medium shadow-sm hover:shadow-md transition-all duration-150"
        >
          Add plant
        </button>
      </div>
    </div>
  )
}
