import { ScrollText } from "lucide-react";
import { useFetch } from "@/lib/useFetch";
import { adminAuditLog } from "@/lib/adminApi";

export default function AdminAudit() {
  const { data: log } = useFetch(adminAuditLog, { pollMs: 5000 });

  return (
    <div className="space-y-6" data-testid="admin-audit">
      <div>
        <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#9CA3AF]">Trace</div>
        <h1 className="text-3xl md:text-[40px] font-bold tracking-tight text-[#0F0F12] leading-tight mt-1">Audit log</h1>
      </div>
      <div className="bg-white border border-[#ECECEA] rounded-2xl overflow-x-auto">
        <table className="w-full text-[13px] min-w-[700px]">
          <thead className="text-[#9CA3AF] text-[11px] border-b border-[#ECECEA]">
            <tr><th className="text-left font-medium py-3 px-5">When</th><th className="text-left font-medium py-3 px-3">Action</th><th className="text-left font-medium py-3 px-3">Target</th><th className="text-left font-medium py-3 px-5">Meta</th></tr>
          </thead>
          <tbody>
            {(log || []).map((a, i) => (
              <tr key={i} className="border-b border-[#F1F1EF]">
                <td className="py-3 px-5 font-mono text-[12px] text-[#6B7280]">{new Date(a.created_at).toLocaleString()}</td>
                <td className="py-3 px-3"><span className="font-mono text-[11px] bg-[#F3F4F6] text-[#0F0F12] px-2 py-0.5 rounded">{a.action}</span></td>
                <td className="py-3 px-3 font-mono text-[12px] text-[#1F2024] truncate max-w-xs">{a.target}</td>
                <td className="py-3 px-5 font-mono text-[11px] text-[#6B7280]">{Object.keys(a.meta || {}).length > 0 ? JSON.stringify(a.meta) : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!log || log.length === 0) && <div className="p-10 text-center text-[#6B7280]"><ScrollText className="w-6 h-6 mx-auto mb-2" />Audit log empty.</div>}
      </div>
    </div>
  );
}
