import { For } from 'solid-js'
import { useNavigate } from '@solidjs/router'
import { typeColors, setTypeColor, resetTypeColors } from '../store/typeColors.js'
import { isDark, toggleDark } from '../utils/darkMode.js'
import { t, currentLang, toggleLang } from '../utils/i18n.js'

const BED_TYPES = ['raised', 'tree', 'flowers', 'herbs']

export default function AdminPage() {
  const navigate = useNavigate()

  return (
    <div class="min-h-screen bg-zinc-100 dark:bg-zinc-950 transition-colors duration-200">
      <header class="flex items-center gap-3 px-5 h-14 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 shadow-md">
        <button
          onClick={() => navigate('/')}
          class="cursor-pointer w-9 h-9 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 transition-colors duration-150"
          title={t('close')}
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <h1 class="text-lg font-semibold text-zinc-800 dark:text-zinc-100 tracking-tight mr-auto">
          {t('admin')}
        </h1>
        <button
          onClick={toggleLang}
          class="cursor-pointer h-9 px-2 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide transition-colors duration-150"
        >
          {currentLang() === 'cs' ? 'EN' : 'CZ'}
        </button>
        <button
          onClick={toggleDark}
          class="cursor-pointer w-9 h-9 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 transition-colors duration-150"
        >
          {isDark() ? '☀️' : '🌙'}
        </button>
      </header>

      <div class="max-w-md mx-auto px-5 py-8 space-y-6">
        <section>
          <h2 class="text-sm font-semibold text-zinc-800 dark:text-zinc-200 uppercase tracking-wide mb-4">
            {t('typeColors')}
          </h2>
          <div class="space-y-3">
            <For each={BED_TYPES}>
              {(type) => (
                <div class="flex items-center gap-3 bg-white dark:bg-zinc-900 rounded-xl px-4 py-3 border border-zinc-200 dark:border-zinc-800">
                  <label
                    class="relative cursor-pointer w-9 h-9 rounded-full border-2 border-zinc-300 dark:border-zinc-600 overflow-hidden shrink-0"
                    style={{ background: typeColors[type] }}
                  >
                    <input
                      type="color"
                      class="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      value={typeColors[type]}
                      onInput={(e) => setTypeColor(type, e.target.value)}
                    />
                  </label>
                  <span class="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                    {t('bedTypes')[type]}
                  </span>
                  <span class="ml-auto text-xs text-zinc-400 dark:text-zinc-500 font-mono">
                    {typeColors[type]}
                  </span>
                </div>
              )}
            </For>
          </div>
          <button
            onClick={resetTypeColors}
            class="cursor-pointer mt-4 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors duration-150"
          >
            {t('resetDefaults')}
          </button>
        </section>
      </div>
    </div>
  )
}
