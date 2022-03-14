import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import Grid from '@mui/material/Grid'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Paper from '@mui/material/Paper'
import swal from 'sweetalert'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import './css/Signin.css'
import { FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput } from '@mui/material'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import Visibility from '@mui/icons-material/Visibility'

async function loginUser (credentials) {
  return fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  }).then((data) => data.json())
}

function Signin (props) {
  const { onSignin } = props
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
      swal('Success', response.message, 'success', {
        buttons: false,
        timer: 2000
      })
        .then((value) => {
          localStorage.setItem('accessToken', response.accessToken)
        })
        .then((value) => {
          onSignin(response.accessToken)
          navigate('/home')
        })
    } else {
      swal('Failed', response.message, 'error')
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
                    <IconButton
                      aria-label='toggle password visibility'
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge='end'
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label='Password'
              />
            </FormControl>
            <div className='d-flex justify-content-center'>
              <Button id='submit-button' type='submit' variant='contained' color='primary' fullWidth>
                Sign In
              </Button>
              {/* <button id='submit-button' type='submit' className='btn btn-primary text-uppercase w-100'>
                Sign In
              </button> */}
            </div>
            <Typography textAlign='center'>
              No account?{' '}
              <a
                href='#'
                className='link-dark'
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
