import { For } from 'solid-js'
import { updateBed } from '../store/gardenStore.js'
import { typeColors } from '../store/typeColors.js'
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

      <div class="relative">
        <select
          class="block w-full border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 rounded-lg px-3.5 pt-5 pb-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-green-500 dark:focus:border-green-400 focus:ring-1 focus:ring-green-500 dark:focus:ring-green-400 transition-colors duration-150 appearance-none cursor-pointer"
          value={props.bed.type || ''}
          onChange={(e) => {
            const type = e.target.value
            const patch = { type }
            if (typeColors[type]) patch.color = typeColors[type]
            update(patch)
          }}
          id="bed-type"
        >
          <option class="bg-white dark:bg-zinc-800" value="">{t('bedType')}...</option>
          <option class="bg-white dark:bg-zinc-800" value="raised">{t('bedTypes').raised}</option>
          <option class="bg-white dark:bg-zinc-800" value="tree">{t('bedTypes').tree}</option>
          <option class="bg-white dark:bg-zinc-800" value="flowers">{t('bedTypes').flowers}</option>
          <option class="bg-white dark:bg-zinc-800" value="herbs">{t('bedTypes').herbs}</option>
        </select>
        <label
          for="bed-type"
          class="absolute left-3 top-2 text-[11px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide pointer-events-none"
        >
          {t('bedType')}
        </label>
        <svg class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </div>

      <div>
        <span class="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
          {t('color')}
        </span>
        <div class="mt-2 flex gap-2 flex-wrap items-center">
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
          <label
            class="relative cursor-pointer w-8 h-8 rounded-full border-2 border-zinc-300 dark:border-zinc-600 bg-zinc-100 dark:bg-zinc-700 transition-all duration-150 hover:scale-110 hover:shadow-md overflow-hidden flex items-center justify-center"
            classList={{
              'border-zinc-800! dark:border-white! scale-110 shadow-md': !COLORS.includes(props.bed.color),
            }}
          >
            <svg class="w-4 h-4 text-zinc-700 dark:text-zinc-200 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2 22l1-1h3l9-9" />
              <path d="M3 21v-3l9-9" />
              <path d="M14.5 5.5l4-4a1.41 1.41 0 0 1 2 2l-4 4" />
              <path d="M12 8l4 4" />
            </svg>
            <input
              type="color"
              class="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              value={props.bed.color || '#4ade80'}
              onInput={(e) => update({ color: e.target.value })}
            />
          </label>
        </div>
      </div>
    </div>
  )
}
