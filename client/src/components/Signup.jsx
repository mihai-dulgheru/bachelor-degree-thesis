import { Visibility, VisibilityOff } from '@mui/icons-material'
import {
  Box,
  Button,
  CssBaseline,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  Link,
  OutlinedInput,
  Paper,
  TextField,
  Typography
} from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import swal from 'sweetalert'
import './Signup.css'

const Signup = () => {
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState('')
  const [isFirstNameValid, setIsFirstNameValid] = useState(true)
  const [lastName, setLastName] = useState('')
  const [isLastNameValid, setIsLastNameValid] = useState(true)
  const [username, setUsername] = useState('')
  const [isUsernameValid, setIsUsernameValid] = useState(true)
  const [email, setEmail] = useState('')
  const [isEmailValid, setIsEmailValid] = useState(true)
  const [password, setPassword] = useState('')
  const [isPasswordValid, setIsPasswordValid] = useState(true)
  const [showPassword, setShowPassword] = useState(false)

  const validation = () => {
    setIsFirstNameValid(firstName !== '')
    setIsLastNameValid(lastName !== '')
    setIsUsernameValid(username !== '')
    setIsEmailValid(email !== '')
    setIsPasswordValid(password !== '')
    return firstName !== '' && lastName !== '' && username !== '' && email !== '' && password !== ''
  }

  const clearForm = () => {
    setFirstName('')
    setLastName('')
    setUsername('')
    setPassword('')
    setEmail('')
    setIsFirstNameValid(true)
    setIsLastNameValid(true)
    setIsUsernameValid(true)
    setIsEmailValid(true)
    setIsPasswordValid(true)
  }

  const createUser = async () => {
    if (validation()) {
      const user = {
        firstName,
        lastName,
        username,
        password,
        email
      }
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      })
      const data = await response.json()
      if (data.status === 'ok') {
        clearForm()
        swal({
          title: 'Success',
          text: 'User has been created!',
          icon: 'success',
          buttons: false,
          timer: 2000
        }).then(() => {
          localStorage.setItem('username', username)
          navigate('/login')
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

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleMouseDownPassword = (event) => {
    event.preventDefault()
  }

  const handleClickLink = (event) => {
    event.preventDefault()
    navigate('/login')
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
    setIsPasswordValid(event.target.value !== '')
  }

  const form = (
    <>
      <Typography variant='h4' textAlign='left'>
        CREATE AN ACCOUNT
      </Typography>
      <br />
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
                  <span className='display-flex align-items-center column-gap-1'>
                    <i className='fa-solid fa-circle-exclamation' />
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
                  <span className='display-flex align-items-center column-gap-1'>
                    <i className='fa-solid fa-circle-exclamation' />
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
                  <span className='display-flex align-items-center column-gap-1'>
                    <i className='fa-solid fa-circle-exclamation' />
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
                  <span className='display-flex align-items-center column-gap-1'>
                    <i className='fa-solid fa-circle-exclamation' />
                    This field is required
                  </span>
                )
              }
            />
          </div>
        </div>
        <div className='row mb-3'>
          <div className='col'>
            <FormControl fullWidth className='form-control' id='inputPassword'>
              <InputLabel htmlFor='outlined-adornment-password' error={!isPasswordValid && true}>
                Password *
              </InputLabel>
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
                error={!isPasswordValid && true}
              />
              {!isPasswordValid && (
                <span className='errors'>
                  <i className='fa-solid fa-circle-exclamation' />
                  This field is required
                </span>
              )}
              <FormHelperText>
                The password must contain a minimum of 8 characters with at least 1 Uppercase [A-Z] or 1 lowercase
                [a-z], and 1 numeric character [0-9]
              </FormHelperText>
            </FormControl>
          </div>
        </div>
        <div className='d-grid col-2 mx-auto'>
          <Button
            type='button'
            variant='contained'
            style={{ backgroundColor: 'var(--very-peri)' }}
            fullWidth
            onClick={createUser}
          >
            Sign Up
          </Button>
        </div>
      </form>
      <Typography textAlign='center'>
        <br />
        Already have an account?{' '}
        <Link color='inherit' component='button' onClick={handleClickLink} style={{ verticalAlign: 'top' }}>
          Sign in
        </Link>
      </Typography>
    </>
  )

  return (
    <div className='body-form'>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2} className='position-absolute top-50 start-50 translate-middle'>
          <CssBaseline />
          <Grid item xs={6} mx='auto' p={2} component={Paper}>
            {form}
          </Grid>
        </Grid>
      </Box>
    </div>
  )
}

export default Signup
