import { createSignal, createEffect, Show } from 'solid-js'
import { mapReady } from '../store/appState.js'

export default function SplashScreen() {
  const [visible, setVisible] = createSignal(true)
  const [fading, setFading] = createSignal(false)

  createEffect(() => {
    if (mapReady()) {
      // Minimum 900ms visible, then fade out
      const elapsed = performance.now()
      const minDelay = Math.max(0, 900 - elapsed)
      setTimeout(() => setFading(true), minDelay)
      setTimeout(() => setVisible(false), minDelay + 500)
    }
  })

  return (
    <Show when={visible()}>
      <div
        class="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-white dark:bg-zinc-950 transition-opacity duration-500"
        classList={{ 'opacity-0': fading() }}
      >
        <img src="/logo.png" alt="Logo" class="w-44 h-44 mb-6" />
        <h1 class="text-3xl font-bold text-zinc-800 dark:text-zinc-100 tracking-tight">
          Zahrádky Strahov
        </h1>
        <p class="mt-4 text-sm text-zinc-400 dark:text-zinc-500 animate-pulse">
          Načítám mapu...
        </p>
      </div>
    </Show>
  )
}
