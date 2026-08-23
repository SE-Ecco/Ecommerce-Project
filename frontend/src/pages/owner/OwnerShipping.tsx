// WHAT: Shop owner's shipping methods management — add, edit, delete
// IMPORTS: shippingService
// USED BY: routes/index.tsx → path "/owner/shipping" (ProtectedRoute, shop_admin)

import { useEffect, useState } from 'react'
import {
  getShippingMethods,
  createShippingMethod,
  updateShippingMethod,
  deleteShippingMethod,
} from '../../services/shippingService'
import Spinner from '../../components/common/Spinner'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'

interface ShippingMethod {
  id: number
  name: string
  price?: number
  min_days?: number
  max_days?: number
}

interface ShippingForm {
  name: string
  price: string
  min_days: string
  max_days: string
}

const emptyForm: ShippingForm = { name: '', price: '', min_days: '', max_days: '' }

const OwnerShipping = () => {
  const [methods, setMethods] = useState<ShippingMethod[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [newMethod, setNewMethod] = useState<ShippingForm>(emptyForm)
  const [adding, setAdding] = useState(false)

  const [editingId, setEditingId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState<ShippingForm>(emptyForm)

  useEffect(() => {
    const fetchMethods = async () => {
      try {
        const data = await getShippingMethods()
        setMethods(data)
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Could not load shipping methods.')
      } finally {
        setLoading(false)
      }
    }

    fetchMethods()
  }, [])

  const toPayload = (form: ShippingForm) => ({
    name: form.name.trim(),
    price: form.price ? Number(form.price) : undefined,
    min_days: form.min_days ? Number(form.min_days) : undefined,
    max_days: form.max_days ? Number(form.max_days) : undefined,
  })

  const handleAdd = async () => {
    if (!newMethod.name.trim()) return
    setAdding(true)
    try {
      const created = await createShippingMethod(toPayload(newMethod))
      setMethods((prev) => [...prev, created])
      setNewMethod(emptyForm)
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Could not add shipping method.')
    } finally {
      setAdding(false)
    }
  }

  const startEdit = (method: ShippingMethod) => {
    setEditingId(method.id)
    setEditForm({
      name: method.name,
      price: method.price?.toString() || '',
      min_days: method.min_days?.toString() || '',
      max_days: method.max_days?.toString() || '',
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm(emptyForm)
  }

  const handleSaveEdit = async (id: number) => {
    if (!editForm.name.trim()) return
    try {
      const updated = await updateShippingMethod(id, toPayload(editForm))
      setMethods((prev) => prev.map((m) => (m.id === id ? updated : m)))
      cancelEdit()
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Could not update shipping method.')
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this shipping method?')) return
    try {
      await deleteShippingMethod(id)
      setMethods((prev) => prev.filter((m) => m.id !== id))
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Could not delete shipping method.')
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
      <h1 className="text-2xl font-bold mb-6">Shipping Methods</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
          {error}
        </div>
      )}

      <div className="border rounded-lg p-4 bg-white mb-8 space-y-3">
        <h2 className="font-semibold text-sm text-gray-600">Add New Method</h2>
        <Input name="name" label="Name (e.g. Standard Delivery)" value={newMethod.name} onChange={(e) => setNewMethod({ ...newMethod, name: e.target.value })} />
        <Input name="price" label="Price" value={newMethod.price} onChange={(e) => setNewMethod({ ...newMethod, price: e.target.value })} />
        <div className="flex gap-3">
          <Input name="min_days" label="Min Days" value={newMethod.min_days} onChange={(e) => setNewMethod({ ...newMethod, min_days: e.target.value })} />
          <Input name="max_days" label="Max Days" value={newMethod.max_days} onChange={(e) => setNewMethod({ ...newMethod, max_days: e.target.value })} />
        </div>
        <Button onClick={handleAdd} disabled={adding} fullWidth>
          Add Shipping Method
        </Button>
      </div>

      {methods.length === 0 ? (
        <p className="text-gray-500">No shipping methods yet.</p>
      ) : (
        <div className="space-y-3">
          {methods.map((method) => (
            <div key={method.id} className="border rounded-lg p-4 bg-white">
              {editingId === method.id ? (
                <div className="space-y-3">
                  <Input name="editName" label="Name" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                  <Input name="editPrice" label="Price" value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} />
                  <div className="flex gap-3">
                    <Input name="editMinDays" label="Min Days" value={editForm.min_days} onChange={(e) => setEditForm({ ...editForm, min_days: e.target.value })} />
                    <Input name="editMaxDays" label="Max Days" value={editForm.max_days} onChange={(e) => setEditForm({ ...editForm, max_days: e.target.value })} />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => handleSaveEdit(method.id)}>Save</Button>
                    <Button variant="outlined" onClick={cancelEdit}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{method.name}</p>
                    <p className="text-sm text-gray-500">
                      {method.price !== undefined ? `${method.price.toLocaleString()} IQD` : 'Free'}
                      {method.min_days && method.max_days
                        ? ` • ${method.min_days}-${method.max_days} days`
                        : ''}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outlined" onClick={() => startEdit(method)}>Edit</Button>
                    <Button variant="outlined" color="error" onClick={() => handleDelete(method.id)}>Delete</Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default OwnerShipping