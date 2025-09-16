"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var celebrate_1 = require("celebrate");
var OrdersController_1 = __importDefault(require("../controllers/OrdersController"));
var isAuthenticated_1 = __importDefault(require("@shared/http/middlewares/isAuthenticated"));
var ordersRouter = (0, express_1.Router)();
var orderController = new OrdersController_1.default();
ordersRouter.use(isAuthenticated_1.default);
ordersRouter.get('/:id', (0, celebrate_1.celebrate)((_a = {},
    _a[celebrate_1.Segments.PARAMS] = {
        id: celebrate_1.Joi.string().uuid().required(),
    },
    _a)), orderController.show);
ordersRouter.post('/', (0, celebrate_1.celebrate)((_b = {},
    _b[celebrate_1.Segments.BODY] = {
        customer_id: celebrate_1.Joi.string().uuid().required(),
        products: celebrate_1.Joi.required(),
    },
    _b)), orderController.create);
exports.default = ordersRouter;
