import { supabase } from './supabaseClient'

const SESSION_KEY = 'cnh_pista_analytics_session'

function getSessionId() {
  try {
    let id = localStorage.getItem(SESSION_KEY)
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem(SESSION_KEY, id)
    }
    return id
  } catch {
    return 'no-storage'
  }
}

export function track(eventName, metadata = {}, userId = null) {
  if (!supabase) return
  supabase
    .from('analytics_events')
    .insert({ session_id: getSessionId(), user_id: userId, event_name: eventName, metadata })
    .then(null, () => {})
}
