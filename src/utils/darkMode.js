import { createSignal } from 'solid-js'

function getInitial() {
  const stored = localStorage.getItem('zahradky_dark')
  if (stored !== null) return stored === 'true'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

const [dark, setDarkInternal] = createSignal(getInitial())

// Apply on load
if (dark()) document.documentElement.classList.add('dark')

export function isDark() {
  return dark()
}

export function toggleDark() {
  const next = !dark()
  setDarkInternal(next)
  localStorage.setItem('zahradky_dark', String(next))
  document.documentElement.classList.toggle('dark', next)
}
