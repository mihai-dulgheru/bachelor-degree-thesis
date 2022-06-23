import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google'
import { useNavigate } from 'react-router-dom'
import swal from 'sweetalert'

const loginUser = async (credentials) => {
  return fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  }).then((data) => data.json())
}

function ReactGoogleLogin({ onSignin }) {
  const navigate = useNavigate()

  const createUser = async (user) => {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    })
    const data = await response.json()
    if (data.status === 'ok') {
      const response = await loginUser(user)
      if ('accessToken' in response) {
        swal({
          title: 'Success',
          text:
            response.message[0] >= 'a' && response.message[0] <= 'z'
              ? response.message[0].toLocaleUpperCase() + response.message.substring(1)
              : response.message,
          icon: 'success',
          buttons: false,
          timer: 2000
        }).then(() => {
          localStorage.setItem('accessToken', response.accessToken)
          onSignin(response.accessToken)
          navigate('/home')
        })
      } else {
        swal({
          title: 'Failed',
          text:
            response.message[0] >= 'a' && response.message[0] <= 'z'
              ? response.message[0].toLocaleUpperCase() + response.message.substring(1)
              : response.message,
          icon: 'error',
          button: {
            text: 'OK',
            value: true,
            visible: true,
            closeModal: true
          }
        })
      }
    } else {
      swal({
        title: 'Failed',
        text:
          data.errors[0].message[0] >= 'a' && data.errors[0].message[0] <= 'z'
            ? data.errors[0].message[0].toLocaleUpperCase() + data.errors[0].message.substring(1)
            : data.errors[0].message,
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

  const handleLogin = async (googleData) => {
    let response = await fetch('/api/google/auth/tokeninfo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: googleData.credential
      })
    })
    const data = await response.json()
    const user = {
      username: data.email,
      password: data.email[0].toLocaleUpperCase() + data.sub,
      firstName: data.given_name,
      lastName: data.family_name,
      email: data.email
    }
    response = await loginUser(user)
    if ('accessToken' in response) {
      swal({
        title: 'Success',
        text:
          response.message[0] >= 'a' && response.message[0] <= 'z'
            ? response.message[0].toLocaleUpperCase() + response.message.substring(1)
            : response.message,
        icon: 'success',
        buttons: false,
        timer: 2000
      }).then(() => {
        localStorage.setItem('accessToken', response.accessToken)
        onSignin(response.accessToken)
        navigate('/home')
      })
    } else {
      await createUser(user)
    }
  }

  return (
    <GoogleOAuthProvider clientId='64113970239-gi8kgn6512hdar4ei0140d8235qqf92l.apps.googleusercontent.com'>
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          await handleLogin(credentialResponse)
        }}
        onError={() => {
          console.log('Login Failed')
        }}
        useOneTap
      />
    </GoogleOAuthProvider>
  )
}

export default ReactGoogleLogin
