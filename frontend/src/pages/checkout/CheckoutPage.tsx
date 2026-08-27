// WHAT: Order confirmation + delivery address + place order
// IMPORTS: hooks/useCart, services/orderService, validations/orderValidation, formik
// FLOW: show cart summary → enter address → place order → clear cart → success redirect
// ⚠️ Protected route — must be logged in as customer
// WHAT: Checkout — select address, shipping, place order
// IMPORTS: orderService, addressService, shippingService, useCart
// PROTECTED: role = customer

import { useEffect, useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useCart } from '../../hooks/useCart'
import { placeOrder } from '../../services/orderService'
import { getAddresses } from '../../services/addressService'
import { getShippingMethods } from '../../services/shippingService'
import { formatPrice } from '../../utils/helpers'
import Spinner from '../../components/common/Spinner'
import Button from '../../components/common/Button'

const CheckoutPage = () => {
  const { items, totalPrice, clearCart } = useCart()
  const navigate = useNavigate()

  const [addresses, setAddresses] = useState<any[]>([])
  const [shippingMethods, setShippingMethods] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState('')

  const [selectedAddress, setSelectedAddress] = useState<number | null>(null)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [addr, shipping] = await Promise.all([
          getAddresses(),
          getShippingMethods(),
        ])
        setAddresses(addr)
        setShippingMethods(shipping)
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Could not load checkout data.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handlePlaceOrder = async () => {
    if (items.length === 0) return
    setPlacing(true)
    try {
      await placeOrder({
        items: items.map((i) => ({
          product_id: i.product.id,
          quantity: i.quantity,
        })),
        address_id: selectedAddress || undefined,
        notes: notes || undefined,
      })
      clearCart()
      navigate('/my-orders')
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Could not place order.')
    } finally {
      setPlacing(false)
    }
  }

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Spinner />
    </div>
  )

  if (items.length === 0) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
          {error}
        </div>
      )}

      {/* address selection */}
      <div className="bg-white border rounded-lg p-4 mb-4">
        <h2 className="font-semibold mb-3">Delivery Address</h2>
        {addresses.length === 0 ? (
          <p className="text-sm text-gray-500">
            No addresses saved.
            <button onClick={() => navigate('/addresses')}
              className="text-blue-600 ml-1 hover:underline">
              Add one
            </button>
          </p>
        ) : (
          <div className="space-y-2">
            {addresses.map((addr) => (
              <label key={addr.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="address"
                  value={addr.id}
                  onChange={() => setSelectedAddress(addr.id)}
                />
                <span className="text-sm">
                  {addr.label} — {addr.street}, {addr.city}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* notes */}
      <div className="bg-white border rounded-lg p-4 mb-4">
        <h2 className="font-semibold mb-3">Order Notes (optional)</h2>
        <textarea
          className="w-full border rounded px-3 py-2 text-sm"
          rows={3}
          placeholder="Any special instructions..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      {/* order summary */}
      <div className="bg-white border rounded-lg p-4 mb-6">
        <h2 className="font-semibold mb-3">Order Summary</h2>
        {items.map((item) => (
          <div key={item.product.id} className="flex justify-between text-sm py-1">
            <span>{item.product.name} × {item.quantity}</span>
            <span>{formatPrice(item.product.price * item.quantity)}</span>
          </div>
        ))}
        <div className="border-t mt-3 pt-3 flex justify-between font-bold">
          <span>Total</span>
          <span className="text-blue-600">{formatPrice(totalPrice)}</span>
        </div>
      </div>

      <Button fullWidth disabled={placing} onClick={handlePlaceOrder}>
        {placing ? 'Placing Order...' : 'Place Order'}
      </Button>
    </div>
  )
}

export default CheckoutPage