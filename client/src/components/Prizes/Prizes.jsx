import { Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import swal from 'sweetalert'
import { CustomAppBar, CustomCard } from '..'
import { convertkWhToCO2, convertkWhToCoal, convertkWhToRON, convertkWhToTrees } from '../../functions'
import { co2Icon, coalIcon, moneyIcon, treeIcon } from '../../images'
import './Prizes.css'

const fractionDigits = 1

const Prizes = () => {
  const navigate = useNavigate()
  const [amountSaved, setAmountSaved] = useState(0)
  const [totalkWhPerYear, setTotalkWhPerYear] = useState(0)
  const [user, setUser] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      const value = {}

      let response = await fetch('/api/auth/user', {
        method: 'GET',
        headers: {
          authorization: localStorage.getItem('accessToken')
        }
      })
      let data = await response.json()
      if (data.status === 'ok') {
        setUser(data.user)
        value.invoiceUnitValue = data.user.invoiceUnitValue && data.user.invoiceUnitValue
        value.county = data.user.county && data.user.county
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

      response = await fetch('/api/auth/user/prizes', {
        method: 'GET',
        headers: {
          authorization: localStorage.getItem('accessToken')
        }
      })
      data = await response.json()
      if (data.status === 'ok') {
        const totalkWhPerYear = data.prizes
          .map((item) => parseFloat(item.prizeValue))
          .reduce((previous, current) => {
            return previous + current
          }, 0)
          .toFixed(fractionDigits)
        setTotalkWhPerYear(totalkWhPerYear)
        value.totalkWhPerYear = totalkWhPerYear
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

      return value
    }

    fetchData().then((value) => {
      setAmountSaved(convertkWhToRON(value.totalkWhPerYear, value.invoiceUnitValue, value.county))
    })
  }, [navigate])

  const awards = [
    {
      iconSrc: moneyIcon,
      altText: 'money icon',
      heading: 'Money Saved',
      value: amountSaved,
      um: 'RON'
    },
    {
      iconSrc: co2Icon,
      altText: 'co2 icon',
      heading: (
        <p style={{ margin: 0 }}>
          CO<sub>2</sub> Reduced
        </p>
      ),
      value: convertkWhToCO2(totalkWhPerYear),
      um: 'KG'
    },
    {
      iconSrc: coalIcon,
      altText: 'coal icon',
      heading: 'Bituminous Coal Saved',
      value: convertkWhToCoal(totalkWhPerYear),
      um: 'KG'
    },
    {
      iconSrc: treeIcon,
      altText: 'tree icon',
      heading: 'Reducing Deforestation',
      value: convertkWhToTrees(totalkWhPerYear),
      um: 'Tree'
    }
  ]

  return (
    <div>
      <CustomAppBar user={user} selectedAppBarItem='Prizes' />
      <div>
        <Typography id='awards-title' variant='h2'>
          You have saved <span id='span-energy'>{totalkWhPerYear} kWh/annum</span> of energy. The equivalent of:
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
