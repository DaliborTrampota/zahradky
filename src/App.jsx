import { Router, Route } from '@solidjs/router'
import MapPage from './pages/MapPage.jsx'
import BedDetailPage from './pages/BedDetailPage.jsx'
import AdminPage from './pages/AdminPage.jsx'
import SplashScreen from './components/SplashScreen.jsx'

export default function App() {
  return (
    <>
      <SplashScreen />
      <Router>
        <Route path="/" component={MapPage} />
        <Route path="/bed/:id" component={BedDetailPage} />
        <Route path="/admin" component={AdminPage} />
      </Router>
    </>
  )
}
