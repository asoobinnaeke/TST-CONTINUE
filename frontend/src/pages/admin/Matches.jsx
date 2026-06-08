import { useState } from "react";
import { toast } from "sonner";
import { useFetch } from "@/lib/useFetch";
import { adminListDuels, adminVoidDuel } from "@/lib/adminApi";

export default function AdminMatches() {
  const [status, setStatus] = useState("all");
  const { data: duels, refetch } = useFetch(() => adminListDuels(status), { pollMs: 4000, deps: [status] });

  const voidDuel = async (id) => {
    const reason = prompt("Reason for voiding the duel? (refunds both traders)");
    if (!reason) return;
    try { await adminVoidDuel(id, reason); toast.success("Duel voided and both refunded"); refetch(); }
    catch (e) { toast.error(e.message); }
  };

  return (
    <div className="space-y-6" data-testid="admin-matches">
      <div>
        <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#9CA3AF]">Manage</div>
        <h1 className="text-3xl md:text-[40px] font-bold tracking-tight text-[#0F0F12] leading-tight mt-1">Matches</h1>
      </div>

      <div className="flex flex-wrap gap-2">
        {["all", "live", "pairing", "completed", "cancelled"].map((s) => (
          <button key={s} onClick={() => setStatus(s)} className={`text-[12px] px-3 py-1.5 rounded-full border ${status === s ? "bg-[#0F0F12] text-white border-[#0F0F12]" : "bg-white border-[#ECECEA] text-[#1F2024]"}`}>{s}</button>
        ))}
      </div>

      <div className="bg-white border border-[#ECECEA] rounded-2xl overflow-x-auto">
        <table className="w-full text-[13px] min-w-[900px]">
          <thead className="text-[#9CA3AF] text-[11px] border-b border-[#ECECEA]">
            <tr>
              <th className="text-left font-medium py-3 px-5">Duel</th>
              <th className="text-left font-medium py-3 px-3">Type</th>
              <th className="text-left font-medium py-3 px-3">Status</th>
              <th className="text-left font-medium py-3 px-3">Trader A</th>
              <th className="text-left font-medium py-3 px-3">Trader B</th>
              <th className="text-right font-medium py-3 px-3">Account</th>
              <th className="text-right font-medium py-3 px-3">P&amp;L A</th>
              <th className="text-right font-medium py-3 px-3">P&amp;L B</th>
              <th className="text-right font-medium py-3 px-5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(duels || []).map((d) => (
              <tr key={d.id} className="border-b border-[#F1F1EF] hover:bg-[#FAFAF7]">
                <td className="py-3 px-5 font-mono text-[#0F0F12] font-semibold">{d.id}</td>
                <td className="py-3 px-3"><span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${d.type === "custom" ? "bg-[#EDE7FE] text-[#7C3AED]" : "bg-[#F3F4F6] text-[#6B7280]"}`}>{d.type}</span></td>
                <td className="py-3 px-3"><span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${d.status === "live" ? "bg-[#EF4444]/10 text-[#EF4444]" : d.status === "completed" ? "bg-[#10B981]/10 text-[#10B981]" : "bg-[#F3F4F6] text-[#6B7280]"}`}>{d.status}</span></td>
                <td className="py-3 px-3 text-[#0F0F12]">@{d.trader_a}</td>
                <td className="py-3 px-3 text-[#0F0F12]">@{d.trader_b}</td>
                <td className="py-3 px-3 text-right font-mono">${(d.account_size / 1000).toFixed(0)}K</td>
                <td className={`py-3 px-3 text-right font-mono font-semibold ${d.pnl_a >= 0 ? "text-[#10B981]" : "text-[#EF4444]"}`}>{d.pnl_a >= 0 ? "+" : "−"}${Math.abs(d.pnl_a).toFixed(0)}</td>
                <td className={`py-3 px-3 text-right font-mono font-semibold ${d.pnl_b >= 0 ? "text-[#10B981]" : "text-[#EF4444]"}`}>{d.pnl_b >= 0 ? "+" : "−"}${Math.abs(d.pnl_b).toFixed(0)}</td>
                <td className="py-3 px-5 text-right">
                  {d.status === "live" && <button onClick={() => voidDuel(d.id)} className="text-[11px] font-medium text-[#EF4444] hover:underline">Void</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!duels || duels.length === 0) && <div className="p-10 text-center text-[#6B7280] text-[13px]">No duels.</div>}
      </div>
    </div>
  );
}
