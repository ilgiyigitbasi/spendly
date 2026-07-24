import * as SecureStore from "expo-secure-store";

const API_BASE_URL = "http://172.20.10.2:8000";

const TOKEN_KEY = "spendly_token";

export async function getToken() {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function setToken(token: string) {
  return SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function clearToken() {
  return SecureStore.deleteItemAsync(TOKEN_KEY);
}

async function request(path: string, options: RequestInit = {}) {
  const token = await getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.detail || `İstek başarısız: ${res.status}`);
  }

  return res.json();
}

export const api = {
  register: (name: string, password: string) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, password }),
    }),

  login: (name: string, password: string) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ name, password }),
    }),

  getBalance: () => request("/transactions/balance"),

  getTransactions: (month?: string) =>
    request(`/transactions${month ? `?month=${month}` : ""}`),

  createTransaction: (payload: {
    type: string;
    category: string;
    amount: number;
    note?: string;
    date: string;
  }) =>
    request("/transactions", { method: "POST", body: JSON.stringify(payload) }),

  deleteTransaction: (id: number) =>
    request(`/transactions/${id}`, { method: "DELETE" }),

  registerPushToken: (token: string) =>
    request("/push/register", {
      method: "POST",
      body: JSON.stringify({ token }),
    }),
};
