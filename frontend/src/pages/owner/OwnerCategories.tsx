import { useEffect, useState } from 'react'
import {
  getCategories,
  deleteCategory,
} from '../../services/categoryService'
import { Category } from '../../types'
import Spinner from '../../components/common/Spinner'
import CategoryForm from '../../components/category/CategoryForm'
import Button from '../../components/common/Button'

const OwnerCategories = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)

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

  useEffect(() => {
    fetchCategories()
  }, [])

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

      {/* Add form */}
      <div className="mb-8 border rounded-lg p-4 bg-white">
        <CategoryForm onSuccess={fetchCategories} />
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
                <div className="flex-1">
                  <CategoryForm
                    category={category}
                    onSuccess={() => {
                      fetchCategories()
                      setEditingId(null)
                    }}
                  />
                </div>
              ) : (
                <>
                  <span>{category.name}</span>
                  <div className="flex gap-2">
                    <Button variant="outlined" onClick={() => setEditingId(category.id)}>
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