import { Typography } from '@mui/material'
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from 'recharts'
import './CustomBarChart.css'
import CustomTooltip from './CustomTooltip'

const COLORS = ['#8884d8', '#82ca9d']

const CustomBarChart = ({ title, width, height, data, legend, dataKeys }) => {
  return (
    <div id='custom-bar-chart' className='max-width-100vw'>
      <Typography variant='h5' className='text-align-center mb-2'>
        {title}
      </Typography>

      <div id='bar-chart-container' className='display-flex justify-content-center'>
        <BarChart
          id='bar-chart'
          width={width ? width : 960}
          height={height ? height : 480}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5
          }}
        >
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='name' height={90} interval={0} angle={30} dx={20} dy={32} />
          <YAxis />
          <Tooltip content={<CustomTooltip colors={COLORS} />} />
          {legend && <Legend />}
          {dataKeys.map((item, index) => (
            <Bar key={item} dataKey={item} fill={COLORS[index % COLORS.length]} />
          ))}
        </BarChart>
      </div>
    </div>
  )
}

export default CustomBarChart
