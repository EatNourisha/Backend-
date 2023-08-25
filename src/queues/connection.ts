import IORedis from "ioredis";
import config from "../config";

// export const connection = new IORedis({
//   host: config.REDIS_HOST,
//   port: config.REDIS_PORT,
//   username: config.REDIS_USERNAME,
//   password: config.REDIS_AUTH,
//   maxRetriesPerRequest: null,
// });
export const LOCAL_REDIS = "127.0.0.1:6379";
export const connection = new IORedis(config.REDIS_URL, {
  maxRetriesPerRequest: null,
});
