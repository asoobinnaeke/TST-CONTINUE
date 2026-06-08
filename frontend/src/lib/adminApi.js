// Admin API client. Token stored in localStorage('admin_token').
const BASE = process.env.REACT_APP_BACKEND_URL;

const getToken = () => localStorage.getItem("admin_token") || "";
export const setAdminToken = (t) => localStorage.setItem("admin_token", t);
export const clearAdminToken = () => localStorage.removeItem("admin_token");
export const isAdminAuthed = () => !!getToken();

async function http(path, { method = "GET", body } = {}) {
  const res = await fetch(`${BASE}/api/admin${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 401) {
    clearAdminToken();
    if (typeof window !== "undefined") window.location.href = "/admin/login";
  }
  if (!res.ok) {
    let d = "Request failed";
    try { d = (await res.json()).detail || d; } catch {}
    throw new Error(d);
  }
  return res.status === 204 ? null : res.json();
}

export const adminLogin = (email, password) =>
  fetch(`${BASE}/api/admin/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) }).then(async (r) => {
    if (!r.ok) throw new Error((await r.json()).detail || "Login failed");
    const j = await r.json();
    setAdminToken(j.token);
    return j;
  });

export const adminOverview = () => http("/overview");
export const adminListUsers = (q = "", plan = "all") => http(`/users?${new URLSearchParams({ q, plan })}`);
export const adminSetPlan = (id, plan) => http(`/users/${id}/plan`, { method: "POST", body: { plan } });
export const adminSuspend = (id, reason) => http(`/users/${id}/suspend`, { method: "POST", body: { reason } });
export const adminUnsuspend = (id) => http(`/users/${id}/unsuspend`, { method: "POST" });
export const adminListDuels = (status = "all") => http(`/duels?status=${status}`);
export const adminVoidDuel = (id, reason) => http(`/duels/${id}/void`, { method: "POST", body: { reason } });
export const adminWithdrawals = () => http("/finance/withdrawals");
export const adminApproveWd = (id) => http(`/finance/withdrawals/${id}/approve`, { method: "POST" });
export const adminRejectWd = (id, reason) => http(`/finance/withdrawals/${id}/reject`, { method: "POST", body: { reason } });
export const adminKycQueue = () => http("/kyc");
export const adminApproveKyc = (id) => http(`/kyc/${id}/approve`, { method: "POST" });
export const adminRejectKyc = (id, reason) => http(`/kyc/${id}/reject`, { method: "POST", body: { reason } });
export const adminAuditLog = () => http("/audit-log");
export const adminCommunitySignups = () => http("/community-signups");
