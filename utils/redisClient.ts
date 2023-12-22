import { createClient } from "redis"

export let redisClient = createClient({url: process.env.REDIS_URL})
redisClient.connect().catch(console.error)