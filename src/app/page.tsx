"use client";

import { useState } from "react";
import PatientForm from "@/components/medical/PatientForm";
import ResultsPanel from "@/components/medical/ResultsPanel";
import { runMultiAgentAnalysis } from "@/components/medical/agents";
import type { Report } from "@/components/medical/ResultsPanel";

export default function Home() {
  const [report, setReport] = useState<Report | null>(null);
  const [running, setRunning] = useState(false);

  const handleAnalyze = async (patientInfo: string) => {
    try {
      setRunning(true);
      const r = await runMultiAgentAnalysis(patientInfo);
      setReport(r);
      // Persist latest
      try {
        localStorage.setItem("medical_analysis_latest", JSON.stringify(r));
      } catch {}
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10 bg-center bg-cover opacity-20"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2000&auto=format&fit=crop)",
          }}
        />
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
              🏥 Quick Start
            </div>
            <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight">
              Multi-Agent Medical AI
            </h1>
            <p className="mt-3 text-muted-foreground max-w-prose">
              Test a simulated team of medical AI specialists analyzing a patient case in parallel, then see an integrated summary.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href="#analyze"
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-95"
              >
                Try it now
              </a>
              <a
                href="/results"
                className="rounded-md border px-4 py-2 text-sm hover:bg-muted"
              >
                View last results
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="analyze" className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-xl font-semibold">Enter a patient case</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Choose a sample or write your own case. Then run the analysis.
            </p>
            <div className="mt-6">
              <PatientForm onAnalyze={handleAnalyze} />
            </div>
          </div>

          <div className="lg:pl-6">
            <div
              className="relative p-6"
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
              <h3 className="font-semibold">How it works</h3>
              <ul className="mt-3 list-disc pl-5 text-sm text-muted-foreground space-y-2">
                <li>Three simulated specialists analyze your input in parallel.</li>
                <li>You will see each agent's findings, recommendations, and concerns.</li>
                <li>An integrated summary highlights consensus and priority actions.</li>
              </ul>
              <div className="mt-4 text-xs text-muted-foreground">
                Note: This demo is for educational purposes only and does not provide medical advice.
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10">
          {running && (
            <div
              className="relative p-6 animate-pulse"
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
              Running analysis...
            </div>
          )}
          {!running && report && <ResultsPanel report={report} />}
        </div>
      </section>

      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-6 py-8 text-xs text-muted-foreground">
          Images from Unsplash. Built with Next.js 15 + Tailwind.
        </div>
      </footer>
    </div>
  );
}