import { useCallback, useState } from 'react'
import InformationButton from '../components/InformationButton'
import SelectionCard from '../components/SelectionCard'

function Garage() {
  const [selectedMakeId, setSelectedMakeId] = useState('')
  const [selectedMakeName, setSelectedMakeName] = useState('')
  const [selectedModelId, setSelectedModelId] = useState('')
  const [selectedModelName, setSelectedModelName] = useState('')
  const [selectedVariantId, setSelectedVariantId] = useState('')
  const [selectedVariantName, setSelectedVariantName] = useState('')

  const handleMakeSelect = useCallback((id, name) => {
    setSelectedMakeId(id)
    setSelectedMakeName(name)
  }, [])

  const handleModelSelect = useCallback((id, name) => {
    setSelectedModelId(id)
    setSelectedModelName(name)
  }, [])

  const handleVariantSelect = useCallback((id, name) => {
    setSelectedVariantId(id)
    setSelectedVariantName(name)
  }, [])

  return (
    <div>
      <h2>My Garage</h2>
      <div className="row">
        <div className="col-12 col-md-4">
          <SelectionCard title="Select a make" depth={1} onSelect={handleMakeSelect} />
        </div>
        <div className="col-12 col-md-4">
          <SelectionCard title="Select a model" depth={2} parentId={selectedMakeId} onSelect={handleModelSelect} />
        </div>
        <div className="col-12 col-md-4">
          <SelectionCard title="Select a variant" depth={3} parentId={selectedModelId} onSelect={handleVariantSelect} />
        </div>
      </div>
      <InformationButton
        variantId={selectedVariantId}
        makeName={selectedMakeName}
        modelName={selectedModelName}
        variantName={selectedVariantName}
      />
    </div>
  )
}

export default Garage