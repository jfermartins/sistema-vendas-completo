import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './App.css'

// Componentes de layout
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Customers from './pages/Customers'
import Orders from './pages/Orders'
import Profile from './pages/Profile'
import Users from './pages/Users'

// Context para autenticação
import { AuthProvider, useAuth } from './contexts/AuthContext'

// Componente para rotas protegidas
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

// Componente para rotas públicas (redireciona se já autenticado)
function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth()
  
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            {/* Rota pública - Login */}
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />
            
            {/* Rotas protegidas */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="products" element={<Products />} />
              <Route path="customers" element={<Customers />} />
              <Route path="orders" element={<Orders />} />
              <Route path="users" element={<Users />} />
              <Route path="profile" element={<Profile />} />
            </Route>
            
            {/* Rota padrão */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
