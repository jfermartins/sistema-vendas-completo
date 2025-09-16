"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    config: {
        redis: {
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
            password: process.env.REDIS_PASS || undefined,
        },
    },
    driver: 'redis',
};
