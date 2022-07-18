const getEstimatedConsumptionPerYear = (device) => {
  const year = 365.242199

  let estimatedConsumptionPerYear = 0
  switch (device.unitMeasurement) {
    case 'W':
      estimatedConsumptionPerYear = (device.energyConsumption / 1000) * device.noOperatingHours * year
      break
    case 'kW':
      estimatedConsumptionPerYear = device.energyConsumption * device.noOperatingHours * year
      break
    case 'kWh/1000h':
      estimatedConsumptionPerYear = (device.energyConsumption / 1000) * device.noOperatingHours * year
      break
    case 'kWh/100 cycles':
      estimatedConsumptionPerYear =
        device.category === 'Maşini de spălat vase' ? device.energyConsumption * 2.08 : device.energyConsumption * 2.2
      break
    case 'kWh/annum':
      estimatedConsumptionPerYear = device.energyConsumption
      break
    case 'kWh/cycle':
      estimatedConsumptionPerYear = device.energyConsumption * 286
      break

    default:
      break
  }

  return estimatedConsumptionPerYear
}

export { getEstimatedConsumptionPerYear }
