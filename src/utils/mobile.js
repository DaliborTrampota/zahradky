import { createSignal, onCleanup, onMount } from 'solid-js'

const [isMobile, setIsMobile] = createSignal(false)

export function initMobileDetection() {
  const mq = window.matchMedia('(max-width: 768px)')
  setIsMobile(mq.matches)
  const handler = (e) => setIsMobile(e.matches)
  mq.addEventListener('change', handler)
  onCleanup(() => mq.removeEventListener('change', handler))
}

export { isMobile }
