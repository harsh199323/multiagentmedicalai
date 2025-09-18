"use client";

import { useEffect, useState } from "react";
import ResultsPanel, { type Report } from "@/components/medical/ResultsPanel";

export default function ResultsPage() {
  const [report, setReport] = useState<Report | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("medical_analysis_latest");
      if (raw) setReport(JSON.parse(raw));
    } catch {}
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-2xl font-semibold">Multi-Agent Medical Analysis</h1>
        <p className="text-sm text-muted-foreground mt-1">Loaded from your last saved session.</p>

        {report ? (
          <div className="mt-8">
            <ResultsPanel report={report} />
          </div>
        ) : (
          <div className="mt-10 rounded-lg border p-6">
            <p className="text-sm">No saved report found. Go back to the home page to run an analysis.</p>
            <a href="/" className="mt-4 inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Go to Home</a>
          </div>
        )}
      </div>
    </div>
  );
}