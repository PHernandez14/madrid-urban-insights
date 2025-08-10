export type ChatMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

export type OllamaChatRequest = {
  model: string;
  messages: ChatMessage[];
  stream?: boolean;
  options?: Record<string, unknown>;
};

export type OllamaChatResponse = {
  message?: ChatMessage;
  response?: string; // algunos endpoints devuelven 'response'
};

const OLLAMA_MODEL = import.meta.env.VITE_OLLAMA_MODEL || 'llama3.1';

export async function chatWithOllama(messages: ChatMessage[], model?: string): Promise<string> {
  const body: OllamaChatRequest = {
    model: model || OLLAMA_MODEL,
    messages,
    stream: false,
  };

  const res = await fetch('/ollama/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error Ollama ${res.status}: ${text}`);
  }
  const data: OllamaChatResponse = await res.json();
  // compat
  if (data.message?.content) return data.message.content;
  if (data.response) return data.response;
  return '';
}

export async function listOllamaModels(): Promise<string[]> {
  const res = await fetch('/ollama/api/tags');
  if (!res.ok) return [];
  const data = await res.json();
  // expected: { models: [{ name: 'llama3.1', ... }, ...] }
  const models = Array.isArray(data?.models) ? data.models : [];
  return models.map((m: any) => m?.name).filter(Boolean);
}

export async function pingOllama(): Promise<boolean> {
  try {
    const res = await fetch('/ollama/api/tags', { method: 'GET' });
    return res.ok;
  } catch {
    return false;
  }
}


