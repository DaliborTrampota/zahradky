import { createSignal } from 'solid-js'
import { supabase } from '../utils/supabase.js'

const [adminUser, setAdminUser] = createSignal(null)

// Check existing session on load
supabase.auth.getSession().then(({ data: { session } }) => {
  setAdminUser(session?.user || null)
})

supabase.auth.onAuthStateChange((_event, session) => {
  setAdminUser(session?.user || null)
})

export function isAdmin() {
  return !!adminUser()
}

export async function adminLogin(email, password) {
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
}

export async function adminLogout() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}
