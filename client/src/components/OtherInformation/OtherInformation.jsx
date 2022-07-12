import { Button, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import swal from 'sweetalert'
import { counties, suppliers } from '../../collections'

const OtherInformation = () => {
  const navigate = useNavigate()
  const [supplier, setSupplier] = useState(suppliers[0].value)
  const [county, setCounty] = useState(counties[0].value)
  const [budget, setBudget] = useState('')
  const [invoiceUnitValue, setInvoiceUnitValue] = useState('')

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
        if (data.user.supplier) {
          setSupplier(data.user.supplier)
        }
        if (data.user.county) {
          setCounty(data.user.county)
        }
        if (data.user.budget) {
          setBudget(data.user.budget)
        }
        if (data.user.invoiceUnitValue) {
          setInvoiceUnitValue(data.user.invoiceUnitValue)
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

    getUser()
  }, [navigate])

  const handleChangeInputBudget = (event) => {
    const regExp = /^[1-9][0-9]*$/
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

  const updateUser = async (user) => {
    const response = await fetch('/api/auth/user', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        authorization: localStorage.getItem('accessToken')
      },
      body: JSON.stringify(user)
    })
    const data = await response.json()
    if (data.status === 'ok') {
      navigate('/profile')
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

  const handleSave = async () => {
    await updateUser({
      supplier,
      county,
      budget: budget || 0,
      invoiceUnitValue: invoiceUnitValue || 0
    })
  }

  const handleCancel = () => {
    navigate('/profile')
  }

  return (
    <div className='position-absolute top-50 start-50 translate-middle col-6'>
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
                className='form-control'
                id='selectSupplier'
                label='Supplier *'
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
                className='form-control'
                id='selectCounty'
                label='County *'
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
            <Button variant='text' color='inherit' onClick={handleCancel} style={{ minWidth: '10%' }}>
              Cancel
            </Button>
            <Button variant='contained' color='success' onClick={handleSave} style={{ minWidth: '10%' }}>
              Save
            </Button>
          </div>
        </form>
      </Stack>
    </div>
  )
}

export default OtherInformation
