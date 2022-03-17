import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Button,
  Container,
  Menu,
  MenuItem,
  Tooltip,
  AppBar,
  Avatar,
  IconButton,
  Toolbar,
  Typography,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { Box } from '@mui/system'
import swal from 'sweetalert'
import PropTypes from 'prop-types'
import TableSortLabel from '@mui/material/TableSortLabel'
import { visuallyHidden } from '@mui/utils'
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
          key={'action'}
          align={'center'}
          padding={'normal'}
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

  const getUser = async () => {
    const response = await fetch('http://localhost:8080/api/auth/user', {
      method: 'GET',
      headers: {
        authorization: localStorage.getItem('accessToken')
      }
    })
    const data = await response.json()
    if (data.status === 'ok') {
      setUser(data.user)
    } else {
      swal('Failed', data.message, 'error').then((value) => {
        navigate('/login')
      })
    }
  }

  const getDevices = async () => {
    const response = await fetch('http://localhost:8080/api/auth/user/devices', {
      method: 'GET',
      headers: {
        authorization: localStorage.getItem('accessToken')
      }
    })
    const data = await response.json()
    if (data.status === 'ok') {
      setRows(data.devices)
    } else {
      swal('Failed', data.message, 'error').then((value) => {
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
    <AppBar position='static'>
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

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button key='Home' onClick={handleClickNavMenuHome} sx={{ my: 2, color: 'white', display: 'block' }}>
              Home
            </Button>
            <Typography
              key='Devices'
              variant='h6'
              noWrap
              component='div'
              sx={{ m: 2, display: { xs: 'none', md: 'flex' } }}
            >
              Devices
            </Typography>
            <Button key='Prizes' onClick={handleClickNavMenuPrizes} sx={{ my: 2, color: 'white', display: 'block' }}>
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

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0

  const table = (
    <Box sx={{ width: '90%', margin: '8px auto 0px auto' }}>
      <Paper sx={{ width: '100%', mb: 2, p: 2 }}>
        <TableContainer>
          <Table stickyHeader size={'medium'}>
            <EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <TableRow key={index} hover tabIndex={-1}>
                      <TableCell align={'left'} padding={'none'}>
                        {row.category}
                      </TableCell>
                      <TableCell align={'left'}>{row.efficiencyClass}</TableCell>
                      <TableCell align={'right'}>{row.energyConsumption}</TableCell>
                      <TableCell align={'left'}>{row.unitMeasurement}</TableCell>
                      <TableCell align={'right'}>{row.noOperatingHours}</TableCell>
                      <TableCell
                        align={'center'}
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          flexWrap: 'wrap',
                          alignItems: 'center',
                          justifyContent: 'center',
                          columnGap: 4
                        }}
                      >
                        <Button
                          variant='outlined'
                          color='inherit'
                          onClick={(event) => navigate(`/device-list/${row.id}`)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant='outlined'
                          color='error'
                          onClick={async (event) => {
                            const response = await fetch(`http://localhost:8080/api/auth/user/devices/${row.id}`, {
                              method: 'DELETE',
                              headers: {
                                authorization: localStorage.getItem('accessToken')
                              }
                            })
                            const data = await response.json()
                            if (data.status === 'ok') {
                              getDevices()
                            } else {
                              swal('Failed', data.message, 'error').then((value) => {
                                navigate('/login')
                              })
                            }
                          }}
                        >
                          Del
                        </Button>
                        <Button
                          variant='outlined'
                          color='secondary'
                          onClick={(event) => {
                            // TODO
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

  const buttons = (
    <Box sx={{ width: '90%', margin: '8px auto 0px auto' }}>
      <div className='d-flex justify-content-center gap-2' style={{ marginBottom: 8 }}>
        <Button
          variant='outlined'
          color='info'
          style={{ backgroundColor: '#fff', minWidth: '25%' }}
          onClick={(event) => {}}
        >
          Generates estimated consumption
        </Button>
        <Button
          variant='outlined'
          color='info'
          style={{ backgroundColor: '#fff', minWidth: '25%' }}
          onClick={(event) => {}}
        >
          Calculate total costs
        </Button>
      </div>
    </Box>
  )

  return (
    <div>
      {appBar}
      {table}
      {buttons}
    </div>
  )
}

export default DeviceList
