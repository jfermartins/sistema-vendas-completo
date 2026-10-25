import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import OrdersController from '../controllers/OrdersController';
import isAuthenticated from '@shared/http/middlewares/isAuthenticated';

const ordersRouter = Router();
const orderController = new OrdersController();

ordersRouter.use(isAuthenticated);

// ADICIONE ESTA ROTA PARA LISTAR TODOS OS PEDIDOS
ordersRouter.get('/', orderController.index);

ordersRouter.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  orderController.show,
);

ordersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      customer_id: Joi.string().uuid().required(),
      products: Joi.required(),
      status: Joi.string().valid('pending', 'processing', 'completed', 'cancelled').optional(),
    },
  }),
  orderController.create,
);

ordersRouter.put(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
    [Segments.BODY]: {
      status: Joi.string().valid('pending', 'processing', 'completed', 'cancelled').required(),
    },
  }),
  orderController.update,
);

export default ordersRouter;
