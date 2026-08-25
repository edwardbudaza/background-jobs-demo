"use client";

import { useState } from "react";

export default function Home() {
  const [status, setStatus] = useState<string | null>(null);

  async function triggerTask() {
    setStatus("Queuing task...");
    const res = await fetch("/api/tasks", { method: "POST" });
    const data = await res.json();
    setStatus(`Queued: ${data.id}`);
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-3xl font-bold">Background Jobs Demo</h1>
      <p className="text-gray-600">
        A small Next.js app that triggers an Inngest background job.
      </p>
      <button
        onClick={triggerTask}
        className="rounded-md bg-black px-4 py-2 text-white hover:bg-gray-800 hover:cursor-pointer"
      >
        Trigger background task
      </button>
      {status && <p className="text-sm text-gray-500">{status}</p>}
    </main>
  );
}
