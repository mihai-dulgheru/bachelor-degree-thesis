import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import MenuIcon from '@mui/icons-material/Menu'
import {
  AppBar,
  Avatar,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Toolbar,
  Tooltip,
  Typography
} from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import TableSortLabel from '@mui/material/TableSortLabel'
import TextField from '@mui/material/TextField'
import { Box } from '@mui/system'
import { visuallyHidden } from '@mui/utils'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import swal from 'sweetalert'
import counties from '../collections/counties.json'
import suppliers from '../collections/suppliers.json'
import './css/DeviceList.css'

const columns = [
  {
    id: 'category',
    numeric: false,
    disablePadding: true,
    label: 'Device Category'
  },
  {
    id: 'efficiencyClass',
    numeric: false,
    disablePadding: false,
    label: 'Efficiency Class'
  },
  {
    id: 'energyConsumption',
    numeric: true,
    disablePadding: false,
    label: 'Power / Energy Consumption'
  },
  {
    id: 'unitMeasurement',
    numeric: false,
    disablePadding: false,
    label: 'Unit of Measurement'
  },
  {
    id: 'noOperatingHours',
    numeric: true,
    disablePadding: false,
    label: 'No. operating hours / day'
  }
]

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) {
      return order
    }
    return a[1] - b[1]
  })
  return stabilizedThis.map((el) => el[0])
}

EnhancedTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired
}

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow>
        {columns.map((column) => (
          <TableCell
            key={column.id}
            align={column.numeric ? 'right' : 'left'}
            padding={column.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === column.id ? order : false}
            style={{ width: `calc(100% / ${columns.length + 2})` }}
          >
            <TableSortLabel
              active={orderBy === column.id}
              direction={orderBy === column.id ? order : 'asc'}
              onClick={createSortHandler(column.id)}
            >
              {column.label}
              {orderBy === column.id ? (
                <Box component='span' sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell
          key='action'
          align='center'
          padding='normal'
          style={{ width: `calc(100% / ${columns.length + 2} * 2)` }}
        >
          Action
        </TableCell>
      </TableRow>
    </TableHead>
  )
}

function DeviceList() {
  const navigate = useNavigate()
  const [user, setUser] = useState({})
  const [anchorElNav, setAnchorElNav] = useState(null)
  const [anchorElUser, setAnchorElUser] = useState(null)
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('category')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [rows, setRows] = useState([])
  const [buttonIsClicked, setButtonIsClicked] = useState(false)
  const [tableRowsEstimatedConsumptionAndTotalCosts, setTableRowsEstimatedConsumptionAndTotalCosts] = useState([])
  const [open, setOpen] = useState(false)
  const [invoiceUnitValue, setInvoiceUnitValue] = useState('')
  const [supplier, setSupplier] = useState(suppliers[0].value)
  const [county, setCounty] = useState(counties[0].value)

  const getUser = async () => {
    const response = await fetch('/api/auth/user', {
      method: 'GET',
      headers: {
        authorization: localStorage.getItem('accessToken')
      }
    })
    const data = await response.json()
    if (data.status === 'ok') {
      setUser(data.user)
      setInvoiceUnitValue(data.user.invoiceUnitValue ? data.user.invoiceUnitValue : '')
      setSupplier(data.user.supplier ? data.user.supplier : suppliers[0].value)
      setCounty(data.user.county ? data.user.county : counties[0].value)
    } else {
      swal({
        title: 'Failed',
        text:
          data.message[0] >= 'a' && data.message[0] <= 'z'
            ? data.message[0].toLocaleUpperCase() + data.message.substring(1)
            : data.message,
        icon: 'error',
        button: {
          text: 'OK',
          value: true,
          visible: true,
          closeModal: true
        }
      }).then(() => {
        navigate('/login')
      })
    }
  }

  const getDevices = async () => {
    const response = await fetch('/api/auth/user/devices', {
      method: 'GET',
      headers: {
        authorization: localStorage.getItem('accessToken')
      }
    })
    const data = await response.json()
    if (data.status === 'ok') {
      setRows(data.devices)
    } else {
      swal({
        title: 'Failed',
        text:
          data.message[0] >= 'a' && data.message[0] <= 'z'
            ? data.message[0].toLocaleUpperCase() + data.message.substring(1)
            : data.message,
        icon: 'error',
        button: {
          text: 'OK',
          value: true,
          visible: true,
          closeModal: true
        }
      }).then(() => {
        navigate('/login')
      })
    }
  }

  const updateUser = async (user) => {
    const response = await fetch('/api/auth/user', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        authorization: localStorage.getItem('accessToken')
      },
      body: JSON.stringify(user)
    })
    const data = await response.json()
    if (data.status === 'ok') {
      setUser(data.user)
      setInvoiceUnitValue(data.user.invoiceUnitValue ? data.user.invoiceUnitValue : '')
      setSupplier(data.user.supplier ? data.user.supplier : suppliers[0].value)
      setCounty(data.user.county ? data.user.county : counties[0].value)
    } else {
      swal({
        title: 'Failed',
        text:
          data.message[0] >= 'a' && data.message[0] <= 'z'
            ? data.message[0].toLocaleUpperCase() + data.message.substring(1)
            : data.message,
        icon: 'error',
        button: {
          text: 'OK',
          value: true,
          visible: true,
          closeModal: true
        }
      }).then(() => {
        navigate('/login')
      })
    }
  }

  useEffect(() => {
    getUser()
    getDevices()
  }, [])

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget)
  }

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  const handleClickNavMenuHome = () => {
    setAnchorElNav(null)
    navigate('/home')
  }

  const handleClickNavMenuPrizes = () => {
    setAnchorElNav(null)
    navigate('/prizes')
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  const handleClickProfile = () => {
    setAnchorElUser(null)
    navigate('/profile')
  }

  const handleClickLogout = () => {
    setAnchorElUser(null)
    localStorage.removeItem('accessToken')
    navigate('/login')
  }

  const appBar = (
    <AppBar position='static' style={{ backgroundColor: 'var(--very-peri)' }}>
      <Container maxWidth='xl'>
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size='large'
              aria-controls='menu-appbar'
              aria-haspopup='true'
              onClick={handleOpenNavMenu}
              color='inherit'
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id='menu-appbar'
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left'
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left'
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' }
              }}
            >
              <MenuItem key='Home' onClick={handleClickNavMenuHome}>
                <Typography textAlign='center'>Home</Typography>
              </MenuItem>
              <MenuItem key='Prizes' onClick={handleClickNavMenuPrizes}>
                <Typography textAlign='center'>Prizes</Typography>
              </MenuItem>
            </Menu>
          </Box>
          <Typography variant='h6' noWrap component='div' sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            Devices
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }} className='box'>
            <Button key='Home' onClick={handleClickNavMenuHome} sx={{ py: 2, color: 'white', display: 'block' }}>
              Home
            </Button>
            <Typography key='Devices' variant='h6' noWrap component='div'>
              Devices
            </Typography>
            <Button key='Prizes' onClick={handleClickNavMenuPrizes} sx={{ py: 2, color: 'white', display: 'block' }}>
              Prizes
            </Button>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title='Open settings'>
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                {!user.avatar ? <AccountCircleIcon fontSize='large' /> : <Avatar src={user.avatar} />}
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id='menu-appbar'
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem key='Profile' onClick={handleClickProfile}>
                <Typography textAlign='center'>Profile</Typography>
              </MenuItem>
              <MenuItem key='Logout' onClick={handleClickLogout}>
                <Typography textAlign='center'>Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )

  const handleRequestSort = (_event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleChangePage = (_event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const calculateEstimatedConsumptionAndTotalCosts = async () => {
    /**
     * Dishwasher: kWh/100 cycles * 2.08 = kWh/annum
     * Washing machines and washer dryers: kWh/100 cycles * 2.2 = kWh/annum
     * Ovens: kWh/cycle * 286 = kWh/annum
     *
     * kWh/1000h = kWh * 1000h
     * 1 year = 365.242199 days
     * 1 day = 24h
     * kWh/annum = kWh * year * day
     *
     * Energy (kWh) = (W * hrs) / 1000
     * Energy (kWh) = kW * hrs
     */
    const year = 365.242199
    const month = 30.4368499
    const week = 7
    const day = 24
    let estimatedConsumptionkWh = 0
    for (const device of rows) {
      let energy = 0
      switch (device.unitMeasurement) {
        case 'W':
          energy = (device.energyConsumption * device.noOperatingHours) / 1000
          break
        case 'kW':
          energy = device.energyConsumption * device.noOperatingHours
          break
        case 'kWh/100 cycles':
          let kWhAnnum = 0
          if (device.category === 'Maşini de spălat vase') {
            kWhAnnum = device.energyConsumption * 2.08
          } else {
            kWhAnnum = device.energyConsumption * 2.2
          }
          energy = kWhAnnum / (year * day)
          break
        case 'kWh/1000h':
          energy = device.energyConsumption / 1000
          break
        case 'kWh/annum':
          energy = device.energyConsumption / (year * day)
          break
        case 'kWh/cycle':
          energy = (device.energyConsumption * 286) / (year * day)
          break

        default:
          break
      }
      estimatedConsumptionkWh += energy
    }

    const estimatedConsumptionkWhDay = estimatedConsumptionkWh * day
    const estimatedConsumptionkWhWeek = estimatedConsumptionkWh * week * day
    const estimatedConsumptionkWhMonth = estimatedConsumptionkWh * month * day
    const estimatedConsumptionkWhYear = estimatedConsumptionkWh * year * day

    let value = invoiceUnitValue || 0
    if (value === 0) {
      /**
       * Preţul final este exprimat în lei/kWh şi conţine prețul energiei active și următoarele tarife reglementate: tariful de
       * introducere energie electrică în reţea (TG), tariful de extracţie energie electrică din retea (TL), tariful pentru serviciul
       * de sistem, tarifele de distribuţie, TVA, certificate verzi, contribuția pentru cogenerare şi acciza necomercială. Costurile
       * privind certificatele verzi, contribuția pentru cogenerare şi acciza necomercială pot fi consultate aici, iar valoarea
       * acestora va fi inclusă distinct pe factură.
       */
      const tg = 0.00149
      const tl = 0.02247
      const systemServiceFee = 0.00932
      const TVA = 0.19
      const cogenerationContribution = 0.02554
      const greenCertificates = 0.07254
      const nonCommercialExciseDuty = 0.00542
      let jt = 0.0
      let activeElectricityTariff = 0.30792

      const distributionArea = counties.find((element) => element.value === county).distributionArea
      switch (distributionArea) {
        case 'Oltenia':
          jt = 142.4 / 1000
          break
        case 'Muntenia Nord':
          jt = 140.68 / 1000
          activeElectricityTariff = 0.30732
          break
        case 'Transilvania Nord':
          jt = 122.78 / 1000
          activeElectricityTariff = 0.30772
          break
        case 'Transilvania Sud':
          jt = 127.04 / 1000
          break
        case 'Banat':
          jt = 117.71 / 1000
          break
        case 'Dobrogea':
          jt = 141.99 / 1000
          break
        case 'Muntenia Sud':
          jt = 119.07 / 1000
          break
        case 'Moldova':
          jt = 143.63 / 1000
          break

        default:
          break
      }

      value =
        (activeElectricityTariff +
          tg +
          tl +
          systemServiceFee +
          jt +
          cogenerationContribution +
          greenCertificates +
          nonCommercialExciseDuty) *
        (1 + TVA)
    }

    setTableRowsEstimatedConsumptionAndTotalCosts([
      {
        period: '1 hour',
        energyConsumption: estimatedConsumptionkWh,
        price: estimatedConsumptionkWh * value
      },
      {
        period: '1 day',
        energyConsumption: estimatedConsumptionkWhDay,
        price: estimatedConsumptionkWhDay * value
      },
      {
        period: '1 week',
        energyConsumption: estimatedConsumptionkWhWeek,
        price: estimatedConsumptionkWhWeek * value
      },
      {
        period: '1 month',
        energyConsumption: estimatedConsumptionkWhMonth,
        price: estimatedConsumptionkWhMonth * value
      },
      {
        period: '1 year',
        energyConsumption: estimatedConsumptionkWhYear,
        price: estimatedConsumptionkWhYear * value
      }
    ])

    setButtonIsClicked(!buttonIsClicked)
  }

  const handleClickCalculateEstimatedConsumptionAndTotalCosts = async () => {
    if ((user.supplier && user.county) || user.invoiceUnitValue) {
      await calculateEstimatedConsumptionAndTotalCosts()
    } else {
      setOpen(true)
    }
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleSave = () => {
    setOpen(false)
    updateUser({
      supplier: supplier,
      county: county,
      invoiceUnitValue: invoiceUnitValue ? parseFloat(invoiceUnitValue) : null
    }).then(() => {
      calculateEstimatedConsumptionAndTotalCosts()
    })
  }

  const handleCancel = () => {
    setOpen(false)
    setInvoiceUnitValue('')
    setSupplier(suppliers[0].value)
    setCounty(counties[0].value)
  }

  const handleChangeInputInvoiceUnitValue = (event) => {
    const regExp = /^(?!0\d)(\d+)?\.?(\d+)?$/
    if (event.target.value === '' || regExp.test(event.target.value)) {
      setInvoiceUnitValue(event.target.value)
    }
  }

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0

  const table = (
    <Box sx={{ width: '90%', margin: '16px auto 0px auto' }}>
      <Paper sx={{ width: '100%', mb: 2, p: 2 }}>
        <TableContainer>
          <Table stickyHeader size='medium'>
            <EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <TableRow key={index} hover tabIndex={-1}>
                      <TableCell align='left' padding='none'>
                        {row.category}
                      </TableCell>
                      <TableCell align='left'>{row.efficiencyClass}</TableCell>
                      <TableCell align='right'>{row.energyConsumption}</TableCell>
                      <TableCell align='left'>{row.unitMeasurement}</TableCell>
                      <TableCell align='right'>{row.noOperatingHours}</TableCell>
                      <TableCell align='center'>
                        <Button
                          variant='outlined'
                          color='inherit'
                          onClick={(_event) => navigate(`/device-list/${row.id}`)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant='outlined'
                          color='error'
                          onClick={async (_event) => {
                            const response = await fetch(`/api/auth/user/devices/${row.id}`, {
                              method: 'DELETE',
                              headers: {
                                authorization: localStorage.getItem('accessToken')
                              }
                            })
                            const data = await response.json()
                            if (data.status === 'ok') {
                              getDevices()
                            } else {
                              swal({
                                title: 'Failed',
                                text:
                                  data.message[0] >= 'a' && data.message[0] <= 'z'
                                    ? data.message[0].toLocaleUpperCase() + data.message.substring(1)
                                    : data.message,
                                icon: 'error',
                                button: {
                                  text: 'OK',
                                  value: true,
                                  visible: true,
                                  closeModal: true
                                }
                              }).then(() => {
                                navigate('/login')
                              })
                            }
                          }}
                          style={{ margin: '0px 4px' }}
                        >
                          Del
                        </Button>
                        <Button
                          variant='outlined'
                          color='secondary'
                          onClick={(_event) => {
                            navigate(`/alternatives/${row.id}`)
                          }}
                        >
                          Alternatives
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          className='table-pagination'
          rowsPerPageOptions={[5, 10, 15]}
          component='div'
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  )

  const button = (
    <Box sx={{ width: '90%', margin: '16px auto 16px auto' }}>
      <div className='d-flex justify-content-center' style={{ marginBottom: 16 }}>
        <Button
          style={{ backgroundColor: 'var(--very-peri)', color: '#ffffff' }}
          onClick={handleClickCalculateEstimatedConsumptionAndTotalCosts}
        >
          Calculate estimated consumption and total costs
        </Button>
      </div>
    </Box>
  )

  const tableEstimatedConsumptionAndTotalCosts = (
    <div className='d-flex justify-content-center'>
      <Box sx={{ width: '90%', margin: 'opx auto' }}>
        <Paper sx={{ width: '100%', mb: 2, p: 2 }}>
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: 'calc(100% / 3)' }}>Period</TableCell>
                  <TableCell align='left' sx={{ width: 'calc(100% / 3)' }}>
                    Energy&nbsp;Consumption&nbsp;(kWh)
                  </TableCell>
                  <TableCell align='left' sx={{ width: 'calc(100% / 3)' }}>
                    Price&nbsp;(RON)
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tableRowsEstimatedConsumptionAndTotalCosts.map((row) => (
                  <TableRow key={row.period} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell component='th' scope='row'>
                      {row.period}
                    </TableCell>
                    <TableCell align='left'>{row.energyConsumption.toFixed(2)}</TableCell>
                    <TableCell align='left'>{row.price.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </div>
  )

  const dialog = (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent className='dialogContent'>
          <DialogContentText>
            Please enter the unit value of the invoice (purchase price for 1 kWh of electricity) or the electricity
            supplier and the county.
          </DialogContentText>
          <TextField
            autoFocus
            margin='dense'
            label='Invoice Unit Value'
            type='text'
            fullWidth
            variant='standard'
            value={invoiceUnitValue}
            onChange={handleChangeInputInvoiceUnitValue}
          />
          <br />
          <DialogContentText className='or'>OR</DialogContentText>
          <br />
          <TextField
            fullWidth
            margin='dense'
            select
            label='Supplier'
            variant='standard'
            value={supplier}
            onChange={(event) => setSupplier(event.target.value)}
          >
            {suppliers.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            margin='dense'
            select
            label='County'
            variant='standard'
            value={county}
            onChange={(event) => setCounty(event.target.value)}
          >
            {counties.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  )

  return (
    <div>
      {appBar}
      {table}
      {button}
      {buttonIsClicked ? tableEstimatedConsumptionAndTotalCosts : <></>}
      {dialog}
    </div>
  )
}

export default DeviceList
