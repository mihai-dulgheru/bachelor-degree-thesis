import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import swal from 'sweetalert'
import CustomAppBar from './CustomAppBar'
import CustomBarChart from './CustomBarChart'
import CustomPieChart from './CustomPieChart'
import CustomStackedAreaChart from './CustomStackedAreaChart'

const Charts = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState({})
  const [devices, setDevices] = useState([])

  useEffect(() => {
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
    getUser()

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

    getDevices()
  }, [navigate])

  const getEstimatedConsumption = (device) => {
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

  const getEstimatedConsumptionByCategory = () => {
    const tempDevices = devices.map((device) => {
      return {
        estimatedConsumption: getEstimatedConsumption(device),
        category: device.category
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
    return estimatedConsumptionByCategory.sort((a, b) => b.value - a.value)
  }

  const getNoOperatingHoursByCategory = () => {
    const object = {}
    for (const device of devices) {
      if (Object.hasOwnProperty.call(object, device.category)) {
        object[device.category] += device.noOperatingHours
      } else {
        object[device.category] = device.noOperatingHours
      }
    }
    const noOperatingHoursByCategories = []
    for (const [key, value] of Object.entries(object)) {
      noOperatingHoursByCategories.push({
        name: key,
        'Number of operating hours per day': value
      })
    }
    return noOperatingHoursByCategories.sort((a, b) => a.name.localeCompare(b.name))
  }

  const getEstimatedConsumptionHistory = () => {
    const tempDevices = devices.map((device) => {
      let items = device.previousVersion && device.previousVersion.split(';')
      return {
        name: device.category,
        previous:
          device.previousVersion === null
            ? parseFloat(getEstimatedConsumption(device).toPrecision(5))
            : parseFloat(
                getEstimatedConsumption({
                  ...device,
                  energyConsumption: parseInt(items[0]),
                  unitMeasurement: items[1],
                  efficiencyClass: items[2]
                }).toPrecision(5)
              ),
        current: parseFloat(getEstimatedConsumption(device).toPrecision(5))
      }
    })
    const object = {}
    for (const device of tempDevices) {
      const name = device.name
      if (Object.hasOwnProperty.call(object, name)) {
        object[name] = {
          name: name,
          previous: object[name].previous + device.previous,
          current: object[name].current + device.current
        }
      } else {
        object[name] = device
      }
    }
    return Object.values(object).sort((a, b) => b.value - a.value)
  }

  return (
    <div>
      <CustomAppBar user={user} selectedAppBarItem={'Charts'} />
      <div>
        <div className='display-flex wrap mt-4 justify-content-space-evenly row-gap-4 column-gap-4'>
          <div>
            <CustomPieChart title={'Estimated consumption by categories'} data={getEstimatedConsumptionByCategory()} />
          </div>
          <div>
            <CustomBarChart
              title={'Number of operating hours per day by category'}
              data={getNoOperatingHoursByCategory()}
              legend={false}
              dataKeys={['Number of operating hours per day']}
            />
          </div>
          <div>
            <CustomStackedAreaChart
              title={'Estimated consumption history'}
              data={getEstimatedConsumptionHistory()}
              dataKeys={['previous', 'current']}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Charts
