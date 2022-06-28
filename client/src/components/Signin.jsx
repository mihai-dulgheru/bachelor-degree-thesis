import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import {
  Avatar,
  Button,
  CssBaseline,
  FormControl,
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
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import swal from 'sweetalert'
import ReactGoogleLogin from './ReactGoogleLogin'
import './Signin.css'

const loginUser = async (credentials) => {
  return fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  }).then((data) => data.json())
}

const Signin = ({ onSignin }) => {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [isUsernameValid, setIsUsernameValid] = useState(true)
  const [password, setPassword] = useState('')
  const [isPasswordValid, setIsPasswordValid] = useState(true)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('username')) {
      setUsername(localStorage.getItem('username'))
    }
  }, [])

  const validation = () => {
    setIsUsernameValid(username !== '')
    setIsPasswordValid(password !== '')
    return username !== '' && password !== ''
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validation()) {
      return
    }
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

  const handleClickLink = (event) => {
    event.preventDefault()
    navigate('/signup')
  }

  const handleChangeUsername = (event) => {
    setUsername(event.target.value)
    setIsUsernameValid(event.target.value !== '')
  }

  const handleChangePassword = (event) => {
    setPassword(event.target.value)
    setIsPasswordValid(event.target.value !== '')
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
          <form id='form' noValidate autoComplete='on' onSubmit={handleSubmit}>
            <TextField
              id='username'
              type='text'
              variant='outlined'
              margin='normal'
              fullWidth
              name='username'
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
            <FormControl id='password' variant='outlined' margin='normal' fullWidth name='password'>
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
                  <i className='fa-solid fa-circle-exclamation'></i>This field is required
                </span>
              )}
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
            <div className='pm-awesome-divider' data-label='or'></div>
            <div id='google-auth' className='d-flex justify-content-center'>
              <ReactGoogleLogin onSignin={onSignin} />
            </div>
            <Typography textAlign='center'>
              No account?{' '}
              <Link color='inherit' component='button' onClick={handleClickLink} style={{ verticalAlign: 'top' }}>
                Create one
              </Link>
            </Typography>
          </form>
        </div>
      </Grid>
      <Grid id='image' item xs={6} md={7} />
    </Grid>
  )
}

export default Signin
