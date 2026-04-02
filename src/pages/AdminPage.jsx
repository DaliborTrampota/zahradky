import { createSignal, For, Show } from 'solid-js'
import { useNavigate } from '@solidjs/router'
import { typeColors, setTypeColor, resetTypeColors } from '../store/typeColors.js'
import { isLoggedIn, changePassword } from '../store/authStore.js'
import { isDark, toggleDark } from '../utils/darkMode.js'
import { t, currentLang, toggleLang } from '../utils/i18n.js'

const BED_TYPES = ['raised', 'tree', 'flowers', 'herbs']

export default function AdminPage() {
  const navigate = useNavigate()
  const [newPass, setNewPass] = createSignal('')
  const [passMsg, setPassMsg] = createSignal('')
  const [passError, setPassError] = createSignal('')

  async function handleChangePassword(e) {
    e.preventDefault()
    setPassMsg('')
    setPassError('')
    try {
      await changePassword(newPass())
      setNewPass('')
      setPassMsg(t('passwordChanged'))
    } catch (err) {
      setPassError(err.message)
    }
  }

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
          <Show
            when={isDark()}
            fallback={
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            }
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
            </svg>
          </Show>
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

        <Show when={isLoggedIn()}>
          <section>
            <h2 class="text-sm font-semibold text-zinc-800 dark:text-zinc-200 uppercase tracking-wide mb-4">
              {t('changePassword')}
            </h2>
            <form onSubmit={handleChangePassword} class="space-y-3">
              <div class="relative">
                <input
                  class="peer block w-full border border-zinc-300 dark:border-zinc-600 bg-transparent rounded-lg px-3.5 pt-5 pb-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-green-500 dark:focus:border-green-400 focus:ring-1 focus:ring-green-500 dark:focus:ring-green-400 transition-colors duration-150"
                  type="password"
                  value={newPass()}
                  onInput={(e) => setNewPass(e.target.value)}
                  placeholder=" "
                  id="new-password"
                  required
                  minLength={6}
                />
                <label
                  for="new-password"
                  class="absolute left-3 top-2 text-[11px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide pointer-events-none"
                >
                  {t('newPassword')}
                </label>
              </div>
              {passMsg() && <p class="text-sm text-green-600 dark:text-green-400">{passMsg()}</p>}
              {passError() && <p class="text-sm text-red-600 dark:text-red-400">{passError()}</p>}
              <button
                type="submit"
                class="cursor-pointer w-full bg-green-600 hover:bg-green-700 active:bg-green-800 text-white rounded-lg px-4 py-2.5 text-sm font-medium shadow-sm hover:shadow-md transition-all duration-150"
              >
                {t('changePassword')}
              </button>
            </form>
          </section>
        </Show>
      </div>
    </div>
  )
}
