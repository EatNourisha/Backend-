import { Queue, Worker, Job } from "bullmq";
import { connection } from "./connection";
import { SubscriptionService } from "../services";

// import Bull, { Job } from "bull";

const QUEUE_NAME = "scheduleq";

interface UpdateSubscriptionDto {
  id: string;
  status: string;
}

export const known_schedule_jobs = ["update_subscription_cron"] as const;

export type KnowScheduleJobType = (typeof known_schedule_jobs)[number];

// // Create a new connection in every instance
export const ScheduleQueue = new Queue<any, any, KnowScheduleJobType>(QUEUE_NAME, {
  connection,
  defaultJobOptions: {
    priority: 1,
    attempts: 10,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
  },
});

export const ScheduleWorker = new Worker(QUEUE_NAME, scheduleProcessor, { connection });

async function scheduleProcessor(job: Job<any, any, KnowScheduleJobType>) {
  // console.log("New Email Job", job)
  switch (job.name) {
    case "update_subscription_cron":
      return await updateSubscription(job);
    default:
      throw new Error(`Job(EmailQueue) ${job.name} not processed!`);
  }
}

async function updateSubscription(job: Job<UpdateSubscriptionDto, any, KnowScheduleJobType>) {
  const data = job.data;
  console.log("Update Subscription Scheduler", data);
  return await SubscriptionService.updateSubscription(data.id, { ...data });
}

export const ScheduleQ = { Queue: ScheduleQueue, Worker: ScheduleWorker };
