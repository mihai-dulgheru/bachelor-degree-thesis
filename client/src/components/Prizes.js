import { Card, CardContent, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import swal from 'sweetalert'
import {
  convertkWhToCO2,
  convertkWhToCoal,
  convertkWhToRON,
  convertkWhToTrees
} from '../functions/conversion-functions'
import energySymbol from '../media/images/Energy-Symbol-Background-PNG.png'
import euroCoin from '../media/images/euro-coin.jpg'
import CustomAppBar from './CustomAppBar'
import './Prizes.css'

function Prizes() {
  const navigate = useNavigate()
  const [user, setUser] = useState({})
  const [prizes, setPrizes] = useState([])
  const [totalkWh, setTotalkWh] = useState(0)
  const [invoiceUnitValue, setInvoiceUnitValue] = useState(0)
  const [county, setCounty] = useState('')
  const [amountSaved, setAmountSaved] = useState(0)

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
      setInvoiceUnitValue(data.user.invoiceUnitValue && data.user.invoiceUnitValue)
      setCounty(data.user.county && data.user.county)
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

  const getPrizes = async () => {
    const response = await fetch('/api/auth/user/prizes', {
      method: 'GET',
      headers: {
        authorization: localStorage.getItem('accessToken')
      }
    })
    const data = await response.json()
    if (data.status === 'ok') {
      setPrizes(data.prizes)
      setTotalkWh(
        data.prizes
          .map((item) => parseFloat(item.prizeValue))
          .reduce((previous, current) => {
            return previous + current
          }, 0)
      )
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

  useEffect(() => {
    getUser()
    getPrizes()
  }, [])

  useEffect(() => {
    setAmountSaved(convertkWhToRON(totalkWh, invoiceUnitValue, county))
  }, [totalkWh, invoiceUnitValue, county])

  return (
    <div>
      <CustomAppBar user={user} selectedAppBarItem={'Prizes'} />
      {/* {prizes.map((item, index) => (
        <p key={index}>{`prizeType: ${item.prizeType}, prizeValue: ${item.prizeValue}`}</p>
      ))} */}
      {/* <p>{'Total kWh: ' + totalkWh}</p> */}
      {/* <p>{'Total RON: ' + amountSaved}</p> */}
      <p>{'Total kg CO2: ' + convertkWhToCO2(totalkWh)}</p>
      <p>{'Total kg coal: ' + convertkWhToCoal(totalkWh)}</p>
      <p>{'Total saved trees: ' + convertkWhToTrees(totalkWh)}</p>

      <div className='cards-container'>
        <Card sx={{ maxWidth: '50vw', maxHeight: '50vh' }}>
          <div className='display-flex flex-direction-row'>
            <img className='card-media' src={energySymbol} alt='energy symbol' />
            <CardContent className='card-content'>
              <Typography gutterBottom variant='h2'>
                {'Saved energy'}
              </Typography>
              <Typography variant='h4' color='text.secondary'>
                {totalkWh + ' kWh'}
              </Typography>
            </CardContent>
          </div>
        </Card>
        <Card sx={{ maxWidth: '50vw', maxHeight: '50vh' }}>
          <div className='display-flex flex-direction-row'>
            <img className='card-media' src={euroCoin} alt='euro coin' />
            <CardContent className='card-content'>
              <Typography gutterBottom variant='h2'>
                {'Saved money'}
              </Typography>
              <Typography variant='h4' color='text.secondary'>
                {amountSaved + ' RON'}
              </Typography>
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Prizes
