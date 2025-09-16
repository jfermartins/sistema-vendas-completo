import { useState, useEffect } from 'react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Alert, AlertDescription } from '../components/ui/alert'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '../components/ui/dialog'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../components/ui/table'
import { 
  Plus, 
  Search,
  ShoppingCart,
  Loader2,
  Eye,
  Trash2
} from 'lucide-react'
import { orderService, customerService, productService } from '../services/api'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [customers, setCustomers] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [viewingOrder, setViewingOrder] = useState(null)
  const [formData, setFormData] = useState({
    customer_id: '',
    products: []
  })
  const [formLoading, setFormLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [ordersRes, customersRes, productsRes] = await Promise.all([
        orderService.getAll(),
        customerService.getAll(),
        productService.getAll()
      ])
      
      setOrders(ordersRes.data)
      setCustomers(customersRes.data)
      setProducts(productsRes.data)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      setError('Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormLoading(true)
    setError('')

    if (!formData.customer_id || formData.products.length === 0) {
      setError('Selecione um cliente e pelo menos um produto')
      setFormLoading(false)
      return
    }

    try {
      const orderData = {
        customer_id: formData.customer_id,
        products: formData.products.map(p => ({
          id: p.product_id,
          quantity: p.quantity,
          price: p.price
        }))
      }

      await orderService.create(orderData)
      setSuccess('Pedido criado com sucesso!')
      setIsDialogOpen(false)
      setFormData({ customer_id: '', products: [] })
      loadData()
    } catch (error) {
      setError(error.response?.data?.message || 'Erro ao criar pedido')
    } finally {
      setFormLoading(false)
    }
  }

  const addProduct = () => {
    setFormData({
      ...formData,
      products: [...formData.products, { product_id: '', quantity: 1, price: 0 }]
    })
  }

  const updateProduct = (index, field, value) => {
    const updatedProducts = [...formData.products]
    updatedProducts[index][field] = value
    
    if (field === 'product_id') {
      const product = products.find(p => p.id === value)
      if (product) {
        updatedProducts[index].price = product.price
      }
    }
    
    setFormData({ ...formData, products: updatedProducts })
  }

  const removeProduct = (index) => {
    const updatedProducts = formData.products.filter((_, i) => i !== index)
    setFormData({ ...formData, products: updatedProducts })
  }

  const openCreateDialog = () => {
    setFormData({ customer_id: '', products: [] })
    setIsDialogOpen(true)
  }

  const viewOrder = (order) => {
    setViewingOrder(order)
    setIsViewDialogOpen(true)
  }

  const filteredOrders = orders.filter(order => {
    const customerName = order.customer?.name?.toLowerCase() || ''
    return customerName.includes(searchTerm.toLowerCase()) ||
           order.id.toString().includes(searchTerm)
  })

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const calculateTotal = () => {
    return formData.products.reduce((total, product) => {
      return total + (product.price * product.quantity)
    }, 0)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pedidos</h1>
          <p className="text-gray-600">Gerencie os pedidos de vendas</p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Pedido
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Barra de pesquisa */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Pesquisar pedidos por cliente ou ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabela de pedidos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Lista de Pedidos
          </CardTitle>
          <CardDescription>
            {filteredOrders.length} pedido(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Itens</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">#{order.id}</TableCell>
                      <TableCell>{order.customer?.name || 'N/A'}</TableCell>
                      <TableCell className="font-bold text-green-600">
                        {formatCurrency(order.total)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {order.order_products?.length || 0} itens
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(order.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => viewOrder(order)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      Nenhum pedido encontrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialog para criar pedido */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Novo Pedido</DialogTitle>
            <DialogDescription>
              Selecione um cliente e adicione produtos ao pedido
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="customer">Cliente</Label>
                <Select value={formData.customer_id} onValueChange={(value) => setFormData({ ...formData, customer_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Produtos</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addProduct}>
                    <Plus className="h-4 w-4 mr-1" />
                    Adicionar
                  </Button>
                </div>
                
                {formData.products.map((product, index) => (
                  <div key={index} className="flex gap-2 mb-2 p-3 border rounded">
                    <Select 
                      value={product.product_id} 
                      onValueChange={(value) => updateProduct(index, 'product_id', value)}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Produto" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.name} - {formatCurrency(p.price)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Input
                      type="number"
                      min="1"
                      value={product.quantity}
                      onChange={(e) => updateProduct(index, 'quantity', parseInt(e.target.value))}
                      placeholder="Qtd"
                      className="w-20"
                    />
                    
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeProduct(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {formData.products.length > 0 && (
                <div className="text-right">
                  <p className="text-lg font-bold">
                    Total: {formatCurrency(calculateTotal())}
                  </p>
                </div>
              )}
            </div>
            
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={formLoading}>
                {formLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando...
                  </>
                ) : (
                  'Criar Pedido'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog para visualizar pedido */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes do Pedido #{viewingOrder?.id}</DialogTitle>
          </DialogHeader>
          
          {viewingOrder && (
            <div className="space-y-4">
              <div>
                <Label>Cliente</Label>
                <p className="font-medium">{viewingOrder.customer?.name}</p>
              </div>
              
              <div>
                <Label>Data do Pedido</Label>
                <p>{formatDate(viewingOrder.created_at)}</p>
              </div>
              
              <div>
                <Label>Produtos</Label>
                <div className="space-y-2">
                  {viewingOrder.order_products?.map((item, index) => (
                    <div key={index} className="flex justify-between p-2 bg-gray-50 rounded">
                      <span>{item.product?.name}</span>
                      <span>{item.quantity}x {formatCurrency(item.price)}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-green-600">{formatCurrency(viewingOrder.total)}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
