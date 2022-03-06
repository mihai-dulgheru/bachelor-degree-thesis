import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import AppBar from '@mui/material/AppBar'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import './css/Home.css'
import swal from 'sweetalert'

function Home () {
  const navigate = useNavigate()
  const [user, setUser] = useState({})

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

  useEffect(() => {
    getUser()
  }, [])

  const handleButton = () => {
    navigate('/profile')
  }

  return (
    <div className='root'>
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='h6' className='title'>
            Home
          </Typography>
          <div>
            <IconButton onClick={handleButton} aria-label='profile' color='inherit' size='medium'>
              {!user.avatar ? <AccountCircleIcon fontSize='large' /> : <Avatar src={user.avatar} />}
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  )
}

export default Home
