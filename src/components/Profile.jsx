import React, { useEffect, useState } from 'react'
import { api } from '../lib/api'

export default function Profile() {
  const [form, setForm] = useState({ phone: '', current_password: '', new_password: '' })
  const [me, setMe] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => { api.me().then(setMe).catch(()=>{}) }, [])

  const submit = async (e) => {
    e.preventDefault()
    setMessage('')
    try {
      const payload = {}
      if (form.phone) payload.phone = form.phone
      if (form.new_password) payload.new_password = form.new_password, payload.current_password = form.current_password
      await api.updateMe(payload)
      setMessage('Profile updated')
      setForm({ phone: '', current_password: '', new_password: '' })
    } catch (e) {
      setMessage(e.message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-xl font-semibold mb-4">Edit Profile</h1>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-600 mb-4">{me?.first_name} {me?.last_name} · {me?.email}</p>
          <form onSubmit={submit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input value={form.phone} onChange={(e)=>setForm({...form, phone: e.target.value})} pattern="[0-9]{10}" className="w-full border rounded px-3 py-2" placeholder="10-digit phone" />
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Current Password</label>
                <input type="password" value={form.current_password} onChange={(e)=>setForm({...form, current_password: e.target.value})} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">New Password</label>
                <input type="password" value={form.new_password} onChange={(e)=>setForm({...form, new_password: e.target.value})} minLength={6} className="w-full border rounded px-3 py-2" />
              </div>
            </div>
            {message && <p className="text-sm">{message}</p>}
            <button className="bg-blue-600 text-white px-3 py-2 rounded">Save Changes</button>
          </form>
        </div>
      </div>
    </div>
  )
}
