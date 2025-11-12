import React, { useState } from 'react'
import { api } from '../../lib/api'

export default function Register({ onSwitch, onSuccess }) {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    qualification: '',
    phone: '',
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onlyLetters = /^([A-Za-z]{2,50})$/
  const onlyDigits10 = /^[0-9]{10}$/
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const validate = () => {
    setError('')
    if (!onlyLetters.test(form.first_name)) return setError('First name must be letters only (2-50)')
    if (!onlyLetters.test(form.last_name)) return setError('Last name must be letters only (2-50)')
    if (!form.qualification || form.qualification.length < 2) return setError('Enter a valid IT-related qualification')
    if (!onlyDigits10.test(form.phone)) return setError('Phone must be exactly 10 digits')
    if (!emailRegex.test(form.email)) return setError('Enter a valid email')
    if (form.password.length < 6) return setError('Password must be at least 6 characters')
    return true
  }

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await api.register(form)
      onSuccess?.()
    } catch (e) {
      setError(e.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Create your account</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">First name</label>
            <input name="first_name" value={form.first_name} onChange={onChange} pattern="[A-Za-z]{2,50}" required className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="John" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Last name</label>
            <input name="last_name" value={form.last_name} onChange={onChange} pattern="[A-Za-z]{2,50}" required className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Doe" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Qualification</label>
          <input name="qualification" value={form.qualification} onChange={onChange} required className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="B.Tech CSE" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input name="phone" value={form.phone} onChange={onChange} pattern="[0-9]{10}" required className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="9876543210" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input name="email" type="email" value={form.email} onChange={onChange} required className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="you@example.com" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input name="password" type="password" value={form.password} onChange={onChange} minLength={6} required className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="At least 6 characters" />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition disabled:opacity-60">
          {loading ? 'Creating...' : 'Create account'}
        </button>
      </form>
      <p className="text-sm text-center mt-4">Have an account? <button onClick={onSwitch} className="text-blue-600 underline">Login</button></p>
    </div>
  )
}
