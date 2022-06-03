import React, { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Alternatives from './Alternatives'
import './App.css'
import Charts from './Charts'
import Device from './Device'
import DeviceList from './DeviceList'
import Home from './Home'
import OtherInformation from './OtherInformation'
import PersonalInformation from './PersonalInformation'
import Prizes from './Prizes'
import Profile from './Profile'
import Signin from './Signin'
import Signup from './Signup'

function App() {
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
          {!accessToken ? (
            <>
              <Route path='*' element={<Signin onSignin={handleSignin} />} />
            </>
          ) : (
            <>
              <Route path='/' element={<Home />} />
              <Route path='/home' element={<Home />} />
              <Route path='/login' element={<Signin onSignin={handleSignin} />} />
              <Route path='/profile' element={<Profile />} />
              <Route path='/edit-personal-information' element={<PersonalInformation />} />
              <Route path='/edit-other-information' element={<OtherInformation />} />
              <Route path='/device-list' element={<DeviceList />} />
              <Route path='/device-list/:deviceId' element={<Device />} />
              <Route path='/alternatives/:deviceId' element={<Alternatives />} />
              <Route path='/prizes' element={<Prizes />} />
              <Route path='/charts' element={<Charts />} />
            </>
          )}
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
