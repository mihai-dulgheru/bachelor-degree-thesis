import React, { useState } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import { CssBaseline, Slide, Stack, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import swal from 'sweetalert'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'
import './css/Signup.css'

const Alert = React.forwardRef(function Alert (props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />
})

function Signup () {
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [state, setState] = useState({
    open: false,
    vertical: 'bottom',
    horizontal: 'center',
    transition: function (props) {
      return <Slide {...props} direction='up' />
    },
    message: 'User created!'
  })
  const { vertical, horizontal, open, transition, message } = state

  const handleClose = () => {
    setState({ ...state, open: false })
  }

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
        // setState({ ...state, open: true })
        // setTimeout(() => {
        //   navigate('/login')
        // }, 2000)
        swal('Success', 'User created!', 'success', {
          buttons: false,
          timer: 2000
        }).then(() => {
          navigate('/login')
        })
      } else {
        swal('Failed', data.errors[0].message, 'error')
      }
    } else {
      swal('Failed', 'Fill in all the required fields!', 'error')
    }
  }

  const snackbar = (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        autoHideDuration={2000}
        onClose={handleClose}
        TransitionComponent={transition}
      >
        <Alert onClose={handleClose} severity='success' spacing={2} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </Stack>
  )

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
            <TextField
              fullWidth
              required
              type='password'
              className='form-control'
              id='inputPassword'
              label='Password'
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              helperText='The password must contain 8 characters with at least 1 Uppercase [A-Z], 1 lowercase [a-z], and 1 numeric character [0-9]'
            />
          </div>
        </div>
        <div className='d-grid col-2 mx-auto'>
          <button className='btn btn-outline-primary' type='button' onClick={createUser}>
            Sign Up
          </button>
        </div>
      </form>
      <Typography textAlign='center'>
        <br />
        Already have an account?{' '}
        <a
          href='#'
          className='link-dark'
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
      {snackbar}
    </div>
  )
}

export default Signup
