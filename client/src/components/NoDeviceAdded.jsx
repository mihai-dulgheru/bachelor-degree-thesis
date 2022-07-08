import { Button, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { oopsIcon } from '../images'
import './NoDeviceAdded.css'

const NoDeviceAdded = () => {
  const navigate = useNavigate()

  return (
    <div className='display-flex flex-direction-column align-items-center justify-content-center mt-4'>
      <div className='display-flex justify-content-center'>
        <img src={oopsIcon} alt='comic-boom-oops-icon' />
      </div>
      <Typography id='info' align='center' gutterBottom variant='h2'>
        You cannot view any charts. Please add at least one device to access this feature!
      </Typography>
      <div className='display-flex justify-content-center'>
        <Button
          id='go-homepage-button'
          variant='contained'
          size='large'
          onClick={() => {
            navigate('/')
          }}
        >
          Go homepage
        </Button>
      </div>
    </div>
  )
}

export default NoDeviceAdded
