import { useState } from 'react'
import TestButton from '../components/TestButton'
import SelectionCard from '../components/SelectionCard'

function Garage() {
  const [selectedMakeId, setSelectedMakeId] = useState('')
  const [selectedModelId, setSelectedModelId] = useState('')

  return (
    <div>
      <h2>My Garage</h2>
      <TestButton />
      <div className="row">
        <div className="col-12 col-md-4">
          <SelectionCard title="Select a make" depth={1} onSelect={setSelectedMakeId} />
        </div>
        <div className="col-12 col-md-4">
          <SelectionCard title="Select a model" depth={2} parentId={selectedMakeId} onSelect={setSelectedModelId} />
        </div>
        <div className="col-12 col-md-4">
          <SelectionCard title="Select a variant" depth={3} parentId={selectedModelId} />
        </div>
      </div>
    </div>
  )
}

export default Garage