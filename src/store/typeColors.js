import { createStore } from 'solid-js/store'

const STORAGE_KEY = 'zahradky_type_colors'

const DEFAULTS = {
  raised: '#fbbf24',
  tree: '#4ade80',
  flowers: '#f472b6',
  herbs: '#34d399',
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : { ...DEFAULTS }
  } catch {
    return { ...DEFAULTS }
  }
}

const [typeColors, setTypeColors] = createStore(load())

export { typeColors }

export function setTypeColor(type, color) {
  setTypeColors(type, color)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(typeColors))
}

export function resetTypeColors() {
  setTypeColors(DEFAULTS)
  localStorage.removeItem(STORAGE_KEY)
}
