import { Queue, Worker, Job } from "bullmq";
import { connection } from "./connection";

import { CreateMealPackAnalysisData } from "../interfaces";
import { MealService } from "../services";

const QUEUE_NAME = "lineupq";

export const known_lineup_jobs = ["create_mealpack_analysis_data"] as const;
export type KnowLineupJobType = (typeof known_lineup_jobs)[number];

// // Create a new connection in every instance
export const LineupQueue = new Queue<any, any, KnowLineupJobType>(QUEUE_NAME, {
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

export const LineupWorker = new Worker(QUEUE_NAME, lineupProcessor, { connection });

async function lineupProcessor(job: Job<any, any, KnowLineupJobType>) {
  // console.log("New Email Job", job)
  switch (job.name) {
    case "create_mealpack_analysis_data":
      return await createMealPackAnalysisData(job);
    default:
      throw new Error(`Job(LineupQueue) ${job.name} not processed!`);
  }
}

async function createMealPackAnalysisData(job: Job<CreateMealPackAnalysisData, any, KnowLineupJobType>) {
  const data = job.data;
  console.log("Create MealPack Analysis Data", data);
  return await MealService.createMealPackAnalysis(data);
}

export const LineupQ = { Queue: LineupQueue, Worker: LineupWorker };
// export const EmailQ = { Queue: EmailQueue };
