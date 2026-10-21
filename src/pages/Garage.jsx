import { useState } from 'react'
import InformationButton from '../components/InformationButton'
import SelectionCard from '../components/SelectionCard'

function Garage() {
  const [selectedMakeId, setSelectedMakeId] = useState('')
  const [selectedModelId, setSelectedModelId] = useState('')
  const [selectedVariantId, setSelectedVariantId] = useState('')

  return (
    <div>
      <h2>My Garage</h2>
      <div className="row">
        <div className="col-12 col-md-4">
          <SelectionCard title="Select a make" depth={1} onSelect={setSelectedMakeId} />
        </div>
        <div className="col-12 col-md-4">
          <SelectionCard title="Select a model" depth={2} parentId={selectedMakeId} onSelect={setSelectedModelId} />
        </div>
        <div className="col-12 col-md-4">
          <SelectionCard title="Select a variant" depth={3} parentId={selectedModelId} onSelect={setSelectedVariantId} />
        </div>
      </div>
      <InformationButton variantId={selectedVariantId} />
    </div>
  )
}

export default Garage