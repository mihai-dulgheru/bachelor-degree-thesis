import counties from '../collections/counties.json'

const fractionDigits = 1

const convertkWhToRON = (kWh, invoiceUnitValue, county) => {
  if (kWh === 0 || county === '') {
    return 0
  }
  if (invoiceUnitValue) {
    return (kWh * invoiceUnitValue).toFixed(fractionDigits)
  } else {
    const tg = 0.00149
    const tl = 0.02247
    const systemServiceFee = 0.00932
    const TVA = 0.19
    const cogenerationContribution = 0.02554
    const greenCertificates = 0.07254
    const nonCommercialExciseDuty = 0.00542
    let jt = 0.0
    let activeElectricityTariff = 0.30792

    const distributionArea = county && counties.find((element) => element.value === county).distributionArea
    switch (distributionArea) {
      case 'Oltenia':
        jt = 142.4 / 1000
        break
      case 'Muntenia Nord':
        jt = 140.68 / 1000
        activeElectricityTariff = 0.30732
        break
      case 'Transilvania Nord':
        jt = 122.78 / 1000
        activeElectricityTariff = 0.30772
        break
      case 'Transilvania Sud':
        jt = 127.04 / 1000
        break
      case 'Banat':
        jt = 117.71 / 1000
        break
      case 'Dobrogea':
        jt = 141.99 / 1000
        break
      case 'Muntenia Sud':
        jt = 119.07 / 1000
        break
      case 'Moldova':
        jt = 143.63 / 1000
        break

      default:
        break
    }

    return (
      kWh *
      (activeElectricityTariff +
        tg +
        tl +
        systemServiceFee +
        jt +
        cogenerationContribution +
        greenCertificates +
        nonCommercialExciseDuty) *
      (1 + TVA)
    ).toFixed(fractionDigits)
  }
}

const convertkWhToCO2 = (kWh) => {
  const greenhouseGasEmissionIntensity = 299.5 // g CO2e/kWh
  // https://www.eea.europa.eu/data-and-maps/daviz/co2-emission-intensity-9/#tab-chart_2_filters=%7B%22rowFilters%22%3A%7B%22ugeo%22%3A%5B%22Romania%22%5D%7D%3B%22columnFilters%22%3A%7B%7D%7D
  return (kWh * greenhouseGasEmissionIntensity * 0.001).toFixed(fractionDigits) // kg CO2
}

const convertkWhToCoal = (kWh) => {
  // Burning 1 kg of bituminous coal will produce 2.42 kg of carbon dioxide. (https://360energy.net/how-does-using-energy-create-carbon-emissions/)
  return (convertkWhToCO2(kWh) / 2.42).toFixed(fractionDigits)
}

const convertkWhToTrees = (kWh) => {
  // To compensate 1 tonne of CO2, 31 to 46 trees are needed. (https://www.encon.be/en/calculation-co2-offsetting-trees)
  return Math.round((convertkWhToCO2(kWh) * 46) / 1000)
}

export { convertkWhToRON, convertkWhToCO2, convertkWhToCoal, convertkWhToTrees }
