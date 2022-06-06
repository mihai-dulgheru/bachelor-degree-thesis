import { Typography } from '@mui/material'
import React from 'react'
import { Cell, Pie, PieChart } from 'recharts'
import './CustomPieChart.css'

const RADIAN = Math.PI / 180
const COLORS_3 = ['#EC6B56', '#FFC154', '#47B39C']
const COLORS_5 = ['#003f5c', '#58508d', '#bc5090', '#ff6361', '#ffa600']

const getRandomColor = () => {
  return `#${Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, 0)
    .toUpperCase()}`
}

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text x={x} y={y} fill='white' textAnchor={x > cx ? 'start' : 'end'} dominantBaseline='central'>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

const CustomPieChart = ({ data, title }) => {
  let COLORS = []
  if (data.length < 4) {
    COLORS = [...COLORS_3]
  } else if (data.length < 6) {
    COLORS = [...COLORS_5]
  } else {
    COLORS = data.map(() => getRandomColor())
  }

  return (
    <>
      <Typography variant='h5' className='w-50 text-align-center mt-4'>
        {title}
      </Typography>
      <div className='display-flex w-50 justify-content-center'>
        <PieChart width={400} height={400}>
          <Pie
            data={data}
            cx='50%'
            cy='50%'
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={160}
            fill='#8884d8'
            dataKey='value'
          >
            {data.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
        <div className='display-flex flex-direction-column justify-content-center'>
          {data.map((_entry, index) => (
            <div className='display-flex align-items-center' key={`legend-${index}`}>
              <div className='w-4 h-4 br-50 mr-2' style={{ backgroundColor: COLORS[index] }}></div>
              <Typography className='text-align-left vertical-align-middle' style={{ lineHeight: 2 }}>
                {data[index].name}
              </Typography>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default CustomPieChart
