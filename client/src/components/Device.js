import { Button, Paper, Stack, Typography } from '@mui/material'
import React, { useState, useEffect, forwardRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import swal from 'sweetalert'
import Select from 'react-select'
import InputUnstyled from '@mui/base/InputUnstyled'
import categories from '../collections/categories.json'
import efficiencyClasses from '../collections/efficiency-classes.json'
import unitsMeasurementsEnergyConsumption from '../collections/units-measurements-energy-consumption.json'
import unitsMeasurementsPower from '../collections/units-measurements-power.json'
import { styled } from '@mui/system'

const StyledInputElement = styled('input')(
  ({ theme }) => `
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

function Device() {
  const navigate = useNavigate()
  const { deviceId } = useParams()
  const [device, setDevice] = useState({})
  const [isSelectedPower, setIsSelectedPower] = useState(false)
  const [energyConsumption, setEnergyConsumption] = useState('')
  const [unitMeasurementEnergyConsumption, setUnitMeasurementEnergyConsumption] = useState('')
  const [unitMeasurementPower, setUnitMeasurementPower] = useState('')
  const [noOperatingHours, setNoOperatingHours] = useState('')
  const [efficiencyClass, setEfficiencyClass] = useState({
    value: '',
    label: ''
  })
  const [category, setCategory] = useState({
    value: '',
    label: ''
  })
  const regExp = /^[0-9\b]+$/

  useEffect(async () => {
    const response = await fetch(`http://localhost:8080/api/auth/user/devices/${deviceId}`, {
      method: 'GET',
      headers: {
        authorization: localStorage.getItem('accessToken')
      }
    })
    const data = await response.json()
    if (data.status === 'ok') {
      setDevice(data.device)
      setEnergyConsumption(data.device.energyConsumption)
      setUnitMeasurementEnergyConsumption(unitsMeasurementsEnergyConsumption[0])
      setUnitMeasurementPower(unitsMeasurementsPower[0])
      if (data.device.unitMeasurement === 'W' || data.device.unitMeasurement === 'kW') {
        setIsSelectedPower(true)
        setUnitMeasurementPower({
          value: data.device.unitMeasurement,
          label: data.device.unitMeasurement
        })
      } else {
        setIsSelectedPower(false)
        setUnitMeasurementEnergyConsumption({
          value: data.device.unitMeasurement,
          label: data.device.unitMeasurement
        })
      }
      setNoOperatingHours(data.device.noOperatingHours)
      setEfficiencyClass({
        value: data.device.efficiencyClass,
        label: data.device.efficiencyClass
      })
      setCategory({
        value: data.device.category,
        label: data.device.category
      })
    } else {
      swal('Failed', data.message, 'error').then((value) => {
        navigate('/login')
      })
    }
  }, [])

  const handleChangeCustomInputEnergyConsumption = (event) => {
    if (event.target.value === '' || regExp.test(event.target.value)) {
      setEnergyConsumption(event.target.value)
    }
  }

  const handleChangeCustomInputNoOperatingHours = (event) => {
    if (event.target.value === '' || (regExp.test(event.target.value) && parseInt(event.target.value) < 25)) {
      setNoOperatingHours(event.target.value)
    }
  }

  const handleSave = async () => {
    const device = {
      energyConsumption: parseInt(energyConsumption),
      unitMeasurement: isSelectedPower ? unitMeasurementPower.value : unitMeasurementEnergyConsumption.value,
      noOperatingHours: parseInt(noOperatingHours),
      efficiencyClass: efficiencyClass.value,
      category: category.value
    }
    const response = await fetch(`http://localhost:8080/api/auth/user/devices/${deviceId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        authorization: localStorage.getItem('accessToken')
      },
      body: JSON.stringify(device)
    })
    const data = await response.json()
    if (data.status === 'ok') {
      navigate(-1)
    } else {
      swal('Failed', data.errors[0].message, 'error')
    }
  }

  const handleCancel = () => {
    navigate(-1)
  }

  const editDevice = (
    <Stack direction='column' spacing={2} xs={6} p={2} component={Paper}>
      <Typography variant='h5' textAlign='left'>
        EDIT DEVICE
      </Typography>
      <form>
        <div className='row'>
          <div className='col'>
            <Typography variant='h6'>Device category: *</Typography>
          </div>
          <div className='col'>
            <Select
              className='select'
              isSearchable={true}
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
            <Typography variant='h6'>Efficiency class: *</Typography>
          </div>
          <div className='col'>
            <Select
              className='select'
              isSearchable={true}
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
              value={isSelectedPower ? 'Power: *' : 'Energy consumption: *'}
              onChange={(event) => setIsSelectedPower(event.target.value === 'Power: *')}
            >
              <option key={'Energy consumption: *'} value={'Energy consumption: *'}>
                Energy consumption: *
              </option>
              <option key={'Power: *'} value={'Power: *'}>
                Power: *
              </option>
            </select>
          </div>
          <div className='col d-flex gap-2'>
            <div className='custom-input'>
              <CustomInput value={energyConsumption} onChange={handleChangeCustomInputEnergyConsumption} />
            </div>
            {isSelectedPower ? (
              <Select
                className='select-units-measures'
                isSearchable={true}
                value={unitMeasurementPower}
                onChange={(unitMeasurePower) => {
                  setUnitMeasurementPower(unitMeasurePower)
                }}
                options={unitsMeasurementsPower}
              />
            ) : (
              <Select
                className='select-units-measures'
                isSearchable={true}
                value={unitMeasurementEnergyConsumption}
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
            <Typography variant='h6'>Number of operating hours / day: *</Typography>
          </div>
          <div className='col'>
            <div className='custom-input'>
              <CustomInput value={noOperatingHours} onChange={handleChangeCustomInputNoOperatingHours} />
            </div>
          </div>
        </div>
        <div className='d-grid gap-2 d-md-flex justify-content-md-end'>
          <Button variant='contained' color='success' style={{ minWidth: '10%' }} onClick={handleSave}>
            Save
          </Button>
          <Button variant='outlined' color='success' style={{ minWidth: '10%' }} onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Stack>
  )

  return (
    <div>
      <div className='position-absolute top-50 start-50 translate-middle col-10 mx-auto'>
        <div>{editDevice}</div>
      </div>
    </div>
  )
}

export default Device
