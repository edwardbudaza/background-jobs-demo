import { realtime, staticSchema } from "inngest";
import { z } from "zod";

export const pipelineChannel = realtime.channel({
  name: ({ contentId }: { contentId: string }) => `pipeline:${contentId}`,
  topics: {
    status: {
      schema: z.object({ message: z.string(), progress: z.number() }),
    },
    result: {
      schema: staticSchema<{ summary: string; wordCount: number }>(),
    },
  },
});
