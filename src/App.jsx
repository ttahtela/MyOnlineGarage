import "bootswatch/dist/quartz/bootstrap.min.css";
import { Routes, Route, Navigate } from 'react-router'
import Navbar from './components/Navbar'
import Garage from './pages/Garage'
import Maintenance from './pages/Maintenance'
import Expenses from './pages/Expenses'
import CarProvider from './context/CarProvider'

function App() {
  return (
    <CarProvider>
      <div className="container py-4">
        <Navbar />

        <Routes>
          <Route path="/" element={<Garage />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </CarProvider>
  )
}

export default App