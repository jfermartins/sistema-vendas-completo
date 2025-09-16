"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var celebrate_1 = require("celebrate");
var CustomersController_1 = __importDefault(require("../controllers/CustomersController"));
var isAuthenticated_1 = __importDefault(require("@shared/http/middlewares/isAuthenticated"));
var customersRouter = (0, express_1.Router)();
var customersController = new CustomersController_1.default();
customersRouter.use(isAuthenticated_1.default);
customersRouter.get('/', customersController.index);
customersRouter.get('/:id', (0, celebrate_1.celebrate)((_a = {},
    _a[celebrate_1.Segments.PARAMS] = {
        id: celebrate_1.Joi.string().uuid().required(),
    },
    _a)), customersController.show);
customersRouter.post('/', (0, celebrate_1.celebrate)((_b = {},
    _b[celebrate_1.Segments.BODY] = {
        name: celebrate_1.Joi.string().required(),
        email: celebrate_1.Joi.string().email().required(),
    },
    _b)), customersController.create);
customersRouter.put('/:id', (0, celebrate_1.celebrate)((_c = {},
    _c[celebrate_1.Segments.BODY] = {
        name: celebrate_1.Joi.string().required(),
        email: celebrate_1.Joi.string().email().required(),
    },
    _c[celebrate_1.Segments.PARAMS] = {
        id: celebrate_1.Joi.string().uuid().required(),
    },
    _c)), customersController.update);
customersRouter.delete('/:id', (0, celebrate_1.celebrate)((_d = {},
    _d[celebrate_1.Segments.PARAMS] = {
        id: celebrate_1.Joi.string().uuid().required(),
    },
    _d)), customersController.delete);
exports.default = customersRouter;
