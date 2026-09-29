// API Client for SupportHaven Backend

const BASE_URL = '/api';

export async function sendChatMessage({ sessionId, message, apiKey }) {
  const response = await fetch(`${BASE_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, message, apiKey })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Server responded with status ${response.status}`);
  }

  return response.json();
}

export async function fetchSession(sessionId) {
  const response = await fetch(`${BASE_URL}/session/${sessionId}`);
  if (!response.ok) throw new Error("Failed to load session");
  return response.json();
}

export async function resetSession(sessionId) {
  const response = await fetch(`${BASE_URL}/session/${sessionId}/reset`, {
    method: 'POST'
  });
  if (!response.ok) throw new Error("Failed to reset session");
  return response.json();
}

export async function requestEscalation(sessionId, reason) {
  const response = await fetch(`${BASE_URL}/session/${sessionId}/escalate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reason })
  });
  if (!response.ok) throw new Error("Failed to escalate session");
  return response.json();
}

export async function fetchAnalytics() {
  const response = await fetch(`${BASE_URL}/admin/analytics`);
  if (!response.ok) throw new Error("Failed to fetch analytics");
  return response.json();
}

export async function fetchConversations() {
  const response = await fetch(`${BASE_URL}/admin/conversations`);
  if (!response.ok) throw new Error("Failed to fetch conversations");
  return response.json();
}

export async function fetchOrders() {
  const response = await fetch(`${BASE_URL}/orders`);
  if (!response.ok) throw new Error("Failed to fetch orders");
  return response.json();
}
