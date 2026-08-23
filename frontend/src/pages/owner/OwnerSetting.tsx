// WHAT: Shop owner's settings page — currency, language, theme color, SEO meta
// IMPORTS: shopSettingsService
// USED BY: routes/index.tsx → path "/owner/settings" (ProtectedRoute, shop_admin)

import { useEffect, useState } from 'react'
import { getShopSettings, updateShopSettings } from '../../services/shopSettingsService'
import Spinner from '../../components/common/Spinner'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'

interface ShopSettingsForm {
  currency: string
  language: string
  theme_color: string
  meta_title: string
  meta_desc: string
}

const OwnerSettings = () => {
  const [form, setForm] = useState<ShopSettingsForm>({
    currency: '',
    language: '',
    theme_color: '',
    meta_title: '',
    meta_desc: '',
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getShopSettings()
        setForm({
          currency: data.currency || '',
          language: data.language || '',
          theme_color: data.theme_color || '',
          meta_title: data.meta_title || '',
          meta_desc: data.meta_desc || '',
        })
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Could not load settings.')
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  const handleChange = (field: keyof ShopSettingsForm) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleSave = async () => {
    setSaving(true)
    setSuccess('')
    setError('')
    try {
      await updateShopSettings(form)
      setSuccess('Settings updated successfully.')
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Could not save settings.')
    } finally {
      setSaving(false)
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
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Shop Settings</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded text-sm">
          {success}
        </div>
      )}

      <div className="space-y-4">
        <Input name="currency" label="Currency (e.g. IQD)" value={form.currency} onChange={handleChange('currency')} />
        <Input name="language" label="Language (e.g. en)" value={form.language} onChange={handleChange('language')} />
        <Input name="theme_color" label="Theme Color (e.g. #2563eb)" value={form.theme_color} onChange={handleChange('theme_color')} />
        <Input name="meta_title" label="Meta Title (SEO)" value={form.meta_title} onChange={handleChange('meta_title')} />
        <Input name="meta_desc" label="Meta Description (SEO)" value={form.meta_desc} onChange={handleChange('meta_desc')} />

        <Button onClick={handleSave} disabled={saving} fullWidth>
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  )
}

export default OwnerSettings