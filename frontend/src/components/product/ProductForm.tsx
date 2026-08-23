// WHAT: Create/Edit product form — reusable in a page or a modal
// IMPORTS: productService, categoryService
// USED BY: OwnerProducts.tsx (create + edit flows)

import { useEffect, useState } from 'react'
import { createProduct, updateProduct } from '../../services/productService'
import { getCategories } from '../../services/categoryService'
import { Product, Category } from '../../types'
import Input from '../common/Input'
import Button from '../common/Button'
import Spinner from '../common/Spinner'

interface Props {
  product?: Product
  onSuccess?: () => void
}

const ProductForm = ({ product, onSuccess }: Props) => {
  const isEditing = Boolean(product)

  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)

  const [name, setName] = useState(product?.name || '')
  const [description, setDescription] = useState(product?.description || '')
  const [price, setPrice] = useState(product?.price?.toString() || '')
  const [stock, setStock] = useState(product?.stock?.toString() || '')
  const [categoryId, setCategoryId] = useState(
    product?.category_id?.toString() || ''
  )
  const [imageFile, setImageFile] = useState<File | null>(null)

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories()
        setCategories(data)
      } catch {
        // non-blocking — form still usable without categories loaded
      } finally {
        setLoadingCategories(false)
      }
    }

    fetchCategories()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name.trim() || !price || !stock || !categoryId) {
      setError('Please fill in all required fields.')
      return
    }

    setSaving(true)

    try {
      if (isEditing && product) {
        await updateProduct(product.id, {
          name: name.trim(),
          description: description.trim(),
          price: Number(price),
          stock: Number(stock),
          category_id: Number(categoryId),
        })
      } else {
        const formData = new FormData()
        formData.append('name', name.trim())
        formData.append('description', description.trim())
        formData.append('price', price)
        formData.append('stock', stock)
        formData.append('category_id', categoryId)
        if (imageFile) {
          formData.append('image', imageFile)
        }
        await createProduct(formData)
      }

      onSuccess?.()
    } catch (err: any) {
      setError(
        err?.response?.data?.message || 'Could not save product. Please try again.'
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold">
        {isEditing ? 'Edit Product' : 'Add Product'}
      </h2>

      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded text-sm">
          {error}
        </div>
      )}

      <Input
        name="name"
        label="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <Input
        name="description"
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div className="flex gap-3">
        <Input
          name="price"
          label="Price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <Input
          name="stock"
          label="Stock"
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">Category</label>
        {loadingCategories ? (
          <Spinner />
        ) : (
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {!isEditing && (
        <div>
          <label className="block text-sm text-gray-600 mb-1">Product Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          />
        </div>
      )}

      <Button type="submit" disabled={saving} fullWidth>
        {saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Add Product'}
      </Button>
    </form>
  )
}

export default ProductForm