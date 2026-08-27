import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import { useNotifications } from "../../hooks/useNotifications";
import { Badge, IconButton, Menu, MenuItem, Typography, Box } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { motion } from "framer-motion";
import CartDrawer from "../cart/CartDrawer";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { totalItems } = useCart();
  const { items, unreadCount, fetchNotifications, markAsRead } = useNotifications();
  const [cartOpen, setCartOpen] = useState(false);
  const [notifAnchor, setNotifAnchor] = useState<null | HTMLElement>(null);

  useEffect(() => {
    if (isAuthenticated) fetchNotifications();
  }, [isAuthenticated]);

  const handleNotifClose = () => setNotifAnchor(null);

  return (
    <>
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <Link to="/">jiwar</Link>

        <button onClick={() => setCartOpen(true)}>
          <Badge badgeContent={totalItems} color="error">
            <ShoppingCartIcon />
          </Badge>
        </button>

        {isAuthenticated && (
          <Box>
            <IconButton onClick={(e) => setNotifAnchor(e.currentTarget)}>
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <Menu
              anchorEl={notifAnchor}
              open={Boolean(notifAnchor)}
              onClose={handleNotifClose}
              slotProps={{ paper: { sx: { maxHeight: 300, width: 300 } } }}
            >
              {items.length === 0 ? (
                <MenuItem disabled>
                  <Typography variant="body2">No notifications</Typography>
                </MenuItem>
              ) : (
                items.slice(0, 10).map((notif) => (
                  <MenuItem
                    key={notif.id}
                    onClick={() => { markAsRead(notif.id); handleNotifClose(); }}
                    sx={{ opacity: notif.is_read ? 0.6 : 1 }}
                  >
                    <Typography variant="body2">{notif.title}</Typography>
                  </MenuItem>
                ))
              )}
            </Menu>
          </Box>
        )}

        {isAuthenticated ? (
          <span>
            Hi, {user?.name}
            <button onClick={() => { if (window.confirm('Are you sure you want to logout?')) logout(); }}>
              Logout
            </button>
          </span>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </motion.nav>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export default Navbar;