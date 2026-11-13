
import {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react'
import toast from 'react-hot-toast'

const AppContext = createContext(null)

const USERS_KEY = 'mudrive_demo_users'
const SESSION_KEY = 'mudrive_demo_session'

const readStorage = (key, fallback) => {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authLoading, setAuthLoading] = useState(false)

  // Restore session on refresh
  const checkAuth = async () => {
    setLoading(true)

    const session = readStorage(SESSION_KEY, null)
    const users = readStorage(USERS_KEY, [])

    const existingUser = users.find(
      (item) => item.id === session?.id
    )

    if (existingUser) {
      const { password, ...safeUser } = existingUser
      setUser(safeUser)
    } else {
      localStorage.removeItem(SESSION_KEY)
      setUser(null)
    }

    setLoading(false)
  }

  useEffect(() => {
    checkAuth()
  }, [])

  // Register
  const register = async (name, email, password) => {
    setAuthLoading(true)

    try {
      const users = readStorage(USERS_KEY, [])
      const normalizedEmail = email.trim().toLowerCase()

      if (!name.trim()) {
        throw new Error('Full name is required')
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
        throw new Error('Enter a valid email address')
      }

      if (password.length < 8) {
        throw new Error('Password must be at least 8 characters')
      }

      const exists = users.some(
        (item) => item.email === normalizedEmail
      )

      if (exists) {
        throw new Error('Email already registered')
      }

      const newUser = {
        id: crypto.randomUUID(),
        name: name.trim(),
        email: normalizedEmail,
        password,
        createdAt: new Date().toISOString(),
      }

      localStorage.setItem(
        USERS_KEY,
        JSON.stringify([...users, newUser])
      )

      toast.success('Account created successfully!')

      return {
        success: true,
        data: {
          user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
          },
        },
      }
    } catch (error) {
      toast.error(error.message)

      return {
        success: false,
        error: error.message,
      }
    } finally {
      setAuthLoading(false)
    }
  }

  // Login
  const login = async (email, password) => {
    setAuthLoading(true)

    try {
      const users = readStorage(USERS_KEY, [])

      const account = users.find(
        (item) =>
          item.email === email.trim().toLowerCase() &&
          item.password === password
      )

      if (!account) {
        throw new Error('Invalid email or password')
      }

      const { password: storedPassword, ...safeUser } = account

      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify(safeUser)
      )

      setUser(safeUser)

      toast.success(`Welcome back, ${safeUser.name}!`)

      return {
        success: true,
        data: { user: safeUser },
      }
    } catch (error) {
      toast.error(error.message)

      return {
        success: false,
        error: error.message,
      }
    } finally {
      setAuthLoading(false)
    }
  }

  // Logout
  const logout = async () => {
    localStorage.removeItem(SESSION_KEY)
    setUser(null)

    toast.success('Signed out successfully')

    return { success: true }
  }

  const value = {
    user,
    loading,
    authLoading,
    isAuthenticated: Boolean(user),
    login,
    register,
    logout,
    checkAuth,
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)

  if (!context) {
    throw new Error(
      'useApp must be used inside AppProvider'
    )
  }

  return context
}
