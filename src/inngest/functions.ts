// src/inngest/functions.ts
import { inngest } from "./client";

import { pipelineChannel } from "./channels";

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const processTask = inngest.createFunction(
  { id: "process-task", retries: 3, triggers: { event: "app/task.created" } },
  async ({ event, step }) => {
    const result = await step.run("handle-task", async () => {
      // Simulate real work: this is where you'd call an external API,
      // write to a database, generate a report, send an email, etc.
      await wait(500);
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

export const analyzeContent = inngest.createFunction(
  {
    id: "analyze-content",
    retries: 2,
    triggers: { event: "app/content.submitted" },
  },
  async ({ event, step }) => {
    const { contentId, content } = event.data;
    const ch = pipelineChannel({ contentId });

    await step.realtime.publish("status-fetching", ch.status, {
      message: "Fetching content...",
      progress: 10,
    });
    await step.run("fetch-content", async () => {
      // Real version: download from a URL, pull from storage, etc.
      await wait(10_000);
      return { length: content.length };
    });

    await step.realtime.publish("status-extracting", ch.status, {
      message: "Extracting text...",
      progress: 30,
    });
    await step.run("extract-text", async () => {
      await wait(10_000);
      return { words: content.split(/\s+/).filter(Boolean) };
    });

    await step.realtime.publish("status-analyzing", ch.status, {
      message: "Analyzing with AI...",
      progress: 60,
    });
    const analysis = await step.run("analyze", async () => {
      // Real version: call OpenAI/Anthropic/etc. here and await the response.
      // The wait below stands in for that network round-trip.
      await wait(25_000);
      const wordCount = content.split(/\s+/).filter(Boolean).length;
      return {
        summary: `Content has ${wordCount} words. Tone: neutral.`,
        wordCount,
      };
    });

    await step.realtime.publish("status-finalizing", ch.status, {
      message: "Finalizing report...",
      progress: 90,
    });
    await step.run("finalize", async () => {
      await wait(5_000);
    });

    await step.realtime.publish("status-complete", ch.status, {
      message: "Done",
      progress: 100,
    });
    await step.realtime.publish("result", ch.result, analysis);

    return analysis;
  },
);
