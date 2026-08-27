// WHAT: Homepage — shows all active shops so customer picks one
// IMPORTS: services/shopService, components/common/Spinner
// FLOW: load all shops → display shop cards → click → go to /shops/:slug/products

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getShops } from '../../services/shopService'
import { Shop } from '../../types'
import Spinner from '../../components/common/Spinner'

const HomePage = () => {
  const [shops, setShops] = useState<Shop[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const data = await getShops()
        setShops(data.filter((s) => s.status === 'active'))
      } catch (err: any) {
        setError(
          err?.response?.data?.message || 'Could not load shops. Please try again.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchShops()
  }, [])

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
      <h1 className="text-3xl font-bold mb-8 text-center">
        Shops in Duhok
      </h1>

      {shops.length === 0 ? (
        <p className="text-center text-gray-500">No shops available yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {shops.map((shop) => (
            <div
              key={shop.id}
              onClick={() => navigate(`/shops/${shop.slug}/products`)}
              className="cursor-pointer border rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
            >
              <img
                src={shop.cloudinary_logo_url || '/placeholder-shop.png'} // 🔧 fix
                alt={shop.name}
                className="w-full h-40 object-cover rounded mb-3"
              />
              <h2 className="text-lg font-semibold">{shop.name}</h2>
              {shop.description && (
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {shop.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default HomePage