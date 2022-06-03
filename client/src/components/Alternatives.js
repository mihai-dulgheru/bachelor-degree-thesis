import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import {
  AppBar,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography
} from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'
import ReactLoading from 'react-loading'
import { useNavigate, useParams } from 'react-router-dom'
import swal from 'sweetalert'
import LoadingScreen from './LoadingScreen'

function Alternatives() {
  const navigate = useNavigate()
  const { deviceId } = useParams()
  const [device, setDevice] = useState({})
  const [budget, setBudget] = useState(0)
  const [alternatives, setAlternatives] = useState([])
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadingDeviceSpecifications, setLoadingDeviceSpecifications] = useState(false)

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
    async function fetchData() {
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
  }, [])

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
  }, [budget])

  const handleBack = () => {
    navigate(-1)
  }

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
          .sort(function (a, b) {
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
      setTimeout(() => setLoading(false), 3000)
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

  // * Setare alternative
  useEffect(() => {
    if (url) {
      getAlternatives()
    }
  }, [url])

  const appBar = (
    <AppBar position='static' style={{ backgroundColor: 'var(--very-peri)' }}>
      <Toolbar>
        <IconButton onClick={handleBack} color='inherit'>
          <ArrowBackIosIcon />
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
        setLoadingDeviceSpecifications(false)
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
                <a className='link-primary' href={`${element.link}`}>
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

  return (
    <div>
      {loading ? (
        <LoadingScreen />
      ) : (
        <>
          {loadingDeviceSpecifications ? (
            <>
              <div className='position-absolute top-50 start-50 translate-middle'>
                <ReactLoading type='spinningBubbles' color='var(--very-peri)' height={100} width={100} />
              </div>
            </>
          ) : (
            <></>
          )}
          {appBar}
          <Box sx={{ width: '90%', margin: '16px auto 0px auto' }}>
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
    </div>
  )
}

export default Alternatives
