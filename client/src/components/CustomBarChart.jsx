import { Typography } from '@mui/material'
import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from 'recharts'
import './CustomBarChart.css'

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
