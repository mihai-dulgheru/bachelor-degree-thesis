import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import swal from 'sweetalert'
import CustomAppBar from './CustomAppBar'
import CustomPieChart from './CustomPieChart'

const Charts = () => {
  const [user, setUser] = useState({})
  const [devices, setDevices] = useState([])
  const navigate = useNavigate()

  const getUser = async () => {
    const response = await fetch('/api/auth/user', {
      method: 'GET',
      headers: {
        authorization: localStorage.getItem('accessToken')
      }
    })
    const data = await response.json()
    if (data.status === 'ok') {
      setUser(data.user)
    } else {
      swal({
        title: 'Failed',
        text:
          data.message[0] >= 'a' && data.message[0] <= 'z'
            ? data.message[0].toLocaleUpperCase() + data.message.substring(1)
            : data.message,
        icon: 'error',
        button: {
          text: 'OK',
          value: true,
          visible: true,
          closeModal: true
        }
      }).then(() => {
        navigate('/login')
      })
    }
  }

  const getDevices = async () => {
    const response = await fetch('/api/auth/user/devices', {
      method: 'GET',
      headers: {
        authorization: localStorage.getItem('accessToken')
      }
    })
    const data = await response.json()
    if (data.status === 'ok') {
      setDevices(data.devices)
    } else {
      swal({
        title: 'Failed',
        text:
          data.message[0] >= 'a' && data.message[0] <= 'z'
            ? data.message[0].toLocaleUpperCase() + data.message.substring(1)
            : data.message,
        icon: 'error',
        button: {
          text: 'OK',
          value: true,
          visible: true,
          closeModal: true
        }
      }).then(() => {
        navigate('/login')
      })
    }
  }

  useEffect(() => {
    getUser()
    getDevices()
  }, [])

  const getEstimatedConsumption = (device) => {
    /**
     * Dishwasher: kWh/100 cycles * 2.08 = kWh/annum
     * Washing machines and washer dryers: kWh/100 cycles * 2.2 = kWh/annum
     * Ovens: kWh/cycle * 286 = kWh/annum
     *
     * kWh/1000h = kWh * 1000h
     * 1 year = 365.242199 days
     * 1 day = 24h
     * kWh/annum = kWh * year * day
     *
     * Energy (kWh) = (W * hrs) / 1000
     * Energy (kWh) = kW * hrs
     */
    const year = 365.242199
    const day = 24
    let energy = 0
    switch (device.unitMeasurement) {
      case 'W':
        energy = (device.energyConsumption * device.noOperatingHours) / 1000
        break
      case 'kW':
        energy = device.energyConsumption * device.noOperatingHours
        break
      case 'kWh/100 cycles':
        let kWhAnnum = 0
        if (device.category === 'Maşini de spălat vase') {
          kWhAnnum = device.energyConsumption * 2.08
        } else {
          kWhAnnum = device.energyConsumption * 2.2
        }
        energy = kWhAnnum / (year * day)
        break
      case 'kWh/1000h':
        energy = device.energyConsumption / 1000
        break
      case 'kWh/annum':
        energy = device.energyConsumption / (year * day)
        break
      case 'kWh/cycle':
        energy = (device.energyConsumption * 286) / (year * day)
        break

      default:
        break
    }

    return energy * year * day
  }

  const getCategory = (device) => {
    return device.category
  }

  const getEstimatedConsumptionByCategory = (devices) => {
    const tempDevices = devices.map((device) => {
      return {
        estimatedConsumption: getEstimatedConsumption(device),
        category: getCategory(device)
      }
    })
    const object = {}
    for (const device of tempDevices) {
      if (Object.hasOwnProperty.call(object, device.category)) {
        object[device.category] += device.estimatedConsumption
      } else {
        object[device.category] = device.estimatedConsumption
      }
    }
    const estimatedConsumptionByCategory = []
    for (const [key, value] of Object.entries(object)) {
      estimatedConsumptionByCategory.push({
        name: key,
        value: value
      })
    }
    return estimatedConsumptionByCategory
  }

  return (
    <div>
      <CustomAppBar user={user} selectedAppBarItem={'Charts'} />
      <CustomPieChart data={getEstimatedConsumptionByCategory(devices)} title={'Estimated consumption by categories'} />
    </div>
  )
}

export default Charts
