import { Request, Response } from 'express';
import ListUserService from '../services/ListUserService';
import CreateUserService from '../services/CreateUserService';
import { instanceToInstance } from 'class-transformer';

export default class UsersController {
  public async index(request: Request, response: Response): Promise<Response> {
    const listUser = new ListUserService();

    const users = await listUser.execute();

    // instanceToInstance já aplica as transformações @Exclude e @Expose
    // O ID será automaticamente excluído da resposta
    return response.json(instanceToInstance(users));
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;

    const createUser = new CreateUserService();

    const user = await createUser.execute({
      name,
      email,
      password,
    });

    // instanceToInstance já aplica as transformações @Exclude e @Expose
    // O ID será automaticamente excluído da resposta
    return response.json(instanceToInstance(user));
  }
}
