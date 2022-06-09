import InputUnstyled from '@mui/base/InputUnstyled'
import { Button, Paper, Stack, Typography } from '@mui/material'
import { styled } from '@mui/system'
import React, { forwardRef, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Select from 'react-select'
import swal from 'sweetalert'
import {
  categories,
  efficiencyClasses,
  unitsMeasurementsEnergyConsumption,
  unitsMeasurementsPower
} from '../collections'

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

const Device = () => {
  const navigate = useNavigate()
  const { deviceId } = useParams()
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

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`/api/auth/user/devices/${deviceId}`, {
        method: 'GET',
        headers: {
          authorization: localStorage.getItem('accessToken')
        }
      })
      const data = await response.json()
      if (data.status === 'ok') {
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
    fetchData()
  }, [])

  const handleChangeCustomInputEnergyConsumption = (event) => {
    const regExp = /^[1-9][0-9]*$/
    if (event.target.value === '' || regExp.test(event.target.value)) {
      setEnergyConsumption(event.target.value)
    }
  }

  const handleChangeCustomInputNoOperatingHours = (event) => {
    const regExp = /^(?!0\d)(\d+)?\.?(\d+)?$/
    const condition =
      event.target.value !== '24.' &&
      (event.target.value === '' || (regExp.test(event.target.value) && parseFloat(event.target.value) <= 24.0))
    if (condition) {
      setNoOperatingHours(event.target.value)
    }
  }

  const handleSave = async () => {
    const device = {
      energyConsumption: parseInt(energyConsumption),
      unitMeasurement: isSelectedPower ? unitMeasurementPower.value : unitMeasurementEnergyConsumption.value,
      noOperatingHours: parseFloat(noOperatingHours),
      efficiencyClass: efficiencyClass.value,
      category: category.value
    }
    const response = await fetch(`/api/auth/user/devices/${deviceId}`, {
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
            <Typography variant='h6'>Efficiency class: *</Typography>
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
              value={isSelectedPower ? 'Power: *' : 'Energy consumption: *'}
              onChange={(event) => setIsSelectedPower(event.target.value === 'Power: *')}
            >
              <option key='Energy consumption: *' value='Energy consumption: *'>
                Energy consumption: *
              </option>
              <option key='Power: *' value='Power: *'>
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
                isSearchable
                value={unitMeasurementPower}
                onChange={(unitMeasurePower) => {
                  setUnitMeasurementPower(unitMeasurePower)
                }}
                options={unitsMeasurementsPower}
              />
            ) : (
              <Select
                className='select-units-measures'
                isSearchable
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
          <Button variant='outlined' color='success' style={{ minWidth: '10%' }} onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant='contained' color='success' style={{ minWidth: '10%' }} onClick={handleSave}>
            Save
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
