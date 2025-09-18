import { getCustomRepository } from 'typeorm';
import Customer from '../typeorm/entities/Customer';
import CustomersRepository from '../typeorm/repositories/CustomersRepository';
import AppError from '@shared/errors/AppError';

interface IRequest {
  name: string;
  email: string;
  phone: string;
}

class CreateCustomerService {
  public async execute({ name, email, phone }: IRequest): Promise<Customer> {
    const customersRepository = getCustomRepository(CustomersRepository);

    // Corrija a tipagem aqui
    const emailExists = await customersRepository.findByEmail(email);

    if (emailExists) {
      throw new AppError('Email address already used.');
    }

    const customer = customersRepository.create({
      name,
      email,
      phone,
    });

    await customersRepository.save(customer);

    return customer;
  }
}

export default CreateCustomerService;
