// WHAT: Shop admin manages their products — table with add/edit/delete
// IMPORTS: services/productService, components/product/ProductForm, hooks/useAuth
// PROTECTED: role = shop_admin only


import { useEffect, useState } from 'react'
import { getProducts, deleteProduct } from '../../services/productService'
import { Product } from '../../types'
import ProductForm from '../../components/product/ProductForm'
import Spinner from '../../components/common/Spinner'
import Button from '../../components/common/Button'

const OwnerProducts = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const fetchProducts = async () => {
    try {
      const data = await getProducts()
      setProducts(data)
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Could not load products.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const openAddForm = () => {
    setEditingProduct(null)
    setShowForm(true)
  }

  const openEditForm = (product: Product) => {
    setEditingProduct(product)
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingProduct(null)
  }

  const handleFormSuccess = () => {
    closeForm()
    setLoading(true)
    fetchProducts()
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this product?')) return
    try {
      await deleteProduct(id)
      setProducts((prev) => prev.filter((p) => p.id !== id))
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Could not delete product.')
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
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Products</h1>
        {!showForm && (
          <Button onClick={openAddForm}>+ Add Product</Button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
          {error}
        </div>
      )}

      {showForm && (
        <div className="border rounded-lg p-6 bg-white mb-8">
          <ProductForm product={editingProduct || undefined} onSuccess={handleFormSuccess} />
          <button
            onClick={closeForm}
            className="text-sm text-gray-500 mt-3 hover:underline"
          >
            Cancel
          </button>
        </div>
      )}

      {products.length === 0 ? (
        <p className="text-gray-500">No products yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="border rounded-lg p-4 bg-white">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-32 object-cover rounded mb-3"
                />
              ) : (
                <div className="w-full h-32 bg-gray-100 rounded mb-3 flex items-center justify-center text-gray-400 text-sm">
                  No image
                </div>
              )}

              <h2 className="font-semibold truncate">{product.name}</h2>
              <p className="text-blue-600 font-bold">{product.price.toLocaleString()} IQD</p>

              <span
                className={`inline-block mt-1 text-xs px-2 py-1 rounded ${
                  product.is_available && product.stock > 0
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {product.is_available && product.stock > 0
                  ? `${product.stock} in stock`
                  : 'Out of stock'}
              </span>

              <div className="flex gap-2 mt-3">
                <Button variant="outlined" onClick={() => openEditForm(product)}>
                  Edit
                </Button>
                <Button variant="outlined" color="error" onClick={() => handleDelete(product.id)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default OwnerProducts