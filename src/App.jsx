import { Router, Route } from '@solidjs/router'
import MapPage from './pages/MapPage.jsx'
import BedDetailPage from './pages/BedDetailPage.jsx'

export default function App() {
  return (
    <Router>
      <Route path="/" component={MapPage} />
      <Route path="/bed/:id" component={BedDetailPage} />
    </Router>
  )
}
