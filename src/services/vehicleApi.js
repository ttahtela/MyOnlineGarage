const BASE_URL = 'https://fleetcatalog.disturbingbyte.pt/v1' // this is the base URL for the Fleet Catalog API

// function for making requests to the fleetByte Catalog API (GET), endpoint is the specific query to be made to the API
async function request(endpoint) {
  const response = await fetch(`${BASE_URL}${endpoint}`)

  if (!response.ok) {
    throw new Error(`Vehicle API error: ${response.status}`)
  }

  return response.json()
}

// function for getting the makes of vehicles from the fleetByte Catalog API, with optional search parameter
export async function getMakes(search = '') {
  const params = new URLSearchParams({
    page: '1',
    pageSize: '20',
  })

  if (search.trim()) {
    params.set('search', search.trim())
  }

  return request(`/makes?${params.toString()}`)
}

// function for getting the models of vehicles from the fleetByte Catalog API, with optional search parameter
export async function getModels(makeId, search = '') {
  const params = new URLSearchParams({
    page: '1',
    pageSize: '100',
  })

  if (search.trim()) {
    params.set('search', search.trim())
  }

  return request(
    `/makes/${encodeURIComponent(makeId)}/models?${params.toString()}`
  )
}

// function for getting the variants of vehicles from the fleetByte Catalog API, with optional search parameter and filters
export async function getVariants(modelId, filters = {}) {
  const params = new URLSearchParams({
    page: '1',
    pageSize: '100',
  })

  if (filters.search) {
    params.set('search', filters.search)
  }

  if (filters.year) {
    params.set('year', String(filters.year))
  }

  if (filters.fuelType) {
    params.set('fuelType', filters.fuelType)
  }

  if (filters.gearboxType) {
    params.set('gearboxType', filters.gearboxType)
  }

  return request(
    `/models/${encodeURIComponent(modelId)}/variants?${params.toString()}`
  )
}

// function for getting the detailed information of a specific variant (variantId) from the fleetByte Catalog API
export async function getVariantDetails(variantId) {
  return request(`/variants/${encodeURIComponent(variantId)}`)
}