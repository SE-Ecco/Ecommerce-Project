// WHAT: Success/error toast notification
// IMPORTS: @mui/material
// USED BY: any page that needs to show success/error messages

import { Snackbar, Alert, AlertColor } from '@mui/material'

interface Props {
  open: boolean
  message: string
  severity?: AlertColor
  onClose: () => void
}

const Toast = ({ open, message, severity = 'info', onClose }: Props) => {
  return (
    <Snackbar open={open} autoHideDuration={4000} onClose={onClose}>
      <Alert onClose={onClose} severity={severity} variant="filled">
        {message}
      </Alert>
    </Snackbar>
  )
}

export default Toast