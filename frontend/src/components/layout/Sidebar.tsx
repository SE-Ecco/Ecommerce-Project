// WHAT: Dashboard sidebar navigation — links for owner/admin pages
// IMPORTS: react-router-dom, useAuth, @mui/material
// USED BY: DashboardLayout.tsx

import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Box, Typography } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import DashboardIcon from '@mui/icons-material/Dashboard'
import InventoryIcon from '@mui/icons-material/Inventory'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'
import CategoryIcon from '@mui/icons-material/Category'
import PersonIcon from '@mui/icons-material/Person'
import SettingsIcon from '@mui/icons-material/Settings'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import StoreIcon from '@mui/icons-material/Store'
import PeopleIcon from '@mui/icons-material/People'

const ownerLinks = [
  { label: 'Dashboard',  path: '/owner/dashboard',  icon: <DashboardIcon /> },
  { label: 'Products',   path: '/owner/products',   icon: <InventoryIcon /> },
  { label: 'Orders',     path: '/owner/orders',     icon: <ShoppingBagIcon /> },
  { label: 'Categories', path: '/owner/categories', icon: <CategoryIcon /> },
  { label: 'Profile',    path: '/owner/profile',    icon: <PersonIcon /> },
  { label: 'Settings',   path: '/owner/settings',   icon: <SettingsIcon /> },
  { label: 'Shipping',   path: '/owner/shipping',   icon: <LocalShippingIcon /> },
]

const adminLinks = [
  { label: 'Dashboard',  path: '/admin/dashboard',  icon: <DashboardIcon /> },
  { label: 'Shops',      path: '/admin/shops',      icon: <StoreIcon /> },
  { label: 'Users',      path: '/admin/users',      icon: <PeopleIcon /> },
]

const Sidebar = () => {
  const { isShopAdmin, isSuperAdmin, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const links = isShopAdmin ? ownerLinks : isSuperAdmin ? adminLinks : []

  return (
    <Box sx={{ width: 240, minHeight: '100vh', borderRight: '1px solid #e0e0e0' }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
          {user?.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {user?.role}
        </Typography>
      </Box>

      <Divider />

      <List>
        {links.map((link) => (
          <ListItem key={link.path} disablePadding>
            <ListItemButton
              selected={location.pathname === link.path}
              onClick={() => navigate(link.path)}
            >
              <ListItemIcon>{link.icon}</ListItemIcon>
              <ListItemText primary={link.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )
}

export default Sidebar