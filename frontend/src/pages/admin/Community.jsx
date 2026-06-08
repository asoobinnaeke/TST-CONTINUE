import { Mail } from "lucide-react";
import { useFetch } from "@/lib/useFetch";
import { adminCommunitySignups } from "@/lib/adminApi";

export default function AdminCommunity() {
  const { data: signups } = useFetch(adminCommunitySignups);

  return (
    <div className="space-y-6" data-testid="admin-community">
      <div>
        <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#9CA3AF]">Lead capture</div>
        <h1 className="text-3xl md:text-[40px] font-bold tracking-tight text-[#0F0F12] leading-tight mt-1">Community Battles waitlist</h1>
        <p className="mt-1 text-[13px] text-[#6B7280]">{(signups || []).length} signups collected</p>
      </div>
      <div className="bg-white border border-[#ECECEA] rounded-2xl overflow-x-auto">
        <table className="w-full text-[13px] min-w-[500px]">
          <thead className="text-[#9CA3AF] text-[11px] border-b border-[#ECECEA]"><tr><th className="text-left font-medium py-3 px-5">Email</th><th className="text-left font-medium py-3 px-3">Source</th><th className="text-left font-medium py-3 px-5">Joined</th></tr></thead>
          <tbody>
            {(signups || []).map((s) => (
              <tr key={s.id} className="border-b border-[#F1F1EF]">
                <td className="py-3 px-5 font-mono text-[#0F0F12]"><Mail className="w-3.5 h-3.5 inline mr-2 text-[#9CA3AF]" />{s.email}</td>
                <td className="py-3 px-3"><span className="text-[10px] uppercase tracking-wider bg-[#F3F4F6] text-[#6B7280] px-2 py-0.5 rounded">{s.source}</span></td>
                <td className="py-3 px-5 font-mono text-[12px] text-[#6B7280]">{new Date(s.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!signups || signups.length === 0) && <div className="p-10 text-center text-[#6B7280]">No signups yet.</div>}
      </div>
    </div>
  );
}
