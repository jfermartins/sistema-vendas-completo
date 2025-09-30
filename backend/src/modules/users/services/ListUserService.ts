import { getRepository } from 'typeorm';
import User from '../typeorm/entities/User';

class ListUserService {
  public async execute(): Promise<User[]> {
    const usersRepository = getRepository(User);

    const users = await usersRepository.find();

    return users;
  }
}

export default ListUserService;
