// WHAT: Shop admin views + edits their shop info (name, description, logo)
// IMPORTS: services/shopService, hooks/useAuth, formik
// PROTECTED: role = shop_admin only
// FIELDS: Shop name, description, logo upload

import { useAuth } from '../../hooks/useAuth'

const OwnerProfile = () => {
  const { user } = useAuth()

  if (!user) {
    return null
  }

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      <div className="border rounded-lg p-6 bg-white flex flex-col items-center text-center">
        {user.cloudinary_avatar_url ? (
          <img
            src={user.cloudinary_avatar_url}
            alt={user.name}
            className="w-24 h-24 rounded-full object-cover mb-4"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center text-2xl font-bold text-gray-400 mb-4">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}

        <h2 className="text-lg font-semibold">{user.name}</h2>
        <p className="text-gray-500 text-sm">{user.email}</p>

        <span className="inline-block mt-3 text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full capitalize">
          {user.role.replace('_', ' ')}
        </span>

        <p className="text-xs text-gray-400 mt-6">
          Profile editing is coming soon.
        </p>
      </div>
    </div>
  )
}

export default OwnerProfile