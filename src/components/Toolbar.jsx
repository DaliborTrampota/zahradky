import { createSignal, Show } from 'solid-js'
import { useNavigate } from '@solidjs/router'
import { isDark, toggleDark } from '../utils/darkMode.js'
import { t, currentLang, toggleLang } from '../utils/i18n.js'
import { isMobile } from '../utils/mobile.js'
import { isAdmin, adminLogin, adminLogout } from '../store/authStore.js'

export default function Toolbar(props) {
  const navigate = useNavigate()
  const [showLogin, setShowLogin] = createSignal(false)
  const [email, setEmail] = createSignal('')
  const [password, setPassword] = createSignal('')
  const [loginError, setLoginError] = createSignal('')

  async function handleLogin(e) {
    e.preventDefault()
    setLoginError('')
    try {
      await adminLogin(email(), password())
      setShowLogin(false)
      setEmail('')
      setPassword('')
    } catch (err) {
      setLoginError(err.message)
    }
  }

  return (
    <header class="relative flex items-center gap-1.5 sm:gap-3 px-3 sm:px-5 h-12 sm:h-14 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 shadow-md shrink-0 transition-colors duration-200">
      <div class="flex items-center gap-2 mr-auto min-w-0">
        <img src="/logo.png" alt="Logo" class="w-7 h-7 sm:w-8 sm:h-8 shrink-0" />
        <h1 class="text-base sm:text-lg font-semibold text-zinc-800 dark:text-zinc-100 tracking-tight truncate">
          {t('appTitle')}
        </h1>
      </div>

      <Show when={!isMobile() && isAdmin()}>
        <Show when={props.drawMode}>
          <div class="flex items-center gap-3 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-full px-4 py-1.5">
            <span class="text-sm font-medium text-amber-700 dark:text-amber-300">
              {t('points', props.draftCount)}
            </span>
            <button
              onClick={props.onFinishDraw}
              disabled={props.draftCount < 3}
              class="cursor-pointer bg-green-600 hover:bg-green-700 active:bg-green-800 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-1.5 rounded-full shadow-sm hover:shadow-md transition-all duration-150"
            >
              {t('finish')}
            </button>
          </div>
        </Show>

        <button
          onClick={props.onToggleDraw}
          class="cursor-pointer text-sm font-medium px-5 py-2 rounded-full transition-all duration-150"
          classList={{
            'bg-amber-500 hover:bg-amber-600 text-white shadow-sm hover:shadow-md': props.drawMode,
            'bg-green-600 hover:bg-green-700 active:bg-green-800 text-white shadow-sm hover:shadow-md': !props.drawMode,
          }}
        >
          {props.drawMode ? t('cancel') : t('drawBed')}
        </button>

        <div class="w-px h-6 bg-zinc-200 dark:bg-zinc-700" />
      </Show>

      <button
        onClick={props.onToggleLabels}
        class="cursor-pointer w-9 h-9 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors duration-150 shrink-0"
        classList={{
          'text-green-600 dark:text-green-400': props.showLabels,
          'text-zinc-400 dark:text-zinc-500': !props.showLabels,
        }}
        title={props.showLabels ? t('hideLabels') : t('showLabels')}
      >
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6z" />
        </svg>
      </button>

      <button
        onClick={toggleLang}
        class="cursor-pointer h-9 px-2 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide transition-colors duration-150 shrink-0"
        title={currentLang() === 'cs' ? 'Switch to English' : 'Přepnout do češtiny'}
      >
        {currentLang() === 'cs' ? 'EN' : 'CZ'}
      </button>

      <button
        onClick={() => navigate('/admin')}
        class="cursor-pointer w-9 h-9 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 transition-colors duration-150 shrink-0"
        title={t('admin')}
      >
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      <button
        onClick={toggleDark}
        class="cursor-pointer w-9 h-9 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 transition-colors duration-150 shrink-0"
        title={isDark() ? t('lightMode') : t('darkMode')}
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

      {/* Admin login/logout */}
      <Show
        when={isAdmin()}
        fallback={
          <button
            onClick={() => setShowLogin(!showLogin())}
            class="cursor-pointer w-9 h-9 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 dark:text-zinc-600 transition-colors duration-150 shrink-0"
            title="Admin"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </button>
        }
      >
        <button
          onClick={adminLogout}
          class="cursor-pointer w-9 h-9 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-green-600 dark:text-green-400 transition-colors duration-150 shrink-0"
          title={t('logout')}
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 00-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75A2.25 2.25 0 003.75 21.75z" />
          </svg>
        </button>
      </Show>

      {/* Admin login dropdown */}
      <Show when={showLogin()}>
        <div class="absolute top-full right-3 mt-2 w-72 bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-700 p-4 z-50">
          <form onSubmit={handleLogin} class="space-y-3">
            <input
              class="block w-full border border-zinc-300 dark:border-zinc-600 bg-transparent rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-green-500 dark:focus:border-green-400 focus:ring-1 focus:ring-green-500 dark:focus:ring-green-400 transition-colors duration-150"
              type="email"
              placeholder="Email"
              value={email()}
              onInput={(e) => setEmail(e.target.value)}
              required
            />
            <input
              class="block w-full border border-zinc-300 dark:border-zinc-600 bg-transparent rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-green-500 dark:focus:border-green-400 focus:ring-1 focus:ring-green-500 dark:focus:ring-green-400 transition-colors duration-150"
              type="password"
              placeholder={t('password')}
              value={password()}
              onInput={(e) => setPassword(e.target.value)}
              required
            />
            {loginError() && (
              <p class="text-xs text-red-500">{loginError()}</p>
            )}
            <button
              type="submit"
              class="cursor-pointer w-full bg-green-600 hover:bg-green-700 text-white rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150"
            >
              {t('login')}
            </button>
          </form>
        </div>
      </Show>
    </header>
  )
}
