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
