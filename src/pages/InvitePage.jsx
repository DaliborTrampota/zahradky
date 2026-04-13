import { createSignal, onMount } from 'solid-js'
import { useNavigate } from '@solidjs/router'
import { supabase } from '../utils/supabase.js'
import { t } from '../utils/i18n.js'
import { setMapReady } from '../store/appState.js'

export default function InvitePage() {
  const navigate = useNavigate()
  const [password, setPassword] = createSignal('')
  const [confirm, setConfirm] = createSignal('')
  const [error, setError] = createSignal('')
  const [loading, setLoading] = createSignal(false)
  const [ready, setReady] = createSignal(false)

  onMount(() => {
    setMapReady(true)
    // Supabase processes the #access_token hash automatically.
    // We just need to confirm the URL contains type=invite.
    const hash = window.location.hash
    if (hash.includes('type=invite') || hash.includes('access_token')) {
      setReady(true)
    } else {
      // No invite token — redirect away
      navigate('/', { replace: true })
    }
  })

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (password() !== confirm()) {
      setError(t('passwordMismatch'))
      return
    }
    if (password().length < 6) {
      setError(t('passwordTooShort'))
      return
    }

    setLoading(true)
    try {
      const { error: err } = await supabase.auth.updateUser({ password: password() })
      if (err) throw err
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div class="min-h-screen flex items-center justify-center bg-zinc-100 dark:bg-zinc-950 px-4">
      <div class="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-800 p-8">
        <h1 class="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mb-1">
          {t('setPassword')}
        </h1>
        <p class="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
          {t('setPasswordHint')}
        </p>

        <form onSubmit={handleSubmit} class="space-y-4">
          <div class="relative">
            <input
              class="peer block w-full border border-zinc-300 dark:border-zinc-600 bg-transparent rounded-lg px-3.5 pt-5 pb-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-green-500 dark:focus:border-green-400 focus:ring-1 focus:ring-green-500 dark:focus:ring-green-400 transition-colors duration-150"
              type="password"
              id="invite-password"
              value={password()}
              onInput={(e) => setPassword(e.target.value)}
              placeholder=" "
              required
              minLength={6}
            />
            <label
              for="invite-password"
              class="absolute left-3 top-2 text-[11px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide pointer-events-none"
            >
              {t('newPassword')}
            </label>
          </div>

          <div class="relative">
            <input
              class="peer block w-full border border-zinc-300 dark:border-zinc-600 bg-transparent rounded-lg px-3.5 pt-5 pb-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-green-500 dark:focus:border-green-400 focus:ring-1 focus:ring-green-500 dark:focus:ring-green-400 transition-colors duration-150"
              type="password"
              id="invite-confirm"
              value={confirm()}
              onInput={(e) => setConfirm(e.target.value)}
              placeholder=" "
              required
              minLength={6}
            />
            <label
              for="invite-confirm"
              class="absolute left-3 top-2 text-[11px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide pointer-events-none"
            >
              {t('confirmPassword')}
            </label>
          </div>

          {error() && (
            <p class="text-sm text-red-600 dark:text-red-400">{error()}</p>
          )}

          <button
            type="submit"
            disabled={loading()}
            class="cursor-pointer w-full bg-green-600 hover:bg-green-700 active:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg px-4 py-2.5 text-sm font-medium shadow-sm hover:shadow-md transition-all duration-150"
          >
            {loading() ? t('saving') : t('setPassword')}
          </button>
        </form>
      </div>
    </div>
  )
}
