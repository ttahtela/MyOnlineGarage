import { useId, useState } from 'react'

function MaintenanceTable() {
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false) // React state for showing the full description of the maintenance
  const descriptionId = useId()

  return (
    <div>
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
          <tr>
            <th scope="row">Default</th>
            <td>Fix</td>
            <td>
              <div className="position-relative">
                <button
                  className={`accordion-button maintenance-description-button${isDescriptionOpen ? '' : ' collapsed'}`}
                  type="button"
                  aria-expanded={isDescriptionOpen}
                  aria-controls={descriptionId}
                  onClick={() => setIsDescriptionOpen(true)}
                  onMouseLeave={() => setIsDescriptionOpen(false)}
                >
                  Car headlight fix
                </button>
                {isDescriptionOpen && (
                  <div
                    id={descriptionId}
                    className="position-absolute start-0 top-100 bg-body border rounded shadow p-3"
                    style={{ zIndex: 10, width: 'min(24rem, 80vw)' }}
                  >
                    This was a headlight fix that wouldn't fit into this tight space.
                  </div>
                )}
              </div>
            </td>
            <td>200€</td>
            <td>
                <button className="btn btn-lg btn-outline-info">
                    Edit
                </button>
            </td>
            <td>
                <button className="btn btn-lg btn-outline-danger">
                    Remove
                </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default MaintenanceTable