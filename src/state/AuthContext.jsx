import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext(null)

const STORAGE_KEY = 'plantpal_user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setUser(JSON.parse(raw))
    } catch {}
  }, [])

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    else localStorage.removeItem(STORAGE_KEY)
  }, [user])

  const login = (email, _password, nameOverride) => {
    const name = nameOverride || email?.split('@')[0] || 'Guest'
    const u = { email, name }
    setUser(u)
    return u
  }

  const logout = () => setUser(null)

  const value = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    login,
    logout,
  }), [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
