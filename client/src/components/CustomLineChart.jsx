import { Typography } from '@mui/material'
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts'

const COLORS = ['#8884d8', '#82ca9d']

const CustomLineChart = ({ title, width, height, data, dataKeys }) => {
  return (
    <div className='max-width-100vw'>
      <Typography variant='h5' className='text-align-center mb-2'>
        {title}
      </Typography>

      <div className='display-flex justify-content-center'>
        <LineChart
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
          <Legend />
          {dataKeys.map((item, index) => (
            <Line key={item} type={'monotone'} dataKey={item} stroke={COLORS[index % COLORS.length]} />
          ))}
        </LineChart>
      </div>
    </div>
  )
}

export default CustomLineChart
