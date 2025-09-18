import { AgentConfig, AgentResult } from "./types";

export const DEFAULT_AGENTS: AgentConfig[] = [
  { id: "gemma2-9b", name: "Dr. Gemma", model: "gemma2:9b", specialty: "General Medicine Specialist" },
  { id: "phi3-3_8b", name: "Dr. Phi", model: "phi3:3.8b", specialty: "Diagnostic Specialist" },
  { id: "llama3-latest", name: "Dr. Llama", model: "llama3:latest", specialty: "Treatment Planning Specialist" },
];

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function inferFindings(text: string) {
  const t = text.toLowerCase();
  const findings: string[] = [];
  const recs: string[] = [];
  const concerns: string[] = [];

  if (/(chest pain|shortness of breath|sob|heart)/.test(t)) {
    findings.push("Symptoms suggest possible cardiac involvement (e.g., ACS risk)");
    recs.push("Obtain ECG, troponins, CXR; start ASA if not contraindicated");
    concerns.push("Rule out acute coronary syndrome and pulmonary embolism");
  }
  if (/(headache|nausea|photophobia|light)/.test(t)) {
    findings.push("Headache pattern concerning for migraine; consider red flags");
    recs.push("Neurologic exam; trial NSAID + antiemetic; consider triptan");
    concerns.push("Rule out intracranial pathology if red flags present");
  }
  if (/(joint pain|stiffness|knees|wrists|fatigue)/.test(t)) {
    findings.push("Inflammatory arthralgia pattern with morning stiffness");
    recs.push("Order ESR/CRP, RF, anti-CCP; consider rheumatology referral");
    concerns.push("Evaluate for rheumatoid arthritis or other inflammatory arthropathy");
  }
  if (findings.length === 0) {
    findings.push("Non-specific presentation; requires further history and exam");
    recs.push("Gather detailed history, vitals, focused physical exam");
    concerns.push("Ensure no time-sensitive emergencies are missed");
  }

  return { findings, recs, concerns };
}

export async function analyzeWithAgent(
  agent: AgentConfig,
  patientInfo: string
): Promise<AgentResult> {
  // Simulate variable response time
  const delay = 600 + Math.floor(Math.random() * 1200);
  await sleep(delay);

  const { findings, recs, concerns } = inferFindings(patientInfo);

  const analysis = [
    "Main Findings:",
    `- ${findings[0]}`,
    findings[1] ? `- ${findings[1]}` : undefined,
    "\nRecommendations:",
    `- ${recs[0]}`,
    recs[1] ? `- ${recs[1]}` : undefined,
    "\nConcerns:",
    `- ${concerns[0]}`,
  ]
    .filter(Boolean)
    .join("\n");

  return {
    agent: agent.name,
    specialty: agent.specialty,
    model: agent.model,
    analysis,
    response_time: `${(delay / 1000).toFixed(2)}s`,
  };
}

export async function runMultiAgentAnalysis(
  patientInfo: string,
  agents: AgentConfig[] = DEFAULT_AGENTS
) {
  const results = await Promise.all(
    agents.map((a) => analyzeWithAgent(a, patientInfo))
  );

  const combined = results
    .map(
      (r) => `${r.agent} (${r.specialty}):\n${r.analysis}`
    )
    .join("\n\n");

  const summary = `Integrated Summary:\n- Consensus: ${
    /ACS|cardiac|arthralgia|migraine/i.test(combined)
      ? "Multiple agents identify themed patterns aligned with symptoms."
      : "Agents recommend further evaluation due to non-specific presentation."
  }\n- Key recommendations emphasize initial diagnostics and safety-netting.\n- Priority actions: address life-threatening causes first, then targeted workup.`;

  return { patient_info: patientInfo, agent_results: results, summary };
}

// Add: Web API-backed analysis using FastAPI endpoint
export async function runMultiAgentAnalysisApi(
  patientInfo: string,
  endpoint: string = "http://localhost:8000/analyze"
) {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      // Map our single-field input into the API's expected shape
      symptoms: patientInfo,
      // Optionally include other empty fields; FastAPI has Pydantic validation
      medical_history: "",
      blood_results: "",
      procedures: "",
      patient_id: "web-ui",
    }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error || `API request failed (status ${res.status})`);
  }

  const data = await res.json();

  // Map API response sections to our AgentResult[]
  const results: AgentResult[] = [];

  if (data?.diagnostic) {
    results.push({
      agent: data.diagnostic.agent || "DiagnosticAgent",
      specialty: "Diagnostic Specialist",
      model: "api",
      analysis: [
        data.diagnostic.diagnosis?.trim?.() || String(data.diagnostic.diagnosis || ""),
        data.diagnostic.confidence ? `\nConfidence: ${data.diagnostic.confidence}` : undefined,
      ].filter(Boolean).join("\n"),
      response_time: "-",
    });
  }

  if (data?.blood_analysis) {
    results.push({
      agent: data.blood_analysis.agent || "BloodAnalysisAgent",
      specialty: "Laboratory Specialist",
      model: "api",
      analysis: [
        data.blood_analysis.blood_analysis?.trim?.() || String(data.blood_analysis.blood_analysis || ""),
        data.blood_analysis.confidence ? `\nConfidence: ${data.blood_analysis.confidence}` : undefined,
      ].filter(Boolean).join("\n"),
      response_time: "-",
    });
  }

  if (data?.medical_coding) {
    results.push({
      agent: data.medical_coding.agent || "MedicalCodingAgent",
      specialty: "Medical Coder",
      model: "api",
      analysis: [
        data.medical_coding.medical_codes?.trim?.() || String(data.medical_coding.medical_codes || ""),
        data.medical_coding.confidence ? `\nConfidence: ${data.medical_coding.confidence}` : undefined,
      ].filter(Boolean).join("\n"),
      response_time: "-",
    });
  }

  const summary: string =
    typeof data?.summary === "string" && data.summary.trim().length > 0
      ? data.summary
      : "Integrated summary unavailable from API.";

  return { patient_info: patientInfo, agent_results: results, summary };
}