
import { useState } from 'react'

function CarAccordion({ id, simpleInfo, currentResult, currentError, isLoading }) {
  const [isOpen, setIsOpen] = useState(false)
  const headingId = `car-heading-${id}`
  const collapseId = `car-collapse-${id}`

  return (
    <div className="accordion">
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
            {isLoading ? (
              <p>Loading vehicle details...</p>
            ) : currentError ? (
              <p role="alert">API request failed: {currentError}</p>
            ) : currentResult ? (
              <pre style={{ textAlign: 'left' }}>{JSON.stringify(currentResult, null, 2)}</pre>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CarAccordion
