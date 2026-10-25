import { Request, Response } from 'express';
import ListOrderService from '../services/ListOrderService'; // Importe o serviço
import ShowOrderService from '../services/ShowOrderService';
import CreateOrderService from '../services/CreateOrderService';
import UpdateOrderStatusService from '../services/UpdateOrderStatusService';

export default class OrdersController {
  // ADICIONE ESTE MÉTODO PARA LISTAR TODOS OS PEDIDOS
  public async index(request: Request, response: Response): Promise<Response> {
    const listOrders = new ListOrderService();

    const orders = await listOrders.execute();

    return response.json(orders);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const showOrder = new ShowOrderService();

    const order = await showOrder.execute({ id });

    return response.json(order);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { customer_id, products, status } = request.body;

    const createOrder = new CreateOrderService();

    const order = await createOrder.execute({
      customer_id,
      products,
      status,
    });

    return response.json(order);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { status } = request.body;

    const updateOrderStatus = new UpdateOrderStatusService();

    const order = await updateOrderStatus.execute({
      id,
      status,
    });

    return response.json(order);
  }
}
