// WHAT: Reusable popup modal (wraps MUI Dialog)
// IMPORTS: @mui/material
// USED BY: pages/owner/OwnerProducts (add product), admin pages

// WHAT: Reusable popup modal (wraps MUI Dialog)
// USED BY: pages/owner/OwnerProducts (add product), admin pages

import { Dialog, DialogContent, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { ReactNode } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogContent>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
        {children}
      </DialogContent>
    </Dialog>
  )
}

// NOTES:
// isOpen   → show/hide switch, owned and controlled by the PARENT page, not Modal itself
// onClose  → runs on outside-click, Escape key, or clicking the ✕ button
// children → whatever content the parent page places inside <Modal>...</Modal>,
//            which is what makes this one file reusable across the whole app

/**
 * 🪟 STORY
 * Modal never decides anything on its own. A shop owner clicks
 * "Add Product" on their page → that page flips isOpen to true →
 * Modal just shows up, holding whatever content it was handed.
 *
 * Click the ✕, click outside, or hit Escape → onClose fires,
 * which the parent page uses to flip isOpen back to false.
 *
 * Modal has no memory of its own state — it's just a mirror of
 * whatever switch the parent page hands it. That's exactly why
 * the same file works for OwnerProducts' add-product form,
 * AdminShops' delete confirmation, or any future popup in Jiwar —
 * Modal doesn't care what's inside, only the parent page decides that.
 */