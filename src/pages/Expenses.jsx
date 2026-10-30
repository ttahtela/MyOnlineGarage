import { useState } from 'react'
import useCars from '../context/useCars'
import { getCarName, loadMaintenance, maintenanceTypes } from '../utils/maintenance'

// expenses page
function Expenses() {
  const { cars } = useCars()
  const [storedMaintenance] = useState(loadMaintenance)
  const { records: maintenance, error: storageError } = storedMaintenance
  const [selectedCarId, setSelectedCarId] = useState('')
  const selectedCar = cars.find((car) => car.id === Number(selectedCarId))
  const selectedCarName = selectedCar ? getCarName(selectedCar) : ''
  const totals = maintenanceTypes.map((type) => ({
    type,
    total: maintenance
      .filter((record) =>
        record.type === type &&
        (record.carId === selectedCar?.id ||
          (record.carId === undefined && record.car === selectedCarName)),
      )
      .reduce((sum, record) => sum + record.price, 0),
  }))
  const totalCost = totals.reduce((sum, { total }) => sum + total, 0)

  return (
    <div>
      <h2>Expenses</h2>
      {storageError && <p className="alert alert-warning" role="alert">{storageError}</p>}

      <div className="mb-4 text-start">
        <label className="form-label" htmlFor="expenses-car">Car</label>
        <select
          id="expenses-car"
          className="form-select"
          value={selectedCar ? selectedCarId : ''}
          onChange={(event) => setSelectedCarId(event.target.value)}
          disabled={cars.length === 0}
        >
          <option value="">Select a car</option>
          {cars.map((car) => (
            <option key={car.id} value={car.id}>{getCarName(car)}</option>
          ))}
        </select>
        {cars.length === 0 && (
          <small className="form-text">Add a car to your garage to view its expenses.</small>
        )}
      </div>

      {selectedCar && (
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">Maintenance type</th>
              <th scope="col">Total cost</th>
            </tr>
          </thead>
          <tbody>
            {totals.map(({ type, total }) => (
              <tr key={type}>
                <th scope="row">{type}</th>
                <td>{total.toFixed(2)}€</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row">Total cost</th>
              <td>{totalCost.toFixed(2)}€</td>
            </tr>
          </tfoot>
        </table>
      )}
    </div>
  )
}

export default Expenses