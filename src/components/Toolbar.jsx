import { Show } from 'solid-js'
import { isDark, toggleDark } from '../utils/darkMode.js'

export default function Toolbar(props) {
  return (
    <header class="flex items-center gap-3 px-5 py-3 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 shadow-md shrink-0 transition-colors duration-200">
      <h1 class="text-lg font-semibold text-zinc-800 dark:text-zinc-100 tracking-tight mr-auto">
        Zahradky
      </h1>

      <Show when={props.drawMode}>
        <div class="flex items-center gap-3 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-full px-4 py-1.5">
          <span class="text-sm font-medium text-amber-700 dark:text-amber-300">
            {props.draftCount} point{props.draftCount !== 1 ? 's' : ''}
          </span>
          <button
            onClick={props.onFinishDraw}
            disabled={props.draftCount < 3}
            class="cursor-pointer bg-green-600 hover:bg-green-700 active:bg-green-800 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-1.5 rounded-full shadow-sm hover:shadow-md transition-all duration-150"
          >
            Finish
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
        {props.drawMode ? 'Cancel' : 'Draw bed'}
      </button>

      <div class="w-px h-6 bg-zinc-200 dark:bg-zinc-700" />

      <button
        onClick={toggleDark}
        class="cursor-pointer w-9 h-9 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 transition-colors duration-150"
        title={isDark() ? 'Switch to light mode' : 'Switch to dark mode'}
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
  )
}
