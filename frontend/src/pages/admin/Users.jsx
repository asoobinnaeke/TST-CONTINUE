import { useState } from "react";
import { Search, Ban, Sparkles, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { useFetch } from "@/lib/useFetch";
import { adminListUsers, adminSetPlan, adminSuspend, adminUnsuspend } from "@/lib/adminApi";

export default function AdminUsers() {
  const [q, setQ] = useState("");
  const [plan, setPlan] = useState("all");
  const { data: users, refetch } = useFetch(() => adminListUsers(q, plan), { deps: [q, plan] });

  const togglePlan = async (u) => {
    try { await adminSetPlan(u.id, u.plan === "PRO" ? "FREE" : "PRO"); toast.success("Plan updated"); refetch(); }
    catch (e) { toast.error(e.message); }
  };

  const toggleSuspend = async (u) => {
    try {
      if (u.suspended) { await adminUnsuspend(u.id); toast.success("Unsuspended"); }
      else { await adminSuspend(u.id, "Manual admin action"); toast.success("Suspended"); }
      refetch();
    } catch (e) { toast.error(e.message); }
  };

  return (
    <div className="space-y-6" data-testid="admin-users">
      <div>
        <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#9CA3AF]">Manage</div>
        <h1 className="text-3xl md:text-[40px] font-bold tracking-tight text-[#0F0F12] leading-tight mt-1">Users</h1>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search username or email…" className="w-full bg-white border border-[#ECECEA] rounded-full pl-10 pr-4 py-2.5 text-[13px] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#0F0F12]" />
        </div>
        {["all", "FREE", "PRO"].map((p) => (
          <button key={p} onClick={() => setPlan(p)} className={`text-[12px] px-3 py-1.5 rounded-full border ${plan === p ? "bg-[#0F0F12] text-white border-[#0F0F12]" : "bg-white border-[#ECECEA] text-[#1F2024]"}`}>{p}</button>
        ))}
      </div>

      <div className="bg-white border border-[#ECECEA] rounded-2xl overflow-x-auto">
        <table className="w-full text-[13px] min-w-[800px]">
          <thead className="text-[#9CA3AF] text-[11px] border-b border-[#ECECEA]">
            <tr>
              <th className="text-left font-medium py-3 px-5">User</th>
              <th className="text-left font-medium py-3 px-3">Email</th>
              <th className="text-left font-medium py-3 px-3">Country</th>
              <th className="text-left font-medium py-3 px-3">Plan</th>
              <th className="text-left font-medium py-3 px-3">KYC</th>
              <th className="text-right font-medium py-3 px-3">Balance</th>
              <th className="text-right font-medium py-3 px-3">Lifetime</th>
              <th className="text-right font-medium py-3 px-5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(users || []).map((u) => (
              <tr key={u.id} className="border-b border-[#F1F1EF] hover:bg-[#FAFAF7]" data-testid={`admin-user-${u.username}`}>
                <td className="py-3 px-5">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-[#0F0F12] text-white text-[10px] grid place-items-center font-bold">{u.username[0]}</span>
                    <span className="font-medium text-[#0F0F12]">@{u.username}</span>
                    {u.suspended && <span className="text-[9px] font-bold uppercase bg-[#FEE2E2] text-[#DC2626] px-1.5 py-0.5 rounded">Susp.</span>}
                  </div>
                </td>
                <td className="py-3 px-3 text-[#1F2024] font-mono text-[12px]">{u.email}</td>
                <td className="py-3 px-3">{u.country}</td>
                <td className="py-3 px-3">
                  <button onClick={() => togglePlan(u)} className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${u.plan === "PRO" ? "bg-[#0F0F12] text-[#B4E04C]" : "bg-[#F3F4F6] text-[#6B7280]"}`}>{u.plan}</button>
                </td>
                <td className="py-3 px-3"><span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${u.kyc_status === "verified" ? "bg-[#10B981]/10 text-[#10B981]" : u.kyc_status === "pending" ? "bg-[#FEF3C7] text-[#92400E]" : "bg-[#F3F4F6] text-[#6B7280]"}`}>{u.kyc_status}</span></td>
                <td className="py-3 px-3 text-right font-mono text-[#0F0F12]">${u.balance.toLocaleString()}</td>
                <td className="py-3 px-3 text-right font-mono text-[#10B981] font-semibold">${u.lifetime_earned.toLocaleString()}</td>
                <td className="py-3 px-5 text-right">
                  <button onClick={() => toggleSuspend(u)} className="text-[11px] font-medium text-[#EF4444] hover:underline inline-flex items-center gap-1">
                    <Ban className="w-3 h-3" /> {u.suspended ? "Unsusp" : "Suspend"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!users || users.length === 0) && <div className="p-10 text-center text-[#6B7280] text-[13px]">No users found.</div>}
      </div>
    </div>
  );
}
