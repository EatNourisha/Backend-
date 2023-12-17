import IORedis from "ioredis";
import config from "../config";

export const LOCAL_REDIS = "127.0.0.1:6379";
export const connection = new IORedis(config.REDIS_URL, {
  maxRetriesPerRequest: null,
});
