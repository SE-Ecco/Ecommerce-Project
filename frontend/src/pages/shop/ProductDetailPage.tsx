// WHAT: Full product detail — description, price, quantity, add to cart
// IMPORTS: productService, useCart, helpers
// FLOW: read :id from URL → load product → display → add to cart

import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getProductById } from '../../services/productService'
import { useCart } from '../../hooks/useCart'
import { formatPrice } from '../../utils/helpers'
import { Product } from '../../types'
import Spinner from '../../components/common/Spinner'
import Button from '../../components/common/Button'

const ProductDetailPage = () => {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(Number(id))
        setProduct(data)
      } catch (err: any) {
        setError(
          err?.response?.data?.message || 'Could not load product.'
        )
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-red-600">{error || 'Product not found.'}</p>
      </div>
    )
  }

  const outOfStock = !product.is_available || product.stock === 0

  const handleAddToCart = () => {
    addItem({ product, quantity })
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* image — no image_url in model, show placeholder */}
        <div className="w-full h-80 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
          No image {/* 🔧 fix: image_url removed */}
        </div>

        <div>
          <h1 className="text-2xl font-bold">{product.name}</h1>

          {product.description && (
            <p className="text-gray-600 mt-3">{product.description}</p>
          )}

          <p className="text-2xl font-bold text-blue-600 mt-4">
            {formatPrice(product.price)}
          </p>

          {outOfStock ? (
            <span className="inline-block mt-3 text-sm bg-red-100 text-red-600 px-3 py-1 rounded">
              Out of stock
            </span>
          ) : (
            <span className="inline-block mt-3 text-sm text-gray-500">
              {product.stock} in stock
            </span>
          )}

          {!outOfStock && (
            <>
              <div className="flex items-center gap-3 mt-6">
                <Button
                  variant="outlined"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  −
                </Button>
                <span className="text-lg font-medium w-8 text-center">
                  {quantity}
                </span>
                <Button
                  variant="outlined"
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                >
                  +
                </Button>
              </div>

              <Button
                onClick={handleAddToCart}
                fullWidth
                className="mt-4"
              >
                Add to Cart
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage
