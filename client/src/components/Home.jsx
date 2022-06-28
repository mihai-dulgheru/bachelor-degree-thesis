import InputUnstyled from '@mui/base/InputUnstyled'
import { Button, Paper, Stack, Typography } from '@mui/material'
import { styled } from '@mui/system'
import { forwardRef, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Select from 'react-select'
import swal from 'sweetalert'
import {
  categories,
  efficiencyClasses,
  unitsMeasurementsEnergyConsumption,
  unitsMeasurementsPower
} from '../collections'
import CustomAppBar from './CustomAppBar'
import './Home.css'

const StyledInputElement = styled('input')(
  () => `
  display: block;
  width: 100%;
  padding: 2px 8px;
  font-weight: 400;
  line-height: 1.5;
  color: #212529;
  background-color: #fff;
  border: 1px solid #ced4da;
  font-size: 1.25rem;
  border-radius: 0.3rem;
  height: 44px;

  &:focus-visible {
    outline: var(--outline-color) auto 1px;
  }
`
)

const CustomInput = forwardRef(function CustomInput(props, ref) {
  return <InputUnstyled components={{ Input: StyledInputElement }} {...props} ref={ref} />
})

const Home = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState({})
  const [category, setCategory] = useState(categories[0])
  const [efficiencyClass, setEfficiencyClass] = useState(efficiencyClasses[0])
  const [energyConsumption, setEnergyConsumption] = useState('')
  const [isEnergyConsumptionValid, setIsEnergyConsumptionValid] = useState(true)
  const [noOperatingHours, setNoOperatingHours] = useState('')
  const [isNoOperatingHoursValid, setIsNoOperatingHoursValid] = useState(true)
  const [devices, setDevices] = useState([
    {
      value: '',
      label: ''
    }
  ])
  const [device, setDevice] = useState(devices[0])
  const [unitMeasureEnergyConsumption, setUnitMeasurementEnergyConsumption] = useState(
    unitsMeasurementsEnergyConsumption[0]
  )
  const [unitMeasurePower, setUnitMeasurementPower] = useState(unitsMeasurementsPower[0])
  const [isSelectedPower, setIsSelectedPower] = useState(false)

  const handleChangeCustomInputEnergyConsumption = (event) => {
    const regExp = isSelectedPower && unitMeasurePower.value === 'kW' ? /^(?!0\d)(\d+)?\.?(\d+)?$/ : /^[1-9][0-9]*$/
    if (event.target.value === '' || regExp.test(event.target.value)) {
      setEnergyConsumption(event.target.value)
      setIsEnergyConsumptionValid(event.target.value !== '')
    }
  }

  const handleChangeCustomInputNoOperatingHours = (event) => {
    const regExp = /^(?!0\d)(\d+)?\.?(\d+)?$/
    const condition =
      event.target.value !== '24.' &&
      (event.target.value === '' || (regExp.test(event.target.value) && parseFloat(event.target.value) <= 24.0))
    if (condition) {
      setNoOperatingHours(event.target.value)
      setIsNoOperatingHoursValid(event.target.value !== '')
    }
  }

  const validation = () => {
    setIsEnergyConsumptionValid(energyConsumption !== '')
    setIsNoOperatingHoursValid(noOperatingHours !== '')
    return energyConsumption && noOperatingHours
  }

  const clearForm = () => {
    setCategory(categories[0])
    setEfficiencyClass(efficiencyClasses[0])
    setUnitMeasurementEnergyConsumption(unitsMeasurementsEnergyConsumption[0])
    setUnitMeasurementPower(unitsMeasurementsPower[0])
    setEnergyConsumption('')
    setNoOperatingHours('')
    setIsEnergyConsumptionValid(true)
    setIsNoOperatingHoursValid(true)
  }

  const handleAdd = async () => {
    if (!validation()) {
      return
    } else {
      const device = {
        energyConsumption: energyConsumption ? parseInt(energyConsumption) : 0,
        noOperatingHours: noOperatingHours ? parseFloat(noOperatingHours) : 0,
        efficiencyClass: efficiencyClass.value,
        category: category.value,
        unitMeasurement: isSelectedPower ? unitMeasurePower.value : unitMeasureEnergyConsumption.value
      }
      const response = await fetch('/api/auth/user/devices', {
        method: 'POST',
        headers: {
          authorization: localStorage.getItem('accessToken'),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(device)
      })
      const data = await response.json()
      if (data.status === 'ok') {
        swal({
          title: 'Success',
          text: 'Device has been created!',
          icon: 'success',
          buttons: false,
          timer: 2000
        }).then(() => {
          clearForm()
          getDevices()
        })
      } else {
        swal({
          title: 'Failed',
          text:
            data.errors[0].message[0] >= 'a' && data.errors[0].message[0] <= 'z'
              ? data.errors[0].message[0].toLocaleUpperCase() + data.errors[0].message.substring(1)
              : data.errors[0].message,
          icon: 'error',
          button: {
            text: 'OK',
            value: true,
            visible: true,
            closeModal: true
          }
        })
      }
    }
  }

  const handleChoose = async () => {
    const chosenDevice = {
      category: device.value.split(';')[0],
      efficiencyClass: device.value.split(';')[1],
      energyConsumption: parseInt(device.value.split(';')[2]),
      unitMeasurement: device.value.split(';')[3],
      noOperatingHours: parseFloat(device.value.split(';')[4])
    }
    const response = await fetch('/api/auth/user/devices', {
      method: 'POST',
      headers: {
        authorization: localStorage.getItem('accessToken'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(chosenDevice)
    })
    const data = await response.json()
    if (data.status === 'ok') {
      swal({
        title: 'Success',
        text: 'Device has been created!',
        icon: 'success',
        buttons: false,
        timer: 2000
      })
    } else {
      swal({
        title: 'Failed',
        text:
          data.errors[0].message[0] >= 'a' && data.errors[0].message[0] <= 'z'
            ? data.errors[0].message[0].toLocaleUpperCase() + data.errors[0].message.substring(1)
            : data.errors[0].message,
        icon: 'error',
        button: {
          text: 'OK',
          value: true,
          visible: true,
          closeModal: true
        }
      })
    }
  }

  const getDevices = async () => {
    const response = await fetch('/api/auth/devices', {
      method: 'GET',
      headers: {
        authorization: localStorage.getItem('accessToken')
      }
    })
    const data = await response.json()
    if (data.status === 'ok') {
      if (data.devices.length > 0) {
        setDevices(data.devices.sort((a, b) => a.value.localeCompare(b.value)))
        setDevice(data.devices[0])
      }
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
      const response = await fetch('/api/auth/devices', {
        method: 'GET',
        headers: {
          authorization: localStorage.getItem('accessToken')
        }
      })
      const data = await response.json()
      if (data.status === 'ok') {
        if (data.devices.length > 0) {
          setDevices(data.devices.sort((a, b) => a.value.localeCompare(b.value)))
          setDevice(data.devices[0])
        }
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

  const setUpDevice = (
    <Stack direction='column' spacing={2} xs={6} p={2} component={Paper}>
      <Typography variant='h5' textAlign='left'>
        SET UP A DEVICE
      </Typography>
      <form>
        <div className='row'>
          <div className='col'>
            <Typography variant='h6'>Device category *</Typography>
          </div>
          <div className='col'>
            <Select
              className='select'
              isSearchable
              value={category}
              onChange={(category) => {
                setCategory(category)
              }}
              options={categories}
            />
          </div>
        </div>
        <div className='row'>
          <div className='col'>
            <Typography variant='h6'>Efficiency class *</Typography>
          </div>
          <div className='col'>
            <Select
              className='select'
              isSearchable
              value={efficiencyClass}
              onChange={(efficiencyClass) => {
                setEfficiencyClass(efficiencyClass)
              }}
              options={efficiencyClasses}
            />
          </div>
        </div>
        <div className='row'>
          <div className='col'>
            <select
              style={{ width: 'fit-content', border: 'none', paddingLeft: 0, fontWeight: 500 }}
              className='form-select form-select-lg form-select-power-energy-consumption'
              value={isSelectedPower ? 'Power *' : 'Energy consumption *'}
              onChange={(event) => setIsSelectedPower(event.target.value === 'Power *')}
            >
              <option key='Energy consumption *' value='Energy consumption *'>
                Energy consumption *
              </option>
              <option key='Power *' value='Power *'>
                Power *
              </option>
            </select>
          </div>
          <div className='col d-flex gap-2'>
            <div className='custom-input'>
              <CustomInput
                className={!isEnergyConsumptionValid ? 'custom-error' : ''}
                value={energyConsumption}
                onChange={handleChangeCustomInputEnergyConsumption}
              />
              <span className={!isEnergyConsumptionValid ? 'errors' : ''}>
                <i className='fa-solid fa-circle-exclamation'></i>This field is required
              </span>
            </div>
            {isSelectedPower ? (
              <Select
                className='select-units-measures'
                isSearchable
                value={unitMeasurePower}
                onChange={(unitMeasurePower) => {
                  setUnitMeasurementPower(unitMeasurePower)
                }}
                options={unitsMeasurementsPower}
              />
            ) : (
              <Select
                className='select-units-measures'
                isSearchable
                value={unitMeasureEnergyConsumption}
                onChange={(unitMeasureEnergyConsumption) => {
                  setUnitMeasurementEnergyConsumption(unitMeasureEnergyConsumption)
                }}
                options={unitsMeasurementsEnergyConsumption}
              />
            )}
          </div>
        </div>
        <div className='row'>
          <div className='col'>
            <Typography variant='h6'>Number of operating hours/day *</Typography>
          </div>
          <div className='col'>
            <div className='custom-input'>
              <CustomInput
                className={!isNoOperatingHoursValid ? 'custom-error' : ''}
                value={noOperatingHours}
                onChange={handleChangeCustomInputNoOperatingHours}
              />
              <span className={!isNoOperatingHoursValid ? 'errors' : ''}>
                <i className='fa-solid fa-circle-exclamation'></i>This field is required
              </span>
            </div>
          </div>
        </div>
        <div className='d-grid gap-2 d-md-flex justify-content-md-end'>
          <Button variant='text' color='inherit' style={{ minWidth: '10%' }} onClick={clearForm}>
            Reset
          </Button>
          <Button
            variant='contained'
            style={{ minWidth: '10%', backgroundColor: 'var(--very-peri)' }}
            onClick={handleAdd}
          >
            Add
          </Button>
        </div>
      </form>
    </Stack>
  )

  const chooseDevice = (
    <Stack direction='column' spacing={2} xs={6} p={2} component={Paper}>
      <form>
        <div className='row'>
          <div className='col'>
            <Typography variant='h5' textAlign='left' noWrap className='fit-content'>
              Or choose a device from our list:
            </Typography>
            <Select
              className='choose-device-select'
              isSearchable
              value={device}
              onChange={(device) => {
                setDevice(device)
              }}
              options={devices}
            />
          </div>
        </div>
        <div className='d-grid gap-2 d-md-flex justify-content-md-end'>
          <Button
            variant='contained'
            style={{ minWidth: '10%', backgroundColor: 'var(--very-peri)' }}
            onClick={handleChoose}
          >
            Choose
          </Button>
        </div>
      </form>
    </Stack>
  )

  return (
    <div className='root'>
      <CustomAppBar user={user} selectedAppBarItem={'Home'} />
      <div className='position-absolute top-50 start-50 translate-middle col-10 mx-auto'>
        <div className='mt-4'>{setUpDevice}</div>
        <div className='mt-2'>{chooseDevice}</div>
      </div>
    </div>
  )
}

export default Home
