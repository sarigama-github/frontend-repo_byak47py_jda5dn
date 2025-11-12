import React, { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import Dashboard from './components/Dashboard'
import VideoSuggest from './components/VideoSuggest'
import Resume from './components/Resume'
import DomainRoadmap from './components/DomainRoadmap'
import Profile from './components/Profile'
import { AuthProvider, useAuth } from './context/AuthContext'

function Gate() {
  const { user, loading } = useAuth()
  const [mode, setMode] = useState('login')
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && user) navigate('/')
  }, [user, loading])

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-6">
        {mode === 'login' ? (
          <Login onSwitch={() => setMode('register')} />
        ) : (
          <Register onSwitch={() => setMode('login')} onSuccess={() => setMode('login')} />
        )}
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/domain/:domain" element={<DomainRoadmap />} />
      <Route path="/videos/:domain/:stepId" element={<VideoSuggest />} />
      <Route path="/resume" element={<Resume />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Gate />
    </AuthProvider>
  )
}
