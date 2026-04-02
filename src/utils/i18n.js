import { createSignal } from 'solid-js'

const translations = {
  cs: {
    appTitle: 'Zahrádky Strahov',
    drawBed: 'Kreslit záhon',
    cancel: 'Zrušit',
    finish: 'Dokončit',
    points: (n) => `${n} ${n === 1 ? 'bod' : n < 5 ? 'body' : 'bodů'}`,
    hideLabels: 'Skrýt popisky',
    showLabels: 'Zobrazit popisky',
    lightMode: 'Světlý režim',
    darkMode: 'Tmavý režim',
    deleteBed: 'Smazat záhon',
    confirmDelete: (name) => `Smazat záhon "${name}"?`,
    close: 'Zavřít',
    name: 'Název',
    owner: 'Vlastník',
    color: 'Barva',
    plants: 'Rostliny',
    noPlantsYet: 'Zatím žádné rostliny',
    plantName: 'Název rostliny',
    removePlant: 'Odebrat rostlinu',
    confirmRemovePlant: (name) => `Odebrat rostlinu "${name}"?`,
    addPlant: 'Přidat rostlinu',
    bedType: 'Typ',
    bedTypes: {
      raised: 'Vyvýšený záhon',
      tree: 'Strom / keř / ovoce',
      flowers: 'Květiny',
      herbs: 'Bylinky',
    },
    admin: 'Nastavení',
    typeColors: 'Barvy typů záhonů',
    resetDefaults: 'Obnovit výchozí',
    login: 'Přihlásit',
    logout: 'Odhlásit',
    password: 'Heslo',
    changePassword: 'Změnit heslo',
    newPassword: 'Nové heslo',
    passwordChanged: 'Heslo bylo změněno',
    gardenMap: 'Mapa zahrady',
    clickToPlace: (n) => `Klikněte pro umístění bodů — ${n} umístěno`,
    resetView: 'Obnovit pohled',
    zoomIn: 'Přiblížit',
    zoomOut: 'Oddálit',
  },
  en: {
    appTitle: 'Zahrádky Strahov',
    drawBed: 'Draw bed',
    cancel: 'Cancel',
    finish: 'Finish',
    points: (n) => `${n} point${n !== 1 ? 's' : ''}`,
    hideLabels: 'Hide labels',
    showLabels: 'Show labels',
    lightMode: 'Switch to light mode',
    darkMode: 'Switch to dark mode',
    deleteBed: 'Delete this bed',
    confirmDelete: (name) => `Delete bed "${name}"?`,
    close: 'Close',
    name: 'Name',
    owner: 'Owner',
    color: 'Color',
    plants: 'Plants',
    noPlantsYet: 'No plants yet',
    plantName: 'Plant name',
    removePlant: 'Remove plant',
    confirmRemovePlant: (name) => `Remove plant "${name}"?`,
    addPlant: 'Add plant',
    bedType: 'Type',
    bedTypes: {
      raised: 'Raised bed',
      tree: 'Tree / bush / fruit',
      flowers: 'Flowers',
      herbs: 'Herbs',
    },
    admin: 'Settings',
    typeColors: 'Bed type colors',
    resetDefaults: 'Reset to defaults',
    login: 'Log in',
    logout: 'Log out',
    password: 'Password',
    changePassword: 'Change password',
    newPassword: 'New password',
    passwordChanged: 'Password changed successfully',
    gardenMap: 'Garden map',
    clickToPlace: (n) => `Click to place points — ${n} placed`,
    resetView: 'Reset view',
    zoomIn: 'Zoom in',
    zoomOut: 'Zoom out',
  },
}

function getInitialLang() {
  const stored = localStorage.getItem('zahradky_lang')
  if (stored && translations[stored]) return stored
  return 'cs'
}

const [lang, setLangInternal] = createSignal(getInitialLang())

export function currentLang() {
  return lang()
}

export function toggleLang() {
  const next = lang() === 'cs' ? 'en' : 'cs'
  setLangInternal(next)
  localStorage.setItem('zahradky_lang', next)
}

export function t(key, ...args) {
  const val = translations[lang()][key]
  if (typeof val === 'function') return val(...args)
  return val || key
}
