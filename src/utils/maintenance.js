export const MAINTENANCE_STORAGE_KEY = 'my-online-garage-maintenance'
export const maintenanceTypes = ['Fix', 'Upgrade', 'Maintenance', 'Purchase', 'Fuel', 'Other']

// returns the car make, model and variant in formatted text
export function getCarName(car) {
  if (!car) {
    return ''
  }

  return [car.makeName, car.modelName, car.variantName].filter(Boolean).join(' ') ||
    `Vehicle ${car.id}`
}

// loads the maintenance data from localStorage
export function loadMaintenance() {
  try {
    const savedMaintenance = window.localStorage.getItem(MAINTENANCE_STORAGE_KEY) // load raw JSON
    const records = savedMaintenance === null ? [] : JSON.parse(savedMaintenance) // turn it into usable text for JavaScript

    // checks for correct shape of data
    if (!Array.isArray(records) || records.some((record) =>
      record === null ||
      typeof record !== 'object' ||
      typeof record.id !== 'string' ||
      typeof record.car !== 'string' ||
      (record.carId !== undefined && (!Number.isInteger(record.carId) || record.carId <= 0)) ||
      typeof record.type !== 'string' ||
      typeof record.descriptionHeading !== 'string' ||
      typeof record.longDescription !== 'string' ||
      typeof record.price !== 'number' ||
      !Number.isFinite(record.price)
    )) {
      throw new Error('Saved maintenance records have an invalid format.')
    }

    return { records, error: '' }
  } catch (error) {
    return {
      records: [],
      error: error instanceof Error ? error.message : 'Could not load saved maintenance records.',
    }
  }
}
