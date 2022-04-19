import React from 'react'
import ReactLoading from 'react-loading'

function LoadingScreen() {
  return (
    <div className='position-absolute top-50 start-50 translate-middle'>
      <ReactLoading type='spinningBubbles' color='var(--very-peri)' height={100} width={100} />
    </div>
  )
}

export default LoadingScreen
