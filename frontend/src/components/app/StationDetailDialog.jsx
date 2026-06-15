import { useEffect, useState } from "react";
import { Copy, Eye, EyeOff, X, ExternalLink, Crown, Skull, Sparkles, Bot, Trophy, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { getStationDuelDetail, getStationRoyaleDetail, getStationTournamentDetail } from "@/lib/api";
import { ResponsiveContainer, LineChart, Line, ReferenceLine, Tooltip } from "recharts";

/**
 * Account-detail dialog opened from the Trading Station list.
 * Shows MT5 credentials + an equity curve. Behaviour varies by event kind:
 *   - duel-*: my equity + opponent equity side-by-side
 *   - royale: leaderboard + phase banner + MT5
 *   - tournament: journey + MT5
 */
export default function StationDetailDialog({ open, item, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !item) {
      setData(null);
      return;
    }
    setLoading(true);
    const fetcher = item.kind === "royale" ? getStationRoyaleDetail
      : item.kind === "tournament" ? getStationTournamentDetail
        : getStationDuelDetail;
    fetcher(item.id).then(setData).catch((e) => toast.error(e.message)).finally(() => setLoading(false));
  }, [open, item]);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose?.()}>
      <DialogContent className="max-w-3xl rounded-3xl border-[var(--border)] bg-[var(--surface)] p-0 overflow-hidden max-h-[90vh] flex flex-col" data-testid="station-detail-dialog">
        <DialogHeader className="px-6 pt-6 pb-3 border-b border-[var(--border-soft)]">
          <DialogTitle className="text-[var(--ink)] text-xl flex items-center gap-2">
            {item?.label}
            <span className="font-mono text-[11px] text-[var(--muted-2)]">{item?.id?.slice(0, 12)}</span>
          </DialogTitle>
          <DialogDescription className="text-[var(--muted)]">
            Account details, MT5 credentials, and live performance.
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto px-6 pb-6 pt-4 space-y-5">
          {loading && <div className="h-40 bg-[var(--bg)] rounded-2xl animate-pulse" />}
          {!loading && data && item?.kind?.startsWith("duel") && <DuelDetail data={data} />}
          {!loading && data && item?.kind === "royale" && <RoyaleDetail data={data} />}
          {!loading && data && item?.kind === "tournament" && <TournamentDetail data={data} />}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ---- Duel ----

function DuelDetail({ data }) {
  const live = data.status === "live";
  return (
    <div className="space-y-4" data-testid="duel-detail">
      <div className="grid sm:grid-cols-3 gap-2">
        <Stat label="Account" value={`$${(data.account_size / 1000).toFixed(0)}K`} />
        <Stat label="Prize" value={`$${data.prize?.toLocaleString() || "—"}`} accent="green" />
        <Stat label={live ? "Time left" : "Status"} value={live ? formatLeft(data.time_left_seconds) : labelize(data.status)} />
      </div>

      <MT5Card mt5={data.me?.mt5} />

      <div className="grid md:grid-cols-2 gap-3">
        <TraderCard t={data.me} you />
        <TraderCard t={data.opponent} />
      </div>

      {data.me?.equity_series?.length > 0 && (
        <ChartCard title="Equity curve" me={data.me} opp={data.opponent} accountSize={data.account_size} />
      )}
    </div>
  );
}

function TraderCard({ t, you }) {
  if (!t) return null;
  const pnl = t.pnl ?? 0;
  return (
    <div className={`rounded-2xl p-4 border ${you ? "bg-[var(--lime-soft)] border-[#B4E04C]" : "bg-[var(--bg)] border-[var(--border-soft)]"}`} data-testid={you ? "trader-me" : "trader-opp"}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-[var(--inverse)] text-[var(--inverse-fg)] text-[12px] grid place-items-center font-bold">{(t.username || "?")[0]}</span>
          <div>
            <div className="text-[13.5px] font-semibold text-[var(--ink)] flex items-center gap-1.5">
              @{t.username}
              {you && <span className="text-[9px] font-bold uppercase tracking-wider bg-[#0F0F12] text-[#B4E04C] px-1.5 py-0.5 rounded">You</span>}
              {t.is_bot && <Bot className="w-3 h-3 text-[var(--muted-2)]" />}
            </div>
            <div className="text-[10.5px] text-[var(--muted)] uppercase tracking-wider">{t.tier || ""}</div>
          </div>
        </div>
        <div className="text-right">
          <div className={`font-mono text-[15px] font-bold ${pnl >= 0 ? "text-[#10B981]" : "text-[#EF4444]"}`}>
            {pnl >= 0 ? "+" : "−"}${Math.abs(pnl).toLocaleString()}
          </div>
          <div className="text-[10.5px] text-[var(--muted)] font-mono">Equity ${t.equity?.toLocaleString() || "—"}</div>
        </div>
      </div>
      <div className="text-[11px] text-[var(--muted)] flex items-center gap-3">
        {t.is_ready && <span className="inline-flex items-center gap-1 text-[#10B981]">● Ready</span>}
        {t.login_confirmed && <span className="inline-flex items-center gap-1 text-[#7C3AED]">● Logged in</span>}
      </div>
    </div>
  );
}

function ChartCard({ title, me, opp, accountSize }) {
  const data = (me.equity_series || []).map((p, i) => ({
    i: p.i,
    me: accountSize + (p.v || 0),
    opp: accountSize + (opp?.equity_series?.[i]?.v || 0),
  }));
  return (
    <div className="bg-[var(--bg)] border border-[var(--border-soft)] rounded-2xl p-4" data-testid="equity-curve">
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="text-[11px] uppercase tracking-wider font-mono text-[var(--muted-2)]">{title}</div>
          <div className="text-[13px] font-semibold text-[var(--ink)]">You vs Opponent</div>
        </div>
        <div className="flex gap-3 text-[11px]">
          <span className="inline-flex items-center gap-1.5 text-[#0F0F12]"><span className="w-2 h-2 rounded-full bg-[#0F0F12]" /> You</span>
          <span className="inline-flex items-center gap-1.5 text-[#7C3AED]"><span className="w-2 h-2 rounded-full bg-[#7C3AED]" /> Opp</span>
        </div>
      </div>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 6, right: 4, left: 4, bottom: 0 }}>
            <ReferenceLine y={accountSize} stroke="#D7D7D2" strokeDasharray="3 3" />
            <Line type="monotone" dataKey="me" stroke="#0F0F12" strokeWidth={2} dot={false} isAnimationActive={false} />
            <Line type="monotone" dataKey="opp" stroke="#7C3AED" strokeWidth={2} dot={false} isAnimationActive={false} />
            <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, padding: "4px 8px" }} formatter={(v) => `$${Math.round(v).toLocaleString()}`} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ---- Royale ----

function RoyaleDetail({ data }) {
  const phase = data.state?.phase;
  return (
    <div className="space-y-4" data-testid="royale-detail">
      <div className="grid sm:grid-cols-4 gap-2">
        <Stat label="Lobby" value={`${data.size}p`} />
        <Stat label="Timeline" value={data.timeline} />
        <Stat label="Pool" value={`$${data.prize_pool.toLocaleString()}`} accent="green" />
        <Stat label="Active" value={`${data.state.total_active}/${data.size}`} />
      </div>

      <PhaseBanner state={data.state} />
      <MT5Card mt5={data.me?.mt5} />

      <div className="bg-[var(--bg)] border border-[var(--border-soft)] rounded-2xl p-3">
        <div className="text-[11px] uppercase tracking-wider font-mono text-[var(--muted-2)] mb-2 px-2">Leaderboard</div>
        <div className="space-y-1 max-h-72 overflow-y-auto">
          {data.leaderboard.map((row) => (
            <LeaderRow key={row.user.id} row={row} />
          ))}
        </div>
      </div>
    </div>
  );
}

function PhaseBanner({ state }) {
  const isP1 = state.phase === "phase1";
  const isP2 = state.phase === "phase2";
  const isFinished = state.phase === "finished";
  return (
    <div className={`rounded-2xl p-4 border ${isP1 ? "bg-[var(--lime-soft)] border-[#B4E04C]" : isP2 ? "bg-[#FEE2E2] border-[#FCA5A5]" : "bg-[var(--bg)] border-[var(--border-soft)]"}`} data-testid="phase-banner">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-[11px] uppercase tracking-wider font-mono text-[var(--muted-2)]">{state.phase_label}</div>
          <div className="text-[14px] font-semibold text-[var(--ink)] mt-0.5">
            {isP1 && "All traders fighting — eliminations start at half-time."}
            {isP2 && `${state.eliminations_remaining} eliminations remaining`}
            {isFinished && "Winner crowned"}
          </div>
        </div>
        {(state.next_elimination_in_seconds != null) && (
          <div className="text-right">
            <div className="text-[10.5px] uppercase tracking-wider font-mono text-[var(--muted-2)]">{isP1 ? "Phase 2 starts" : "Next eliminate"}</div>
            <div className="font-mono text-2xl font-semibold text-[var(--ink)]">{formatLeft(state.next_elimination_in_seconds)}</div>
          </div>
        )}
      </div>
    </div>
  );
}

function LeaderRow({ row }) {
  const elim = row.is_eliminated;
  return (
    <div className={`flex items-center gap-3 px-2 py-2 rounded-xl ${elim ? "opacity-50" : "hover:bg-[var(--surface)]"}`} data-testid={`leader-row-${row.rank}`}>
      <div className={`w-7 h-7 rounded-full grid place-items-center font-mono text-xs font-semibold ${
        elim ? "bg-[var(--tag)] text-[var(--muted-2)]" :
        row.rank === 1 ? "bg-[#B4E04C] text-[#0F0F12]" :
        row.rank <= 3 ? "bg-[var(--purple-soft)] text-[#7C3AED]" :
        "bg-[var(--tag)] text-[var(--muted)]"
      }`}>{row.rank}</div>
      <div className="flex-1 min-w-0 flex items-center gap-2">
        <span className={`text-[13px] font-medium text-[var(--ink)] truncate ${elim ? "line-through" : ""}`}>@{row.user.username}</span>
        {elim && <Skull className="w-3 h-3 text-[var(--muted-2)]" />}
        {row.rank === 1 && !elim && <Crown className="w-3 h-3 text-[#B4E04C]" />}
      </div>
      <div className={`font-mono text-[12.5px] font-semibold ${elim ? "text-[var(--muted-2)] line-through" : "text-[var(--ink)]"}`}>${row.equity.toLocaleString()}</div>
      <div className={`font-mono text-[11px] font-semibold w-16 text-right ${row.pnl >= 0 ? "text-[#10B981]" : "text-[#EF4444]"} ${elim ? "line-through opacity-70" : ""}`}>
        {row.pnl >= 0 ? "+" : "−"}${Math.abs(row.pnl).toFixed(0)}
      </div>
    </div>
  );
}

// ---- Tournament ----

function TournamentDetail({ data }) {
  const j = data.journey || {};
  return (
    <div className="space-y-4" data-testid="tournament-detail">
      <div className="grid sm:grid-cols-4 gap-2">
        <Stat label="Stage" value={j.tournament_stage} />
        <Stat label="Account" value={`$${(data.account_size / 1000).toFixed(0)}K`} />
        <Stat label="Prize pool" value={`$${j.tournament_prize_pool?.toLocaleString()}`} accent="green" />
        <Stat label="Your exit" value={j.exit_stage} />
      </div>

      <MT5Card mt5={data.me?.mt5} />
      <JourneyPath path={j.path} prizeWon={j.prize_won} isChampion={j.is_champion} totalPnl={j.total_pnl} />
    </div>
  );
}

function JourneyPath({ path, prizeWon, isChampion, totalPnl }) {
  if (!path?.length) {
    return (
      <div className="bg-[var(--bg)] border border-dashed border-[var(--border-soft)] rounded-2xl p-6 text-center text-[13px] text-[var(--muted)]">
        Journey will appear here once the group stage begins.
      </div>
    );
  }
  return (
    <div className="bg-[var(--bg)] border border-[var(--border-soft)] rounded-2xl p-4 space-y-3" data-testid="journey-path">
      <div className="flex items-center justify-between mb-1">
        <div className="text-[11px] uppercase tracking-wider font-mono text-[var(--muted-2)]">Your journey</div>
        <div className="text-[11px] font-mono text-[var(--ink)]">Total PnL <span className={`font-semibold ${totalPnl >= 0 ? "text-[#10B981]" : "text-[#EF4444]"}`}>{totalPnl >= 0 ? "+" : "−"}${Math.abs(totalPnl).toLocaleString()}</span></div>
      </div>
      <div className="space-y-2">
        {path.map((p, i) => (
          <div key={i} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border ${p.advanced ? "bg-[var(--lime-soft)]/40 border-[#B4E04C]/40" : "bg-[#FEE2E2] border-[#FCA5A5]"}`}>
            <div className={`w-7 h-7 rounded-full grid place-items-center text-[11px] font-bold ${p.advanced ? "bg-[#16A34A] text-white" : "bg-[#DC2626] text-white"}`}>
              {p.advanced ? "✓" : "✕"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold text-[var(--ink)]">{p.stage}</div>
              <div className="text-[11.5px] text-[var(--muted)] truncate">
                {p.opponent && <>vs {p.opponent}</>}
                {p.details && <> · {p.details}</>}
                {p.date_label && <> · {p.date_label}</>}
              </div>
            </div>
            <div className="text-right">
              <div className={`font-mono text-[13px] font-semibold ${p.pnl >= 0 ? "text-[#10B981]" : "text-[#EF4444]"}`}>
                {p.pnl >= 0 ? "+" : "−"}${Math.abs(p.pnl).toLocaleString()}
              </div>
              <div className="text-[10px] text-[var(--muted)] uppercase tracking-wider">{p.result}</div>
            </div>
          </div>
        ))}
      </div>
      {(prizeWon > 0 || isChampion) && (
        <div className={`rounded-xl p-3 flex items-center gap-3 ${isChampion ? "bg-[#FEF3C7] border border-[#FBBF24]" : "bg-[var(--surface)] border border-[var(--border-soft)]"}`}>
          {isChampion ? <Trophy className="w-5 h-5 text-[#B45309]" /> : <Sparkles className="w-5 h-5 text-[var(--ink)]" />}
          <div className="flex-1">
            <div className="text-[12.5px] font-semibold text-[var(--ink)]">{isChampion ? "Champion" : "Prize earned"}</div>
            <div className="text-[11.5px] text-[var(--muted)]">Final payout for your performance.</div>
          </div>
          <div className="font-mono text-lg font-bold text-[var(--ink)]">${prizeWon.toLocaleString()}</div>
        </div>
      )}
    </div>
  );
}

// ---- Shared ----

function MT5Card({ mt5 }) {
  if (!mt5) return null;
  const copy = (txt, label) => { navigator.clipboard?.writeText(txt); toast.success(`${label} copied`); };
  return (
    <div className="bg-[#0F0F12] text-white rounded-2xl p-4 relative overflow-hidden" data-testid="mt5-card">
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#B4E04C] rounded-full blur-[60px] opacity-20" />
      <div className="relative">
        <div className="flex items-center justify-between mb-2.5">
          <div className="text-[11px] uppercase tracking-wider font-mono text-white/60">MT5 Login</div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-[#B4E04C] text-[#0F0F12] px-2 py-0.5 rounded">Live</span>
        </div>
        <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5 text-[12.5px]">
          <CredRow label="Platform" value={mt5.platform} />
          <CredRow label="Server" value={mt5.server} onCopy={() => copy(mt5.server, "Server")} />
          <CredRow label="Login" value={mt5.login} mono onCopy={() => copy(mt5.login, "Login")} />
          <CredRow label="Password" value={mt5.password} mono onCopy={() => copy(mt5.password, "Password")} />
        </div>
      </div>
    </div>
  );
}

function CredRow({ label, value, mono, onCopy }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-[10.5px] uppercase tracking-wider font-mono text-white/55 shrink-0">{label}</span>
      <div className="flex items-center gap-1.5 min-w-0">
        <span className={`text-white ${mono ? "font-mono" : ""} truncate`}>{value}</span>
        {onCopy && (
          <button onClick={onCopy} className="text-white/55 hover:text-white shrink-0">
            <Copy className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, accent }) {
  const c = accent === "green" ? "text-[#10B981]" : "text-[var(--ink)]";
  return (
    <div className="bg-[var(--bg)] border border-[var(--border-soft)] rounded-xl px-3 py-2">
      <div className="text-[10px] uppercase tracking-wider font-mono text-[var(--muted-2)]">{label}</div>
      <div className={`text-[13.5px] font-mono font-semibold ${c} truncate`}>{value || "—"}</div>
    </div>
  );
}

function formatLeft(seconds) {
  if (seconds == null || seconds < 0) return "00:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds) % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function labelize(s) {
  if (!s) return "—";
  return s[0].toUpperCase() + s.slice(1);
}
