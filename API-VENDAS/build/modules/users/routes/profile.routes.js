"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var celebrate_1 = require("celebrate");
var isAuthenticated_1 = __importDefault(require("@shared/http/middlewares/isAuthenticated"));
var ProfileController_1 = __importDefault(require("../controllers/ProfileController"));
var profileRouter = (0, express_1.Router)();
var profileController = new ProfileController_1.default();
profileRouter.use(isAuthenticated_1.default);
profileRouter.get('/', profileController.show);
profileRouter.put('/', (0, celebrate_1.celebrate)((_a = {},
    _a[celebrate_1.Segments.BODY] = {
        name: celebrate_1.Joi.string().required(),
        email: celebrate_1.Joi.string().email().required(),
        old_password: celebrate_1.Joi.string(),
        password: celebrate_1.Joi.string().optional(),
        password_confirmation: celebrate_1.Joi.string()
            .valid(celebrate_1.Joi.ref('password'))
            .when('password', {
            is: celebrate_1.Joi.exist(),
            then: celebrate_1.Joi.required(),
        }),
    },
    _a)), profileController.update);
exports.default = profileRouter;
