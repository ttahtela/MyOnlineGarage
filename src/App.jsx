import "bootswatch/dist/quartz/bootstrap.min.css";
import { Routes, Route, Navigate } from 'react-router'
import Garage from './pages/Garage'
import Maintenance from './pages/Maintenance'
import Expenses from './pages/Expenses'

function App() {
  return (
    <div className="container py-4">
      <h1>My Online Garage</h1>

      <Routes>
        <Route path="/" element={<Garage />} />
        <Route path="/maintenance" element={<Maintenance />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App