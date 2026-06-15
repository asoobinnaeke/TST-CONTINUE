import { useMemo } from "react";
import { motion } from "framer-motion";
import { ResponsiveContainer, LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from "recharts";
import { Trophy, Crown, Sparkles, Skull, Users, ArrowRight } from "lucide-react";

/**
 * Page-specific infographics. Each is the centerpiece visual of its product page.
 */

// =====================================================================
// 1v1 DUEL — Equity Curve Clash
// =====================================================================
export function EquityCurveClash() {
  const data = useMemo(() => {
    // Deterministic dual-equity series — Player A wins after a crossover
    const pts = [];
    for (let i = 0; i < 60; i++) {
      const t = i / 59;
      // A: rises slowly then accelerates
      const a = 50000 + Math.sin(t * 2.6) * 1500 + t * 2600 + Math.sin(i * 0.45) * 350;
      // B: leads early then falters
      const b = 50000 + Math.sin(t * 1.8 + 1) * 1800 + (1 - t) * 2200 + Math.sin(i * 0.35) * 400 - t * 1200;
      pts.push({ t: i, a: Math.round(a), b: Math.round(b) });
    }
    return pts;
  }, []);
  const finalA = data[data.length - 1].a;
  const finalB = data[data.length - 1].b;

  return (
    <div className="relative bg-[#0F0F12] border border-white/10 rounded-3xl p-6 lg:p-8 overflow-hidden" data-testid="model-infographic">
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{ backgroundImage: "linear-gradient(to right, #FFFFFF 1px, transparent 1px), linear-gradient(to bottom, #FFFFFF 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      <div className="relative flex items-start justify-between mb-6">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-white/40">Match · live</div>
          <div className="text-[15px] font-bold text-white">$100K · 4h Duel</div>
        </div>
        <div className="font-mono text-[10px] text-[#B4E04C] inline-flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-[#B4E04C] rounded-full animate-pulse" /> 03:42:11 LEFT
        </div>
      </div>

      <div className="relative h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <ReferenceLine y={50000} stroke="#FFFFFF" strokeOpacity={0.1} strokeDasharray="2 2" />
            <Line type="monotone" dataKey="a" stroke="#B4E04C" strokeWidth={2.5} dot={false} isAnimationActive animationDuration={2000} />
            <Line type="monotone" dataKey="b" stroke="#A78BFA" strokeWidth={2.5} dot={false} isAnimationActive animationDuration={2000} />
            <Tooltip contentStyle={{ background: "#16161D", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 11, color: "#FFFFFF" }} />
          </LineChart>
        </ResponsiveContainer>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 1.8 }}
          className="absolute top-4 right-4 w-3 h-3 bg-[#B4E04C] rounded-full shadow-[0_0_28px_8px_rgba(180,224,76,0.55)]"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#B4E04C]" />
          <div>
            <div className="text-[12px] font-bold text-white">@TradeFury</div>
            <div className="font-mono text-2xl font-bold text-[#B4E04C]">+${(finalA - 50000).toLocaleString()}</div>
            <div className="text-[10px] uppercase tracking-wider font-mono text-[#B4E04C]/70">Winner — takes pool</div>
          </div>
        </div>
        <div className="flex items-center gap-3 opacity-60">
          <div className="w-2.5 h-2.5 rounded-full bg-[#A78BFA]" />
          <div>
            <div className="text-[12px] font-bold text-white">@GoldHands</div>
            <div className="font-mono text-2xl font-bold text-white/70">{finalB >= 50000 ? "+" : "−"}${Math.abs(finalB - 50000).toLocaleString()}</div>
            <div className="text-[10px] uppercase tracking-wider font-mono text-white/40">Opponent</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// =====================================================================
// TRADING ROYALE — Elimination Timeline
// =====================================================================
const ROYALE_PLAYERS = [
  "@TradeFury", "@FXSamurai", "@GoldHands", "@MoCapital", "@CryptoKing",
  "@StealthAlpha", "@RileyJess", "@PaperHands", "@TradeNova", "@MarketBeast",
];

export function EliminationTimeline() {
  // 10 traders, 30-min lobby, phase 1 = 15min, phase 2 eliminations every 1.5min
  // We render an abstract timeline visualization.
  const slots = 12; // visible columns
  const elimSchedule = [4, 5, 6, 7, 8, 9, 10, 11]; // column indices when eliminations occur
  const aliveByCol = (col) => {
    const elims = elimSchedule.filter((e) => e <= col).length;
    return Math.max(1, ROYALE_PLAYERS.length - elims);
  };

  return (
    <div className="relative bg-[#0F0F12] border border-white/10 rounded-3xl p-6 lg:p-8 overflow-hidden" data-testid="model-infographic">
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{ backgroundImage: "linear-gradient(to right, #FFFFFF 1px, transparent 1px), linear-gradient(to bottom, #FFFFFF 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      <div className="relative flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-white/40">Lobby · 10p · 30min</div>
          <div className="text-[15px] font-bold text-white">Survive the drop</div>
        </div>
        <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-wider">
          <span className="inline-flex items-center gap-1.5 text-[#B4E04C]"><span className="w-1.5 h-1.5 bg-[#B4E04C] rounded-full" />Active</span>
          <span className="inline-flex items-center gap-1.5 text-[#EF4444]"><span className="w-1.5 h-1.5 bg-[#EF4444] rounded-full" />Eliminated</span>
        </div>
      </div>

      {/* Phase bar */}
      <div className="relative">
        <div className="flex h-8 rounded-lg overflow-hidden border border-white/10">
          <div className="flex-1 bg-[#B4E04C]/15 border-r-2 border-dashed border-white/30 flex items-center justify-center text-[10px] font-mono uppercase tracking-wider text-[#B4E04C]">PHASE 1 — All fighting</div>
          <div className="flex-1 bg-[#EF4444]/15 flex items-center justify-center text-[10px] font-mono uppercase tracking-wider text-[#EF4444]">PHASE 2 — Eliminations</div>
        </div>
        {/* tick markers */}
        <div className="grid grid-cols-12 mt-1 text-[9px] font-mono text-white/30">
          {[...Array(slots)].map((_, i) => (
            <div key={i} className="text-center">{`${(i * 2.5).toFixed(1)}m`}</div>
          ))}
        </div>
      </div>

      {/* Traders dropping off */}
      <div className="mt-8 grid grid-cols-12 gap-2">
        {[...Array(slots)].map((_, col) => {
          const alive = aliveByCol(col);
          const wasJustElim = elimSchedule.includes(col);
          return (
            <motion.div
              key={col}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: col * 0.06 }}
              className="flex flex-col items-center gap-1.5"
            >
              {[...Array(ROYALE_PLAYERS.length)].map((_, idx) => {
                const eliminated = idx >= alive;
                return (
                  <motion.div
                    key={idx}
                    animate={eliminated && wasJustElim && idx === alive ? { scale: [1, 1.6, 0], rotate: [0, 0, 30], opacity: [1, 1, 0.3] } : {}}
                    transition={{ duration: 0.6 }}
                    className={`w-3 h-3 rounded-full ${eliminated ? "bg-[#EF4444]/30 border border-[#EF4444]/50" : "bg-[#B4E04C] shadow-[0_0_8px_rgba(180,224,76,0.6)]"}`}
                  />
                );
              })}
              <div className="font-mono text-[10px] mt-1 font-bold text-white/70">{alive}</div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-7 pt-6 border-t border-white/10 grid grid-cols-3 gap-4">
        <div>
          <div className="font-mono text-[10px] text-white/40 uppercase tracking-wider">Phase 1</div>
          <div className="text-[13px] font-bold text-white mt-1">All fighting</div>
          <div className="text-[11px] text-white/50">No eliminations · build the lead</div>
        </div>
        <div>
          <div className="font-mono text-[10px] text-white/40 uppercase tracking-wider">Phase 2</div>
          <div className="text-[13px] font-bold text-white mt-1">Lowest equity = OUT</div>
          <div className="text-[11px] text-white/50">Every interval, one dies</div>
        </div>
        <div>
          <div className="font-mono text-[10px] text-white/40 uppercase tracking-wider">Winner</div>
          <div className="text-[13px] font-bold text-[#B4E04C] mt-1">Last balance standing</div>
          <div className="text-[11px] text-white/50">Takes 85% of the pool</div>
        </div>
      </div>
    </div>
  );
}

// =====================================================================
// MULTI TRADER — Live Shifting Bar Chart (leaderboard race)
// =====================================================================
export function LeaderboardRace() {
  const players = [
    { name: "@TradeFury", equity: 11540, accent: "#B4E04C", you: true },
    { name: "@FXSamurai", equity: 9210, accent: "#A78BFA" },
    { name: "@MoCapital", equity: 7680, accent: "#A78BFA" },
    { name: "@StealthAlpha", equity: 6420, accent: "#A78BFA" },
    { name: "@RileyJess", equity: 4150, accent: "#A78BFA" },
    { name: "@GoldHands", equity: 2240, accent: "#A78BFA" },
    { name: "@MarketBeast", equity: -870, accent: "#A78BFA" },
    { name: "@CryptoKing", equity: -2030, accent: "#A78BFA" },
  ];
  const max = Math.max(...players.map((p) => Math.abs(p.equity)));
  return (
    <div className="relative bg-[#0F0F12] border border-white/10 rounded-3xl p-6 lg:p-8 overflow-hidden" data-testid="model-infographic">
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{ backgroundImage: "linear-gradient(to right, #FFFFFF 1px, transparent 1px), linear-gradient(to bottom, #FFFFFF 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      <div className="relative flex items-center justify-between mb-6">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-white/40">Tournament · live</div>
          <div className="text-[15px] font-bold text-white">Group A · Round of 16</div>
        </div>
        <Trophy className="w-5 h-5 text-[#B4E04C]" />
      </div>
      <div className="relative space-y-2.5">
        {players.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="flex items-center gap-3"
          >
            <div className={`w-6 text-center font-mono text-[11px] font-bold ${i === 0 ? "text-[#B4E04C]" : "text-white/40"}`}>{i + 1}</div>
            <div className="w-32 truncate text-[13px] font-medium text-white flex items-center gap-1.5">
              {p.name}
              {p.you && <span className="text-[8.5px] font-bold uppercase tracking-wider bg-[#B4E04C] text-[#0F0F12] px-1 py-0.5 rounded">You</span>}
            </div>
            <div className="flex-1 h-7 bg-white/5 rounded-md relative overflow-hidden">
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: Math.abs(p.equity) / max }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: i * 0.08, ease: [0.21, 0.6, 0.35, 1] }}
                style={{ originX: 0, background: p.equity >= 0 ? p.accent : "#EF4444" }}
                className="h-full rounded-md shadow-[0_0_18px_-4px_rgba(180,224,76,0.5)]"
              />
            </div>
            <div className={`font-mono text-[13px] font-bold w-20 text-right ${p.equity >= 0 ? "text-[#B4E04C]" : "text-[#EF4444]"}`}>
              {p.equity >= 0 ? "+" : "−"}${Math.abs(p.equity).toLocaleString()}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// =====================================================================
// TAG TEAM — Node Connection Diagram
// =====================================================================
export function TeamConnectionViz() {
  return (
    <div className="relative bg-[#0F0F12] border border-white/10 rounded-3xl p-8 lg:p-12 overflow-hidden" data-testid="model-infographic">
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{ backgroundImage: "linear-gradient(to right, #FFFFFF 1px, transparent 1px), linear-gradient(to bottom, #FFFFFF 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      <div className="relative flex items-center justify-between mb-8">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-white/40">3v3 Match</div>
          <div className="text-[15px] font-bold text-white">Team Alpha vs Team Capital</div>
        </div>
        <Users className="w-5 h-5 text-[#7C3AED]" />
      </div>

      <div className="grid grid-cols-7 items-center relative">
        {/* Team Alpha (left, lime) */}
        <div className="col-span-3 flex flex-col items-center gap-3">
          {[{ n: "Riley", pnl: 3140 }, { n: "Jess", pnl: 3200 }, { n: "Mo", pnl: 2080 }].map((m, i) => (
            <motion.div
              key={m.n}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="bg-[#16161D] border border-[#B4E04C]/40 rounded-2xl px-4 py-3 w-full flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#B4E04C] text-[#0F0F12] grid place-items-center font-bold text-xs">{m.n[0]}</div>
                <div className="text-[12.5px] font-semibold text-white">{m.n}</div>
              </div>
              <div className="font-mono text-[13px] font-bold text-[#B4E04C]">+${m.pnl.toLocaleString()}</div>
            </motion.div>
          ))}
        </div>

        {/* Center connector */}
        <div className="col-span-1 flex justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center"
          >
            <div className="font-black text-[40px] text-white">VS</div>
            <div className="text-[10px] font-mono text-white/40 uppercase tracking-wider mt-1">02:14:36</div>
          </motion.div>
        </div>

        {/* Team Capital (right, purple) */}
        <div className="col-span-3 flex flex-col items-center gap-3">
          {[{ n: "Carter", pnl: 2410 }, { n: "Ava", pnl: 2180 }, { n: "Sam", pnl: 1590 }].map((m, i) => (
            <motion.div
              key={m.n}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="bg-[#16161D] border border-[#A78BFA]/40 rounded-2xl px-4 py-3 w-full flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#A78BFA] text-white grid place-items-center font-bold text-xs">{m.n[0]}</div>
                <div className="text-[12.5px] font-semibold text-white">{m.n}</div>
              </div>
              <div className="font-mono text-[13px] font-bold text-[#A78BFA]">+${m.pnl.toLocaleString()}</div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 gap-4">
        <div className="bg-[#B4E04C]/10 border border-[#B4E04C]/30 rounded-xl p-4">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#B4E04C]">Team Alpha · combined</div>
          <div className="font-mono text-3xl font-black text-[#B4E04C] mt-2">+$8,420</div>
        </div>
        <div className="bg-[#A78BFA]/10 border border-[#A78BFA]/30 rounded-xl p-4">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#A78BFA]">Team Capital · combined</div>
          <div className="font-mono text-3xl font-black text-[#A78BFA] mt-2">+$6,180</div>
        </div>
      </div>
    </div>
  );
}

// =====================================================================
// COMMUNITY BATTLES — Tug-of-War Stacked Area
// =====================================================================
export function TugOfWar() {
  const data = useMemo(() => {
    const pts = [];
    for (let i = 0; i < 30; i++) {
      const t = i / 29;
      const factionA = Math.round(120000 + Math.sin(t * 3) * 18000 + t * 28000);
      const factionB = Math.round(120000 + Math.cos(t * 2.5) * 14000 + (1 - t) * 8000 + t * 18000);
      pts.push({ t: i, A: factionA, B: factionB });
    }
    return pts;
  }, []);

  return (
    <div className="relative bg-[#0F0F12] border border-white/10 rounded-3xl p-6 lg:p-8 overflow-hidden" data-testid="model-infographic">
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{ backgroundImage: "linear-gradient(to right, #FFFFFF 1px, transparent 1px), linear-gradient(to bottom, #FFFFFF 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      <div className="relative flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-white/40">Community season · 4w</div>
          <div className="text-[15px] font-bold text-white">Discord East vs Discord West</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-mono text-white/40 uppercase tracking-wider">Lead</div>
          <div className="font-mono text-lg font-bold text-[#B4E04C]">+$24,180</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="bg-[#16161D] border border-[#B4E04C]/30 rounded-xl p-4">
          <div className="text-[10px] uppercase font-mono tracking-wider text-[#B4E04C]">Discord East · 84 traders</div>
          <div className="font-mono text-2xl font-black text-[#B4E04C] mt-1">+$148,320</div>
        </div>
        <div className="bg-[#16161D] border border-[#A78BFA]/30 rounded-xl p-4">
          <div className="text-[10px] uppercase font-mono tracking-wider text-[#A78BFA]">Discord West · 78 traders</div>
          <div className="font-mono text-2xl font-black text-[#A78BFA] mt-1">+$124,140</div>
        </div>
      </div>

      <div className="relative h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="ga" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#B4E04C" stopOpacity={0.6} />
                <stop offset="100%" stopColor="#B4E04C" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="gb" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#A78BFA" stopOpacity={0.55} />
                <stop offset="100%" stopColor="#A78BFA" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeOpacity={0.05} />
            <YAxis hide domain={["dataMin - 20000", "dataMax + 10000"]} />
            <Area type="monotone" dataKey="A" stroke="#B4E04C" fill="url(#ga)" strokeWidth={2} isAnimationActive animationDuration={1500} />
            <Area type="monotone" dataKey="B" stroke="#A78BFA" fill="url(#gb)" strokeWidth={2} isAnimationActive animationDuration={1500} />
            <Tooltip contentStyle={{ background: "#16161D", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 11, color: "#FFFFFF" }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// =====================================================================
// AFFILIATE — Compounding Branching Tree
// =====================================================================
export function AffiliateTree() {
  // Each level grows the network by 3x
  const levels = [
    { n: 1, refs: 5, earnings: 250 },
    { n: 2, refs: 15, earnings: 750 },
    { n: 3, refs: 45, earnings: 2250 },
  ];
  return (
    <div className="relative bg-[#0F0F12] border border-white/10 rounded-3xl p-6 lg:p-8 overflow-hidden" data-testid="model-infographic">
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{ backgroundImage: "linear-gradient(to right, #FFFFFF 1px, transparent 1px), linear-gradient(to bottom, #FFFFFF 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      <div className="relative flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-white/40">Your network · projected</div>
          <div className="text-[15px] font-bold text-white">5 refs → $3,250 / mo</div>
        </div>
        <Sparkles className="w-5 h-5 text-[#B4E04C]" />
      </div>

      {/* You node */}
      <div className="relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto w-fit"
        >
          <div className="bg-[#B4E04C] text-[#0F0F12] rounded-full px-6 py-3 font-bold text-[13px] shadow-[0_0_30px_-6px_#B4E04C]">YOU</div>
        </motion.div>

        {/* Branches */}
        <div className="grid grid-cols-3 mt-12 gap-4 relative">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.12 }}
              className="relative"
            >
              {/* Connecting line */}
              <svg className="absolute -top-12 left-1/2 -translate-x-1/2 w-px h-12" viewBox="0 0 1 48">
                <line x1="0.5" y1="0" x2="0.5" y2="48" stroke="#B4E04C" strokeOpacity="0.3" strokeDasharray="3 3" />
              </svg>
              <div className="bg-[#16161D] border border-white/10 rounded-2xl p-4 text-center">
                <div className="text-[10px] uppercase tracking-wider font-mono text-white/40">Level {i + 1}</div>
                <div className="font-mono text-2xl font-black text-white mt-2">{levels[i].refs}</div>
                <div className="text-[10px] text-white/50 mt-1">refs</div>
                <div className="mt-3 pt-3 border-t border-white/10">
                  <div className="text-[10px] uppercase tracking-wider font-mono text-[#B4E04C]">Earnings / mo</div>
                  <div className="font-mono text-[15px] font-bold text-[#B4E04C] mt-1">${levels[i].earnings.toLocaleString()}</div>
                </div>
              </div>
              {/* Sub-branches */}
              <div className="mt-3 grid grid-cols-3 gap-1">
                {[0, 1, 2].map((j) => (
                  <motion.div
                    key={j}
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.6 + i * 0.12 + j * 0.05 }}
                    className="h-2 bg-[#B4E04C]/30 rounded-full"
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-wider font-mono text-white/40">Lifetime · paid forever</div>
          <div className="text-[13px] font-bold text-white">Every ref's trade fee = your earnings</div>
        </div>
        <ArrowRight className="w-5 h-5 text-[#B4E04C]" />
      </div>
    </div>
  );
}
