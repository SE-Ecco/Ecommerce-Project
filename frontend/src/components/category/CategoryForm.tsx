// WHAT: Create/edit category form
// IMPORTS: @mui/material, categoryService, Toast
// USED BY: OwnerCategories.tsx

import { useState } from 'react'
import { TextField } from '@mui/material'
import { createCategory, updateCategory } from '../../services/categoryService'
import { Category } from '../../types'
import Button from '../common/Button'
import Toast from '../common/Toast'

interface Props {
  category?: Category       // if passed → edit mode, else → create mode
  onSuccess: () => void     // called after save → parent refreshes list
}

const CategoryForm = ({ category, onSuccess }: Props) => {
  const [name, setName] = useState(category?.name || '')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  })

  const handleSubmit = async () => {
    if (!name.trim()) return
    setLoading(true)

    try {
      if (category) {
        await updateCategory(category.id, { name })
        setToast({ open: true, message: 'Category updated!', severity: 'success' })
      } else {
        await createCategory({ name })
        setToast({ open: true, message: 'Category created!', severity: 'success' })
        setName('')
      }
      onSuccess()
    } catch (err: any) {
      setToast({
        open: true,
        message: err?.response?.data?.message || 'Something went wrong',
        severity: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <TextField
        fullWidth
        label="Category Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button
        onClick={handleSubmit}
        disabled={loading || !name.trim()}
        fullWidth
      >
        {loading ? 'Saving...' : category ? 'Update Category' : 'Create Category'}
      </Button>

      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </>
  )
}

export default CategoryForm