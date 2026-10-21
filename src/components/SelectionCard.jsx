import { useEffect, useState } from 'react'
import SelectionDropDown from './SelectionDropDown'
import { getMakes, getModels, getVariants } from '../services/vehicleApi'

function SelectionCard({ title, depth, parentId, onSelect }) {
    const [selectedOption, setSelectedOption] = useState('') // state for storing the selected option
    const [options, setOptions] = useState([]) // state for storing the options (full list) loaded from the API
    const [error, setError] = useState('') // error state
    const [isLoading, setIsLoading] = useState(false) // loading state

    useEffect(() => {
        let cancelled = false

        async function loadOptions() {
            setOptions([])
            setSelectedOption('')
            setError('')
            setIsLoading(false)
            onSelect?.('')

            if (depth !== 1 && !parentId) {
                return
            }

            setIsLoading(true)
            try {
                const response = depth === 1
                    ? await getMakes() // depth of 1 means the loading of car makes
                    : depth === 2
                      ? await getModels(parentId) // depth of 2 means the loading of car models
                      : await getVariants(parentId) // depth of 3 means the loading of car variants
                const loadedOptions = response.items.map((item) => ({ // this creates the options for the dropdown menu
                    value: item.id,
                    label: item.name
                }))

                if (!cancelled) {
                    setOptions(loadedOptions)
                    const firstOption = loadedOptions[0]?.value ?? ''
                    setSelectedOption(firstOption)
                    onSelect?.(firstOption, loadedOptions[0]?.label ?? '')
                }
            } catch (requestError) {
                if (!cancelled) {
                    setError(requestError instanceof Error ? requestError.message : String(requestError))
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false)
                }
            }
        }

        loadOptions()
        return () => {
            cancelled = true
        }
    }, [depth, parentId, onSelect])

    function handleSelect(value) {
        setSelectedOption(value)
        const selected = options.find((option) => option.value === value)
        onSelect?.(value, selected?.label ?? '')
    }

    return (
       <div className="card text-white bg-secondary mb-3" style={{ maxWidth: '20rem' }}>
        <div className="card-header">{title}</div>
        <div className="card-body">
           <SelectionDropDown // the actual select dropdown component
               options={options}
               selectedOption={selectedOption}
               onSelect={handleSelect}
               disabled={isLoading || (depth !== 1 && !parentId)}
               placeholder={isLoading ? 'Loading...' : 'Select an option'}
           />
           {error && <p role="alert">Could not load options: {error}</p>}
        </div>
        </div>
    )
}

export default SelectionCard