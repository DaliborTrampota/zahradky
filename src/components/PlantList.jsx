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
      <h3 class="text-xs font-medium text-stone-500 uppercase tracking-wide mb-2">Plants</h3>
      <ul class="space-y-1 mb-3">
        <For
          each={props.bed.plants}
          fallback={<li class="text-sm text-stone-400 italic">No plants yet</li>}
        >
          {(plant) => (
            <li class="flex items-center justify-between text-sm bg-stone-50 rounded px-3 py-2">
              <div>
                <span class="font-medium text-stone-700">{plant.name}</span>
                <span class="ml-2 text-stone-400 text-xs">{plant.datePlanted}</span>
              </div>
              <button
                onClick={() => removePlant(props.bed.id, plant.id)}
                class="cursor-pointer text-stone-300 hover:text-red-400 text-base leading-none ml-2 transition-colors"
                title="Remove plant"
              >
                &times;
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
            class="flex-1 min-w-0 border border-stone-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            type="date"
            value={date()}
            onInput={(e) => setDate(e.target.value)}
            class="w-32 shrink-0 border border-stone-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
        <button
          onClick={handleAdd}
          class="cursor-pointer w-full bg-green-500 hover:bg-green-600 text-white rounded px-3 py-1.5 text-sm font-medium transition-colors"
        >
          Add plant
        </button>
      </div>
    </div>
  )
}
