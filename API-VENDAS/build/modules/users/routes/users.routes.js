"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var celebrate_1 = require("celebrate");
var multer_1 = __importDefault(require("multer"));
var upload_1 = __importDefault(require("@config/upload"));
var UsersController_1 = __importDefault(require("../controllers/UsersController"));
var isAuthenticated_1 = __importDefault(require("../../../shared/http/middlewares/isAuthenticated"));
var UserAvatarController_1 = __importDefault(require("../controllers/UserAvatarController"));
var usersRouter = (0, express_1.Router)();
var usersController = new UsersController_1.default();
var usersAvatarController = new UserAvatarController_1.default();
var upload = (0, multer_1.default)(upload_1.default);
usersRouter.get('/', isAuthenticated_1.default, usersController.index);
usersRouter.post('/', (0, celebrate_1.celebrate)((_a = {},
    _a[celebrate_1.Segments.BODY] = {
        name: celebrate_1.Joi.string().required(),
        email: celebrate_1.Joi.string().email().required(),
        password: celebrate_1.Joi.string().required(),
    },
    _a)), usersController.create);
usersRouter.patch('/avatar', isAuthenticated_1.default, upload.single('avatar'), usersAvatarController.update);
exports.default = usersRouter;
