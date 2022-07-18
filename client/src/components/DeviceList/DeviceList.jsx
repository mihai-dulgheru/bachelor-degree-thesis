import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField
} from '@mui/material'
import Fade from '@mui/material/Fade'
import Popper from '@mui/material/Popper'
import Typography from '@mui/material/Typography'
import { Box } from '@mui/system'
import { visuallyHidden } from '@mui/utils'
import PopupState, { bindPopper, bindToggle } from 'material-ui-popup-state'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import swal from 'sweetalert'
import { CustomAppBar } from '..'
import { counties, suppliers } from '../../json'
import './DeviceList.css'

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
    label: 'Power/Energy Consumption'
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
    label: 'No. operating hours/day'
  }
]

const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

const getComparator = (order, orderBy) => {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

const stableSort = (array, comparator) => {
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

const EnhancedTableHead = ({ order, orderBy, onRequestSort }) => {
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
              {orderBy === column.id
                ? (
                  <Box component='span' sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                  )
                : null}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell
          key='action'
          align='center'
          padding='normal'
          style={{ width: `calc(100% / ${columns.length + 2} * 2)` }}
        >
          Actions
        </TableCell>
      </TableRow>
    </TableHead>
  )
}

EnhancedTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired
}

const DeviceList = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState({})
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('category')
  const [searchParams, setSearchParams] = useSearchParams()
  const [page, setPage] = useState(parseInt(searchParams.get('page')) || 0)
  const [rowsPerPage, setRowsPerPage] = useState(parseInt(searchParams.get('rowsPerPage')) || 5)
  const [rows, setRows] = useState([])
  const [buttonIsClicked, setButtonIsClicked] = useState(false)
  const [tableRowsEstimatedConsumptionAndTotalCosts, setTableRowsEstimatedConsumptionAndTotalCosts] = useState([])
  const [open, setOpen] = useState(false)
  const [invoiceUnitValue, setInvoiceUnitValue] = useState('')
  const [supplier, setSupplier] = useState(suppliers[0].value)
  const [county, setCounty] = useState(counties[0].value)
  const [devices, setDevices] = useState([])
  const [filter, setFilter] = useState('')

  useEffect(() => {
    setSearchParams({ rowsPerPage, page })

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
        setDevices(data.devices)
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

    getUser()
    getDevices()
  }, [navigate, page, rowsPerPage, setSearchParams])

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

  const getDevices = async () => {
    const response = await fetch('/api/auth/user/devices', {
      method: 'GET',
      headers: {
        authorization: localStorage.getItem('accessToken')
      }
    })
    const data = await response.json()
    if (data.status === 'ok') {
      setDevices(data.devices)
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

  const updateDevice = async (device) => {
    const response = await fetch(`/api/auth/user/devices/${device.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        authorization: localStorage.getItem('accessToken')
      },
      body: JSON.stringify(device)
    })
    const data = await response.json()
    if (data.status !== 'ok') {
      swal({
        title: 'Failed',
        text:
          data.errors[0].message[0] >= 'a' && data.errors[0].message[0] <= 'z'
            ? data.errors[0].message[0].toLocaleUpperCase() + data.errors[0].message.substring(1)
            : data.errors[0].message,
        icon: 'error',
        button: {
          text: 'OK',
          value: true,
          visible: true,
          closeModal: true
        }
      })
    }
  }

  const handleRequestSort = (_event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleChangePage = (_event, newPage) => {
    setPage(newPage)
    setSearchParams({ rowsPerPage, page: newPage })
  }

  const handleChangeRowsPerPage = (event) => {
    const value = parseInt(event.target.value, 10)
    setRowsPerPage(value)
    setPage(0)
    setSearchParams({ rowsPerPage: value, page: 0 })
  }

  const year = 365.242199
  const month = 30.4368499
  const week = 7
  const day = 24

  const tg = 0.00149
  const tl = 0.02247
  const systemServiceFee = 0.00932
  const tva = 0.19
  const cogenerationContribution = 0.02554
  const greenCertificates = 0.07254
  const nonCommercialExciseDuty = 0.00542

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
     * Energy (kWh) = (W * hrs)/1000
     * Energy (kWh) = kW * hrs
     */
    let estimatedConsumptionkWh = 0
    for (const device of rows) {
      let energy = 0
      switch (device.unitMeasurement) {
        case 'W':
          energy = device.energyConsumption / 1000
          break
        case 'kW':
          energy = device.energyConsumption
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
      estimatedConsumptionkWh += (energy * device.noOperatingHours) / 24
      console.log(device)
    }

    const estimatedConsumptionkWhDay = estimatedConsumptionkWh * day
    const estimatedConsumptionkWhWeek = estimatedConsumptionkWh * week * day
    const estimatedConsumptionkWhMonth = estimatedConsumptionkWh * month * day
    const estimatedConsumptionkWhYear = estimatedConsumptionkWh * year * day

    let value = invoiceUnitValue || 0
    let jt = 0.0
    let activeElectricityTariff = 0.30792
    if (value === 0) {
      /**
       * Preţul final este exprimat în lei/kWh şi conţine prețul energiei active (activeElectricityTariff) și următoarele tarife reglementate:
       * tariful de introducere energie electrică în reţea (tg),
       * tariful de extracţie energie electrică din retea (tl),
       * tariful pentru serviciul de sistem (systemServiceFee),
       * tarifele de distribuţie (jt),
       * tva (tva),
       * certificate verzi (greenCertificates),
       * contribuția pentru cogenerare (cogenerationContribution),
       * acciza necomercială (nonCommercialExciseDuty).
       */
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
        (1 + tva)
    }

    setTableRowsEstimatedConsumptionAndTotalCosts([
      {
        period: '1 hour',
        energyConsumption: estimatedConsumptionkWh,
        price: estimatedConsumptionkWh * value,
        jt,
        activeElectricityTariff
      },
      {
        period: '1 day',
        energyConsumption: estimatedConsumptionkWhDay,
        price: estimatedConsumptionkWhDay * value,
        jt,
        activeElectricityTariff
      },
      {
        period: '1 week',
        energyConsumption: estimatedConsumptionkWhWeek,
        price: estimatedConsumptionkWhWeek * value,
        jt,
        activeElectricityTariff
      },
      {
        period: '1 month',
        energyConsumption: estimatedConsumptionkWhMonth,
        price: estimatedConsumptionkWhMonth * value,
        jt,
        activeElectricityTariff
      },
      {
        period: '1 year',
        energyConsumption: estimatedConsumptionkWhYear,
        price: estimatedConsumptionkWhYear * value,
        jt,
        activeElectricityTariff
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
      supplier,
      county,
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

  const handleSearch = (event) => {
    setFilter(event.target.value)
    setRows(
      devices.filter((item) => {
        return (
          String(item.energyConsumption).toLowerCase().includes(event.target.value.toLowerCase()) ||
          item.unitMeasurement.toLowerCase().includes(event.target.value.toLowerCase()) ||
          String(item.noOperatingHours).toLowerCase().includes(event.target.value.toLowerCase()) ||
          String(item.efficiencyClass).toLowerCase().includes(event.target.value.toLowerCase()) ||
          item.category.toLowerCase().includes(event.target.value.toLowerCase())
        )
      })
    )
  }

  const handleClickPreviousVersion = async (device) => {
    const temp = device.previousVersion.split(';')
    await updateDevice({
      id: device.id,
      energyConsumption: parseInt(temp[0]),
      unitMeasurement: temp[1],
      efficiencyClass: temp[2],
      previousVersion: null
    })
    await getDevices()
  }

  const search = (
    <div id='search'>
      <div>
        <i className='fa-solid fa-magnifying-glass' />
        <input
          id='search-input'
          aria-invalid='false'
          placeholder='Search...'
          type='search'
          value={filter}
          onChange={handleSearch}
        />
      </div>
    </div>
  )

  const table = (
    <Box sx={{ width: '90%', margin: '1rem auto 0 auto' }}>
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
                        <div className='display-flex align-items-center flex-wrap-wrap'>
                          <div className='previous-version-button'>
                            {row.previousVersion !== null && (
                              <>
                                <Button
                                  color='inherit'
                                  style={{ minWidth: 0 }}
                                  onClick={() => handleClickPreviousVersion(row)}
                                >
                                  <i className='fa-solid fa-arrow-rotate-left' />
                                </Button>
                              </>
                            )}
                          </div>
                          <div>{row.category}</div>
                        </div>
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
                              setButtonIsClicked(false)
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
                          style={{ margin: '0 0.25rem' }}
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
          page={rows.length && page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  )

  const button = (
    <Box sx={{ width: '90%', margin: '1rem auto', mb: '0', pb: '1rem' }}>
      <div className='d-flex justify-content-center'>
        <Button
          onClick={handleClickCalculateEstimatedConsumptionAndTotalCosts}
          style={{ backgroundColor: 'var(--very-peri)', color: '#ffffff' }}
        >
          Calculate estimated consumption and total costs
        </Button>
      </div>
    </Box>
  )

  const fractionDigits = 4
  const tableEstimatedConsumptionAndTotalCosts = (
    <div className='d-flex justify-content-center'>
      <Box sx={{ width: '90%', margin: '0 auto' }}>
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
                    <TableCell align='left'>
                      <div id='last-cell'>
                        <div>{row.price.toFixed(2)}</div>
                        <PopupState variant='popper'>
                          {(popupState) => (
                            <div>
                              <Button color='inherit' {...bindToggle(popupState)} style={{ minWidth: 0 }}>
                                <i className='fa-solid fa-circle-info' />
                              </Button>
                              <Popper
                                {...bindPopper(popupState)}
                                transition
                                placement='left-end'
                                disablePortal={false}
                                modifiers={[
                                  {
                                    name: 'flip',
                                    enabled: true,
                                    options: {
                                      altBoundary: true,
                                      rootBoundary: 'document',
                                      padding: 8
                                    }
                                  },
                                  {
                                    name: 'preventOverflow',
                                    enabled: true,
                                    options: {
                                      altAxis: true,
                                      altBoundary: true,
                                      tether: true,
                                      rootBoundary: 'document',
                                      padding: 8
                                    }
                                  }
                                ]}
                              >
                                {({ TransitionProps }) => (
                                  <Fade {...TransitionProps} timeout={350}>
                                    <Paper id='popup-paper'>
                                      <div id='popup-title'>
                                        <Typography variant='h5'>Details</Typography>
                                      </div>
                                      <div id='popup-content'>
                                        {invoiceUnitValue
                                          ? (
                                            <div>
                                              <div className='display-flex column-gap-2'>
                                                <Typography variant='body1'>Valoarea unitară a facturii:</Typography>
                                                <Typography variant='body1' style={{ fontWeight: 500 }}>
                                                  {invoiceUnitValue + ' RON'}
                                                </Typography>
                                              </div>
                                              <div>
                                                <Typography variant='body2'>
                                                  Preţul final al facturii = Consum estimativ (kWh) * Valoarea unitară a
                                                  facturii (RON/kWh)
                                                </Typography>
                                              </div>
                                            </div>
                                            )
                                          : (
                                            <div>
                                              <div className='display-flex column-gap-2'>
                                                <Typography variant='body1'>Prețul energiei active:</Typography>
                                                <Typography variant='body1' style={{ fontWeight: 500 }}>
                                                  {(row.energyConsumption * row.activeElectricityTariff).toFixed(
                                                    fractionDigits
                                                  ) + ' RON'}
                                                </Typography>
                                              </div>
                                              <div className='display-flex column-gap-2'>
                                                <Typography variant='body1'>
                                                  Tariful de introducere energie electrică în reţea:
                                                </Typography>
                                                <Typography variant='body1' style={{ fontWeight: 500 }}>
                                                  {(row.energyConsumption * tg).toFixed(fractionDigits) + ' RON'}
                                                </Typography>
                                              </div>
                                              <div className='display-flex column-gap-2'>
                                                <Typography variant='body1'>
                                                  Tariful de extracţie energie electrică din retea:
                                                </Typography>
                                                <Typography variant='body1' style={{ fontWeight: 500 }}>
                                                  {(row.energyConsumption * tl).toFixed(fractionDigits) + ' RON'}
                                                </Typography>
                                              </div>
                                              <div className='display-flex column-gap-2'>
                                                <Typography variant='body1'>
                                                  Tariful pentru serviciul de sistem:
                                                </Typography>
                                                <Typography variant='body1' style={{ fontWeight: 500 }}>
                                                  {(row.energyConsumption * systemServiceFee).toFixed(fractionDigits) +
                                                  ' RON'}
                                                </Typography>
                                              </div>
                                              <div className='display-flex column-gap-2'>
                                                <Typography variant='body1'>Tariful de distribuţie:</Typography>
                                                <Typography variant='body1' style={{ fontWeight: 500 }}>
                                                  {(row.energyConsumption * row.jt).toFixed(fractionDigits) + ' RON'}
                                                </Typography>
                                              </div>
                                              <div className='display-flex column-gap-2'>
                                                <Typography variant='body1'>Certificatele verzi:</Typography>
                                                <Typography variant='body1' style={{ fontWeight: 500 }}>
                                                  {(row.energyConsumption * greenCertificates).toFixed(fractionDigits) +
                                                  ' RON'}
                                                </Typography>
                                              </div>
                                              <div className='display-flex column-gap-2'>
                                                <Typography variant='body1'>Contribuția pentru cogenerare:</Typography>
                                                <Typography variant='body1' style={{ fontWeight: 500 }}>
                                                  {(row.energyConsumption * cogenerationContribution).toFixed(
                                                    fractionDigits
                                                  ) + ' RON'}
                                                </Typography>
                                              </div>
                                              <div className='display-flex column-gap-2'>
                                                <Typography variant='body1'>Acciza necomercială:</Typography>
                                                <Typography variant='body1' style={{ fontWeight: 500 }}>
                                                  {(row.energyConsumption * nonCommercialExciseDuty).toFixed(
                                                    fractionDigits
                                                  ) + ' RON'}
                                                </Typography>
                                              </div>
                                              <div className='display-flex column-gap-2'>
                                                <Typography variant='body1'>TVA:</Typography>
                                                <Typography variant='body1' style={{ fontWeight: 500 }}>
                                                  {(
                                                    row.energyConsumption *
                                                  (row.activeElectricityTariff +
                                                    tg +
                                                    tl +
                                                    systemServiceFee +
                                                    row.jt +
                                                    greenCertificates +
                                                    cogenerationContribution +
                                                    nonCommercialExciseDuty) *
                                                  tva
                                                  ).toFixed(fractionDigits) + ' RON'}
                                                </Typography>
                                              </div>
                                            </div>
                                            )}
                                      </div>
                                    </Paper>
                                  </Fade>
                                )}
                              </Popper>
                            </div>
                          )}
                        </PopupState>
                      </div>
                    </TableCell>
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
        <DialogContent className='dialog-content'>
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
      <CustomAppBar user={user} selectedAppBarItem='Devices' />
      {search}
      {table}
      {button}
      {buttonIsClicked && tableEstimatedConsumptionAndTotalCosts}
      {dialog}
    </div>
  )
}

export default DeviceList
