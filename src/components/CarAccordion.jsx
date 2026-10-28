
import { useState } from 'react'
import useCars from '../context/useCars'
import formatVariantDetails from '../utils/formatVariantDetails'

// component for showing or editing the car details
function VehicleDetailList({ details, isEditing, onValueChange }) {
  return (
    <dl className="mb-0">
      {details.map((detail) => ( // going through every detail
        <div key={detail.key} className="mb-1">
          <div className="d-flex flex-wrap align-items-baseline gap-1">
            <dt className="fw-semibold mb-0">{detail.label}:</dt>
            {detail.children.length > 0 ? (
              detail.value !== null && <dd className="mb-0">{detail.value}</dd>
            ) : isEditing ? ( // in editing mode show an input form adjusted for the type of value
              <dd className="mb-0">
                {typeof detail.rawValue === 'boolean' ? (
                  <select
                    className="form-select form-select-sm"
                    value={String(detail.rawValue)}
                    onChange={(event) => onValueChange(detail.path, event.target.value === 'true')}
                    aria-label={detail.label}
                  >
                    <option value="true">true</option>
                    <option value="false">false</option>
                  </select>
                ) : ( // not in editing mode so just show the text
                  <input
                    className="form-control form-control-sm"
                    type={typeof detail.rawValue === 'number' ? 'number' : 'text'}
                    value={detail.rawValue === null ? '' : String(detail.rawValue)}
                    onChange={(event) => onValueChange(detail.path, event.target.value)}
                    aria-label={detail.label}
                  />
                )}
              </dd>
            ) : (
              <dd className="mb-0">{detail.value}</dd>
            )}
          </div>
          {detail.children.length > 0 && (
            <div className="border-start ms-2 mt-1 ps-3">
              <VehicleDetailList
                details={detail.children}
                isEditing={isEditing}
                onValueChange={onValueChange}
              />
            </div>
          )}
        </div>
      ))}
    </dl>
  )
}

function updateValueAtPath(value, path, nextValue) {
  if (path.length === 0) {
    return nextValue
  }

  const [key, ...remainingPath] = path

  if (Array.isArray(value)) {
    return value.map((item, index) =>
      index === key ? updateValueAtPath(item, remainingPath, nextValue) : item,
    )
  }

  return {
    ...value,
    [key]: updateValueAtPath(value[key], remainingPath, nextValue),
  }
}

function normalizeEditedValues(original, edited) {
  if (typeof original === 'number' && typeof edited === 'string') {
    if (edited === '') {
      return null
    }

    const number = Number(edited)
    return Number.isFinite(number) ? number : edited
  }

  if (Array.isArray(original) && Array.isArray(edited)) {
    return edited.map((value, index) => normalizeEditedValues(original[index], value))
  }

  if (original !== null && typeof original === 'object' &&
      edited !== null && typeof edited === 'object' && !Array.isArray(edited)) {
    return Object.fromEntries(
      Object.entries(edited).map(([key, value]) => [
        key,
        normalizeEditedValues(original[key], value),
      ]),
    )
  }

  return edited
}

// CarAccordion component displays an accordion for a car which when opened up shows the details of the car
function CarAccordion({ car }) {
  const { removeCar, updateCarDetails } = useCars()
  const [isOpen, setIsOpen] = useState(false) // accordion open/closed state
  const [isEditing, setIsEditing] = useState(false) // react state for showing text as editable text (editing mode) or as normal text
  const [draftDetails, setDraftDetails] = useState(null) // react state to hold the temporary copy that is being edited before saving to make canceling possible
  const headingId = `car-heading-${car.id}` // unique id for the accordion heading
  const collapseId = `car-collapse-${car.id}` // unique id for the accordion collapse section
  const simpleInfo = [car.makeName, car.modelName, car.variantName].filter(Boolean).join(' ') // car make, model and variant names to show in the accordion heading
  const handleRemove = () => removeCar(car.id) // removes the car from my garage through the removeCar function from the CarProvider context
  const handleEdit = () => {
    setDraftDetails(car.details)
    setIsEditing(true)
  }
  const handleValueChange = (path, value) => {
    setDraftDetails((currentDetails) => updateValueAtPath(currentDetails, path, value)) // changes go into a draft instead of the original car details
  }
  const handleSave = () => {
    updateCarDetails(car.id, normalizeEditedValues(car.details, draftDetails)) // changes from the draft go into the car details finally
    setIsEditing(false) // exiting edit mode
    setDraftDetails(null) // clearing the draft
  }
  const handleCancel = () => {
    setIsEditing(false)
    setDraftDetails(null)
  }

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
                <>
                  <VehicleDetailList
                    details={formatVariantDetails(isEditing ? draftDetails : car.details)}
                    isEditing={isEditing}
                    onValueChange={handleValueChange}
                  />
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {car.details !== null && (
        <button
          type="button"
          className={`btn car-action-button ${isEditing ? 'btn-primary' : 'btn-outline-info'} flex-shrink-0`}
          onClick={isEditing ? handleSave : handleEdit}
        >
          {isEditing ? 'Save' : 'Edit'}
        </button>
      )}

      <button
        type="button"
        className={`btn car-action-button ${isEditing ? 'btn-secondary' : 'btn-outline-danger'} flex-shrink-0`}
        onClick={isEditing ? handleCancel : handleRemove}
      >
        {isEditing ? 'Cancel' : 'Remove'}
      </button>

    </div>
    
  )
}

export default CarAccordion
