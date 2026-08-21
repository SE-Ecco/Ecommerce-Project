// WHAT: All products of ONE shop with category filter + search + pagination
// IMPORTS: services/productService, services/shopService, services/categoryService
//          store/shopStore, components/product/ProductGrid, components/common/{Spinner, Pagination, SearchBar}
// FLOW: read :slug from URL → load shop → load categories → load products → render grid


import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getProducts,getProductsBySlug } from '../../services/productService'
import { Product } from '../../types'
import ProductGrid from '../../components/product/ProductGrid'
import Spinner from '../../components/common/Spinner'

const ProductsPage = () => {
  const { slug } = useParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProductsBySlug(slug!)
        setProducts(data)
      } catch (err: any) {
        setError(
          err?.response?.data?.message || 'Could not load products.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Products</h1>

      {products.length === 0 ? (
        <p className="text-center text-gray-500">No products available.</p>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  )
}

export default ProductsPage