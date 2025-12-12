import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext(null)
const API_URL = 'http://localhost:5000/api'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = sessionStorage.getItem('plantpal_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email, password, nameOverride) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (data.success) {
        const userData = { ...data.user, email }
        setUser(userData)
        sessionStorage.setItem('plantpal_user', JSON.stringify(userData))
        return userData
      } else {
        throw new Error(data.error)
      }
    } catch (err) {
      throw err
    }
  }

  const signup = async (email, password, name) => {
    try {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      })
      const data = await res.json()
      if (data.success) {
        const userData = { ...data.user, email }
        setUser(userData)
        sessionStorage.setItem('plantpal_user', JSON.stringify(userData))
        return userData
      } else {
        throw new Error(data.error)
      }
    } catch (err) {
      throw err
    }
  }

  const logout = () => {
    setUser(null)
    sessionStorage.removeItem('plantpal_user')
  }

  const value = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    loading,
  }), [user, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
