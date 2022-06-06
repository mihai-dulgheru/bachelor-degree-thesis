import { Card, CardContent, Typography } from '@mui/material'
import React from 'react'
import './CustomCard.css'

const CustomCard = ({ iconSrc, altText, heading, value, um }) => {
  return (
    <div>
      <Card className='card'>
        <img className='card-media' src={iconSrc} alt={altText} />
        <CardContent className='card-content'>
          <Typography id='card-heading' gutterBottom variant='h3'>
            {heading}
          </Typography>
          <Typography variant='h4' color='text.secondary'>
            {value + ' ' + um}
          </Typography>
        </CardContent>
      </Card>
    </div>
  )
}

export default CustomCard
