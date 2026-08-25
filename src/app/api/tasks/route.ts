import { NextResponse } from "next/server";
import { inngest } from "@/inngest/client";

export async function POST() {
  const id = `task_${Date.now()}`;

  await inngest.send({
    name: "app/task.created",
    data: { id },
  });

  return NextResponse.json({ message: "Task queued", id });
}
