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
import { LoadingScreen } from '..'
import {
  convertkWhToCO2,
  convertkWhToCoal,
  convertkWhToRON,
  convertkWhToTrees,
  getEstimatedConsumptionPerYear
} from '../../functions'
import './Alternatives.css'

const fractionDigits = 1

const Alternatives = () => {
  const navigate = useNavigate()
  const { deviceId } = useParams()
  const [alternatives, setAlternatives] = useState([])
  const [budget, setBudget] = useState(true)
  const [county, setCounty] = useState('')
  const [device, setDevice] = useState({})
  const [error, setError] = useState(false)
  const [inputBudget, setInputBudget] = useState('')
  const [invoiceUnitValue, setInvoiceUnitValue] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingDeviceSpecifications, setLoadingDeviceSpecifications] = useState(false)
  const [open, setOpen] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const value = {}

      let response = await fetch(`/api/auth/user/devices/${deviceId}`, {
        method: 'GET',
        headers: {
          authorization: localStorage.getItem('accessToken')
        }
      })
      let data = await response.json()
      if (data.status === 'ok') {
        setDevice(data.device)
        value.category = data.device.category
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
        setBudget(data.user.budget || 0)
        setInvoiceUnitValue(data.user.invoiceUnitValue && data.user.invoiceUnitValue)
        setCounty(data.user.county && data.user.county)
        value.budget = data.user.budget || 0
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

      return value
    }

    fetchData()
      .then((value) => {
        return {
          url: `https://www.emag.ro/search/stoc/pret,intre-0-si-${value.budget}/${
            value.category &&
            value.category
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
          }`,
          budget: value.budget
        }
      })
      .then(async (value) => {
        const response = await fetch(`/alternatives/?url=${value.url}`, {
          method: 'GET'
        })
        const data = await response.json()
        if (data.status === 'ok') {
          const alternatives = data.data
            .filter((element) => {
              return element && element.price <= value.budget
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
          setAlternatives(alternatives)
          setLoading(false)
          setLoadingDeviceSpecifications(false)
        } else {
          swal({
            title: 'Failed',
            text: data.message
              ? data.message[0] >= 'a' && data.message[0] <= 'z'
                ? data.message[0].toLocaleUpperCase() + data.message.substring(1)
                : data.message
              : 'Error: net::ERR_SOCKET_NOT_CONNECTED',
            icon: 'error',
            button: {
              text: 'OK',
              value: true,
              visible: true,
              closeModal: true
            }
          })
        }
      })
  }, [deviceId, navigate])

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

  const calculatePrize = async (newDevice) => {
    const prize = {
      prizeType: 'SAVED_ENERGY',
      prizeValue: 0
    }
    const oldEstimatedConsumptionkWhPerYear = getEstimatedConsumptionPerYear(device)
    const newEstimatedConsumptionkWhPerYear = getEstimatedConsumptionPerYear({
      ...newDevice,
      noOperatingHours: device.noOperatingHours
    })
    if (newEstimatedConsumptionkWhPerYear < oldEstimatedConsumptionkWhPerYear) {
      prize.prizeValue = (oldEstimatedConsumptionkWhPerYear - newEstimatedConsumptionkWhPerYear).toFixed(fractionDigits)
      await addPrize(prize)
    }
    return prize
  }

  const handleBack = () => {
    navigate(-1)
  }

  const handleChoose = async (element) => {
    setLoadingDeviceSpecifications(true)
    const response = await fetch(`/alternatives/one/?url=${element.link}`, {
      method: 'GET'
    })
    const data = await response.json()
    if (data.status === 'ok') {
      if (data.data.energyConsumption && data.data.unitMeasurement) {
        await updateDevice(data.data)
        const prize = await calculatePrize(data.data)
        await updateUser({ budget: Math.trunc(budget - element.price) })
        const newLine = '\n\r'
        swal({
          title: 'Success',
          text:
            'The device has been added to your list! ' +
            (prize.prizeValue > 0
              ? 'You have won the following awards:' +
                `${newLine}SAVED ENERGY: ${prize.prizeValue} kWh/annum` +
                `${newLine}MONEY SAVED: ${convertkWhToRON(prize.prizeValue, invoiceUnitValue, county)} RON` +
                `${newLine}REDUCED CARBON DIOXIDE: ${convertkWhToCO2(prize.prizeValue)} KG` +
                `${newLine}BITUMINOUS COAL SAVED: ${convertkWhToCoal(prize.prizeValue)} KG` +
                `${newLine}REDUCING DEFORESTATION: ${convertkWhToTrees(prize.prizeValue)} Tree`
              : "Unfortunately, you didn't win any awards."),
          icon: 'success',
          button: {
            text: 'OK',
            value: true,
            visible: true,
            closeModal: true
          }
        }).then(() => {
          setLoadingDeviceSpecifications(false)
          handleBack()
        })
      } else {
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
        }).then(() => {
          setLoadingDeviceSpecifications(false)
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
                <a className='link-primary' target='_blank' rel='noreferrer' href={`${element.link}`}>
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

  const dialog = (
    <div>
      <Dialog open={open}>
        <DialogTitle>Please enter the amount of your budget</DialogTitle>
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
            autoComplete='off'
          />
          <DialogContentText
            className='dialog-content-text'
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
        <div className='position-fixed top-50 start-50 translate-middle'>
          <ReactLoading type='spinningBubbles' color='var(--very-peri)' height={100} width={100} />
        </div>
      )}
      {budget
        ? (
          <>
            {loading
              ? (
                <LoadingScreen />
                )
              : (
                <>
                  {appBar}
                  <Box sx={{ width: '90%', margin: '1rem auto 0 auto' }}>
                    <Paper sx={{ width: '100%', mb: 2, p: 2 }}>
                      <Typography variant='h4' gutterBottom component='div'>
                        Alternatives for device
                      </Typography>
                      <Typography variant='h5' gutterBottom component='div'>
                        {`${device.category}${
                      device.efficiencyClass ? `, Energy efficiency class: ${device.efficiencyClass}` : ''
                    }, Energy consumption: ${device.energyConsumption} ${device.unitMeasurement}`}
                      </Typography>
                      {table}
                    </Paper>
                  </Box>
                </>
                )}
          </>
          )
        : (
            dialog
          )}
    </div>
  )
}

export default Alternatives
