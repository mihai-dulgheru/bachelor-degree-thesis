import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import MenuIcon from '@mui/icons-material/Menu'
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography
} from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const listOfAppBarItems = [
  {
    name: 'Home',
    path: '/'
  },
  {
    name: 'Devices',
    path: '/device-list'
  },
  {
    name: 'Prizes',
    path: '/prizes'
  },
  {
    name: 'Charts',
    path: '/charts'
  }
]

const CustomAppBar = ({ user, selectedAppBarItem }) => {
  const navigate = useNavigate()
  const [anchorElNav, setAnchorElNav] = useState(null)
  const [anchorElUser, setAnchorElUser] = useState(null)

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  const handleClickMenuItem = (item) => {
    setAnchorElNav(null)
    navigate(item.path)
  }

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget)
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

  return (
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
              // style={{ top: '1em' }}
              style={{ top: '.5em' }}
            >
              {listOfAppBarItems
                .filter((item) => {
                  return item.name !== selectedAppBarItem
                })
                .map((item) => {
                  return (
                    <MenuItem key={item.name} onClick={() => handleClickMenuItem(item)}>
                      <Typography textAlign='center'>{item.name}</Typography>
                    </MenuItem>
                  )
                })}
            </Menu>
          </Box>
          <Typography variant='h6' noWrap component='div' sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            {selectedAppBarItem}
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }} className='box'>
            {listOfAppBarItems.map((item) => {
              return item.name === selectedAppBarItem ? (
                <Typography key={item.name} variant='h6' noWrap component='div'>
                  {selectedAppBarItem}
                </Typography>
              ) : (
                <Button
                  key={item.name}
                  onClick={() => handleClickMenuItem(item)}
                  sx={{ py: 2, color: 'white', display: 'block' }}
                >
                  {item.name}
                </Button>
              )
            })}
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
              // style={{ top: '1em' }}
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
}

export default CustomAppBar
