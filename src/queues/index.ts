import { queues } from "./queues";

export * from "./email.queue";
export { serverAdapter } from "./board";

export async function closeWorkers() {
  for (const que of queues) {
    await que.Queue.close();
    await que.Worker.close();
  }
}
