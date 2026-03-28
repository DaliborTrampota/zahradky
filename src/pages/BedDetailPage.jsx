import { useNavigate } from '@solidjs/router'
import { onMount } from 'solid-js'

// Deep-link shim: /bed/:id redirects back to the map.
// Future: pass the bed id via state or a shared signal to auto-open the panel.
export default function BedDetailPage() {
  const navigate = useNavigate()
  onMount(() => navigate('/', { replace: true }))
  return null
}
