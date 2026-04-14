// Site Planner API client — talks to Azure Functions in /api
// Auth: pass user email + code as headers on every request.
// Set the current user via setApiUser() after login.

let _user = null;
export function setApiUser(user) { _user = user; }
export function clearApiUser() { _user = null; }

function authHeaders() {
  if (!_user) return {};
  return {
    "x-user-email": _user.email,
    "x-user-code": _user.code
  };
}

async function request(path, opts = {}) {
  const res = await fetch(`/api/${path}`, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...(opts.headers || {})
    }
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${path} ${res.status}: ${text}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

// ── Auth ──
export async function login(email, code) {
  return request(`users?action=login`, {
    method: "POST",
    body: JSON.stringify({ email, code })
  });
}

// ── Jobs ──
export async function listJobs() { return request("jobs"); }
export async function saveJob(job) {
  return request("jobs", { method: "POST", body: JSON.stringify(job) });
}
export async function deleteJobApi(id) {
  return request(`jobs/${id}`, { method: "DELETE" });
}
export async function bulkUploadJobs(jobs) {
  return request("jobs", { method: "POST", body: JSON.stringify(jobs) });
}

// ── Workers (whole map) ──
export async function getWorkers() { return request("workers"); }
export async function saveWorkers(workersMap) {
  return request("workers", { method: "POST", body: JSON.stringify(workersMap) });
}

// ── Leave ──
export async function listLeave() { return request("leave"); }
export async function saveLeaveEntry(entry) {
  return request("leave", { method: "POST", body: JSON.stringify(entry) });
}
export async function deleteLeaveEntry(id) {
  return request(`leave/${id}`, { method: "DELETE" });
}
export async function bulkUploadLeave(items) {
  return request("leave", { method: "POST", body: JSON.stringify(items) });
}

// ── Users ──
export async function listUsers() { return request("users"); }
export async function saveUser(u) {
  return request("users", { method: "POST", body: JSON.stringify(u) });
}
export async function deleteUserApi(email) {
  return request(`users/${encodeURIComponent(email)}`, { method: "DELETE" });
}

// ── Threads (whole map) ──
export async function getThreads() { return request("threads"); }
export async function saveThreads(threadsMap) {
  return request("threads", { method: "POST", body: JSON.stringify(threadsMap) });
}

// ── History (admin audit log) ──
export async function listHistory() { return request("history"); }
