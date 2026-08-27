"use client";

import { useState } from "react";
import { useRealtime } from "inngest/react";
import { pipelineChannel } from "@/inngest/channels";
import { fetchToken } from "@/app/actions";

function Progress({ contentId }: { contentId: string }) {
  const { messages, connectionStatus } = useRealtime({
    channel: pipelineChannel({ contentId }),
    topics: ["status", "result"] as const,
    token: () => fetchToken(contentId),
  });

  return (
    <div className="w-full max-w-md text-sm text-gray-700">
      <p>Connection: {connectionStatus}</p>
      <p>{messages.byTopic.status?.data.message ?? "Waiting to start..."}</p>
      <div className="h-2 w-full rounded bg-gray-200">
        <div
          className="h-2 rounded bg-black transition-all"
          style={{ width: `${messages.byTopic.status?.data.progress ?? 0}%` }}
        />
      </div>
      {messages.byTopic.result && (
        <p className="mt-2 font-medium">
          {messages.byTopic.result.data.summary}
        </p>
      )}
    </div>
  );
}

export default function Home() {
  const [content, setContent] = useState("");
  const [contentId, setContentId] = useState<string | null>(null);

  async function submit() {
    const res = await fetch("/api/analyze", {
      method: "POST",
      body: JSON.stringify({ content }),
    });
    const data = await res.json();
    setContentId(data.contentId);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-3xl font-bold">Background Jobs Demo</h1>
      <textarea
        className="w-full max-w-md rounded border p-2"
        rows={4}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Paste some text to analyze..."
      />
      <button
        onClick={submit}
        className="rounded-md bg-black px-4 py-2 text-white hover:bg-gray-800"
      >
        Analyze content (~1 min)
      </button>
      {contentId && <Progress contentId={contentId} />}
    </main>
  );
}
