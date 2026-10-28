// code for adjusting the raw JSON api response for variant details into clean formatted text

function formatLabel(key) {
  const words = String(key)
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .trim()

  return words ? words[0].toUpperCase() + words.slice(1) : 'Value'
}

function createDetailNode(key, value, path) {
  if (Array.isArray(value)) {
    return {
      key,
      label: formatLabel(key),
      value: value.length === 0 ? '[]' : null,
      rawValue: value,
      path,
      children: value.map((item, index) =>
        createDetailNode(`Item ${index + 1}`, item, [...path, index]),
      ),
    }
  }

  if (value !== null && typeof value === 'object') {
    const entries = Object.entries(value)

    return {
      key,
      label: formatLabel(key),
      value: entries.length === 0 ? '{}' : null,
      rawValue: value,
      path,
      children: entries.map(([childKey, childValue]) =>
        createDetailNode(childKey, childValue, [...path, childKey]),
      ),
    }
  }

  return {
    key,
    label: formatLabel(key),
    value: value === null ? 'null' : String(value),
    rawValue: value,
    path,
    children: [],
  }
}

export default function formatVariantDetails(details) {
  if (Array.isArray(details)) {
    return details.map((value, index) => createDetailNode(`Item ${index + 1}`, value, [index]))
  }

  if (details !== null && typeof details === 'object') {
    return Object.entries(details).map(([key, value]) => createDetailNode(key, value, [key]))
  }

  return [createDetailNode('Value', details, [])]
}
