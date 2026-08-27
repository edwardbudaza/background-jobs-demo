import { NextResponse } from "next/server";
import { inngest } from "@/inngest/client";

export async function POST(req: Request) {
  const { content } = await req.json();
  const contentId = crypto.randomUUID();

  await inngest.send({
    name: "app/content.submitted",
    data: { contentId, content },
  });

  return NextResponse.json({ contentId });
}
