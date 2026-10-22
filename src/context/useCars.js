import { useContext } from 'react'
import CarContext from './carContext'

// a custom React hook to access the car context
function useCars() {
  const context = useContext(CarContext)

  if (!context) {
    throw new Error('useCars must be used within a CarProvider')
  }

  return context
}

export default useCars
