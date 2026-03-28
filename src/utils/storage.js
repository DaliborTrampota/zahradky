const KEY = 'zahradky_garden'

export function loadGarden() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : { beds: [] }
  } catch {
    return { beds: [] }
  }
}

export function saveGarden(data) {
  localStorage.setItem(KEY, JSON.stringify(data))
}
