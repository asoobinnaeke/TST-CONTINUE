import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, ArrowDownRight, Users, Crown } from "lucide-react";
import { toast } from "sonner";
import PageHeader from "@/components/app/PageHeader";
import { useFetch } from "@/lib/useFetch";
import { listLobbies, getLobby, joinLobby } from "@/lib/api";

const sizes = [10, 20, 50];
const timelines = ["5min", "10min", "15min", "30min", "1h", "4h", "24h", "36h", "48h", "72h"];

export default function Royale() {
  const navigate = useNavigate();
  const [size, setSize] = useState("all");
  const [tl, setTl] = useState("all");

  const { data: lobbiesRaw, refetch } = useFetch(
    () => listLobbies({ size: size === "all" ? undefined : Number(size), timeline: tl === "all" ? undefined : tl }),
    { pollMs: 5000, deps: [size, tl] }
  );
  const lobbies = lobbiesRaw || [];

  // Pick the first live lobby for the leaderboard widget
  const liveLobbyId = lobbies.find((l) => l.status === "live")?.id;
  const { data: liveLobby } = useFetch(() => liveLobbyId ? getLobby(liveLobbyId) : Promise.resolve(null), { pollMs: 3000, deps: [liveLobbyId] });

  const handleJoin = async (lobby) => {
    if (lobby.status === "live") {
      navigate(`/app/match/${lobby.id}`);
      return;
    }
    try {
      await joinLobby(lobby.id);
      toast.success(`Joined ${lobby.id}`);
      refetch();
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <div data-testid="royale-page" className="space-y-8">
      <PageHeader eyebrow="Compete" title="Trading Royale" description="Equal accounts, simultaneous spawn. Highest equity when the timer hits zero wins the entire pool." />

      <div className="flex flex-wrap items-center gap-3" data-testid="royale-filters">
        <FilterPills label="Lobby size" value={size} onChange={setSize} options={sizes.map(String)} suffix=" traders" />
        <FilterPills label="Timeline" value={tl} onChange={setTl} options={timelines} />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {lobbies.map((l) => (
          <LobbyCard key={l.id} lobby={l} onJoin={() => handleJoin(l)} />
        ))}
      </div>

      {liveLobby?.leaderboard?.length > 0 && (
        <div className="bg-white border border-[#ECECEA] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#9CA3AF]">Live leaderboard</div>
              <div className="text-base font-semibold text-[#0F0F12]">{liveLobby.id} · {liveLobby.size}-player · {liveLobby.timeline}</div>
            </div>
            {liveLobby.time_left_seconds != null && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#EF4444]">
                <span className="w-1.5 h-1.5 bg-[#EF4444] rounded-full" />
                {formatTime(liveLobby.time_left_seconds)} left
              </span>
            )}
          </div>
          <div className="space-y-1">
            {liveLobby.leaderboard.slice(0, 10).map((t) => {
              const isYou = t.user.username === "TradeFury";
              return (
                <div key={t.rank} className={`flex items-center gap-4 px-3 py-2.5 rounded-xl ${isYou ? "bg-[#E6F4C2]/50 ring-1 ring-[#B4E04C]" : "hover:bg-[#F5F5F2]"}`} data-testid={`leaderboard-row-${t.rank}`}>
                  <div className={`w-7 h-7 rounded-full grid place-items-center font-mono text-xs font-semibold ${t.rank === 1 ? "bg-[#B4E04C] text-[#0F0F12]" : t.rank <= 3 ? "bg-[#EDE7FE] text-[#7C3AED]" : "bg-[#F3F4F6] text-[#6B7280]"}`}>{t.rank}</div>
                  <div className="flex-1 flex items-center gap-2">
                    <span className="text-[13px] font-medium text-[#0F0F12]">@{t.user.username}</span>
                    {isYou && <span className="text-[9px] font-bold uppercase tracking-wider bg-[#0F0F12] text-[#B4E04C] px-1.5 py-0.5 rounded">You</span>}
                  </div>
                  <div className="font-mono text-sm font-semibold text-[#0F0F12]">${t.equity.toLocaleString()}</div>
                  <div className={`font-mono text-xs font-semibold w-20 text-right ${t.pnl >= 0 ? "text-[#10B981]" : "text-[#EF4444]"}`}>{t.pnl >= 0 ? "+" : "−"}${Math.abs(t.pnl).toFixed(0)}</div>
                  <div className="w-6 text-center">{t.change > 0 ? <ArrowUpRight className="w-3.5 h-3.5 text-[#10B981] inline" /> : t.change < 0 ? <ArrowDownRight className="w-3.5 h-3.5 text-[#EF4444] inline" /> : <span className="text-[#D1D5DB]">·</span>}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function formatTime(s) {
  if (!s || s < 0) s = 0;
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}` : `${m}:${String(sec).padStart(2, "0")}`;
}

function FilterPills({ label, value, onChange, options, suffix = "" }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] font-mono uppercase tracking-wider text-[#9CA3AF]">{label}</span>
      <div className="flex flex-wrap gap-1.5">
        <FilterBtn active={value === "all"} onClick={() => onChange("all")}>All</FilterBtn>
        {options.map((o) => <FilterBtn key={o} active={value === o} onClick={() => onChange(o)}>{o}{suffix}</FilterBtn>)}
      </div>
    </div>
  );
}

function FilterBtn({ active, onClick, children }) {
  return <button onClick={onClick} className={`text-[12px] px-3 py-1.5 rounded-full border transition-colors ${active ? "bg-[#0F0F12] text-white border-[#0F0F12]" : "bg-white border-[#ECECEA] text-[#1F2024] hover:bg-[#F5F5F2]"}`}>{children}</button>;
}

function LobbyCard({ lobby, onJoin }) {
  const pct = (lobby.joined / lobby.size) * 100;
  return (
    <div data-testid={`lobby-card-${lobby.id}`} className="bg-white border border-[#ECECEA] rounded-2xl p-5 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-12px_rgba(15,15,18,0.1)] transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-[#EDE7FE] grid place-items-center"><Crown className="w-4 h-4 text-[#7C3AED]" /></div>
          <div>
            <div className="text-[13px] font-semibold text-[#0F0F12]">{lobby.size}-Player · {lobby.timeline}</div>
            <div className="text-[11px] font-mono text-[#6B7280]">{lobby.id}</div>
          </div>
        </div>
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${lobby.status === "live" ? "bg-[#EF4444]/10 text-[#EF4444]" : lobby.status === "starting" ? "bg-[#A78BFA]/15 text-[#7C3AED]" : "bg-[#F3F4F6] text-[#6B7280]"}`}>{lobby.status === "live" ? "● LIVE" : lobby.status === "starting" ? "Starting" : "Filling"}</span>
      </div>
      <div className="space-y-3 mb-4">
        <div>
          <div className="flex items-center justify-between text-[12px] mb-1.5">
            <span className="text-[#6B7280] inline-flex items-center gap-1.5"><Users className="w-3 h-3" /> Joined</span>
            <span className="font-mono font-semibold text-[#0F0F12]">{lobby.joined} / {lobby.size}</span>
          </div>
          <div className="h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden"><div className="h-full bg-[#B4E04C] rounded-full" style={{ width: `${pct}%` }} /></div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <Mini label="Entry" value={`$${lobby.entry_fee}`} />
          <Mini label="Pool" value={`$${lobby.prize_pool.toLocaleString()}`} accent="green" />
          <Mini label="Starts" value={lobby.starts_in} accent="purple" />
        </div>
      </div>
      <button onClick={onJoin} className="w-full inline-flex items-center justify-center gap-2 bg-[#0F0F12] text-white text-[13px] font-medium py-2.5 rounded-full hover:bg-[#1F2024]" disabled={lobby.is_in}>
        {lobby.is_in ? "Joined" : lobby.status === "live" ? "Spectate" : "Join royale"}
        {!lobby.is_in && <ArrowUpRight className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}

function Mini({ label, value, accent }) {
  const c = accent === "green" ? "text-[#10B981]" : accent === "purple" ? "text-[#7C3AED]" : "text-[#0F0F12]";
  return (
    <div className="bg-[#FAFAF7] border border-[#F1F1EF] rounded-lg px-2 py-1.5">
      <div className="text-[10px] font-mono uppercase tracking-wider text-[#9CA3AF]">{label}</div>
      <div className={`text-[12px] font-mono font-semibold ${c}`}>{value}</div>
    </div>
  );
}
