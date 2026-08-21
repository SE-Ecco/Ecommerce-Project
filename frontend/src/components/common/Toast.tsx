// WHAT: Success/error toast notification
// IMPORTS: @mui/material
// USED BY: any page that needs to show success/error messages

import { Snackbar, Alert } from '@mui/material'

interface ToastProps {
  open: boolean
  message: string
  severity: 'success' | 'error' | 'warning' | 'info'
  onClose: () => void
}

const Toast = ({ open, message, severity, onClose }: ToastProps) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert onClose={onClose} severity={severity} variant="filled">
        {message}
      </Alert>
    </Snackbar>
  )
}

export default Toast