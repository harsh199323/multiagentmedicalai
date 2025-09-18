"use client";

import { useState } from "react";

type PatientFormProps = {
  onAnalyze: (patientInfo: string) => void;
};

const DEFAULT_CASES = [
  "Patient presents with chest pain, shortness of breath, and fatigue for 3 days. Has history of hypertension and family history of heart disease.",
  "35-year-old patient with severe headaches, nausea, and sensitivity to light for 2 days. No prior medical history.",
  "Patient reports joint pain in knees and wrists, morning stiffness lasting 2 hours, and fatigue for several weeks.",
];

export default function PatientForm({ onAnalyze }: PatientFormProps) {
  const [selected, setSelected] = useState<number>(0);
  const [custom, setCustom] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const patientInfo = selected === 3 ? custom : DEFAULT_CASES[selected] || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientInfo.trim()) return;
    try {
      setLoading(true);
      await Promise.resolve(onAnalyze(patientInfo.trim()));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Sample patient cases</label>
        <div className="grid gap-3">
          {DEFAULT_CASES.map((c, idx) => (
            <label key={idx} className="relative flex items-start gap-3 p-4 cursor-pointer">
              <input
                type="radio"
                name="case"
                className="mt-1"
                checked={selected === idx}
                onChange={() => setSelected(idx)}
              />
              <span className="text-sm text-foreground/90">{c}</span>
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
            </label>
          ))}
          <label className="relative flex items-start gap-3 p-4 cursor-pointer">
            <input
              type="radio"
              name="case"
              className="mt-1"
              checked={selected === 3}
              onChange={() => setSelected(3)}
            />
            <span className="text-sm text-foreground/90">Enter custom case</span>
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
          </label>
        </div>
      </div>

      {selected === 3 && (
        <div className="space-y-2">
          <label htmlFor="custom" className="text-sm font-medium">
            Patient information
          </label>
          <textarea
            id="custom"
            className="w-full min-h-32 rounded-md border bg-background p-3 text-sm"
            placeholder="Describe the patient's symptoms, history, and findings..."
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
          />
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading || !patientInfo.trim()}
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-95 disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Run Multi-Agent Analysis"}
        </button>
        <span className="text-xs text-muted-foreground">
          Simulated locally — no external API calls.
        </span>
      </div>
    </form>
  );
}