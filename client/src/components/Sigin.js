import React, { useState } from 'react'
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
  const [username, setUsername] = useState('dulgherumihai19')
  const [password, setPassword] = useState('Password123!')

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
              defaultValue='dulgherumihai19'
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              id='password'
              type='password'
              variant='outlined'
              margin='normal'
              required
              fullWidth
              name='password'
              label='Password'
              defaultValue='Password123!'
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button id='submit-button' type='submit' fullWidth variant='contained' color='primary'>
              Sign In
            </Button>
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
