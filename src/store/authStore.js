import { createSignal } from 'solid-js'
import { supabase } from '../utils/supabase.js'

const [user, setUser] = createSignal(null)
const [profile, setProfile] = createSignal(null)

async function fetchProfile(userId) {
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  return data
}

async function handleSession(session) {
  if (session?.user) {
    setUser(session.user)
    setProfile(await fetchProfile(session.user.id))
  } else {
    setUser(null)
    setProfile(null)
  }
}

supabase.auth.getSession().then(({ data: { session } }) => {
  handleSession(session)
})

supabase.auth.onAuthStateChange((_event, session) => {
  handleSession(session)
})

export function isLoggedIn() {
  return !!user()
}

export function isAdmin() {
  return profile()?.role === 'admin'
}

export async function login(email, password) {
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
}

export async function logout() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function changePassword(newPassword) {
  const { error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) throw error
}
