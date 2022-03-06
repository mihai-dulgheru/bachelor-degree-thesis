import './App.css'
import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Signin from './components/Sigin'
import Profile from './components/Profile'
import Home from './components/Home'

function App () {
  const [accessToken, setAccessToken] = useState('')
  const tempAccessToken = localStorage.getItem('accessToken')

  useEffect(() => {
    setAccessToken(localStorage.getItem('accessToken'))
  }, [tempAccessToken])

  const handleSignin = (accessToken) => {
    setAccessToken(accessToken)
  }

  return (
    <div className='wrapper'>
      <BrowserRouter>
        <Routes>
          {!accessToken
            ? (
              <Route path='*' element={<Signin onSignin={handleSignin} />} />
              )
            : (
              <>
                <Route path='/' element={<Home />} />
                <Route path='/home' element={<Home />} />
                <Route path='/login' element={<Signin onSignin={handleSignin} />} />
                <Route path='/profile' element={<Profile />} />
              </>
              )}
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
