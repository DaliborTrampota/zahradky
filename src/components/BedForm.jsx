import { For } from 'solid-js'
import { updateBed } from '../store/gardenStore.js'

const COLORS = [
  '#4ade80', // green
  '#f87171', // red
  '#60a5fa', // blue
  '#fbbf24', // amber
  '#a78bfa', // violet
  '#fb923c', // orange
  '#34d399', // emerald
  '#f472b6', // pink
]

export default function BedForm(props) {
  const update = (patch) => updateBed(props.bed.id, patch)

  return (
    <div class="space-y-3">
      <label class="block">
        <span class="text-xs font-medium text-stone-500 uppercase tracking-wide">Name</span>
        <input
          class="mt-1 block w-full border border-stone-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          value={props.bed.name}
          onInput={(e) => update({ name: e.target.value })}
        />
      </label>
      <label class="block">
        <span class="text-xs font-medium text-stone-500 uppercase tracking-wide">Owner</span>
        <input
          class="mt-1 block w-full border border-stone-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          value={props.bed.owner}
          onInput={(e) => update({ owner: e.target.value })}
        />
      </label>
      <div>
        <span class="text-xs font-medium text-stone-500 uppercase tracking-wide">Color</span>
        <div class="mt-2 flex gap-2 flex-wrap">
          <For each={COLORS}>
            {(c) => (
              <button
                class="cursor-pointer w-7 h-7 rounded-full border-2 transition-transform hover:scale-110"
                classList={{
                  'border-stone-800 scale-110': props.bed.color === c,
                  'border-transparent': props.bed.color !== c,
                }}
                style={{ background: c }}
                onClick={() => update({ color: c })}
                title={c}
              />
            )}
          </For>
        </div>
      </div>
    </div>
  )
}
