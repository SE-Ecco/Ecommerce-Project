// WHAT: Customer manages delivery addresses — add, delete
// IMPORTS: addressService, Spinner
// PROTECTED: role = customer

import { useEffect, useState } from 'react'
import {
  getAddresses,
  createAddress,
  deleteAddress,
} from '../../services/addressService'
import Spinner from '../../components/common/Spinner'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'

const AddressPage = () => {
  const [addresses, setAddresses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({
    label: '', street: '', city: '', phone: ''
  })

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const data = await getAddresses()
        setAddresses(data)
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Could not load addresses.')
      } finally {
        setLoading(false)
      }
    }
    fetchAddresses()
  }, [])

  const handleAdd = async () => {
    if (!form.label || !form.street || !form.city || !form.phone) return
    setAdding(true)
    try {
      const created = await createAddress(form)
      setAddresses((prev) => [...prev, created])
      setForm({ label: '', street: '', city: '', phone: '' })
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Could not add address.')
    } finally {
      setAdding(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this address?')) return
    try {
      await deleteAddress(id)
      setAddresses((prev) => prev.filter((a) => a.id !== id))
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Could not delete address.')
    }
  }

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Spinner />
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">My Addresses</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
          {error}
        </div>
      )}

      {/* add form */}
      <div className="border rounded-lg p-4 bg-white mb-6 space-y-3">
        <h2 className="font-semibold text-sm text-gray-600">Add New Address</h2>
        <Input name="label" label="Label (e.g. Home)" value={form.label}
          onChange={(e) => setForm({ ...form, label: e.target.value })} />
        <Input name="street" label="Street" value={form.street}
          onChange={(e) => setForm({ ...form, street: e.target.value })} />
        <Input name="city" label="City" value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })} />
        <Input name="phone" label="Phone" value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <Button onClick={handleAdd} disabled={adding} fullWidth>
          {adding ? 'Adding...' : 'Add Address'}
        </Button>
      </div>

      {/* list */}
      {addresses.length === 0 ? (
        <p className="text-gray-500">No addresses yet.</p>
      ) : (
        <div className="space-y-3">
          {addresses.map((address) => (
            <div key={address.id}
              className="border rounded-lg p-4 bg-white flex justify-between items-center">
              <div>
                <p className="font-semibold">{address.label}</p>
                <p className="text-sm text-gray-500">{address.street}, {address.city}</p>
                <p className="text-sm text-gray-500">{address.phone}</p>
              </div>
              <Button variant="outlined" color="error"
                onClick={() => handleDelete(address.id)}>
                Delete
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AddressPage