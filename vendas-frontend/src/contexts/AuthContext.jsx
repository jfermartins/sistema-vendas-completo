import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../services/api'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar se há token salvo no localStorage
    const token = localStorage.getItem('@VendasApp:token')
    const userData = localStorage.getItem('@VendasApp:user')

    if (token && userData) {
      api.defaults.headers.authorization = `Bearer ${token}`
      setUser(JSON.parse(userData))
      setIsAuthenticated(true)
    }
    
    setLoading(false)
  }, [])

  const signIn = async (email, password) => {
    try {
      const response = await api.post('/sessions', {
        email,
        password
      })

      const { user, token } = response.data

      localStorage.setItem('@VendasApp:token', token)
      localStorage.setItem('@VendasApp:user', JSON.stringify(user))

      api.defaults.headers.authorization = `Bearer ${token}`

      setUser(user)
      setIsAuthenticated(true)

      return { success: true }
    } catch (error) {
      console.error('Erro no login:', error)
      return { 
        success: false, 
        message: error.response?.data?.message || 'Erro interno do servidor' 
      }
    }
  }

  const signOut = () => {
    localStorage.removeItem('@VendasApp:token')
    localStorage.removeItem('@VendasApp:user')
    
    delete api.defaults.headers.authorization
    
    setUser(null)
    setIsAuthenticated(false)
  }

  const updateUser = (userData) => {
    setUser(userData)
    localStorage.setItem('@VendasApp:user', JSON.stringify(userData))
  }

  const value = {
    user,
    isAuthenticated,
    loading,
    signIn,
    signOut,
    updateUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  
  return context
}
