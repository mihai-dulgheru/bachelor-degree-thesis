import { Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import swal from 'sweetalert'
import {
  convertkWhToCO2,
  convertkWhToCoal,
  convertkWhToRON,
  convertkWhToTrees
} from '../functions/conversion-functions'
import co2EmissionsIcon from '../media/images/co2-emissions-icon.jpg'
import coalIcon from '../media/images/coal-icon.jpg'
import moneyIcon from '../media/images/money.png'
import treeIcon from '../media/images/tree-icon-vector.jpg'
import CustomAppBar from './CustomAppBar'
import CustomCard from './CustomCard'
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

  const awards = [
    {
      iconSrc: moneyIcon,
      altText: 'money icon',
      heading: 'Saved money',
      value: amountSaved,
      um: 'RON'
    },
    {
      iconSrc: co2EmissionsIcon,
      altText: 'co2 emissions icon',
      heading: 'CO2 emissions',
      value: convertkWhToCO2(totalkWh),
      um: 'kg'
    },
    {
      iconSrc: coalIcon,
      altText: 'coal icon',
      heading: 'Coal',
      value: convertkWhToCoal(totalkWh),
      um: 'kg'
    },
    {
      iconSrc: treeIcon,
      altText: 'tree icon',
      heading: 'Saved trees',
      value: convertkWhToTrees(totalkWh),
      um: ''
    }
  ]

  return (
    <div>
      <CustomAppBar user={user} selectedAppBarItem={'Prizes'} />
      <div>
        <Typography id='awards-title' variant='h2'>
          You have saved <span id='span-energy'>{totalkWh} kWh</span> of energy. The equivalent of:
        </Typography>
        <div className='center'>
          <div id='cards-container'>
            {awards.map((item) => (
              <CustomCard key={item.heading} {...item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Prizes
