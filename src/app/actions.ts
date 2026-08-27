"use server";

import { getClientSubscriptionToken } from "inngest/react";
import { inngest } from "@/inngest/client";
import { pipelineChannel } from "@/inngest/channels";

export async function fetchToken(contentId: string) {
  return getClientSubscriptionToken(inngest, {
    channel: pipelineChannel({ contentId }),
    topics: ["status", "result"],
  });
}
