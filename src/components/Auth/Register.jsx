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
  const [errors, setErrors] = useState({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onlyLetters = /^([A-Za-z]{2,50})$/
  const onlyDigits10 = /^[0-9]{10}$/
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const setFieldError = (field, message) => setErrors(prev => ({ ...prev, [field]: message }))

  const validateField = (name, value) => {
    let msg = ''
    if (name === 'first_name' || name === 'last_name') {
      if (!onlyLetters.test(value)) msg = 'Letters only (2-50)'
    }
    if (name === 'qualification') {
      if (!value || value.length < 2) msg = 'Enter a valid qualification'
    }
    if (name === 'phone') {
      if (!onlyDigits10.test(value)) msg = '10 digits required'
    }
    if (name === 'email') {
      if (!emailRegex.test(value)) msg = 'Invalid email'
    }
    if (name === 'password') {
      if (!value || value.length < 6) msg = 'Min 6 characters'
    }
    setFieldError(name, msg)
    return !msg
  }

  const validateAll = () => {
    const fields = Object.entries(form)
    let ok = true
    for (const [k, v] of fields) {
      const valid = validateField(k, v)
      if (!valid) ok = false
    }
    return ok
  }

  const onChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
    validateField(name, value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!validateAll()) return
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
            <input name="first_name" value={form.first_name} onChange={onChange} pattern="[A-Za-z]{2,50}" required className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 ${errors.first_name? 'border-red-500 focus:ring-red-300':'focus:ring-blue-500'}`} placeholder="John" />
            {errors.first_name && <p className="text-xs text-red-600 mt-1">{errors.first_name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Last name</label>
            <input name="last_name" value={form.last_name} onChange={onChange} pattern="[A-Za-z]{2,50}" required className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 ${errors.last_name? 'border-red-500 focus:ring-red-300':'focus:ring-blue-500'}`} placeholder="Doe" />
            {errors.last_name && <p className="text-xs text-red-600 mt-1">{errors.last_name}</p>}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Qualification</label>
          <input name="qualification" value={form.qualification} onChange={onChange} required className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 ${errors.qualification? 'border-red-500 focus:ring-red-300':'focus:ring-blue-500'}`} placeholder="B.Tech CSE" />
          {errors.qualification && <p className="text-xs text-red-600 mt-1">{errors.qualification}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input name="phone" value={form.phone} onChange={onChange} pattern="[0-9]{10}" required className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 ${errors.phone? 'border-red-500 focus:ring-red-300':'focus:ring-blue-500'}`} placeholder="9876543210" />
          {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input name="email" type="email" value={form.email} onChange={onChange} required className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 ${errors.email? 'border-red-500 focus:ring-red-300':'focus:ring-blue-500'}`} placeholder="you@example.com" />
          {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input name="password" type="password" value={form.password} onChange={onChange} minLength={6} required className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 ${errors.password? 'border-red-500 focus:ring-red-300':'focus:ring-blue-500'}`} placeholder="At least 6 characters" />
          {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
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
