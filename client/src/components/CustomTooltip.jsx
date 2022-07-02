import './CustomTooltip.css'

const CustomTooltip = ({ active, payload, label, colors }) => {
  if (active && payload && payload.length) {
    return (
      <div className='custom-tooltip'>
        <p className='label'>{`${label}`}</p>
        <p className='payload' style={{ color: `${colors[0]}` }}>{`${payload[0].name}: ${payload[0].value}`}</p>
        {payload[1] && (
          <p className='payload' style={{ color: `${colors[1]}` }}>{`${payload[1].name}: ${payload[1].value}`}</p>
        )}
      </div>
    )
  }

  return null
}

export default CustomTooltip
