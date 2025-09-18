import React, { useState, useEffect } from "react";
import { orderService, customerService, productService } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, ShoppingCart, Search, Loader2, User, Package, DollarSign } from "lucide-react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

  const [formData, setFormData] = useState({
    customer_id: "",
    products: [{
      product_id: "",
      quantity: 1,
      price: 0
    }]
  });

  useEffect(() => {
    fetchOrders();
    fetchCustomers();
    fetchProducts();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getAll();
      let data = response.data;
      
      if (!Array.isArray(data) && data.orders) {
        data = data.orders;
      }
      
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Erro ao carregar pedidos: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await customerService.getAll();
      let data = response.data;
      
      if (!Array.isArray(data) && data.customers) {
        data = data.customers;
      }
      
      setCustomers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erro ao carregar clientes:", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await productService.getAll();
      let data = response.data;
      
      if (!Array.isArray(data) && data.products) {
        data = data.products;
      }
      
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erro ao carregar produtos:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError("");
    setSuccess("");

    try {
      const orderData = {
        customer_id: formData.customer_id,
        products: formData.products.map(item => ({
          product_id: item.product_id,
          quantity: Number(item.quantity),
          price: Number(item.price)
        }))
      };

      console.log('Enviando dados:', orderData);

      if (editingOrder) {
        await orderService.update(editingOrder.id, orderData);
        setSuccess("Pedido atualizado com sucesso!");
      } else {
        await orderService.create(orderData);
        setSuccess("Pedido criado com sucesso!");
      }
      
      await fetchOrders();
      handleDialogClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Erro ao processar pedido");
      console.error('Erro detalhado:', err.response?.data);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (order) => {
    setEditingOrder(order);
    setFormData({
      customer_id: order.customer_id || "",
      products: order.order_products?.map(op => ({
        product_id: op.product_id || "",
        quantity: op.quantity || 1,
        price: op.price || 0
      })) || [{ product_id: "", quantity: 1, price: 0 }]
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este pedido?")) return;
    
    try {
      await orderService.delete(id);
      setSuccess("Pedido excluído com sucesso!");
      await fetchOrders();
    } catch (err) {
      setError(err.message || "Erro ao excluir pedido");
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingOrder(null);
    setFormData({
      customer_id: "",
      products: [{
        product_id: "",
        quantity: 1,
        price: 0
      }]
    });
    setError("");
  };

  const handleProductChange = (index, field, value) => {
    const newProducts = [...formData.products];
    
    // Se estamos mudando o produto, atualizar o preço automaticamente
    if (field === "product_id") {
      const selectedProduct = products.find(p => p.id === value);
      newProducts[index] = {
        ...newProducts[index],
        [field]: value,
        price: selectedProduct ? selectedProduct.price : newProducts[index].price
      };
    } else {
      newProducts[index] = {
        ...newProducts[index],
        [field]: value
      };
    }
    
    setFormData({ ...formData, products: newProducts });
  };

  const addProductField = () => {
    setFormData({
      ...formData,
      products: [...formData.products, { product_id: "", quantity: 1, price: 0 }]
    });
  };

  const removeProductField = (index) => {
    if (formData.products.length <= 1) return;
    
    const newProducts = [...formData.products];
    newProducts.splice(index, 1);
    setFormData({ ...formData, products: newProducts });
  };

  const calculateTotal = (order) => {
    if (!order.order_products) return 0;
    return order.order_products.reduce((total, item) => {
      return total + (item.quantity * item.price);
    }, 0);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': { label: 'Pendente', variant: 'secondary' },
      'processing': { label: 'Processando', variant: 'default' },
      'completed': { label: 'Concluído', variant: 'success' },
      'cancelled': { label: 'Cancelado', variant: 'destructive' }
    };
    
    const config = statusConfig[status] || { label: status, variant: 'outline' };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredOrders = orders.filter(order => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      (order.id && order.id.toLowerCase().includes(searchLower)) ||
      (order.customer?.name && order.customer.name.toLowerCase().includes(searchLower)) ||
      (order.order_products?.some(op => 
        op.product?.name && op.product.name.toLowerCase().includes(searchLower)
      )) ||
      (order.status && order.status.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Pedidos</h1>
          <p className="text-muted-foreground">
            Gerencie os pedidos cadastrados
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Pedido
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingOrder ? "Editar Pedido" : "Novo Pedido"}
              </DialogTitle>
              <DialogDescription>
                {editingOrder
                  ? "Atualize as informações do pedido"
                  : "Preencha os dados do novo pedido"}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="my-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="customer_id">Cliente *</Label>
                <select
                  id="customer_id"
                  value={formData.customer_id}
                  onChange={(e) =>
                    setFormData({ ...formData, customer_id: e.target.value })
                  }
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Selecione um cliente</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Produtos *</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addProductField}>
                    <Plus className="h-4 w-4 mr-1" /> Adicionar Produto
                  </Button>
                </div>
                
                {formData.products.map((product, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-end p-3 border rounded-md">
                    <div className="col-span-5">
                      <Label htmlFor={`product_id_${index}`}>Produto</Label>
                      <select
                        id={`product_id_${index}`}
                        value={product.product_id}
                        onChange={(e) => handleProductChange(index, "product_id", e.target.value)}
                        required
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">Selecione um produto</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} - {formatCurrency(p.price)}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="col-span-3">
                      <Label htmlFor={`quantity_${index}`}>Quantidade</Label>
                      <Input
                        id={`quantity_${index}`}
                        type="number"
                        min="1"
                        value={product.quantity}
                        onChange={(e) => handleProductChange(index, "quantity", e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="col-span-3">
                      <Label htmlFor={`price_${index}`}>Preço Unitário</Label>
                      <Input
                        id={`price_${index}`}
                        type="number"
                        step="0.01"
                        min="0"
                        value={product.price}
                        onChange={(e) => handleProductChange(index, "price", e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="col-span-1">
                      {formData.products.length > 1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => removeProductField(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={handleDialogClose}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={formLoading}>
                  {formLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {formLoading
                    ? editingOrder
                      ? "Atualizando..."
                      : "Criando..."
                    : editingOrder
                    ? "Atualizar"
                    : "Criar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {success && (
        <Alert className="bg-green-50 text-green-800 border-green-200">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Lista de Pedidos</CardTitle>
              <CardDescription>
                {filteredOrders.length} pedido(s) encontrado(s)
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar pedidos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Carregando pedidos...</span>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                {searchTerm ? 'Nenhum pedido encontrado' : 'Nenhum pedido cadastrado'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm 
                  ? 'Tente buscar com outros termos'
                  : 'Comece criando seu primeiro pedido'
                }
              </p>
              {!searchTerm && (
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Pedido
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Produtos</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">#{order.id?.slice(-8)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          {order.customer?.name || "N/A"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[200px]">
                          {order.order_products?.slice(0, 2).map((op, idx) => (
                            <div key={idx} className="flex items-center gap-1 text-sm">
                              <Package className="h-3 w-3 text-muted-foreground" />
                              <span className="truncate">
                                {op.quantity}x {op.product?.name || "Produto não encontrado"}
                              </span>
                            </div>
                          ))}
                          {order.order_products?.length > 2 && (
                            <div className="text-xs text-muted-foreground mt-1">
                              +{order.order_products.length - 2} mais...
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(order.created_at)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 font-medium">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          {formatCurrency(calculateTotal(order))}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(order)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(order.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Orders;