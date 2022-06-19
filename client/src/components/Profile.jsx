import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import {
  AppBar,
  Avatar,
  Button,
  Card,
  CardContent,
  IconButton,
  Input,
  Paper,
  Slide,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography
} from '@mui/material'
import MuiAlert from '@mui/material/Alert'
import { styled } from '@mui/material/styles'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import swal from 'sweetalert'
import './Profile.css'

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />
})

const BootstrapButton = styled(Button)({
  display: 'inline-block',
  fontWeight: 400,
  lineHeight: 1.5,
  textAlign: 'center',
  textDecoration: 'none',
  verticalAlign: 'middle',
  cursor: 'pointer',
  webkitUserUelect: 'none',
  mozUserSelect: 'none',
  userSelect: 'none',
  backgroundColor: 'transparent',
  border: '1px solid transparent',
  transition:
    'color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out',
  color: '#dc3545',
  borderColor: '#dc3545',
  padding: '0.5rem 1rem',
  fontSize: '1.25rem',
  borderRadius: '0.3rem',

  boxShadow: 'none',
  textTransform: 'none',
  fontFamily: [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"'
  ].join(','),
  '&:hover': {
    color: '#fff',
    backgroundColor: '#dc3545',
    borderColor: '#dc3545',
    boxShadow: 'none'
  },
  '&:active': {
    color: '#fff',
    backgroundColor: '#dc3545',
    borderColor: '#dc3545',
    boxShadow: 'none'
  },
  '&:focus': {
    boxShadow: '0 0 0 0.25rem rgb(220 53 69 / 50%)'
  }
})

const Profile = () => {
  const navigate = useNavigate()
  const tempAccessToken = localStorage.getItem('accessToken')
  const [accessToken, setAccessToken] = useState('')
  const [user, setUser] = useState({})
  const [state, setState] = useState({
    open: false,
    vertical: 'bottom',
    horizontal: 'center',
    transition: function (props) {
      return <Slide {...props} direction='up' />
    },
    message: 'Profile photo updated!'
  })
  const { vertical, horizontal, open, transition, message } = state

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
        setUser(data.user)
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

  const handleBack = () => {
    navigate('/home')
  }

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    navigate('/login')
  }

  const toDataURL = (url) =>
    fetch(url)
      .then((response) => response.blob())
      .then(
        (blob) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result)
            reader.onerror = reject
            reader.readAsDataURL(blob)
          })
      )

  const handleChange = (e) => {
    if (e.target.files.length) {
      toDataURL(URL.createObjectURL(e.target.files[0])).then((dataUrl) => {
        updateUser({ ...user, avatar: dataUrl })
      })
    }
  }

  const handleClose = () => {
    setState({ ...state, open: false })
  }

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
      setUser(data.user)
      setState({ ...state, open: true })
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

  const deleteUser = async () => {
    swal({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this account!',
      icon: 'warning',
      buttons: true,
      dangerMode: true
    }).then(async (willDelete) => {
      if (willDelete) {
        const response = await fetch('/api/auth/user', {
          method: 'DELETE',
          headers: {
            authorization: accessToken
          }
        })
        const data = await response.json()
        if (data.status === 'ok') {
          swal('Your account has been deleted!', {
            icon: 'success',
            buttons: false,
            timer: 2000
          }).then(() => {
            localStorage.removeItem('username')
            handleLogout()
          })
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
    })
  }

  function createData(property, value) {
    return { property, value }
  }

  const rowsPersonalInfoCard = [
    createData('First Name', user.firstName),
    createData('Last Name', user.lastName),
    createData('Username', user.username),
    createData('E-mail', user.email)
  ]

  const rowsOtherInfoCard = [
    createData('Supplier', user.supplier ? user.supplier : '-'),
    createData('County', user.county ? user.county : '-'),
    createData('Voltage Level', user.voltageLevel ? user.voltageLevel : 0),
    createData('Budget', user.budget ? user.budget : 0),
    createData('Invoice Unit Value', user.invoiceUnitValue ? user.invoiceUnitValue : 0)
  ]

  const appBar = (
    <AppBar position='static' style={{ backgroundColor: 'var(--very-peri)' }}>
      <Toolbar>
        <IconButton onClick={handleBack} color='inherit'>
          <ArrowBackIosNewIcon />
        </IconButton>
        <Typography variant='h6' className='title'>
          Profile
        </Typography>
        <Button
          onClick={handleLogout}
          variant='outlined'
          color='inherit'
          size='medium'
          endIcon={<i className='fa-solid fa-arrow-right-from-bracket'></i>}
        >
          Sign Out{' '}
        </Button>
      </Toolbar>
    </AppBar>
  )

  const photoCard = (
    <Card className='root' variant='outlined'>
      <CardContent>
        <div className='centred'>
          <div>
            <CardContent>
              <div className='container'>
                {user.avatar ? <Avatar id='avatar-profile' src={user.avatar} /> : <Avatar id='avatar-profile' />}
                <label id='label-avatar' htmlFor='upload-button'>
                  <Input
                    accept='image/*'
                    id='upload-button'
                    type='file'
                    style={{ display: 'none' }}
                    onChange={handleChange}
                  />
                  <div className='overlay'>
                    <i className='fa-solid fa-upload icon'></i>
                  </div>
                </label>
              </div>
            </CardContent>
          </div>
          <div>
            <Typography variant='h5'>
              Welcome, {user.firstName} {user.lastName}!
            </Typography>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const personalInfoCard = (
    <Card>
      <CardContent>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell colSpan={1} width='50%'>
                  Personal Information
                </TableCell>
                <TableCell align='right'>
                  <Button
                    variant='outlined'
                    color='primary'
                    size='medium'
                    onClick={() => navigate('/edit-personal-information')}
                    style={{ minWidth: '10%' }}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rowsPersonalInfoCard.map((row, index) => (
                <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component='th' scope='row'>
                    {row.property}
                  </TableCell>
                  <TableCell align='left'>{row.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  )

  const otherInfoCard = (
    <Card>
      <CardContent>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell colSpan={1} width='50%'>
                  Other Information
                </TableCell>
                <TableCell align='right'>
                  <Button
                    variant='outlined'
                    color='primary'
                    size='medium'
                    onClick={() => navigate('/edit-other-information')}
                    style={{ minWidth: '10%' }}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rowsOtherInfoCard.map((row, index) => (
                <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component='th' scope='row'>
                    {row.property}
                  </TableCell>
                  <TableCell align='left'>{row.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  )

  const deleteAccountCard = (
    <Card>
      <CardContent>
        <Stack direction='row' justifyContent='center' alignItems='center'>
          <BootstrapButton
            variant='outlined'
            color='error'
            size='medium'
            onClick={deleteUser}
            className='text-uppercase'
          >
            Delete account
          </BootstrapButton>
        </Stack>
      </CardContent>
    </Card>
  )

  const snackbar = (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        TransitionComponent={transition}
      >
        <Alert onClose={handleClose} severity='success' spacing={2} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </Stack>
  )

  return (
    <div className='root'>
      {appBar}
      {photoCard}
      {personalInfoCard}
      {otherInfoCard}
      {deleteAccountCard}
      {snackbar}
    </div>
  )
}

export default Profile
