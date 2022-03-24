import React, { useState } from 'react'
import {
  Box,
  CssBaseline,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
  TextField,
  Paper,
  Grid,
  Button
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import swal from 'sweetalert'
import './css/Signup.css'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import Visibility from '@mui/icons-material/Visibility'

function Signup() {
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const validation = () => {
    if (firstName === '' || lastName === '' || username === '' || password === '' || email === '') {
      return false
    } else {
      return true
    }
  }

  const clearForm = () => {
    setFirstName('')
    setLastName('')
    setUsername('')
    setPassword('')
    setEmail('')
  }

  const createUser = async () => {
    if (validation()) {
      const user = {
        firstName: firstName,
        lastName: lastName,
        username: username,
        password: password,
        email: email
      }
      const response = await fetch('http://localhost:8080/api/users', {
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
          timer: 3000
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

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleMouseDownPassword = (event) => {
    event.preventDefault()
  }

  const form = (
    <>
      <Typography variant='h4' textAlign='center'>
        Create an account
      </Typography>
      <br />
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
            <FormControl fullWidth required className='form-control' id='inputPassword'>
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
                The password must contain 8 characters with at least 1 Uppercase [A-Z], 1 lowercase [a-z], and 1 numeric
                character [0-9]
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
        <a
          className='link-dark a'
          onClick={(e) => {
            e.preventDefault()
            navigate('/login')
          }}
        >
          Sign in
        </a>
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
