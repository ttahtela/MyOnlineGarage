import { useRef, useState } from 'react'
import { getVariantDetails } from '../services/vehicleApi'

function InformationButton({ variantId, makeName, modelName, variantName }) {
  const [result, setResult] = useState(null) // state for storing the API response
  const [error, setError] = useState(null) // state when the response has an error
  const [loadingVariantId, setLoadingVariantId] = useState('') // state for storing the variantId that is currently loading
  const requestIdRef = useRef(0) // reference to track the latest request ID to avoid race conditions with requests
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
  const simpleInfo = [makeName, modelName, variantName].filter(Boolean).join(' ')

  return (
    <div>
      <button onClick={handleClick} disabled={isLoading || !variantId}>
        {isLoading ? 'Loading...' : 'Show Variant Details'}
      </button>
      {currentResult && (
        <>
          <h3>Selected vehicle</h3>
          <h4>{simpleInfo}</h4> {/* car make, model and variant*/}
          <p>Detailed information:</p>
          <pre>{JSON.stringify(currentResult, null, 2)}</pre> {/* variant details */}
        </>
      )}
      {currentError && <p role="alert">API request failed: {currentError}</p>}
    </div>
  )
}

export default InformationButton