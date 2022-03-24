import {
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import swal from 'sweetalert'

function PersonalInformation() {
  const navigate = useNavigate()
  const [accessToken, setAccessToken] = useState('')
  const tempAccessToken = localStorage.getItem('accessToken')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const getUser = async () => {
    const response = await fetch('http://localhost:8080/api/auth/user', {
      method: 'GET',
      headers: {
        authorization: localStorage.getItem('accessToken')
      }
    })
    const data = await response.json()
    if (data.status === 'ok') {
      setFirstName(data.user.firstName)
      setLastName(data.user.lastName)
      setUsername(data.user.username)
      setEmail(data.user.email)
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

  useEffect(() => {
    getUser()
  }, [])

  useEffect(() => {
    setAccessToken(localStorage.getItem('accessToken'))
  }, [tempAccessToken])

  const validation = () => {
    if (firstName === '' || lastName === '' || username === '') {
      return false
    } else {
      return true
    }
  }

  const handleSave = async () => {
    if (validation()) {
      let user = {
        firstName: firstName,
        lastName: lastName,
        username: username,
        email: email
      }
      if (password) {
        user = { ...user, password: password }
      }
      await updateUser(user)
      localStorage.setItem('username', username)
    } else {
      swal({
        title: 'Failed',
        text: 'Please fill in all the required fields!',
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
    navigate('/profile')
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleMouseDownPassword = (event) => {
    event.preventDefault()
  }

  return (
    <div className='position-absolute top-50 start-50 translate-middle'>
      <Stack direction='column' spacing={2} xs={6} p={2} component={Paper}>
        <Typography variant='h5' textAlign='left'>
          CHANGE YOUR PERSONAL INFORMATION
        </Typography>
        <form>
          <div className='row mb-3'>
            <div className='col'>
              <TextField
                fullWidth
                required
                type='text'
                className='form-control'
                id='inputFirstName'
                label='First Name'
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
              />
            </div>
            <div className='col'>
              <TextField
                fullWidth
                required
                type='text'
                className='form-control'
                id='inputLastName'
                label='Last Name'
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
              />
            </div>
          </div>
          <div className='row mb-3'>
            <div className='col'>
              <TextField
                fullWidth
                required
                type='text'
                className='form-control'
                id='inputUsername'
                label='Username'
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </div>
          </div>
          <div className='row mb-3'>
            <div className='col'>
              <TextField
                fullWidth
                required
                type='email'
                className='form-control'
                id='inputEmail'
                label='E-mail'
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
          </div>
          <div className='row mb-3'>
            <div className='col'>
              <FormControl fullWidth className='form-control' id='inputPassword'>
                <InputLabel htmlFor='outlined-adornment-password'>Password</InputLabel>
                <OutlinedInput
                  id='outlined-adornment-password'
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  endAdornment={
                    <InputAdornment position='end'>
                      <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge='end'>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label='Password'
                />
                <FormHelperText>
                  The password must contain 8 characters with at least 1 Uppercase [A-Z], 1 lowercase [a-z], and 1
                  numeric character [0-9]
                </FormHelperText>
              </FormControl>
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

export default PersonalInformation
