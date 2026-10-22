import { useCallback, useMemo, useRef, useState } from 'react'
import { getVariantDetails } from '../services/vehicleApi'
import CarContext from './carContext'

// a provider component that manages the state of the list of cars and provides a function to add a car to the list of cars
function CarProvider({ children }) {
  const [cars, setCars] = useState([]) // car list
  const nextCarIdRef = useRef(0)

  const addCar = useCallback(async (car) => {
    const id = nextCarIdRef.current + 1
    nextCarIdRef.current = id

    setCars((currentCars) => [
      ...currentCars,
      { ...car, id, status: 'loading', details: null, error: '' },
    ])

    try {
      const details = await getVariantDetails(car.variantId)
      setCars((currentCars) =>
        currentCars.map((currentCar) =>
          currentCar.id === id ? { ...currentCar, status: 'loaded', details } : currentCar,
        ),
      )
    } catch (requestError) {
      const error = requestError instanceof Error ? requestError.message : String(requestError)
      setCars((currentCars) =>
        currentCars.map((currentCar) =>
          currentCar.id === id ? { ...currentCar, status: 'error', error } : currentCar,
        ),
      )
    }
  }, [])

  const value = useMemo(() => ({ cars, addCar }), [cars, addCar])

  return <CarContext.Provider value={value}>{children}</CarContext.Provider>
}

export default CarProvider
