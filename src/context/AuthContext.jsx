import React, { createContext, useContext, useEffect, useState } from 'react'
import { api, getToken, setToken, clearToken } from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    const token = getToken()
    if (!token) {
      setLoading(false)
      return
    }
    try {
      const me = await api.me()
      setUser(me)
    } catch (e) {
      clearToken()
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const login = async (email, password) => {
    const res = await api.login(email, password)
    setToken(res.token)
    await load()
  }

  const logout = () => {
    clearToken()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
