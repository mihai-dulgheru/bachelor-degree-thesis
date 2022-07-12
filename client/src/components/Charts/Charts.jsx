import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import swal from 'sweetalert'
import { CustomAppBar, CustomBarChart, CustomPieChart, CustomStackedAreaChart, NoDeviceAdded } from '..'
import { getEstimatedConsumptionPerYear } from '../../functions'

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

    getUser()
    getDevices()
  }, [navigate])

  const getEstimatedConsumptionByCategory = () => {
    const tempDevices = devices.map((device) => {
      return {
        estimatedConsumption: getEstimatedConsumptionPerYear(device),
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
        value
      })
    }
    return estimatedConsumptionByCategory.sort((a, b) => b.value - a.value)
  }

  const getNoOperatingHoursByCategory = () => {
    const object = {}
    for (const device of devices) {
      const category = device.category
      if (Object.hasOwnProperty.call(object, category)) {
        object[category] = {
          noOperatingHours: object[category].noOperatingHours + device.noOperatingHours,
          number: object[category].number + 1
        }
      } else {
        object[category] = { noOperatingHours: device.noOperatingHours, number: 1 }
      }
    }
    const noOperatingHoursByCategories = []
    for (const [key, value] of Object.entries(object)) {
      noOperatingHoursByCategories.push({
        name: key,
        'The average number of operating hours per day': value.noOperatingHours / value.number
      })
    }
    return noOperatingHoursByCategories.sort((a, b) => a.name.localeCompare(b.name))
  }

  const getEstimatedConsumptionHistory = () => {
    const tempDevices = devices.map((device) => {
      const items = device.previousVersion && device.previousVersion.split(';')
      const fractionDigits = 2
      return {
        name: device.category,
        previous:
          device.previousVersion === null
            ? parseFloat(getEstimatedConsumptionPerYear(device).toFixed(fractionDigits))
            : parseFloat(
              getEstimatedConsumptionPerYear({
                ...device,
                energyConsumption: parseInt(items[0]),
                unitMeasurement: items[1],
                efficiencyClass: items[2]
              }).toFixed(fractionDigits)
            ),
        current: parseFloat(getEstimatedConsumptionPerYear(device).toFixed(fractionDigits))
      }
    })
    const object = {}
    for (const device of tempDevices) {
      const name = device.name
      if (Object.hasOwnProperty.call(object, name)) {
        object[name] = {
          name,
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
      <CustomAppBar user={user} selectedAppBarItem='Charts' />
      {devices.length !== 0
        ? (
          <>
            <div>
              <div className='display-flex flex-direction-column row-gap-4 mt-4'>
                <div>
                  <CustomPieChart
                    title='Estimated consumption by categories'
                    data={getEstimatedConsumptionByCategory()}
                  />
                </div>
                <div>
                  <CustomBarChart
                    title='The average number of operating hours per day by category'
                    data={getNoOperatingHoursByCategory()}
                    legend={false}
                    dataKeys={['The average number of operating hours per day']}
                  />
                </div>
                <div>
                  <CustomStackedAreaChart
                    title='Estimated consumption history (in kWh/annum)'
                    data={getEstimatedConsumptionHistory()}
                    dataKeys={['previous', 'current']}
                  />
                </div>
              </div>
            </div>
          </>
          )
        : (
          <>
            <NoDeviceAdded />
          </>
          )}
    </div>
  )
}

export default Charts
