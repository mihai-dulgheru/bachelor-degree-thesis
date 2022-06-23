import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import {
  Alternatives,
  Charts,
  Device,
  DeviceList,
  Home,
  NotFound,
  OtherInformation,
  PersonalInformation,
  Prizes,
  Profile,
  Signin,
  Signup
} from '../components'
import './App.css'
import ValidationTextFields from './ValidationTextFields'

function App() {
  const tempAccessToken = localStorage.getItem('accessToken')
  const [accessToken, setAccessToken] = useState('')

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
              {/* TODO: delete below */}
              <Route path='/validation-text-fields' element={<ValidationTextFields />} />
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
              <Route path='*' element={<NotFound />} />
            </>
          )}
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
