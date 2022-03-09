import { Button, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import swal from 'sweetalert'
import suppliers from '../json/suppliers.json'
import counties from '../json/counties.json'

function OtherInformation () {
  const navigate = useNavigate()
  const [accessToken, setAccessToken] = useState('')
  const tempAccessToken = localStorage.getItem('accessToken')
  const [supplier, setSupplier] = useState(suppliers[0].value)
  const [county, setCounty] = useState(counties[0].value)
  const [voltageLevel, setVoltageLevel] = useState('')
  const [budget, setBudget] = useState('')
  const [invoiceUnitValue, setInvoiceUnitValue] = useState('')

  const handleChangeInputVoltageLevel = (event) => {
    const regExp = /^[0-9\b]+$/
    if (event.target.value === '' || regExp.test(event.target.value)) {
      setVoltageLevel(event.target.value)
    }
  }

  const handleChangeInputBudget = (event) => {
    const regExp = /^[0-9\b]+$/
    if (event.target.value === '' || regExp.test(event.target.value)) {
      setBudget(event.target.value)
    }
  }

  const handleChangeInputInvoiceUnitValue = (event) => {
    const regExp = /^(?!0\d)(\d+)?\.?(\d+)?$/
    if (event.target.value === '' || regExp.test(event.target.value)) {
      setInvoiceUnitValue(event.target.value)
    }
  }

  const getUser = async () => {
    const response = await fetch('http://localhost:8080/api/auth/user', {
      method: 'GET',
      headers: {
        authorization: localStorage.getItem('accessToken')
      }
    })
    const data = await response.json()
    if (data.status === 'ok') {
      if (data.user.supplier) {
        setSupplier(data.user.supplier)
      }
      if (data.user.county) {
        setCounty(data.user.county)
      }
      if (data.user.voltageLevel) {
        setVoltageLevel(data.user.voltageLevel)
      }
      if (data.user.budget) {
        setBudget(data.user.budget)
      }
      if (data.user.invoiceUnitValue) {
        setInvoiceUnitValue(data.user.invoiceUnitValue)
      }
    } else {
      swal('Failed', data.message, 'error').then((value) => {
        navigate('/login')
      })
    }
  }

  const updateUser = async (user) => {
    const response = await fetch('http://localhost:8080/api/auth/user', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        authorization: accessToken
      },
      body: JSON.stringify(user)
    })
    const data = await response.json()
    if (data.status === 'ok') {
      navigate('/profile')
    } else {
      swal('Failed', data.message, 'error').then((value) => {
        navigate('/login')
      })
    }
  }

  useEffect(() => {
    getUser()
  }, [])

  useEffect(() => {
    setAccessToken(localStorage.getItem('accessToken'))
  }, [tempAccessToken])

  const handleSave = async () => {
    await updateUser({
      supplier: supplier,
      county: county,
      voltageLevel: voltageLevel || 0,
      budget: budget || 0,
      invoiceUnitValue: invoiceUnitValue || 0
    })
  }

  return (
    <div className='position-absolute top-50 start-50 translate-middle'>
      <Stack direction='column' spacing={2} xs={6} p={2} component={Paper}>
        <Typography variant='h5' textAlign='left'>
          CHANGE YOUR OTHER INFORMATION
        </Typography>
        <form>
          <div className='row mb-3'>
            <div className='col'>
              <TextField
                fullWidth
                select
                required
                className='form-control'
                id='selectSupplier'
                label='Supplier'
                value={supplier}
                onChange={(event) => setSupplier(event.target.value)}
                helperText='Please select your supplier'
              >
                {suppliers.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </div>
          </div>
          <div className='row mb-3'>
            <div className='col'>
              <TextField
                fullWidth
                select
                required
                className='form-control'
                id='selectCounty'
                label='County'
                value={county}
                onChange={(event) => setCounty(event.target.value)}
                helperText='Please select your county'
              >
                {counties.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </div>
          </div>
          <div className='row mb-3'>
            <div className='col'>
              <TextField
                fullWidth
                type='text'
                value={voltageLevel}
                onChange={handleChangeInputVoltageLevel}
                className='form-control'
                id='inputVoltageLevel'
                label='Voltage Level'
              />
            </div>
          </div>
          <div className='row mb-3'>
            <div className='col'>
              <TextField
                fullWidth
                type='text'
                value={budget}
                onChange={handleChangeInputBudget}
                className='form-control'
                id='inputBudget'
                label='Budget'
              />
            </div>
          </div>
          <div className='row mb-3'>
            <div className='col'>
              <TextField
                fullWidth
                type='text'
                value={invoiceUnitValue}
                onChange={handleChangeInputInvoiceUnitValue}
                className='form-control'
                id='inputInvoiceUnitValue'
                label='Invoice Unit Value'
              />
            </div>
          </div>
          <div className='d-grid gap-2 d-md-flex justify-content-md-end'>
            <Button variant='contained' color='success' onClick={handleSave}>
              Save
            </Button>
            <Button variant='contained' onClick={() => navigate('/profile')}>
              Back
            </Button>
          </div>
        </form>
      </Stack>
    </div>
  )
}

export default OtherInformation
