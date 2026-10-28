import { useState } from 'react'
import useCars from '../context/useCars'

// a button to add a car to the list of cars
function AddCarButton({ variantId, makeName, modelName, variantName }) {
  const { addCar } = useCars() // custom React hook to access the car context to add a car to the list of cars
  const [isLoading, setLoading] = useState(false) // loading state for the button
  const handleClick = async () => {

    try {
      setLoading(true)
      await addCar({ variantId, makeName, modelName, variantName }) // add the car to the list of cars using the addCar function from the car context through the custom React hook useCars
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button className="btn btn-lg btn-primary" onClick={handleClick} disabled={!variantId}>
        {isLoading == true ? 'Adding car...' : 'Add the car to my garage'}
      </button>
    </div>
  )
}

export default AddCarButton