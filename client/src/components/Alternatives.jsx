import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import {
  AppBar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Typography
} from '@mui/material'
import { Box } from '@mui/system'
import { useEffect, useState } from 'react'
import ReactLoading from 'react-loading'
import { useNavigate, useParams } from 'react-router-dom'
import swal from 'sweetalert'
import './Alternatives.css'
import LoadingScreen from './LoadingScreen'

const Alternatives = () => {
  const navigate = useNavigate()
  const { deviceId } = useParams()
  const [device, setDevice] = useState({})
  const [budget, setBudget] = useState(true)
  const [alternatives, setAlternatives] = useState([])
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadingDeviceSpecifications, setLoadingDeviceSpecifications] = useState(false)
  const [open, setOpen] = useState(true)
  const [inputBudget, setInputBudget] = useState('')
  const [error, setError] = useState(false)

  const updateUser = async (user) => {
    const response = await fetch('/api/auth/user', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        authorization: localStorage.getItem('accessToken')
      },
      body: JSON.stringify(user)
    })
    const data = await response.json()
    if (data.status === 'ok') {
      setBudget(data.user.budget)
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

  const updateDevice = async (device) => {
    const response = await fetch(`/api/auth/user/devices/${deviceId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        authorization: localStorage.getItem('accessToken')
      },
      body: JSON.stringify(device)
    })
    const data = await response.json()
    if (data.status !== 'ok') {
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

  const addPrize = async (prize) => {
    const response = await fetch('/api/auth/user/prizes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: localStorage.getItem('accessToken')
      },
      body: JSON.stringify(prize)
    })
    const data = await response.json()
    if (data.status !== 'ok') {
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
    // * Setare dispozitiv si buget
    const fetchData = async () => {
      let response = await fetch(`/api/auth/user/devices/${deviceId}`, {
        method: 'GET',
        headers: {
          authorization: localStorage.getItem('accessToken')
        }
      })
      let data = await response.json()
      if (data.status === 'ok') {
        setDevice(data.device)
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
      response = await fetch('/api/auth/user', {
        method: 'GET',
        headers: {
          authorization: localStorage.getItem('accessToken')
        }
      })
      data = await response.json()
      if (data.status === 'ok') {
        setBudget(data.user.budget ? data.user.budget : 0)
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
    fetchData()
  }, [deviceId, navigate])

  // * Setare url
  useEffect(() => {
    setUrl(
      `https://www.emag.ro/search/stoc/pret,intre-0-si-${budget}/${
        device.category &&
        device.category
          .trim()
          .toLocaleLowerCase()
          .replaceAll(' ', '+')
          .replaceAll('ă', 'a')
          .replaceAll('î', 'i')
          .replaceAll('â', 'a')
          .replaceAll('ş', 's')
          .replaceAll('ș', 's')
          .replaceAll('ț', 't')
          .replaceAll(',', '%2C')
          .replaceAll('(', '%28')
          .replaceAll(')', '%29')
      }/c`
    )
  }, [budget, device.category])

  const handleBack = () => {
    navigate(-1)
  }

  // * Setare alternative
  useEffect(() => {
    const getAlternatives = async () => {
      const response = await fetch(`/alternatives/?url=${url}`, {
        method: 'GET'
      })
      const data = await response.json()
      if (data.status === 'ok') {
        setAlternatives(
          data.data
            .filter((element) => {
              return element && element.price <= budget
            })
            .sort((a, b) => {
              const priceA = a.price
              const priceB = b.price
              if (priceA < priceB) {
                return 1
              }
              if (priceA > priceB) {
                return -1
              }
              return 0
            })
        )
        setTimeout(() => {
          setLoading(false)
          setLoadingDeviceSpecifications(false)
        }, 3000)
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
        })
      }
    }

    if (url) {
      getAlternatives()
    }
  }, [budget, url])

  const appBar = (
    <AppBar position='static' style={{ backgroundColor: 'var(--very-peri)' }}>
      <Toolbar>
        <IconButton onClick={handleBack} color='inherit'>
          <ArrowBackIosNewIcon />
        </IconButton>
        <Typography variant='h6' className='title'>
          Alternatives
        </Typography>
      </Toolbar>
    </AppBar>
  )

  const calculatePrize = async (newDevice) => {
    const prize = {
      prizeType: 'SAVED_ENERGY',
      prizeValue: 0
    }
    if (newDevice.energyConsumption < device.energyConsumption) {
      prize.prizeValue = device.energyConsumption - newDevice.energyConsumption
      await addPrize(prize)
    }
    return prize
  }

  const handleChoose = async (element) => {
    setLoadingDeviceSpecifications(true)
    const response = await fetch(`/alternatives/one/?url=${element.link}`, {
      method: 'GET'
    })
    const data = await response.json()
    setLoadingDeviceSpecifications(false)
    if (data.status === 'ok') {
      if (!data.data.energyConsumption || !data.data.unitMeasurement) {
        swal({
          title: 'Failed',
          text: 'You cannot choose this device!',
          icon: 'error',
          button: {
            text: 'OK',
            value: true,
            visible: true,
            closeModal: true
          }
        })
      } else {
        await updateUser({ budget: Math.trunc(budget - element.price) })
        await updateDevice(data.data)
        const prize = await calculatePrize(data.data)
        swal({
          title: 'Success',
          text:
            'The device has been added to your list! You have won the following awards:\n\r' +
            `${prize.prizeType.replace('_', ' ')}: ${prize.prizeValue} ${data.data.unitMeasurement}`,
          icon: 'success',
          button: {
            text: 'OK',
            value: true,
            visible: true,
            closeModal: true
          }
        }).then(() => {
          navigate('/device-list')
        })
      }
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
      })
    }
  }

  const table = (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell align='left'>No.</TableCell>
            <TableCell align='center'>Name</TableCell>
            <TableCell align='right'>Price&nbsp;(RON)</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {alternatives.map((element, index) => (
            <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell align='center'>{`${index + 1}.`}</TableCell>
              <TableCell align='left'>{element.name}</TableCell>
              <TableCell align='right'>{element.price}</TableCell>
              <TableCell className='d-flex flex-row gap-3 justify-content-around align-items-center'>
                <a className='link-primary' target={'_blank'} rel={'noreferrer'} href={`${element.link}`}>
                  Check!
                </a>
                <button className='btn btn-outline-secondary' onClick={() => handleChoose(element)}>
                  Choose!
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )

  const handleChangeInputBudget = (event) => {
    const regExp = /^[1-9][0-9]*$/
    if (event.target.value === '' || regExp.test(event.target.value)) {
      setInputBudget(event.target.value)
      setError(false)
    }
  }

  const handleOK = () => {
    if (inputBudget) {
      setOpen(false)
      updateUser({
        budget: parseInt(inputBudget)
      }).then(() => {
        setLoading(true)
        setBudget(parseInt(inputBudget))
      })
    } else {
      setError(true)
    }
  }

  const dialog = (
    <div>
      <Dialog open={open}>
        <DialogTitle>{'Please enter the amount of your budget'}</DialogTitle>
        <DialogContent className='dialog-content'>
          <TextField
            autoFocus
            margin='dense'
            label='Budget'
            type='text'
            fullWidth
            variant='standard'
            value={inputBudget}
            onChange={handleChangeInputBudget}
          />
          <DialogContentText
            className={'dialog-content-text'}
            style={error ? { display: 'contents', color: 'rgba(255, 0, 0, 0.8)' } : {}}
          >
            Please enter a value
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOK}>OK</Button>
        </DialogActions>
      </Dialog>
    </div>
  )

  return (
    <div className='alternatives-container'>
      {loadingDeviceSpecifications && (
        <div className='position-absolute top-50 start-50 translate-middle'>
          <ReactLoading type='spinningBubbles' color='var(--very-peri)' height={100} width={100} />
        </div>
      )}
      {!budget ? (
        dialog
      ) : (
        <>
          {loading ? (
            <LoadingScreen />
          ) : (
            <>
              {appBar}
              <Box sx={{ width: '90%', margin: '1rem auto 0px auto' }}>
                <Paper sx={{ width: '100%', mb: 2, p: 2 }}>
                  <Typography variant='h4' gutterBottom component='div'>
                    Alternatives for device
                  </Typography>
                  <Typography variant='subtitle1' gutterBottom component='div'>
                    {`${device.category}, Energy efficiency class: ${device.efficiencyClass}, Energy consumption: ${device.energyConsumption} ${device.unitMeasurement}`}
                  </Typography>
                  <Typography variant='subtitle1' gutterBottom component='div'>
                    {`Budget: ${budget} RON`}
                  </Typography>
                  {table}
                </Paper>
              </Box>
            </>
          )}
        </>
      )}
    </div>
  )
}

export default Alternatives
