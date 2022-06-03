import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import swal from 'sweetalert'
import './Signin.css'

async function loginUser(credentials) {
  return fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  }).then((data) => data.json())
}

function Signin({ onSignin }) {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('username')) {
      setUsername(localStorage.getItem('username'))
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const response = await loginUser({
      username,
      password
    })
    if ('accessToken' in response) {
      swal({
        title: 'Success',
        text:
          response.message[0] >= 'a' && response.message[0] <= 'z'
            ? response.message[0].toLocaleUpperCase() + response.message.substring(1)
            : response.message,
        icon: 'success',
        buttons: false,
        timer: 2000
      })
        .then(() => {
          localStorage.setItem('accessToken', response.accessToken)
        })
        .then(() => {
          onSignin(response.accessToken)
          localStorage.setItem('username', username)
          navigate('/home')
        })
    } else {
      swal({
        title: 'Failed',
        text:
          response.message[0] >= 'a' && response.message[0] <= 'z'
            ? response.message[0].toLocaleUpperCase() + response.message.substring(1)
            : response.message,
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

  return (
    <Grid id='container' container>
      <CssBaseline />
      <Grid item xs={6} md={5} component={Paper}>
        <div id='paper'>
          <Avatar id='avatar-lock'>
            <LockOutlinedIcon />
          </Avatar>
          <Typography variant='h4' component='h2'>
            Sign in
          </Typography>
          <form id='form' noValidate onSubmit={handleSubmit}>
            <TextField
              id='username'
              type='text'
              variant='outlined'
              margin='normal'
              required
              fullWidth
              name='username'
              label='Username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <FormControl id='password' variant='outlined' margin='normal' required fullWidth name='password'>
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
            </FormControl>
            <div className='d-flex justify-content-center'>
              <Button
                id='submit-button'
                type='submit'
                variant='contained'
                style={{ backgroundColor: 'var(--very-peri)' }}
                fullWidth
              >
                Sign In
              </Button>
            </div>
            <Typography textAlign='center'>
              No account?{' '}
              <a
                className='link-dark a'
                onClick={(e) => {
                  e.preventDefault()
                  navigate('/signup')
                }}
              >
                Create one
              </a>
            </Typography>
          </form>
        </div>
      </Grid>
      <Grid id='image' item xs={6} md={7} />
    </Grid>
  )
}

export default Signin
