import { createSignal } from 'solid-js'
import { supabase } from '../utils/supabase.js'
import { initGarden } from './gardenStore.js'

const [currentUser, setCurrentUser] = createSignal(null)
const [userProfile, setUserProfile] = createSignal(null)
const [authLoading, setAuthLoading] = createSignal(true)

async function fetchProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) {
    console.error('Failed to fetch profile:', error.message)
    return null
  }
  return data
}

async function handleSession(session) {
  if (session?.user) {
    setCurrentUser(session.user)
    const profile = await fetchProfile(session.user.id)
    setUserProfile(profile)
    await initGarden()
  } else {
    setCurrentUser(null)
    setUserProfile(null)
  }
}

// Initialize: check existing session
supabase.auth.getSession().then(({ data: { session } }) => {
  handleSession(session).then(() => setAuthLoading(false))
})

// Listen for auth changes
supabase.auth.onAuthStateChange((_event, session) => {
  handleSession(session)
})

export { currentUser, userProfile, authLoading }

export function isLoggedIn() {
  return !!currentUser()
}

export function isAdmin() {
  return userProfile()?.role === 'admin'
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
