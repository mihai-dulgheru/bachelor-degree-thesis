import { AppBar, IconButton, Paper, Toolbar, Typography } from '@mui/material'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import swal from 'sweetalert'
import { Box } from '@mui/system'

function Alternatives() {
  const navigate = useNavigate()
  const { deviceId } = useParams()
  const [device, setDevice] = useState({})
  const [budget, setBudget] = useState(0)

  useEffect(async () => {
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
  }, [])

  const handleBack = () => {
    navigate(-1)
  }

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

  const URL = `https://www.emag.ro/search/stoc/pret,intre-0-si-${budget}/${
    device.category
      ? device.category
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
      : ''
  }/c`

  return (
    <div>
      {appBar}
      <Box sx={{ width: '90%', margin: '16px auto 0px auto' }}>
        <Paper sx={{ width: '100%', mb: 2, p: 2 }}>
          <Typography variant='h4' gutterBottom component='div'>
            Alternatives for device
          </Typography>
          <Typography variant='subtitle1' gutterBottom component='div'>
            {`${device.category}, Energy efficiency class: ${device.efficiencyClass}, Energy consumption: ${device.energyConsumption} ${device.unitMeasurement}`}
          </Typography>
          <a
            href={URL}
            onClick={async (e) => {
              e.preventDefault()
              let response = await fetch(URL, {
                headers: {
                  'Access-Control-Allow-Origin': '*',
                  'Access-Control-Allow-Credentials': 'true',
                  'Access-Control-Allow-Methods': '*',
                  'Access-Control-Allow-Headers': '*'
                }
              })
              let data = await response.json()
              console.log(data)
            }}
          >
            {URL}
          </a>
        </Paper>
      </Box>
    </div>
  )
}

export default Alternatives
