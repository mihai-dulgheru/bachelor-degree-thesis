import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Signin from './components/Sigin'
import Profile from './components/Profile'
import Home from './components/Home'
import Signup from './components/Signup'
import './App.css'
import PersonalInformation from './components/PersonalInformation'
import OtherInformation from './components/OtherInformation'

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
          <Route path='/signup' element={<Signup />} />
          {!accessToken
            ? (
              <>
                <Route path='*' element={<Signin onSignin={handleSignin} />} />
              </>
              )
            : (
              <>
                <Route path='/' element={<Home />} />
                <Route path='/home' element={<Home />} />
                <Route path='/login' element={<Signin onSignin={handleSignin} />} />
                <Route path='/profile' element={<Profile />} />
                <Route path='/edit-personal-information' element={<PersonalInformation />} />
                <Route path='/edit-other-information' element={<OtherInformation />} />
              </>
              )}
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
