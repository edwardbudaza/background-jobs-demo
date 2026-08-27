import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { processTask, dailySummary, analyzeContent } from "@/inngest/functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [processTask, dailySummary, analyzeContent],
});
