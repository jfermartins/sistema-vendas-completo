import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import Order from '../typeorm/entities/Order';
import OrdersRepository from '../typeorm/repositories/OrdersRepository';
import CustomersRepository from '@modules/customers/typeorm/repositories/CustomersRepository';
import ProductsRepository from '@modules/products/typeorm/repositories/ProductsRepository';

interface IProduct {
  product_id: string;
  quantity: number;
  price: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
  status?: string;
}

class CreateOrderService {
  public async execute({ customer_id, products, status = 'pending' }: IRequest): Promise<Order> {
    const ordersRepository = getCustomRepository(OrdersRepository);
    const customerRepository = getCustomRepository(CustomersRepository);
    const productsRepository = getCustomRepository(ProductsRepository);

    const customerExists = await customerRepository.findById(customer_id);

    if (!customerExists) {
      throw new AppError('Could not find any customer with the given id.');
    }

    console.log('Produtos recebidos na requisição:', products);
    const productIds = products.map(product => product.product_id);
    console.log('IDs dos produtos extraídos:', productIds);
    const existsProducts = await productsRepository.findAllByIds(products);
    console.log('Produtos encontrados no banco de dados:', existsProducts);

    if (!existsProducts.length) {
      throw new AppError('Could not find any products with the given ids.');
    }

    const existsProductsIds = existsProducts.map(product => product.id);

    const checkInexistentProducts = products.filter(
      product => !existsProductsIds.includes(product.product_id),
    );

    if (checkInexistentProducts.length) {
      throw new AppError(
        `Could not find product ${checkInexistentProducts[0].product_id}.`,
      );
    }

    const quantityAvailable = products.filter(
      product =>
        existsProducts.filter(p => p.id == product.product_id)[0].quantity <
        product.quantity,
    );
    console.log('Produtos com quantidade disponível:', quantityAvailable);

    if (quantityAvailable.length) {
      throw new AppError(
        `The quantity ${quantityAvailable[0].quantity} is not available for ${quantityAvailable[0].product_id}.`,
      );
    }

    const serializedProducts = products.map(product => ({
      product_id: product.product_id,
      quantity: product.quantity,
      price: product.price,
    }));
    console.log('Produtos serializados para o pedido:', serializedProducts);

    const order = await ordersRepository.createOrder({
      customer: customerExists,
      products: serializedProducts,
      status,
    });
    console.log('Objeto do pedido criado:', order);

    console.log('Objeto do pedido antes de extrair order_products:', order);
    const { order_products } = order;
    console.log('order_products extraídos:', order_products);

    const updatedProductQuantity = order_products.map(product => ({
      id: product.product_id,
      quantity:
        existsProducts.filter(p => p.id === product.product_id)[0].quantity -
        product.quantity,
    }));
    console.log('Quantidade de produtos atualizada:', updatedProductQuantity);

    await productsRepository.save(updatedProductQuantity);

    return order;
  }
}

export default CreateOrderService;
