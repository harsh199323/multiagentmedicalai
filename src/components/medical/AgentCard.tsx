"use client";

import { AgentResult } from "./types";

export default function AgentCard({ result }: { result: AgentResult }) {
  return (
    <div
      className="relative p-4 bg-card text-card-foreground shadow-sm"
      style={{
        backgroundImage:
          "linear-gradient(to bottom, color-mix(in oklch, var(--muted-foreground) 18%, transparent) 1px, transparent 1px), linear-gradient(to right, color-mix(in oklch, var(--muted-foreground) 18%, transparent) 1px, transparent 1px), radial-gradient(120% 80% at 50% 0%, rgba(255,255,255,0.65), rgba(255,255,255,0) 60%)",
        backgroundSize: "22px 22px, 22px 22px, auto",
        backgroundPosition: "0 0, 0 0, 0 0",
        backgroundBlendMode: "multiply",
      }}
    >
      <svg
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full text-border"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d="M4 6 C14 4, 28 6, 40 5 S62 6, 74 4 90 6, 95 12 96 26, 95 38 96 50, 94 64 96 76, 90 90 78 94, 64 96 50 94, 38 96 26 94, 12 92 6 80, 4 66 6 52, 5 38 6 26, 4 14 4 6 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">{result.agent}</h3>
          <p className="text-xs text-muted-foreground">{result.specialty}</p>
        </div>
        <div className="text-xs text-muted-foreground">
          <span className="px-2 py-1 rounded bg-muted">{result.model}</span>
        </div>
      </div>
      <div className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">
        {result.analysis}
      </div>
      <div className="mt-3 text-xs text-muted-foreground">
        Response time: {result.response_time}
      </div>
    </div>
  );
}