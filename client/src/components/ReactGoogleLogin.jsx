import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google'

function ReactGoogleLogin() {
  const handleLogin = async (googleData) => {
    const response = await fetch('/api/auth/google/tokeninfo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: localStorage.getItem('accessToken')
      },
      body: JSON.stringify({
        token: googleData.credential
      })
    })
    const data = await response.json()
    console.log(googleData)
    console.log(data)
    // sub - password
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
        type='standard'
        theme='outline'
        size='large'
        text='signin_with'
        shape='pill'
        logo_alignment='center'
        useOneTap
        auto_select
      />
    </GoogleOAuthProvider>
  )
}

export default ReactGoogleLogin
