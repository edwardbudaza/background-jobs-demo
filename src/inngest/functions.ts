// src/inngest/functions.ts
import { inngest } from "./client";

export const processTask = inngest.createFunction(
  { id: "process-task", retries: 3, triggers: { event: "app/task.created" } },
  async ({ event, step }) => {
    const result = await step.run("handle-task", async () => {
      // Simulate real work: this is where you'd call an external API,
      // write to a database, generate a report, send an email, etc.
      await new Promise((resolve) => setTimeout(resolve, 500));
      return { processed: true, id: event.data.id };
    });

    await step.sleep("pause-before-followup", "1s");

    return { message: `Task ${event.data.id} complete`, result };
  },
);

export const dailySummary = inngest.createFunction(
  {
    id: "daily-summary",
    triggers: { cron: "TZ=Africa/Johannesburg 0 9 * * *" },
  },
  async ({ step }) => {
    // Simulate daily summary generation
    const summary = await step.run("build-summary", async () => {
      // Real version: query your DB for yesterday's task count, errors, etc.
      return {
        date: new Date().toISOString().slice(0, 10),
        tasksProcessed: Math.floor(Math.random() * 50),
      };
    });

    return { message: "Daily summary generated", summary };
  },
);
