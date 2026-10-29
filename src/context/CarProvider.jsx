import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getVariantDetails } from '../services/vehicleApi'
import CarContext from './carContext'

const STORAGE_KEY = 'my-online-garage-cars' // localStorage key

// loads the car list from localStorage
function loadCars() {
  try {
    const savedCars = window.localStorage.getItem(STORAGE_KEY)
    const records = savedCars === null ? [] : JSON.parse(savedCars)

    // checks if the data is in correct shape or throws error
    if (!Array.isArray(records) || records.some((car) =>
      car === null ||
      typeof car !== 'object' ||
      !Number.isInteger(car.id) ||
      car.id <= 0 ||
      typeof car.variantId !== 'string' ||
      typeof car.makeName !== 'string' ||
      typeof car.modelName !== 'string' ||
      typeof car.variantName !== 'string' ||
      (car.details !== null && typeof car.details !== 'object')
    )) {
      throw new Error('Saved garage cars have an invalid format.')
    }

    return {
      cars: records.map((car) => ({
        ...car,
        status: car.details === null ? 'loading' : 'loaded',
        error: '',
      })),
      storageError: '',
    }
  } catch (error) {
    return {
      cars: [],
      storageError: error instanceof Error ? error.message : 'Could not load saved garage cars.',
    }
  }
}

// takes only the required fields to save into localStorage
function toStoredCars(cars) {
  return cars.map(({ id, variantId, makeName, modelName, variantName, details }) => ({
    id,
    variantId,
    makeName,
    modelName,
    variantName,
    details,
  }))
}

// a provider component that manages the state of the list of cars and provides a function to add a car to the list of cars
function CarProvider({ children }) {
  const [storedCars, setStoredCars] = useState(loadCars)
  const { cars, storageError } = storedCars
  const carsRef = useRef(cars)
  const initialLoadingIdsRef = useRef(cars
    .filter((car) => car.status === 'loading')
    .map((car) => car.id))
  const nextCarIdRef = useRef(cars.reduce((maxId, car) => Math.max(maxId, car.id), 0))

  // saves the cars into localStorage
  const updateCars = useCallback((update) => {
    const nextCars = update(carsRef.current)
    carsRef.current = nextCars

    let nextStorageError = ''
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(toStoredCars(nextCars)))
    } catch (error) {
      nextStorageError = error instanceof Error
        ? error.message
        : 'Could not save garage cars.'
    }

    setStoredCars({ cars: nextCars, storageError: nextStorageError })
  }, [])

  const loadDetails = useCallback(async (id, variantId) => {
    try {
      const details = await getVariantDetails(variantId)
      updateCars((currentCars) =>
        currentCars.map((car) =>
          car.id === id ? { ...car, status: 'loaded', details, error: '' } : car,
        ),
      )
    } catch (requestError) {
      const error = requestError instanceof Error ? requestError.message : String(requestError)
      updateCars((currentCars) =>
        currentCars.map((car) =>
          car.id === id ? { ...car, status: 'error', error } : car,
        ),
      )
    }
  }, [updateCars])

  useEffect(() => {
    initialLoadingIdsRef.current.forEach((id) => {
      const car = carsRef.current.find((currentCar) => currentCar.id === id)
      if (car) {
        loadDetails(car.id, car.variantId)
      }
    })
  }, [loadDetails])

  const addCar = useCallback(async (car) => {
    const id = nextCarIdRef.current + 1
    nextCarIdRef.current = id

    updateCars((currentCars) => [
      ...currentCars,
      { ...car, id, status: 'loading', details: null, error: '' },
    ])

    await loadDetails(id, car.variantId)
  }, [loadDetails, updateCars])

  const removeCar = useCallback((id) => {
    updateCars((currentCars) => currentCars.filter((car) => car.id !== id))
  }, [updateCars])

  const updateCarDetails = useCallback((id, details) => {
    updateCars((currentCars) =>
      currentCars.map((car) => (car.id === id ? { ...car, details } : car)), // car details updated here, React re-renders
    )
  }, [updateCars])

  const value = useMemo(
    () => ({ cars, storageError, addCar, removeCar, updateCarDetails }),
    [cars, storageError, addCar, removeCar, updateCarDetails],
  )

  return <CarContext.Provider value={value}>{children}</CarContext.Provider>
}

export default CarProvider
