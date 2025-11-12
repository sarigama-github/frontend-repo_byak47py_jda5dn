import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  return (
    <nav className="bg-white border-b sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button onClick={()=>navigate('/')} className="font-semibold text-lg">LernifyRoad</button>
          <Link className="text-sm hover:text-blue-600" to="/">Dashboard</Link>
          <Link className="text-sm hover:text-blue-600" to="/resume">Resume Builder</Link>
          <Link className="text-sm hover:text-blue-600" to="/profile">Edit Profile</Link>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">Hi, {user?.first_name}</span>
          <button onClick={logout} className="bg-gray-800 text-white px-3 py-1.5 rounded">Logout</button>
        </div>
      </div>
    </nav>
  )
}
