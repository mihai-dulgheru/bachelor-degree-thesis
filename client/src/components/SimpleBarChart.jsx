import { Typography } from '@mui/material'
import React from 'react'
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from 'recharts'

const COLORS = ['#8884d8', '#82ca9d']

const SimpleBarChart = ({ title, width, height, data, legend, dataKeys }) => {
  return (
    <div>
      <Typography variant='h5' className='text-align-center mb-2'>
        {title}
      </Typography>

      <div className='display-flex justify-content-center'>
        <BarChart
          width={width ? width : 800}
          height={height ? height : 400}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5
          }}
        >
          <CartesianGrid strokeDasharray={'3 3'} />
          <XAxis dataKey={'name'} />
          <YAxis />
          <Tooltip />
          {legend && <Legend />}
          {dataKeys.map((item, index) => (
            <Bar key={item} dataKey={item} fill={COLORS[index % COLORS.length]} />
          ))}
        </BarChart>
      </div>
    </div>
  )
}

export default SimpleBarChart
