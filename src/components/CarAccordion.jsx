
import { useState } from 'react'
import useCars from '../context/useCars'

// CarAccordion component displays an accordion for a car which when opened up shows the details of the car
function CarAccordion({ car }) {
  const { removeCar } = useCars()
  const [isOpen, setIsOpen] = useState(false) // accordion open/closed state
  const headingId = `car-heading-${car.id}` // unique id for the accordion heading
  const collapseId = `car-collapse-${car.id}` // unique id for the accordion collapse section
  const simpleInfo = [car.makeName, car.modelName, car.variantName].filter(Boolean).join(' ') // car make, model and variant names to show in the accordion heading
  const handleRemove = () => removeCar(car.id) // removes the car from my garage through the removeCar function from the CarProvider context

  return (
    <div className="d-flex align-items-start gap-2">
      <div className="accordion flex-grow-1">
        <div className="accordion-item">
          <h2 className="accordion-header" id={headingId}>
            <button
              className={`accordion-button${isOpen ? '' : ' collapsed'}`}
              type="button"
              aria-expanded={isOpen}
              aria-controls={collapseId}
              onClick={() => setIsOpen((open) => !open)}
            >
              {simpleInfo || 'Vehicle details'}
            </button>
          </h2>
          <div
            id={collapseId}
            className={`accordion-collapse collapse${isOpen ? ' show' : ''}`}
            aria-labelledby={headingId}
          >
            <div className="accordion-body">
              {car.status === 'loading' ? (
                <p>Loading vehicle details...</p>
              ) : car.error ? (
                <p role="alert">API request failed: {car.error}</p>
              ) : car.details !== null ? (
                <pre style={{ textAlign: 'left' }}>{JSON.stringify(car.details, null, 2)}</pre>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="btn btn-outline-danger flex-shrink-0"
        onClick={handleRemove}
      >
        Remove
      </button>
    </div>
    
  )
}

export default CarAccordion
