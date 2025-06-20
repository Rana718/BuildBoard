import Redis from "ioredis";

const redis_url = process.env.REDIS_URL || "redis://localhost:6379";

let redis: Redis;

declare global {
    var redisInstance: Redis | undefined;
}

if (!global.redisInstance) {
    global.redisInstance = new Redis(redis_url, {
        maxRetriesPerRequest: null,
        enableAutoPipelining: true,
        lazyConnect: false,
    });

    global.redisInstance.on("connect", () => {
        console.log("✅ Redis Connected Successfully");
    });

    global.redisInstance.on("error", (err) => {
        console.error("❌ Redis Connection Error:", err);
    });
}

redis = global.redisInstance;

export default redis;
