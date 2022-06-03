import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import swal from 'sweetalert'
import {
  convertkWhToCO2,
  convertkWhToCoal,
  convertkWhToRON,
  convertkWhToTrees
} from '../functions/conversion-functions'
import CustomAppBar from './CustomAppBar'

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
    const response = await fetch('/api/auth/prizes', {
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
      {prizes.map((item, index) => (
        <p key={index}>{`prizeType: ${item.prizeType}, prizeValue: ${item.prizeValue}`}</p>
      ))}
      <p>{'Total kWh: ' + totalkWh}</p>
      <p>{'Total RON: ' + amountSaved}</p>
      <p>{'Total kg CO2: ' + convertkWhToCO2(totalkWh)}</p>
      <p>{'Total kg coal: ' + convertkWhToCoal(totalkWh)}</p>
      <p>{'Total saved trees: ' + convertkWhToTrees(totalkWh)}</p>
    </div>
  )
}

export default Prizes
