// WHAT: Shop admin manages product categories — add/edit/delete
// IMPORTS: services/categoryService, components/category/CategoryForm, hooks/useAuth
// PROTECTED: role = shop_admin only

import { useEffect, useState } from 'react'
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../../services/categoryService'
import { Category } from '../../types'
import Spinner from '../../components/common/Spinner'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'

const OwnerCategories = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [newName, setNewName] = useState('')
  const [adding, setAdding] = useState(false)

  const [editingId, setEditingId] = useState<number | null>(null)
  const [editName, setEditName] = useState('')

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories()
        setCategories(data)
      } catch (err: any) {
        setError(
          err?.response?.data?.message || 'Could not load categories.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const handleAdd = async () => {
    if (!newName.trim()) return
    setAdding(true)
    try {
      const created = await createCategory({ name: newName.trim() })
      setCategories((prev) => [...prev, created])
      setNewName('')
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Could not add category.')
    } finally {
      setAdding(false)
    }
  }

  const startEdit = (category: Category) => {
    setEditingId(category.id)
    setEditName(category.name)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditName('')
  }

  const handleSaveEdit = async (id: number) => {
    if (!editName.trim()) return
    try {
      const updated = await updateCategory(id, { name: editName.trim() })
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? updated : c))
      )
      cancelEdit()
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Could not update category.')
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this category?')) return
    try {
      await deleteCategory(id)
      setCategories((prev) => prev.filter((c) => c.id !== id))
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Could not delete category.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Categories</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-2 mb-8">
        <div className="flex-1">
          <Input
            name="newCategory"
            label="New category name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </div>
        <Button onClick={handleAdd} disabled={adding}>
          Add
        </Button>
      </div>

      {categories.length === 0 ? (
        <p className="text-gray-500">No categories yet.</p>
      ) : (
        <div className="space-y-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className="border rounded-lg p-3 bg-white flex justify-between items-center"
            >
              {editingId === category.id ? (
                <div className="flex-1 flex gap-2 items-center">
                  <Input
                    name="editCategory"
                    label=""
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                  <Button onClick={() => handleSaveEdit(category.id)}>
                    Save
                  </Button>
                  <Button variant="outlined" onClick={cancelEdit}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <>
                  <span>{category.name}</span>
                  <div className="flex gap-2">
                    <Button variant="outlined" onClick={() => startEdit(category)}>
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDelete(category.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default OwnerCategories