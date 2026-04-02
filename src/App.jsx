import { Show } from 'solid-js'
import { Router, Route } from '@solidjs/router'
import MapPage from './pages/MapPage.jsx'
import BedDetailPage from './pages/BedDetailPage.jsx'
import AdminPage from './pages/AdminPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SplashScreen from './components/SplashScreen.jsx'
import { isLoggedIn, authLoading } from './store/authStore.js'

export default function App() {
  return (
    <>
      <Show when={!authLoading()} fallback={<SplashScreen />}>
        <Show when={isLoggedIn()} fallback={<LoginPage />}>
          <SplashScreen />
          <Router>
            <Route path="/" component={MapPage} />
            <Route path="/bed/:id" component={BedDetailPage} />
            <Route path="/admin" component={AdminPage} />
          </Router>
        </Show>
      </Show>
    </>
  )
}
