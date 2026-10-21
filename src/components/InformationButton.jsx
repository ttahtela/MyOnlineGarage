import { useState } from 'react'
import { getVariantDetails } from '../services/vehicleApi'

function InformationButton({variantId}) {
  const [result, setResult] = useState(null) // state for storing the API response
  const [error, setError] = useState('') // state when the response has an error
  const [isLoading, setIsLoading] = useState(false) // state when the response is loading

  const handleClick = async () => {
    setIsLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await getVariantDetails(variantId)
      setResult(response)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <button onClick={handleClick} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Show Variant Details'}
      </button>
      {result && (
        <pre>{JSON.stringify(result, null, 2)}</pre>
      )}
      {error && <p role="alert">API request failed: {error}</p>}
    </div>
  )
}

export default InformationButton