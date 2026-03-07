import { Box } from '@mui/material'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './components/header'

function MainLayout() {
  const location = useLocation()
  const isWelcomePage = location.pathname === '/'

  return (
    <Box className="app-shell">
      {!isWelcomePage && <Header />}
      <Box component="main" className="page-content">
        <Outlet />
      </Box>
    </Box>
  )
}

export default MainLayout
