import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import Order from '../typeorm/entities/Order';
import OrdersRepository from '../typeorm/repositories/OrdersRepository';
import ProductsRepository from '@modules/products/typeorm/repositories/ProductsRepository';

interface IRequest {
  id: string;
  status: string;
}

class UpdateOrderStatusService {
  public async execute({ id, status }: IRequest): Promise<Order> {
    const ordersRepository = getCustomRepository(OrdersRepository);
    const productsRepository = getCustomRepository(ProductsRepository);

    const order = await ordersRepository.findById(id);

    if (!order) {
      throw new AppError('Order not found.');
    }

    const previousStatus = order.status;

    // Se mudando para "completed", subtrair do estoque
    if (status === 'completed' && previousStatus !== 'completed') {
      const { order_products } = order;

      for (const orderProduct of order_products) {
        const product = await productsRepository.findOne(orderProduct.product_id);
        if (product) {
          product.quantity -= orderProduct.quantity;
          await productsRepository.save(product);
        }
      }
    }
    // Se estava "completed" e mudando para outro, devolver ao estoque
    else if (previousStatus === 'completed' && status !== 'completed') {
      const { order_products } = order;

      for (const orderProduct of order_products) {
        const product = await productsRepository.findOne(orderProduct.product_id);
        if (product) {
          product.quantity += orderProduct.quantity;
          await productsRepository.save(product);
        }
      }
    }

    order.status = status;
    await ordersRepository.save(order);

    return order;
  }
}

export default UpdateOrderStatusService;
