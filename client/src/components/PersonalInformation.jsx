import { Visibility, VisibilityOff } from '@mui/icons-material'
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
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import swal from 'sweetalert'

const PersonalInformation = () => {
  const navigate = useNavigate()
  const tempAccessToken = localStorage.getItem('accessToken')
  const [accessToken, setAccessToken] = useState('')
  const [firstName, setFirstName] = useState('')
  const [isFirstNameValid, setIsFirstNameValid] = useState(true)
  const [lastName, setLastName] = useState('')
  const [isLastNameValid, setIsLastNameValid] = useState(true)
  const [username, setUsername] = useState('')
  const [isUsernameValid, setIsUsernameValid] = useState(true)
  const [email, setEmail] = useState('')
  const [isEmailValid, setIsEmailValid] = useState(true)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const updateUser = async (user) => {
    const response = await fetch('/api/auth/user', {
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
    const getUser = async () => {
      const response = await fetch('/api/auth/user', {
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
    getUser()
  }, [navigate])

  useEffect(() => {
    setAccessToken(localStorage.getItem('accessToken'))
  }, [tempAccessToken])

  const validation = () => {
    setIsFirstNameValid(firstName !== '')
    setIsLastNameValid(lastName !== '')
    setIsUsernameValid(username !== '')
    setIsEmailValid(email !== '')
    return firstName !== '' && lastName !== '' && username !== '' && email !== ''
  }

  const handleSave = async () => {
    if (!validation()) {
      return
    } else {
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

  const handleChangeFirstName = (event) => {
    setFirstName(event.target.value)
    setIsFirstNameValid(event.target.value !== '')
  }

  const handleChangeLastName = (event) => {
    setLastName(event.target.value)
    setIsLastNameValid(event.target.value !== '')
  }

  const handleChangeUsername = (event) => {
    setUsername(event.target.value)
    setIsUsernameValid(event.target.value !== '')
  }

  const handleChangeEmail = (event) => {
    setEmail(event.target.value)
    setIsEmailValid(event.target.value !== '')
  }

  const handleChangePassword = (event) => {
    setPassword(event.target.value)
  }

  return (
    <div className='position-absolute top-50 start-50 translate-middle'>
      <Stack direction='column' spacing={2} xs={6} p={2} component={Paper}>
        <Typography variant='h5' textAlign='left'>
          CHANGE YOUR PERSONAL INFORMATION
        </Typography>
        <form noValidate>
          <div className='row mb-3'>
            <div className='col'>
              <TextField
                fullWidth
                type='text'
                className='form-control'
                id='inputFirstName'
                label='First Name *'
                value={firstName}
                onChange={handleChangeFirstName}
                error={!isFirstNameValid}
                helperText={
                  !isFirstNameValid && (
                    <span className={'display-flex align-items-center column-gap-1'}>
                      <i className='fa-solid fa-circle-exclamation'></i>
                      This field is required
                    </span>
                  )
                }
              />
            </div>
            <div className='col'>
              <TextField
                fullWidth
                type='text'
                className='form-control'
                id='inputLastName'
                label='Last Name *'
                value={lastName}
                onChange={handleChangeLastName}
                error={!isLastNameValid}
                helperText={
                  !isLastNameValid && (
                    <span className={'display-flex align-items-center column-gap-1'}>
                      <i className='fa-solid fa-circle-exclamation'></i>
                      This field is required
                    </span>
                  )
                }
              />
            </div>
          </div>
          <div className='row mb-3'>
            <div className='col'>
              <TextField
                fullWidth
                type='text'
                className='form-control'
                id='inputUsername'
                label='Username *'
                value={username}
                onChange={handleChangeUsername}
                error={!isUsernameValid}
                helperText={
                  !isUsernameValid && (
                    <span className={'display-flex align-items-center column-gap-1'}>
                      <i className='fa-solid fa-circle-exclamation'></i>
                      This field is required
                    </span>
                  )
                }
              />
            </div>
          </div>
          <div className='row mb-3'>
            <div className='col'>
              <TextField
                fullWidth
                type='email'
                className='form-control'
                id='inputEmail'
                label='E-mail *'
                value={email}
                onChange={handleChangeEmail}
                error={!isEmailValid}
                helperText={
                  !isEmailValid && (
                    <span className={'display-flex align-items-center column-gap-1'}>
                      <i className='fa-solid fa-circle-exclamation'></i>
                      This field is required
                    </span>
                  )
                }
              />
            </div>
          </div>
          {!localStorage.getItem('loggedInWithGoogle') && (
            <div className='row mb-3'>
              <div className='col'>
                <FormControl fullWidth className='form-control' id='inputPassword'>
                  <InputLabel htmlFor='outlined-adornment-password'>Password</InputLabel>
                  <OutlinedInput
                    id='outlined-adornment-password'
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={handleChangePassword}
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
                    The password must contain a minimum of 8 characters with at least 1 Uppercase [A-Z] or 1 lowercase
                    [a-z], and 1 numeric character [0-9]
                  </FormHelperText>
                </FormControl>
              </div>
            </div>
          )}
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
