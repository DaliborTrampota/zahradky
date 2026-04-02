import { createSignal, For, Show, onMount } from 'solid-js'
import { useNavigate } from '@solidjs/router'
import { typeColors, setTypeColor, resetTypeColors } from '../store/typeColors.js'
import { isAdmin, changePassword, currentUser } from '../store/authStore.js'
import { supabase } from '../utils/supabase.js'
import { isDark, toggleDark } from '../utils/darkMode.js'
import { t, currentLang, toggleLang } from '../utils/i18n.js'

const BED_TYPES = ['raised', 'tree', 'flowers', 'herbs']

export default function AdminPage() {
  const navigate = useNavigate()

  // Password change
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

  // User list (admin only)
  const [users, setUsers] = createSignal([])

  onMount(async () => {
    if (isAdmin()) {
      const { data } = await supabase.from('profiles').select('*').order('created_at')
      if (data) setUsers(data)
    }
  })

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
          {isDark() ? '\u2600' : '\u263E'}
        </button>
      </header>

      <div class="max-w-md mx-auto px-5 py-8 space-y-8">
        {/* Change password */}
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

        {/* Type colors */}
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

        {/* User management (admin only) */}
        <Show when={isAdmin()}>
          <section>
            <h2 class="text-sm font-semibold text-zinc-800 dark:text-zinc-200 uppercase tracking-wide mb-4">
              {t('userManagement')}
            </h2>
            <div class="space-y-2">
              <For each={users()} fallback={<p class="text-sm text-zinc-400">{t('noUsers')}</p>}>
                {(user) => (
                  <div class="flex items-center gap-3 bg-white dark:bg-zinc-900 rounded-xl px-4 py-3 border border-zinc-200 dark:border-zinc-800">
                    <div class="min-w-0 flex-1">
                      <p class="text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate">
                        {user.display_name || user.email}
                      </p>
                      <Show when={user.display_name}>
                        <p class="text-xs text-zinc-400 dark:text-zinc-500 truncate">{user.email}</p>
                      </Show>
                    </div>
                    <span
                      class="text-xs font-medium px-2 py-0.5 rounded-full"
                      classList={{
                        'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300': user.role === 'admin',
                        'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400': user.role !== 'admin',
                      }}
                    >
                      {user.role === 'admin' ? t('roleAdmin') : t('roleMember')}
                    </span>
                  </div>
                )}
              </For>
            </div>
            <p class="mt-4 text-xs text-zinc-400 dark:text-zinc-500">
              {t('createUserHint')}
            </p>
          </section>
        </Show>
      </div>
    </div>
  )
}
