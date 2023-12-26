import Redis from "ioredis"

export let redisClient = new Redis({ host: process.env.REDIS_HOST, port: parseInt(process.env.REDIS_PORT!), password: process.env.REDIS_PASSWORD });