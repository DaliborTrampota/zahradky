import { createStore } from 'solid-js/store'
import { loadGarden, saveGarden } from '../utils/storage.js'
import { generateId } from '../utils/id.js'

const [garden, setGarden] = createStore(loadGarden())

function persist(fn) {
  return (...args) => {
    fn(...args)
    saveGarden(garden)
  }
}

export { garden }

export const addBed = persist((points) => {
  setGarden('beds', (beds) => [
    ...beds,
    {
      id: generateId(),
      name: 'New Bed',
      owner: '',
      color: '#4ade80',
      points,
      plants: [],
    },
  ])
})

export const updateBed = persist((id, patch) => {
  setGarden('beds', (b) => b.id === id, patch)
})

export const deleteBed = persist((id) => {
  setGarden('beds', (beds) => beds.filter((b) => b.id !== id))
})

export const addPlant = persist((bedId, plant) => {
  setGarden(
    'beds',
    (b) => b.id === bedId,
    'plants',
    (plants) => [...plants, { id: generateId(), ...plant }]
  )
})

export const removePlant = persist((bedId, plantId) => {
  setGarden(
    'beds',
    (b) => b.id === bedId,
    'plants',
    (plants) => plants.filter((p) => p.id !== plantId)
  )
})
