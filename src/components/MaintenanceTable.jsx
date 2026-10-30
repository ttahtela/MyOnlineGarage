import { useState } from 'react'
import useCars from '../context/useCars'
import {
  getCarName,
  loadMaintenance,
  MAINTENANCE_STORAGE_KEY,
  maintenanceTypes,
} from '../utils/maintenance'

const emptyDraft = {
  carId: '',
  type: '',
  descriptionHeading: '',
  longDescription: '',
  price: '',
}

// maintenance table component
function MaintenanceTable() {
  const { cars } = useCars() // useCars hook to get the car list
  const [storedMaintenance, setStoredMaintenance] = useState(loadMaintenance) // saved maintenance data
  const { records: maintenance, error: storageError } = storedMaintenance
  const [draft, setDraft] = useState(emptyDraft) // maintenance currently being edited
  const [editingId, setEditingId] = useState(null) // tracks which record is being edited
  const [openDescriptionId, setOpenDescriptionId] = useState(null) // tracks which record's description is open
  const [formError, setFormError] = useState('')

  // saves maintenance data to localStorage
  const saveMaintenance = (records) => {
    let error = ''
    try {
      window.localStorage.setItem(MAINTENANCE_STORAGE_KEY, JSON.stringify(records))
    } catch (storageFailure) {
      error = storageFailure instanceof Error
        ? storageFailure.message
        : 'Could not save maintenance records.'
    }
    setStoredMaintenance({ records, error })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const selectedCar = cars.find((car) => car.id === Number(draft.carId))
    if (!selectedCar) {
      setFormError('Select a car from your garage before saving this record.')
      return
    }

    const record = {
      ...draft,
      carId: selectedCar.id,
      car: getCarName(selectedCar),
      price: Number(draft.price),
    }

    if (editingId === null) {
      saveMaintenance([
        ...maintenance,
        { ...record, id: window.crypto.randomUUID() },
      ])
    } else {
      saveMaintenance(
        maintenance.map((item) => item.id === editingId ? { ...item, ...record } : item),
      )
    }

    setDraft(emptyDraft)
    setEditingId(null)
    setFormError('')
  }

  const handleEdit = (record) => {
    const matchingCar = cars.find((car) =>
      car.id === record.carId ||
      getCarName(car) === record.car,
    )
    setDraft({
      carId: matchingCar ? String(matchingCar.id) : '',
      type: maintenanceTypes.includes(record.type) ? record.type : 'Other',
      descriptionHeading: record.descriptionHeading,
      longDescription: record.longDescription,
      price: String(record.price),
    })
    setEditingId(record.id)
    setOpenDescriptionId(null)
    setFormError('')
  }

  const handleDelete = (id) => {
    saveMaintenance(maintenance.filter((record) => record.id !== id))
    if (editingId === id) {
      setDraft(emptyDraft)
      setEditingId(null)
    }
  }

  const handleCancel = () => {
    setDraft(emptyDraft)
    setEditingId(null)
    setFormError('')
  }

  return (
    <div>
      {storageError && <p className="alert alert-warning" role="alert">{storageError}</p>}
      {formError && <p className="alert alert-warning" role="alert">{formError}</p>}

      <form className="row g-2 align-items-end mb-4 text-start" onSubmit={handleSubmit}>
        <h3 className="col-12 fs-5 mb-1">
          {editingId === null ? 'Add maintenance record' : 'Edit maintenance record'}
        </h3>
        <div className="col-md-2">
          <label className="form-label" htmlFor="maintenance-car">Car</label>
          <select
            id="maintenance-car"
            className="form-select"
            value={draft.carId}
            onChange={(event) => {
              setDraft({ ...draft, carId: event.target.value })
              setFormError('')
            }}
            required
          >
            <option value="">Select a car</option>
            {cars.map((car) => (
              <option key={car.id} value={car.id}>{getCarName(car)}</option>
            ))}
          </select>
          {cars.length === 0 && (
            <small className="form-text">Add a car to your garage before recording maintenance.</small>
          )}
        </div>
        <div className="col-md-2">
          <label className="form-label" htmlFor="maintenance-type">Maintenance type</label>
          <select
            id="maintenance-type"
            className="form-select"
            value={draft.type}
            onChange={(event) => setDraft({ ...draft, type: event.target.value })}
            required
          >
            <option value="">Select a type</option>
            {maintenanceTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <label className="form-label" htmlFor="maintenance-description-heading">
            Description heading
          </label>
          <input
            id="maintenance-description-heading"
            className="form-control"
            value={draft.descriptionHeading}
            onChange={(event) => setDraft({ ...draft, descriptionHeading: event.target.value })}
            maxLength={25}
            required
          />
        </div>
        <div className="col-md-2">
          <label className="form-label" htmlFor="maintenance-long-description">
            Long description
          </label>
          <textarea
            id="maintenance-long-description"
            className="form-control"
            rows="1"
            value={draft.longDescription}
            onChange={(event) => setDraft({ ...draft, longDescription: event.target.value })}
          />
        </div>
        <div className="col-md-2">
          <label className="form-label" htmlFor="maintenance-price">Price (€)</label>
          <input
            id="maintenance-price"
            className="form-control"
            type="number"
            min="0"
            step="0.01"
            value={draft.price}
            onChange={(event) => setDraft({ ...draft, price: event.target.value })}
            required
          />
        </div>
        <div className="col-md-2 d-flex gap-2">
          <button className="btn btn-primary" type="submit">
            {editingId === null ? 'Add' : 'Save'}
          </button>
          {editingId !== null && (
            <button className="btn btn-secondary" type="button" onClick={handleCancel}>
              Cancel
            </button>
          )}
        </div>
        </form>

      <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">Car</th>
              <th scope="col">Maintenance type</th>
              <th scope="col">Description</th>
              <th scope="col">Price</th>
              <th scope="col">Edit</th>
              <th scope="col">Delete</th>
            </tr>
          </thead>
          <tbody>
            {maintenance.map((record) => (
              <tr key={record.id}>
                <th scope="row">{getCarName(cars.find((car) => car.id === record.carId)) || record.car}</th>
                <td>{record.type}</td>
                <td>
                  <div className="position-relative">
                    <button
                      className={`accordion-button maintenance-description-button${openDescriptionId === record.id ? '' : ' collapsed'}`}
                      type="button"
                      aria-expanded={openDescriptionId === record.id}
                      aria-controls={`maintenance-description-${record.id}`}
                      onClick={() => setOpenDescriptionId(
                        openDescriptionId === record.id ? null : record.id,
                      )}
                    >
                      {record.descriptionHeading}
                    </button>
                    {openDescriptionId === record.id && (
                      <div
                        id={`maintenance-description-${record.id}`}
                        className="position-absolute start-0 top-100 bg-body border rounded shadow p-3"
                        style={{ zIndex: 10, width: 'min(24rem, 80vw)' }}
                      >
                        {record.longDescription || 'No long description provided.'}
                      </div>
                    )}
                  </div>
                </td>
                <td>{record.price.toFixed(2)}€</td>
                <td>
                  <button
                    className="btn btn-lg btn-outline-info"
                    type="button"
                    onClick={() => handleEdit(record)}
                  >
                    Edit
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-lg btn-outline-danger"
                    type="button"
                    onClick={() => handleDelete(record.id)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
            {maintenance.length === 0 && (
              <tr>
                <td colSpan="6">No maintenance records yet.</td>
              </tr>
            )}
          </tbody>
        </table>
    </div>
  )
}

export default MaintenanceTable
