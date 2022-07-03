import { Typography } from '@mui/material'
import { Area, AreaChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from 'recharts'
import './CustomStackedAreaChart.css'
import CustomTooltip from './CustomTooltip'

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
              strokeWidth='4'
              fill='none'
              stroke={STROKE_COLORS[index % STROKE_COLORS.length]}
              d='M0,16h10.666666666666666
            A5.333333333333333,5.333333333333333,0,1,1,21.333333333333332,16
            H32M21.333333333333332,16
            A5.333333333333333,5.333333333333333,0,1,1,10.666666666666666,16'
            />
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
          width={width || 960}
          height={height || 480}
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0
          }}
        >
          <defs>
            <linearGradient id='color-0' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='5%' stopColor={FILL_COLORS[0]} stopOpacity={0.8} />
              <stop offset='95%' stopColor={FILL_COLORS[0]} stopOpacity={0} />
            </linearGradient>
            <linearGradient id='color-1' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='5%' stopColor={FILL_COLORS[1]} stopOpacity={0.8} />
              <stop offset='95%' stopColor={FILL_COLORS[1]} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='name' height={90} interval={0} angle={30} dx={10} dy={32} />
          <YAxis />
          <Tooltip content={<CustomTooltip colors={TEXT_COLORS} />} />
          <Legend content={renderLegend} />
          {dataKeys.map((item, index) => (
            <Area
              key={item}
              type='monotone'
              dataKey={item}
              stackId='1'
              stroke={STROKE_COLORS[index % STROKE_COLORS.length]}
              fillOpacity={1}
              fill={`url(#color-${index})`}
            />
          ))}
        </AreaChart>
      </div>
    </div>
  )
}

export default CustomStackedAreaChart
