import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { 
  Package, 
  Users, 
  ShoppingCart, 
  DollarSign,
  TrendingUp
} from 'lucide-react'
import { productService, customerService, orderService } from '../services/api'

export default function Dashboard() {
  const [stats, setStats] = useState({
    products: 0,
    customers: 0,
    orders: 0,
    revenue: 0
  })
  const [loading, setLoading] = useState(true)
  const [recentOrders, setRecentOrders] = useState([])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      const [productsRes, customersRes, ordersRes] = await Promise.all([
        productService.getAll(),
        customerService.getAll(),
        orderService.getAll()
      ])

      const orders = Array.isArray(ordersRes.data) ? ordersRes.data : (ordersRes.data?.orders || [])
      
      // Calcular receita baseada nos produtos dos pedidos
      const revenue = orders.reduce((total, order) => {
        if (order.order_products && Array.isArray(order.order_products)) {
          const orderTotal = order.order_products.reduce((orderSum, item) => {
            return orderSum + (item.quantity * item.price);
          }, 0);
          return total + orderTotal;
        }
        return total + parseFloat(order.total || 0);
      }, 0)

      setStats({
        products: productsRes.data?.length || 0,
        customers: customersRes.data?.length || 0,
        orders: orders.length,
        revenue
      })

      setRecentOrders(orders.slice(-5).reverse())
      
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const statsCards = [
    {
      title: 'Total de Produtos',
      value: stats.products,
      icon: Package,
      description: 'Produtos cadastrados',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total de Clientes',
      value: stats.customers,
      icon: Users,
      description: 'Clientes cadastrados',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Total de Pedidos',
      value: stats.orders,
      icon: ShoppingCart,
      description: 'Pedidos realizados',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Receita Total',
      value: formatCurrency(stats.revenue),
      icon: DollarSign,
      description: 'Valor total em vendas',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <Badge variant="outline" className="text-sm">
          Atualizado agora
        </Badge>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, index) => {
          const Icon = card.icon
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {card.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {card.value}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {card.description}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${card.bgColor}`}>
                    <Icon className={`h-6 w-6 ${card.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Pedidos recentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Pedidos Recentes
            </CardTitle>
            <CardDescription>
              Últimos pedidos realizados no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Pedido #{order.order_number}</p>
                      <p className="text-sm text-gray-600">
                        Cliente: {order.customer?.name || 'N/A'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">
                        {formatCurrency(
                          order.order_products?.reduce((sum, item) => sum + (item.quantity * item.price), 0) || order.total || 0
                        )}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {order.order_products?.length || 0} itens
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Nenhum pedido encontrado
              </p>
            )}
          </CardContent>
        </Card>

        {/* Card de resumo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Resumo do Sistema
            </CardTitle>
            <CardDescription>
              Visão geral das operações
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Produtos em estoque</span>
                <span className="font-medium">{stats.products}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Base de clientes</span>
                <span className="font-medium">{stats.customers}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pedidos processados</span>
                <span className="font-medium">{stats.orders}</span>
              </div>
              <div className="flex items-center justify-between border-t pt-4">
                <span className="text-sm font-medium text-gray-900">Receita total</span>
                <span className="font-bold text-green-600">
                  {formatCurrency(stats.revenue)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}