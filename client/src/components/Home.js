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
import { Box, styled, width } from '@mui/system'
import MenuIcon from '@mui/icons-material/Menu'
import InputUnstyled from '@mui/base/InputUnstyled'
import types from '../collections/types.json'
import energyClasses from '../collections/energy-classes.json'

const StyledInputElement = styled('input')(
  ({ theme }) => `
  display: block;
  width: 100%;
  padding: 0.5rem 2.25rem 0.5rem 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #212529;
  background-color: #fff;
  border: 1px solid #ced4da;
  font-size: 1.25rem;
  border-radius: 0.3rem;

  &:focus {
    border-color: #86b7fe;
    outline: 0;
    box-shadow: 0 0 0 0.25rem rgb(13 110 253 / 25%);
  }
`
)

const CustomInput = forwardRef(function CustomInput (props, ref) {
  return <InputUnstyled components={{ Input: StyledInputElement }} {...props} ref={ref} />
})

function Home () {
  const navigate = useNavigate()
  const [user, setUser] = useState({})
  const [anchorElNav, setAnchorElNav] = useState(null)
  const [anchorElUser, setAnchorElUser] = useState(null)
  const [type, setType] = useState(types[0].value)
  const [energyClass, setEnergyClass] = useState(energyClasses[0].value)
  const [consumption, setConsumption] = useState('')
  const [noOperatingHours, setNoOperatingHours] = useState('')
  const [devices, setDevices] = useState([
    {
      value: '',
      label: ''
    }
  ])
  const [device, setDevice] = useState(devices[0].value)
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

  const handleChangeCustomInputConsumption = (event) => {
    if (event.target.value === '' || regExp.test(event.target.value)) {
      setConsumption(event.target.value)
    }
  }

  const handleChangeCustomInputNoOperatingHours = (event) => {
    if (event.target.value === '' || (regExp.test(event.target.value) && parseInt(event.target.value) < 25)) {
      setNoOperatingHours(event.target.value)
    }
  }

  const validation = () => {
    if (consumption && noOperatingHours) {
      return true
    }
    return false
  }

  const clearForm = () => {
    setType(types[0].value)
    setEnergyClass(energyClasses[0].value)
    setConsumption('')
    setNoOperatingHours('')
  }

  const handleAdd = async () => {
    if (validation()) {
      const device = {
        consumption: consumption ? parseInt(consumption) : 0,
        noWorkingHours: noOperatingHours ? parseInt(noOperatingHours) : 0,
        energyClass: energyClass,
        deviceType: type
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
      swal('Failed', 'Missing fields (Average hourly consumption (kWh) and/or Number of operating hours)', 'error')
    }
  }

  const handleChoose = async () => {
    const chosenDevice = {
      deviceType: device.split(',')[0],
      energyClass: device.split(',')[1],
      consumption: parseInt(device.split(',')[2]),
      noWorkingHours: parseInt(device.split(',')[3])
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
      setDevices(data.devices)
      setDevice(data.devices[0].value)
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
        Set up a device
      </Typography>
      <form>
        <div className='row'>
          <div className='col'>
            <Typography variant='h6'>Device type: *</Typography>
          </div>
          <div className='col'>
            <select
              className='form-select form-select-lg'
              value={type}
              onChange={(event) => setType(event.target.value)}
            >
              {types.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className='row'>
          <div className='col'>
            <Typography variant='h6'>Energy class: *</Typography>
          </div>
          <div className='col'>
            <select
              className='form-select form-select-lg'
              value={energyClass}
              onChange={(event) => setEnergyClass(event.target.value)}
            >
              {energyClasses.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className='row'>
          <div className='col'>
            <Typography variant='h6'>Average hourly consumption (kWh): *</Typography>
          </div>
          <div className='col'>
            <div className='custom-input'>
              <CustomInput value={consumption} onChange={handleChangeCustomInputConsumption} />
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col'>
            <Typography variant='h6'>Number of operating hours: *</Typography>
          </div>
          <div className='col'>
            <div className='custom-input'>
              <CustomInput value={noOperatingHours} onChange={handleChangeCustomInputNoOperatingHours} />
            </div>
          </div>
        </div>
        <div className='d-grid gap-2 d-md-flex justify-content-md-end'>
          <Button variant='contained' style={{ width: '10%' }} onClick={handleAdd}>
            Add
          </Button>
          {/* <button type='button' className='btn btn-primary text-uppercase' style={{ width: '10%' }} onClick={handleAdd}>
            Add
          </button> */}
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
            <select className='choose-device-select' value={device} onChange={(event) => setDevice(event.target.value)}>
              {devices.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className='d-grid gap-2 d-md-flex justify-content-md-end'>
          <Button variant='contained' style={{ width: '10%' }} onClick={handleChoose}>
            Choose
          </Button>
          {/* <button
            type='button'
            className='btn btn-primary text-uppercase'
            style={{ width: '10%' }}
            onClick={handleChoose}
          >
            Choose
          </button> */}
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
