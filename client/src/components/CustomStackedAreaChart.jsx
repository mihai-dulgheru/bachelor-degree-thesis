import { Typography } from '@mui/material'
import { Area, AreaChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from 'recharts'
import './CustomStackedAreaChart.css'

const STROKE_COLORS = ['#82ca9d', '#ffc658']
const FILL_COLORS = ['#82ca9d', '#ffc658']

const CustomStackedAreaChart = ({ title, width, height, data, dataKeys }) => {
  return (
    <div id='custom-stacked-area-chart' className='max-width-100vw'>
      <Typography variant='h5' className='text-align-center mb-2'>
        {title}
      </Typography>

      <div id='area-chart-container' className='display-flex justify-content-center'>
        <AreaChart
          id='area-chart'
          width={width ? width : 800}
          height={height ? height : 400}
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0
          }}
        >
          <CartesianGrid strokeDasharray={'3 3'} />
          <XAxis dataKey={'name'} />
          <YAxis />
          <Tooltip />
          <Legend />
          {dataKeys.map((item, index) => (
            <Area
              key={item}
              type={'monotone'}
              dataKey={item}
              stackId={'1'}
              stroke={STROKE_COLORS[index % STROKE_COLORS.length]}
              fill={FILL_COLORS[index % FILL_COLORS.length]}
            />
          ))}
        </AreaChart>
      </div>
    </div>
  )
}

export default CustomStackedAreaChart
