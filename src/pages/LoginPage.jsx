import { createSignal } from 'solid-js'
import { login } from '../store/authStore.js'
import { t } from '../utils/i18n.js'
import { isDark, toggleDark } from '../utils/darkMode.js'
import { currentLang, toggleLang } from '../utils/i18n.js'

export default function LoginPage() {
  const [email, setEmail] = createSignal('')
  const [password, setPassword] = createSignal('')
  const [error, setError] = createSignal('')
  const [submitting, setSubmitting] = createSignal(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(email(), password())
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div class="min-h-screen flex flex-col bg-zinc-100 dark:bg-zinc-950 transition-colors duration-200">
      <div class="absolute top-4 right-4 flex gap-1">
        <button
          onClick={toggleLang}
          class="cursor-pointer h-9 px-2 flex items-center justify-center rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide transition-colors duration-150"
        >
          {currentLang() === 'cs' ? 'EN' : 'CZ'}
        </button>
        <button
          onClick={toggleDark}
          class="cursor-pointer w-9 h-9 flex items-center justify-center rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 transition-colors duration-150"
        >
          {isDark() ? '\u2600' : '\u263E'}
        </button>
      </div>

      <div class="flex-1 flex items-center justify-center px-4">
        <div class="w-full max-w-sm">
          <div class="text-center mb-8">
            <img src="/logo.png" alt="Logo" class="w-24 h-24 mx-auto mb-4" />
            <h1 class="text-2xl font-bold text-zinc-800 dark:text-zinc-100">
              {t('appTitle')}
            </h1>
          </div>

          <form onSubmit={handleSubmit} class="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-800 p-6 space-y-4">
            <div class="relative">
              <input
                class="peer block w-full border border-zinc-300 dark:border-zinc-600 bg-transparent rounded-lg px-3.5 pt-5 pb-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-green-500 dark:focus:border-green-400 focus:ring-1 focus:ring-green-500 dark:focus:ring-green-400 transition-colors duration-150"
                type="email"
                value={email()}
                onInput={(e) => setEmail(e.target.value)}
                placeholder=" "
                id="login-email"
                required
              />
              <label
                for="login-email"
                class="absolute left-3 top-2 text-[11px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide pointer-events-none"
              >
                {t('email')}
              </label>
            </div>

            <div class="relative">
              <input
                class="peer block w-full border border-zinc-300 dark:border-zinc-600 bg-transparent rounded-lg px-3.5 pt-5 pb-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-green-500 dark:focus:border-green-400 focus:ring-1 focus:ring-green-500 dark:focus:ring-green-400 transition-colors duration-150"
                type="password"
                value={password()}
                onInput={(e) => setPassword(e.target.value)}
                placeholder=" "
                id="login-password"
                required
              />
              <label
                for="login-password"
                class="absolute left-3 top-2 text-[11px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide pointer-events-none"
              >
                {t('password')}
              </label>
            </div>

            {error() && (
              <p class="text-sm text-red-600 dark:text-red-400">{error()}</p>
            )}

            <button
              type="submit"
              disabled={submitting()}
              class="cursor-pointer w-full bg-green-600 hover:bg-green-700 active:bg-green-800 disabled:opacity-50 text-white rounded-lg px-4 py-2.5 text-sm font-medium shadow-sm hover:shadow-md transition-all duration-150"
            >
              {submitting() ? '...' : t('login')}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
