import React, { forwardRef, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import AppBar from '@mui/material/AppBar'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import './css/Home.css'
import swal from 'sweetalert'
import { Button, Container, Menu, MenuItem, Paper, Stack, Tooltip } from '@mui/material'
import { Box, styled } from '@mui/system'
import MenuIcon from '@mui/icons-material/Menu'
import InputUnstyled from '@mui/base/InputUnstyled'
import categories from '../collections/categories.json'
import efficiencyClasses from '../collections/efficiency-classes.json'
import unitsMeasurementsEnergyConsumption from '../collections/units-measurements-energy-consumption.json'
import unitsMeasurementsPower from '../collections/units-measurements-power.json'
import Select from 'react-select'

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

function Home() {
  const navigate = useNavigate()
  const [user, setUser] = useState({})
  const [anchorElNav, setAnchorElNav] = useState(null)
  const [anchorElUser, setAnchorElUser] = useState(null)
  const [category, setCategory] = useState(categories[0])
  const [efficiencyClass, setEfficiencyClass] = useState(efficiencyClasses[0])
  const [energyConsumption, setEnergyConsumption] = useState('')
  const [noOperatingHours, setNoOperatingHours] = useState('')
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
  const regExp = /^[0-9\b]+$/

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget)
  }

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  const handleClickNavMenuDevices = () => {
    setAnchorElNav(null)
    navigate('/device-list')
  }

  const handleClickNavMenuPrizes = () => {
    setAnchorElNav(null)
    navigate('/prizes')
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  const handleClickProfile = () => {
    setAnchorElUser(null)
    navigate('/profile')
  }

  const handleClickLogout = () => {
    setAnchorElUser(null)
    localStorage.removeItem('accessToken')
    navigate('/login')
  }

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

  const validation = () => {
    if (energyConsumption && noOperatingHours) {
      return true
    }
    return false
  }

  const clearForm = () => {
    setCategory(categories[0])
    setEfficiencyClass(efficiencyClasses[0])
    setUnitMeasurementEnergyConsumption(unitsMeasurementsEnergyConsumption[0])
    setUnitMeasurementPower(unitsMeasurementsPower[0])
    setEnergyConsumption('')
    setNoOperatingHours('')
  }

  const handleAdd = async () => {
    if (validation()) {
      const device = {
        energyConsumption: energyConsumption ? parseInt(energyConsumption) : 0,
        noOperatingHours: noOperatingHours ? parseInt(noOperatingHours) : 0,
        efficiencyClass: efficiencyClass.value,
        category: category.value,
        unitMeasurement: isSelectedPower ? unitMeasurePower.value : unitMeasureEnergyConsumption.value
      }
      const response = await fetch('http://localhost:8080/api/auth/user/devices', {
        method: 'POST',
        headers: {
          authorization: localStorage.getItem('accessToken'),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(device)
      })
      const data = await response.json()
      if (data.status === 'ok') {
        swal('Success', 'Device created!', 'success').then(() => {
          clearForm()
          getDevices()
        })
      } else {
        swal('Failed', data.errors[0].message, 'error')
      }
    } else {
      swal(
        'Failed',
        `Missing fields (${isSelectedPower ? 'Power' : 'Energy consumption'} and/or Number of operating hours / day)`,
        'error'
      )
    }
  }

  const handleChoose = async () => {
    const chosenDevice = {
      category: device.value.split(',')[0],
      efficiencyClass: device.value.split(',')[1],
      energyConsumption: parseInt(device.value.split(',')[2]),
      unitMeasurement: device.value.split(',')[3],
      noOperatingHours: parseInt(device.value.split(',')[4])
    }
    const response = await fetch('http://localhost:8080/api/auth/user/devices', {
      method: 'POST',
      headers: {
        authorization: localStorage.getItem('accessToken'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(chosenDevice)
    })
    const data = await response.json()
    if (data.status === 'ok') {
      swal('Success', 'Device created!', 'success')
    } else {
      swal('Failed', data.errors[0].message, 'error')
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
      setUser(data.user)
    } else {
      swal('Failed', data.message, 'error').then((value) => {
        navigate('/login')
      })
    }
  }

  const getDevices = async () => {
    const response = await fetch('http://localhost:8080/api/auth/devices', {
      method: 'GET',
      headers: {
        authorization: localStorage.getItem('accessToken')
      }
    })
    const data = await response.json()
    if (data.status === 'ok') {
      if (data.devices.length > 0) {
        setDevices(data.devices)
        setDevice(data.devices[0])
      }
    } else {
      swal('Failed', data.message, 'error').then((value) => {
        navigate('/login')
      })
    }
  }

  useEffect(() => {
    getUser()
    getDevices()
  }, [])

  const appBar = (
    <AppBar position='static'>
      <Container maxWidth='xl'>
        <Toolbar disableGutters>
          <Typography variant='h6' noWrap component='div' sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}>
            Home
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size='large'
              aria-controls='menu-appbar'
              aria-haspopup='true'
              onClick={handleOpenNavMenu}
              color='inherit'
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id='menu-appbar'
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left'
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left'
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' }
              }}
            >
              <MenuItem key='Devices' onClick={handleClickNavMenuDevices}>
                <Typography textAlign='center'>Devices</Typography>
              </MenuItem>
              <MenuItem key='Prizes' onClick={handleClickNavMenuPrizes}>
                <Typography textAlign='center'>Prizes</Typography>
              </MenuItem>
            </Menu>
          </Box>

          <Typography variant='h6' noWrap component='div' sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            Home
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button key='Devices' onClick={handleClickNavMenuDevices} sx={{ my: 2, color: 'white', display: 'block' }}>
              Devices
            </Button>
            <Button key='Prizes' onClick={handleClickNavMenuPrizes} sx={{ my: 2, color: 'white', display: 'block' }}>
              Prizes
            </Button>
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title='Open settings'>
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                {!user.avatar ? <AccountCircleIcon fontSize='large' /> : <Avatar src={user.avatar} />}
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id='menu-appbar'
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem key='Profile' onClick={handleClickProfile}>
                <Typography textAlign='center'>Profile</Typography>
              </MenuItem>
              <MenuItem key='Logout' onClick={handleClickLogout}>
                <Typography textAlign='center'>Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )

  const setUpDevice = (
    <Stack direction='column' spacing={2} xs={6} p={2} component={Paper}>
      <Typography variant='h5' textAlign='left'>
        SET UP A DEVICE
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
                value={unitMeasurePower}
                onChange={(unitMeasurePower) => {
                  setUnitMeasurementPower(unitMeasurePower)
                }}
                options={unitsMeasurementsPower}
              />
            ) : (
              <Select
                className='select-units-measures'
                isSearchable={true}
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
            <Typography variant='h6'>Number of operating hours / day: *</Typography>
          </div>
          <div className='col'>
            <div className='custom-input'>
              <CustomInput value={noOperatingHours} onChange={handleChangeCustomInputNoOperatingHours} />
            </div>
          </div>
        </div>
        <div className='d-grid gap-2 d-md-flex justify-content-md-end'>
          <Button variant='contained' color='primary' style={{ minWidth: '10%' }} onClick={handleAdd}>
            Add
          </Button>
          <Button variant='text' color='inherit' style={{ minWidth: '10%' }} onClick={clearForm}>
            Reset
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
              isSearchable={true}
              value={device}
              onChange={(device) => {
                setDevice(device)
              }}
              options={devices}
            />
          </div>
        </div>
        <div className='d-grid gap-2 d-md-flex justify-content-md-end'>
          <Button variant='contained' style={{ minWidth: '10%' }} onClick={handleChoose}>
            Choose
          </Button>
        </div>
      </form>
    </Stack>
  )

  return (
    <div className='root'>
      {appBar}
      <div className='position-absolute top-50 start-50 translate-middle col-10 mx-auto'>
        <div className='mt-4'>{setUpDevice}</div>
        <div className='mt-2'>{chooseDevice}</div>
      </div>
    </div>
  )
}

export default Home
