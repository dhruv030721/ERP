import Redis from "ioredis";
import logger from "../Utils/logger";

class RedisClient {
    private static instance: Redis | null = null;

    private constructor() {
        // Private constructor to prevent direct instantiation
    }

    public static getInstance(): Redis {
        if (!RedisClient.instance) {
            RedisClient.instance = new Redis({
                host: process.env.REDIS_HOST || "127.0.0.1",
                port: parseInt(process.env.REDIS_PORT || "6379"),
            });

            // Optionally add error handling
            RedisClient.instance.on("error", (err) => {
                console.error("Redis connection error:", err);
            });

            logger.info("Redis client initialized");
        }
        return RedisClient.instance;
    }
}

export default RedisClient;
