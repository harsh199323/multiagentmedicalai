export type AgentConfig = {
  id: string;
  name: string;
  model: string;
  specialty: string;
};

export type AgentResult = {
  agent: string;
  specialty: string;
  model: string;
  analysis: string;
  response_time: string;
  error?: string;
};