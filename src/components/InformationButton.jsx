import { useRef, useState } from 'react'
import { getVariantDetails } from '../services/vehicleApi'

function InformationButton({ variantId, makeName, modelName, variantName }) {
  const [result, setResult] = useState(null) // state for storing the API response
  const [error, setError] = useState(null) // state when the response has an error
  const [loadingVariantId, setLoadingVariantId] = useState('')
  const requestIdRef = useRef(0)
  const isLoading = loadingVariantId === variantId

  const handleClick = async () => {
    const requestId = requestIdRef.current + 1
    requestIdRef.current = requestId
    setLoadingVariantId(variantId)
    setError(null)
    setResult(null)

    try {
      const response = await getVariantDetails(variantId)
      if (requestId === requestIdRef.current) {
        setResult({ variantId, data: response })
      }
    } catch (requestError) {
      if (requestId === requestIdRef.current) {
        setError({
          variantId,
          message: requestError instanceof Error ? requestError.message : String(requestError),
        })
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setLoadingVariantId('')
      }
    }
  }

  const currentResult = result?.variantId === variantId ? result.data : null
  const currentError = error?.variantId === variantId ? error.message : ''

  return (
    <div>
      <button onClick={handleClick} disabled={isLoading || !variantId}>
        {isLoading ? 'Loading...' : 'Show Variant Details'}
      </button>
      {currentResult && (
        <>
          <h3>Selected vehicle</h3>
          <p>{[makeName, modelName, variantName].filter(Boolean).join(' ')}</p>
          <pre>{JSON.stringify(currentResult, null, 2)}</pre>
        </>
      )}
      {currentError && <p role="alert">API request failed: {currentError}</p>}
    </div>
  )
}

export default InformationButton