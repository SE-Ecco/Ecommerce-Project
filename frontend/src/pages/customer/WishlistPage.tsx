// WHAT: Customer wishlist — saved products list
// IMPORTS: wishlistService, useWishlist, WishlistItem
// PROTECTED: role = customer

import { useEffect, useState } from 'react'
import { getWishlist, removeFromWishlist } from '../../services/wishlistService'
import Spinner from '../../components/common/Spinner'
import WishlistItem from '../../components/wishlist/WishlistItem'

const WishlistPage = () => {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const data = await getWishlist()
        setItems(data)
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Could not load wishlist.')
      } finally {
        setLoading(false)
      }
    }
    fetchWishlist()
  }, [])

  const handleRemove = async (wishlistId: number, productId: number) => {
    try {
      await removeFromWishlist(wishlistId, productId)
      setItems((prev) => prev.filter((i) => i.id !== wishlistId))
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Could not remove item.')
    }
  }

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Spinner />
    </div>
  )

  if (error) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <p className="text-red-600">{error}</p>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>

      {items.length === 0 ? (
        <p className="text-gray-500 text-center">Your wishlist is empty.</p>
      ) : (
        <div className="space-y-2 bg-white border rounded-lg p-4">
          {items.map((item) => (
            <WishlistItem
              key={item.id}
              product={item.product}
              wishlistId={item.id}
              onRemove={handleRemove}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default WishlistPage