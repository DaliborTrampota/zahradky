import { Show } from 'solid-js'
import { isDark, toggleDark } from '../utils/darkMode.js'
import { t, currentLang, toggleLang } from '../utils/i18n.js'
import { isMobile } from '../utils/mobile.js'

export default function Toolbar(props) {
  return (
    <header class="flex items-center gap-1.5 sm:gap-3 px-3 sm:px-5 h-12 sm:h-14 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 shadow-md shrink-0 transition-colors duration-200">
      <h1 class="text-base sm:text-lg font-semibold text-zinc-800 dark:text-zinc-100 tracking-tight mr-auto truncate">
        {t('appTitle')}
      </h1>

      <Show when={!isMobile()}>
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
    </header>
  )
}
