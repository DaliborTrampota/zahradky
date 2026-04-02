import { supabase } from './supabase.js'

const LOCAL_KEY = 'zahradky_garden'

function loadLocal() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY)
    return raw ? JSON.parse(raw) : { beds: [] }
  } catch {
    return { beds: [] }
  }
}

function saveLocal(data) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(data))
}

export async function loadGarden() {
  try {
    const { data: beds, error } = await supabase
      .from('beds')
      .select('*, plants(*)')
      .order('created_at')

    if (error) throw error

    const garden = { beds: beds.map(formatBed) }
    saveLocal(garden)
    return garden
  } catch (e) {
    console.warn('Supabase load failed, using localStorage fallback:', e.message)
    return loadLocal()
  }
}

export async function upsertBed(bed) {
  const { plants, ...bedRow } = bed
  const { error } = await supabase.from('beds').upsert(bedRow)
  if (error) console.error('Failed to save bed:', error.message)
}

export async function deleteBedRemote(id) {
  const { error } = await supabase.from('beds').delete().eq('id', id)
  if (error) console.error('Failed to delete bed:', error.message)
}

export async function upsertPlant(bedId, plant) {
  const { error } = await supabase
    .from('plants')
    .upsert({ id: plant.id, bed_id: bedId, name: plant.name, date_planted: plant.datePlanted })
  if (error) console.error('Failed to save plant:', error.message)
}

export async function deletePlantRemote(plantId) {
  const { error } = await supabase.from('plants').delete().eq('id', plantId)
  if (error) console.error('Failed to delete plant:', error.message)
}

function formatBed(row) {
  return {
    id: row.id,
    name: row.name,
    owner: row.owner,
    type: row.type || '',
    color: row.color,
    points: row.points,
    plants: (row.plants || []).map((p) => ({
      id: p.id,
      name: p.name,
      datePlanted: p.date_planted,
    })),
  }
}
