import { useRef, useState } from 'react'
import { getVariantDetails } from '../services/vehicleApi'
import CarAccordion from './CarAccordion'

function InformationButton({ variantId, makeName, modelName, variantName }) {
  const [cars, setCars] = useState([])
  const nextCarIdRef = useRef(0)

  const handleClick = async () => {
    const id = nextCarIdRef.current + 1
    nextCarIdRef.current = id
    const simpleInfo = [makeName, modelName, variantName].filter(Boolean).join(' ')

    setCars((currentCars) => [
      ...currentCars,
      { id, simpleInfo, status: 'loading', result: null, error: '' },
    ])

    try {
      const result = await getVariantDetails(variantId)
      setCars((currentCars) =>
        currentCars.map((car) => car.id === id ? { ...car, status: 'loaded', result } : car),
      )
    } catch (requestError) {
      const error = requestError instanceof Error ? requestError.message : String(requestError)
      setCars((currentCars) =>
        currentCars.map((car) => car.id === id ? { ...car, status: 'error', error } : car),
      )
    }
  }

  return (
    <div>
      <button onClick={handleClick} disabled={!variantId}>
        Add car to the list
      </button>
      {cars.map((car) => (
        <CarAccordion
          key={car.id}
          id={car.id}
          simpleInfo={car.simpleInfo}
          currentResult={car.result}
          currentError={car.error}
          isLoading={car.status === 'loading'}
        />
      ))}
    </div>
  )
}

export default InformationButton