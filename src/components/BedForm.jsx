import { For } from 'solid-js'
import { updateBed } from '../store/gardenStore.js'
import { t } from '../utils/i18n.js'

const COLORS = [
  '#4ade80', '#f87171', '#60a5fa', '#fbbf24',
  '#a78bfa', '#fb923c', '#34d399', '#f472b6',
]

export default function BedForm(props) {
  const update = (patch) => updateBed(props.bed.id, patch)

  return (
    <div class="space-y-4">
      <div class="relative">
        <input
          class="peer block w-full border border-zinc-300 dark:border-zinc-600 bg-transparent rounded-lg px-3.5 pt-5 pb-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-green-500 dark:focus:border-green-400 focus:ring-1 focus:ring-green-500 dark:focus:ring-green-400 transition-colors duration-150"
          value={props.bed.name}
          onInput={(e) => update({ name: e.target.value })}
          placeholder=" "
          id="bed-name"
        />
        <label
          for="bed-name"
          class="absolute left-3 top-2 text-[11px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide pointer-events-none"
        >
          {t('name')}
        </label>
      </div>

      <div class="relative">
        <input
          class="peer block w-full border border-zinc-300 dark:border-zinc-600 bg-transparent rounded-lg px-3.5 pt-5 pb-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-green-500 dark:focus:border-green-400 focus:ring-1 focus:ring-green-500 dark:focus:ring-green-400 transition-colors duration-150"
          value={props.bed.owner}
          onInput={(e) => update({ owner: e.target.value })}
          placeholder=" "
          id="bed-owner"
        />
        <label
          for="bed-owner"
          class="absolute left-3 top-2 text-[11px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide pointer-events-none"
        >
          {t('owner')}
        </label>
      </div>

      <div>
        <span class="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
          {t('color')}
        </span>
        <div class="mt-2 flex gap-2 flex-wrap">
          <For each={COLORS}>
            {(c) => (
              <button
                class="cursor-pointer w-8 h-8 rounded-full border-2 transition-all duration-150 hover:scale-110 hover:shadow-md"
                classList={{
                  'border-zinc-800 dark:border-white scale-110 shadow-md': props.bed.color === c,
                  'border-transparent': props.bed.color !== c,
                }}
                style={{ background: c }}
                onClick={() => update({ color: c })}
              />
            )}
          </For>
        </div>
      </div>
    </div>
  )
}
