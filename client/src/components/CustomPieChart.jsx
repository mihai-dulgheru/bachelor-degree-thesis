import { Typography } from '@mui/material'
import { Cell, Pie, PieChart } from 'recharts'

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

const CustomPieChart = ({ title, data, width, height, outerRadius }) => {
  let COLORS = []
  if (data.length < 4) {
    COLORS = [...COLORS_3]
  } else if (data.length < 6) {
    COLORS = [...COLORS_5]
  } else {
    COLORS = data.map(() => getRandomColor())
  }

  return (
    <div>
      <Typography variant='h5' className='text-align-center mb-2'>
        {title}
      </Typography>

      <div className='display-flex flex-wrap-wrap justify-content-center'>
        <PieChart width={width ? width : 480} height={height ? height : 480}>
          <Pie
            data={data}
            dataKey='value'
            nameKey='name'
            cx='50%'
            cy='50%'
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={outerRadius ? outerRadius : 160}
            fill='#8884d8'
          >
            {data.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
        <div className='display-flex flex-direction-column justify-content-center'>
          {data.map((_entry, index) => (
            <div key={`legend-${index}`} className='display-flex align-items-center'>
              <div className='w-4 h-4 br-50 mr-2' style={{ backgroundColor: COLORS[index] }}></div>
              <Typography className='text-align-left vertical-align-middle' style={{ lineHeight: 2 }}>
                {data[index].name}
              </Typography>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CustomPieChart
