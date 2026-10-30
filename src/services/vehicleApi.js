const BASE_URL = 'https://fleetcatalog.disturbingbyte.pt/v1' // this is the base URL for the Fleet Catalog API
const PAGE_SIZE = 100

// function for making requests to the fleetByte Catalog API (GET), endpoint is the specific query to be made to the API
async function request(endpoint) {
  const response = await fetch(`${BASE_URL}${endpoint}`)

  if (!response.ok) {
    throw new Error(`Vehicle API error: ${response.status}`)
  }

  return response.json()
}

// helper function requesting all pages of the fleetByte Catalog API, instead of limiting to just the 100 items per page
async function requestAllPages(createEndpoint) {
  const items = []
  let response

  for (let page = 1; ; page += 1) {
    response = await request(createEndpoint(page))

    if (!Array.isArray(response.items)) {
      throw new Error('Vehicle API response is missing its items list')
    }

    items.push(...response.items)

    if (response.items.length < PAGE_SIZE) {
      return { ...response, items }
    }
  }
}

// function for getting the makes of vehicles from the Fleet Catalog API
export async function getMakes() {
  return requestAllPages((page) => {
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(PAGE_SIZE),
    })

    return `/makes?${params.toString()}`
  })
}

// function for getting the models of vehicles from the Fleet Catalog API
export async function getModels(makeId) {
  return requestAllPages((page) => {
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(PAGE_SIZE),
    })

    return `/makes/${encodeURIComponent(makeId)}/models?${params.toString()}`
  })
}

// function for getting the variants of vehicles from the Fleet Catalog API
export async function getVariants(modelId) {
  return requestAllPages((page) => {
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(PAGE_SIZE),
    })

    return `/models/${encodeURIComponent(modelId)}/variants?${params.toString()}`
  })
}

// function for getting the detailed information of a specific variant (variantId) from the fleetByte Catalog API
export async function getVariantDetails(variantId) {
  return request(`/variants/${encodeURIComponent(variantId)}`)
}