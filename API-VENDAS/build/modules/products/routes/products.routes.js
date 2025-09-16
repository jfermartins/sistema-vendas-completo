"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var ProductsController_1 = __importDefault(require("../controllers/ProductsController"));
var celebrate_1 = require("celebrate");
var productsRouter = (0, express_1.Router)();
var productsController = new ProductsController_1.default();
productsRouter.get('/', productsController.index);
productsRouter.get('/:id', (0, celebrate_1.celebrate)((_a = {},
    _a[celebrate_1.Segments.PARAMS] = {
        id: celebrate_1.Joi.string().uuid().required(),
    },
    _a)), productsController.show);
productsRouter.post('/', (0, celebrate_1.celebrate)((_b = {},
    _b[celebrate_1.Segments.BODY] = {
        name: celebrate_1.Joi.string().required(),
        price: celebrate_1.Joi.number().precision(2).required(),
        quantity: celebrate_1.Joi.number().required(),
    },
    _b)), productsController.create);
productsRouter.put('/:id', (0, celebrate_1.celebrate)((_c = {},
    _c[celebrate_1.Segments.BODY] = {
        name: celebrate_1.Joi.string().required(),
        price: celebrate_1.Joi.number().precision(2).required(),
        quantity: celebrate_1.Joi.number().required(),
    },
    _c[celebrate_1.Segments.PARAMS] = {
        id: celebrate_1.Joi.string().uuid().required(),
    },
    _c)), productsController.update);
productsRouter.delete('/:id', (0, celebrate_1.celebrate)((_d = {},
    _d[celebrate_1.Segments.PARAMS] = {
        id: celebrate_1.Joi.string().uuid().required(),
    },
    _d)), productsController.delete);
exports.default = productsRouter;
