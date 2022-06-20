import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'

const ValidationTextFields = () => {
  return (
    <Box
      component='form'
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' }
      }}
      noValidate
      autoComplete='off'
    >
      <div>
        <TextField
          error={true && true}
          id='outlined-error-helper-text'
          label='Error'
          defaultValue='Hello World'
          helperText={true && '⚠ Incorrect entry.'}
        />
      </div>
    </Box>
  )
}

export default ValidationTextFields
