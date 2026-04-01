import { createStore } from 'solid-js/store'
import { createSignal } from 'solid-js'
import {
  loadGarden,
  upsertBed,
  deleteBedRemote,
  upsertPlant,
  deletePlantRemote,
} from '../utils/storage.js'
import { generateId } from '../utils/id.js'

const [garden, setGarden] = createStore({ beds: [] })
const [loading, setLoading] = createSignal(true)

loadGarden().then((data) => {
  setGarden(data)
  setLoading(false)
})

export { garden, loading }

export const addBed = (points) => {
  const bed = {
    id: generateId(),
    name: 'New Bed',
    owner: '',
    color: '#4ade80',
    points,
    plants: [],
  }
  setGarden('beds', (beds) => [...beds, bed])
  upsertBed(bed)
}

export const updateBed = (id, patch) => {
  setGarden('beds', (b) => b.id === id, patch)
  const bed = garden.beds.find((b) => b.id === id)
  if (bed) upsertBed(bed)
}

export const deleteBed = (id) => {
  setGarden('beds', (beds) => beds.filter((b) => b.id !== id))
  deleteBedRemote(id)
}

export const addPlant = (bedId, plant) => {
  const full = { id: generateId(), ...plant }
  setGarden(
    'beds',
    (b) => b.id === bedId,
    'plants',
    (plants) => [...plants, full]
  )
  upsertPlant(bedId, full)
}

export const removePlant = (bedId, plantId) => {
  setGarden(
    'beds',
    (b) => b.id === bedId,
    'plants',
    (plants) => plants.filter((p) => p.id !== plantId)
  )
  deletePlantRemote(plantId)
}
