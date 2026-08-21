// WHAT: Wraps all dashboard pages — adds Sidebar on left + content on right
// IMPORTS: Sidebar.tsx, react-router-dom (Outlet)
// USED BY: routes/index.tsx (for shop_admin + super_admin routes)


import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

const DashboardLayout = () => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* sidebar */}
      <Sidebar />

      {/* page content */}
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  )
}

export default DashboardLayout