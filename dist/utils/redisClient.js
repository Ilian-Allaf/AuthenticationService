"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = void 0;
const redis_1 = require("redis");
exports.redisClient = (0, redis_1.createClient)({
    username: 'default',
    password: 'eYVX7EwVmmxKPCDmwMtyKVge8oLd2t81',
    socket: {
        host: 'redis',
        port: 6379,
    }
});
exports.redisClient.connect().catch(console.error);
