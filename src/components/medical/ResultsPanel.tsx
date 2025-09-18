"use client";

import AgentCard from "./AgentCard";
import { AgentResult } from "./types";
import { useState } from "react";

export type Report = {
  patient_info: string;
  agent_results: AgentResult[];
  summary: string;
};

export default function ResultsPanel({ report }: { report: Report }) {
  const copyJson = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(report, null, 2));
    } catch {}
  };

  const saveLocal = () => {
    try {
      localStorage.setItem("medical_analysis_latest", JSON.stringify(report));
    } catch {}
  };

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<number | null>(null);

  const saveToDatabase = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("bearer_token") : null;
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          patient_info: report.patient_info,
          agent_results: report.agent_results,
          summary: report.summary,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || `Failed to save (status ${res.status})`);
      }

      const data = await res.json();
      if (typeof data?.id === "number") setSavedId(data.id);
    } catch (e: any) {
      setSaveError(e?.message || "Failed to save report");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full max-w-5xl space-y-6">
      <div
        className="relative bg-card p-5"
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
            d="M3 8 C10 5, 20 4, 30 6 S55 8, 68 5 88 6, 95 9 97 18, 96 28 98 42, 96 55 97 68, 94 78 92 90, 80 94 68 96, 55 95 42 98, 28 94 18 96, 9 92 6 80, 4 68 5 55, 6 42 5 28, 8 18 3 8 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
        <h2 className="text-lg font-semibold">Patient Case</h2>
        <p className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">{report.patient_info}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {report.agent_results.map((res, idx) => (
          <AgentCard key={idx} result={res} />
        ))}
      </div>

      <div
        className="relative bg-card p-5"
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
        <h2 className="text-lg font-semibold">Integrated Summary</h2>
        <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">{report.summary}</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={copyJson}
          className="inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm hover:bg-muted"
        >
          Copy JSON
        </button>
        <button
          onClick={saveLocal}
          className="inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm hover:bg-muted"
        >
          Save to local
        </button>
        <button
          onClick={saveToDatabase}
          disabled={saving}
          className="inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm hover:bg-muted disabled:opacity-60"
        >
          {saving ? "Saving…" : savedId ? `Saved (ID ${savedId})` : "Save to database"}
        </button>
        <a
          href="/results"
          className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-95"
          onClick={saveLocal}
        >
          Open in Results page
        </a>
        {saveError ? (
          <span className="text-sm text-destructive">{saveError}</span>
        ) : null}
      </div>
    </div>
  );
}