function SelectionDropDown({ options, selectedOption, onSelect, disabled, placeholder }) {

    return (
        <div>
            <select className="form-select" value={selectedOption} onChange={(e) => onSelect(e.target.value)} disabled={disabled}>
                <option value="">{placeholder}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    )
}

export default SelectionDropDown