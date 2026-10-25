import AppError from '@shared/errors/AppError';
import { hash } from 'bcryptjs';
import { getRepository } from 'typeorm';
import User from '../typeorm/entities/User';

interface IRequest {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({ name, email, password }: IRequest): Promise<User> {
    const usersRepository = getRepository(User);

    const emailExists = await usersRepository.findOne({
      where: { email },
    });

    if (emailExists) {
      throw new AppError('Email address already used');
    }

    const hashedPassword = await hash(password, 8);

    const user = usersRepository.create({
      name,
      email,
      password: hashedPassword,
      avatar: 'default.png', // Definindo um avatar padrão
    });

    await usersRepository.save(user);

    return user;
  }
}

export default CreateUserService;
