import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton'
import LogoutIcon from '@mui/icons-material/Logout'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { Input } from '@mui/material'
import './css/Profile.css'
import swal from 'sweetalert'
import { styled } from '@mui/material/styles'
import Stack from '@mui/material/Stack'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'
import Slide from '@mui/material/Slide'

const Alert = React.forwardRef(function Alert (props, ref) {
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

function Profile () {
  const navigate = useNavigate()
  const [accessToken, setAccessToken] = useState('')
  const [user, setUser] = useState({})
  const tempAccessToken = localStorage.getItem('accessToken')
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
    getUser()
  }, [])

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

  const getUser = async () => {
    const response = await fetch('http://localhost:8080/api/auth/user', {
      method: 'GET',
      headers: {
        authorization: localStorage.getItem('accessToken')
      }
    })
    const data = await response.json()
    if (data.status === 'ok') {
      setUser(data.user)
    } else {
      swal('Failed', data.message, 'error').then((value) => {
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
      setUser(data.user)
      setState({ ...state, open: true })
    } else {
      swal('Failed', data.message, 'error').then((value) => {
        navigate('/login')
      })
    }
  }

  const deleteUser = async () => {
    const response = await fetch('http://localhost:8080/api/auth/user', {
      method: 'DELETE',
      headers: {
        authorization: accessToken
      }
    })
    const data = await response.json()
    if (data.status === 'ok') {
      swal('Success', data.message, 'success').then((value) => {
        handleLogout()
      })
    } else {
      swal('Failed', data.message, 'error').then((value) => {
        navigate('/login')
      })
    }
  }

  function createData (property, value) {
    return { property, value }
  }

  const rowsPersonalInfoCard = [
    createData('First Name', user.firstName),
    createData('Last Name', user.lastName),
    createData('Username', user.username),
    createData('E-mail', user.email)
  ]

  const rowsOtherInfoCard = [
    createData('Supplier', user.supplier),
    createData('County', user.county),
    createData('Voltage Level', user.voltageLevel),
    createData('Budget', user.budget),
    createData('Invoice Unit Value', user.invoiceUnitValue)
  ]

  const appBar = (
    <AppBar position='static'>
      <Toolbar>
        <IconButton onClick={handleBack} aria-label='back' color='inherit'>
          <ArrowBackIosIcon />
        </IconButton>
        <Typography variant='h6' className='title'>
          Profile
        </Typography>
        <Button onClick={handleLogout} variant='outlined' color='inherit' size='medium' startIcon={<LogoutIcon />}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  )

  const photoCard = (
    <Card className='root' variant='outlined'>
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
                  <FileUploadIcon className='icon' fontSize='large' />
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
    </Card>
  )

  const personalInfoCard = (
    <Card>
      <CardContent>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label='simple table'>
            <TableHead>
              <TableRow>
                <TableCell colSpan={1}>Personal Information</TableCell>
                <TableCell align='right'>
                  <Button variant='contained' size='medium' onClick={() => navigate('/edit-personal-information')}>
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
          <Table sx={{ minWidth: 650 }} aria-label='simple table'>
            <TableHead>
              <TableRow>
                <TableCell colSpan={1}>Other Information</TableCell>
                <TableCell align='right'>
                  <Button variant='contained' size='medium' onClick={() => navigate('/edit-other-information')}>
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
          <BootstrapButton variant='outlined' color='error' size='medium' onClick={deleteUser}>
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
