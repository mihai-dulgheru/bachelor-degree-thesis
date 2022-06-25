import { Typography } from '@mui/material'
import { Area, AreaChart, CartesianGrid, Legend, XAxis, YAxis } from 'recharts'
import './CustomStackedAreaChart.css'

const STROKE_COLORS = ['#82ca9d', '#ffc658']
const FILL_COLORS = ['#82ca9d', '#ffc658']
const TEXT_COLORS = ['#82ca9d', '#ffc658']

const renderLegend = (props) => {
  const { payload } = props

  return (
    <ul id='render-legend-list'>
      {payload.map((entry, index) => (
        <li key={`item-${index}`}>
          <svg
            width='14'
            height='14'
            viewBox='0 0 32 32'
            version='1.1'
            style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '0.25rem' }}
          >
            <path
              strokeWidth={'4'}
              fill='none'
              stroke={STROKE_COLORS[index % STROKE_COLORS.length]}
              d='M0,16h10.666666666666666
            A5.333333333333333,5.333333333333333,0,1,1,21.333333333333332,16
            H32M21.333333333333332,16
            A5.333333333333333,5.333333333333333,0,1,1,10.666666666666666,16'
            ></path>
          </svg>
          <span style={{ display: 'contents', color: TEXT_COLORS[index % TEXT_COLORS.length] }}>{entry.value}</span>
        </li>
      ))}
    </ul>
  )
}

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
          {/* <Tooltip /> */}
          <Legend content={renderLegend} />
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
