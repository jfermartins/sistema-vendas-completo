import axios from 'axios'

// Configuração base da API
export const api = axios.create({
  baseURL: 'http://localhost:3333', // URL da API backend
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para adicionar token automaticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('@VendasApp:token')
    
    if (token) {
      config.headers.authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para tratar respostas e erros
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Se o token expirou ou é inválido, redirecionar para login
    if (error.response?.status === 401) {
      localStorage.removeItem('@VendasApp:token')
      localStorage.removeItem('@VendasApp:user')
      window.location.href = '/login'
    }
    
    return Promise.reject(error)
  }
)

// Serviços específicos para cada módulo

// Autenticação
export const authService = {
  login: (email, password) => api.post('/sessions', { email, password }),
  forgotPassword: (email) => api.post('/password/forgot', { email }),
  resetPassword: (token, password) => api.post('/password/reset', { token, password })
}

// Usuários
export const userService = {
  getAll: () => api.get('/users'),
  create: (userData) => api.post('/users', userData),
  getProfile: () => api.get('/profile'),
  updateProfile: (userData) => api.put('/profile', userData),
  updateAvatar: (formData) => api.patch('/users/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

// Produtos
export const productService = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  create: (productData) => api.post('/products', productData),
  update: (id, productData) => api.put(`/products/${id}`, productData),
  delete: (id) => api.delete(`/products/${id}`)
}

// Clientes
export const customerService = {
  getAll: () => api.get('/customers'),
  getById: (id) => api.get(`/customers/${id}`),
  create: (customerData) => api.post('/customers', customerData),
  update: (id, customerData) => api.put(`/customers/${id}`, customerData),
  delete: (id) => api.delete(`/customers/${id}`)
}

// Pedidos
export const orderService = {
  getAll: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
  create: (orderData) => api.post('/orders', orderData)
}

export default api
