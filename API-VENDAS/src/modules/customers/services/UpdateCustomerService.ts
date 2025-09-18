import { getCustomRepository } from 'typeorm';
import Customer from '../typeorm/entities/Customer';
import CustomersRepository from '../typeorm/repositories/CustomersRepository';
import AppError from '@shared/errors/AppError';

interface IRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
}

class UpdateCustomerService {
  public async execute({
    id,
    name,
    email,
    phone, // ADICIONE A VÍRGULA AQUI
  }: IRequest): Promise<Customer> {
    const customersRepository = getCustomRepository(CustomersRepository);

    const customer = await customersRepository.findById(id);

    if (!customer) {
      throw new AppError('Customer not found.');
    }

    const customerWithEmail = await customersRepository.findByEmail(email);

    if (customerWithEmail && customerWithEmail.id !== id) {
      throw new AppError('Email address already used.');
    }

    customer.name = name;
    customer.email = email;
    customer.phone = phone;

    await customersRepository.save(customer);

    return customer;
  }
}

export default UpdateCustomerService;
