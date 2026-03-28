import { Show } from 'solid-js'

export default function Toolbar(props) {
  return (
    <header class="flex items-center gap-3 px-4 py-3 bg-white border-b border-stone-200 shadow-sm shrink-0">
      <h1 class="text-lg font-semibold text-stone-800 mr-auto">Zahradky</h1>

      <Show when={props.drawMode}>
        <div class="flex items-center gap-3 bg-stone-100 rounded-lg px-3 py-1.5">
          <span class="text-sm font-medium text-stone-500">
            {props.draftCount} point{props.draftCount !== 1 ? 's' : ''}
          </span>
          <button
            onClick={props.onFinishDraw}
            disabled={props.draftCount < 3}
            class="cursor-pointer bg-green-500 hover:bg-green-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-3 py-1.5 rounded transition-colors"
          >
            Finish bed
          </button>
        </div>
      </Show>

      <button
        onClick={props.onToggleDraw}
        class="cursor-pointer text-sm font-medium px-4 py-2 rounded border transition-colors"
        classList={{
          'bg-yellow-400 border-yellow-500 text-yellow-900 hover:bg-yellow-300': props.drawMode,
          'bg-white border-stone-300 text-stone-700 hover:bg-stone-50': !props.drawMode,
        }}
      >
        {props.drawMode ? 'Cancel' : 'Draw bed'}
      </button>
    </header>
  )
}
