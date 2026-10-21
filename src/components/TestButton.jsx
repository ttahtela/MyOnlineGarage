import { useState } from 'react'
import { getVariantDetails } from '../services/vehicleApi'

function TestButton() {
  const [result, setResult] = useState(null) // state for storing the API response
  const [error, setError] = useState('') // state when the response has an error
  const [isLoading, setIsLoading] = useState(false) // state when the response is loading

  const handleClick = async () => {
    setIsLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await getVariantDetails(
        'c520f1a8-ae06-4b4e-a8f4-1560d64252c9'
      )
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
        {isLoading ? 'Testing API...' : 'Test API'}
      </button>
      {result && (
        <pre>{JSON.stringify(result, null, 2)}</pre>
      )}
      {error && <p role="alert">API request failed: {error}</p>}
    </div>
  )
}

export default TestButton