import { useState } from "react";
import { Swords, Crown, Trophy, Users, Globe, ArrowUpRight, Check } from "lucide-react";
import { toast } from "sonner";
import { communityNotify } from "@/lib/api";

const duelTiers = [
  { size: "$5,000", entry: "$60", prize: "$100" },
  { size: "$10,000", entry: "$125", prize: "$200" },
  { size: "$25,000", entry: "$280", prize: "$500" },
  { size: "$50,000", entry: "$550", prize: "$1,000" },
  { size: "$100,000", entry: "$1,100", prize: "$2,000" },
  { size: "$250,000", entry: "$2,800", prize: "$5,000" },
  { size: "$500,000", entry: "$5,500", prize: "$10,000" },
  { size: "$1,000,000", entry: "$11,000", prize: "$20,000" },
];

const multiPrize = [
  { stage: "Round of 16 qualifiers", share: "25%" },
  { stage: "Quarter-final qualifiers", share: "25%" },
  { stage: "Semi-finalists", share: "20%" },
  { stage: "Finalist (Runner-up)", share: "15%" },
  { stage: "Champion", share: "15%" },
];

function Section({ index, reverse, icon: Icon, name, tagline, description, bullets, children, side, testId, accent = "lime" }) {
  const tone = {
    lime: { bg: "bg-[#E6F4C2]", text: "text-[#0F0F12]", check: "text-[#0F0F12]" },
    purple: { bg: "bg-[#EDE7FE]", text: "text-[#7C3AED]", check: "text-[#7C3AED]" },
    neutral: { bg: "bg-[#F3F4F6]", text: "text-[#0F0F12]", check: "text-[#0F0F12]" },
  }[accent];

  return (
    <div
      data-testid={testId}
      className={`grid lg:grid-cols-12 gap-10 lg:gap-16 items-center ${reverse ? "lg:[direction:rtl]" : ""}`}
    >
      <div className={`lg:col-span-6 ${reverse ? "lg:[direction:ltr]" : ""}`}>
        <div className="flex items-center gap-4 mb-5">
          <div className={`w-12 h-12 rounded-2xl grid place-items-center ${tone.bg} ${tone.text}`}>
            <Icon className="w-5 h-5" strokeWidth={2} />
          </div>
          <div className="text-xs font-mono uppercase tracking-[0.18em] text-[#6B7280]">
            Product · 0{index}
          </div>
        </div>
        <h3 className="text-3xl md:text-5xl font-bold tracking-tight text-[#0F0F12] leading-[1.02]">
          {name}
        </h3>
        <p className="mt-3 text-lg text-[#1F2024] font-medium">{tagline}</p>
        <p className="mt-4 text-[15px] text-[#4B5563] leading-relaxed max-w-xl">{description}</p>
        <ul className="mt-7 space-y-3">
          {bullets.map((b, i) => (
            <li key={i} className="flex gap-3 text-[15px] text-[#1F2024]">
              <span className={`w-5 h-5 rounded-full grid place-items-center shrink-0 mt-0.5 ${tone.bg}`}>
                <Check className={`w-3 h-3 ${tone.check}`} strokeWidth={3} />
              </span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
        <div className="mt-8">{children}</div>
      </div>
      <div className={`lg:col-span-6 ${reverse ? "lg:[direction:ltr]" : ""}`}>{side}</div>
    </div>
  );
}

function PrimaryCta({ children }) {
  return (
    <button className="group inline-flex items-center gap-2 bg-[#0F0F12] text-white font-medium text-[14px] px-5 py-3 rounded-full hover:bg-[#1F2024] transition-all hover:-translate-y-0.5">
      {children}
      <span className="grid place-items-center w-5 h-5 bg-[#B4E04C] rounded-full text-[#0F0F12]">
        <ArrowUpRight className="w-3 h-3" strokeWidth={2.5} />
      </span>
    </button>
  );
}

function StatCard({ tone, label, value, sub }) {
  return (
    <div className={`rounded-2xl p-4 ${tone === "lime" ? "bg-[#E6F4C2]" : tone === "purple" ? "bg-[#EDE7FE]" : "bg-white border border-[#ECECEA]"}`}>
      <div className="text-xs font-mono text-[#1F2024]/70">{label}</div>
      <div className="mt-1 font-mono text-2xl font-semibold text-[#0F0F12] tracking-tight">{value}</div>
      {sub && <div className="mt-0.5 text-xs text-[#6B7280]">{sub}</div>}
    </div>
  );
}

export default function ProductDeepDive() {
  const [email, setEmail] = useState("");

  const submitEmail = async (e) => {
    e.preventDefault();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!ok) {
      toast.error("Please enter a valid email");
      return;
    }
    try {
      const res = await communityNotify(email, "landing");
      toast.success(res.already ? "You're already on the list" : "You're on the list. We'll notify you at launch.");
      setEmail("");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <section className="relative py-24 lg:py-32 border-t border-[#ECECEA] bg-[#FAFAF7]" data-testid="product-deepdive-section">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 space-y-32">

        {/* 1 — 1v1 DUEL */}
        <Section
          index={1}
          icon={Swords}
          name="1v1 Duel"
          tagline="You vs them. Equal accounts. Best trader wins."
          description="The purest test of trading skill. Two traders receive identical accounts — same balance, same market access, same clock. The trader with the highest equity when time expires wins the prize."
          bullets={[
            "Accounts from $5,000 to $1,000,000",
            "Standard Duels open to all traders",
            "Custom Duels — Pro members set their own rules",
            "Live opponent P&L visible during the duel",
            "Pro Duels styled differently in the broadcast centre",
          ]}
          testId="product-deepdive-duel"
          accent="lime"
          side={
            <div className="bg-white rounded-3xl border border-[#ECECEA] overflow-hidden" data-testid="duel-prize-table">
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#ECECEA]">
                <div>
                  <div className="text-xs font-mono uppercase tracking-[0.18em] text-[#6B7280]">Duel tiers</div>
                  <div className="text-sm font-semibold text-[#0F0F12]">Account → Prize</div>
                </div>
                <span className="text-xs font-mono text-[#10B981] inline-flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#10B981] rounded-full" />
                  All active
                </span>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[#6B7280]">
                    <th className="text-left font-medium py-3 px-6">Account</th>
                    <th className="text-left font-medium py-3 px-6">Entry</th>
                    <th className="text-right font-medium py-3 px-6">Winner prize</th>
                  </tr>
                </thead>
                <tbody className="font-mono">
                  {duelTiers.map((t) => (
                    <tr key={t.size} className="border-t border-[#F1F1EF]">
                      <td className="py-3.5 px-6 font-semibold text-[#0F0F12]">{t.size}</td>
                      <td className="py-3.5 px-6 text-[#1F2024]">{t.entry}</td>
                      <td className="py-3.5 px-6 text-right font-semibold text-[#10B981]">{t.prize}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          }
        >
          <div className="flex flex-wrap gap-3">
            <PrimaryCta>Join a duel</PrimaryCta>
            <button className="inline-flex items-center gap-2 bg-white border border-[#ECECEA] text-[#0F0F12] font-medium text-[14px] px-5 py-3 rounded-full hover:bg-[#F5F5F2]">
              View live duels
            </button>
          </div>
        </Section>

        {/* 2 — ROYALE */}
        <Section
          index={2}
          reverse
          icon={Crown}
          name="Trading Royale"
          tagline="Spawn. Trade. Survive. Last balance standing wins."
          description="Multiple traders spawn simultaneously with equal accounts and compete for the highest equity when the timer hits zero. Highest balance takes the entire prize pool."
          bullets={[
            "Lobby sizes: 10, 20, or 50 traders",
            "Standard entry: $20 per participant",
            "Winner takes all — platform rake 15%",
            "Timelines from 5 min to 72 hrs",
            "All markets: Forex, Crypto, Stocks, Commodities",
          ]}
          testId="product-deepdive-royale"
          accent="purple"
          side={
            <div className="bg-white rounded-3xl border border-[#ECECEA] p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <div className="text-xs font-mono uppercase tracking-[0.18em] text-[#6B7280]">Active lobby</div>
                  <div className="text-base font-semibold text-[#0F0F12]">50-Player · 24h</div>
                </div>
                <span className="text-xs font-medium bg-[#0F0F12] text-white px-2.5 py-1 rounded-full inline-flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#B4E04C] rounded-full pulse-soft" />
                  Live
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-5">
                <StatCard tone="lime" label="Traders joined" value="47 / 50" />
                <StatCard tone="purple" label="Prize pool" value="$850" sub="(50 × $20) × 0.85" />
              </div>

              <div className="rounded-2xl bg-[#FAFAF7] border border-[#F1F1EF] p-4">
                <div className="text-xs font-mono uppercase tracking-[0.18em] text-[#6B7280] mb-3">
                  Top movers
                </div>
                <div className="space-y-2.5">
                  {[
                    { name: "@StealthAlpha", pnl: "+$1,847", positive: true },
                    { name: "@TradeNova", pnl: "+$1,420", positive: true },
                    { name: "@FXSamurai", pnl: "+$1,113", positive: true },
                    { name: "@CryptoKing", pnl: "−$240", positive: false },
                  ].map((t, i) => (
                    <div key={t.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-xs text-[#6B7280] w-5">#{i + 1}</span>
                        <span className="text-sm font-medium text-[#0F0F12]">{t.name}</span>
                      </div>
                      <span className={`font-mono text-sm font-semibold ${t.positive ? "text-[#10B981]" : "text-[#EF4444]"}`}>
                        {t.pnl}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          }
        >
          <PrimaryCta>Join a royale</PrimaryCta>
        </Section>

        {/* 3 — MULTI TRADER */}
        <Section
          index={3}
          icon={Trophy}
          name="Multi Trader"
          tagline="Group stages, knockouts, one champion."
          description="32 traders. 8 groups of 4. Over multiple weeks, the best traders advance from group stage through Round of 16, Quarter-Finals, Semi-Finals, and the Final. Prize money is distributed at every qualifying round."
          bullets={[
            "32 traders divided into 8 groups of 4",
            "Top 2 per group advance after Week 1",
            "Weekly knockout rounds until the Final",
            "3rd place match included",
            "Transparent prize pool at every stage",
          ]}
          testId="product-deepdive-multi"
          accent="lime"
          side={
            <div className="bg-white rounded-3xl border border-[#ECECEA] overflow-hidden" data-testid="multi-prize-table">
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#ECECEA]">
                <div>
                  <div className="text-xs font-mono uppercase tracking-[0.18em] text-[#6B7280]">Prize distribution</div>
                  <div className="text-sm font-semibold text-[#0F0F12]">Pool share by stage</div>
                </div>
              </div>
              <ul>
                {multiPrize.map((p, i) => {
                  const champion = i === multiPrize.length - 1;
                  return (
                    <li
                      key={p.stage}
                      className={`flex items-center justify-between px-6 py-4 border-t border-[#F1F1EF] ${champion ? "bg-[#E6F4C2]/40" : ""}`}
                    >
                      <span className={`text-sm ${champion ? "font-semibold text-[#0F0F12]" : "text-[#1F2024]"}`}>
                        {p.stage}
                      </span>
                      <span className={`font-mono font-semibold ${champion ? "text-[#0F0F12] text-lg" : "text-[#10B981]"}`}>
                        {p.share}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          }
        >
          <PrimaryCta>Enter tournament</PrimaryCta>
        </Section>

        {/* 4 — TAG TEAM */}
        <Section
          index={4}
          reverse
          icon={Users}
          name="Tag Team Trading"
          tagline="Build your squad. Trade as one."
          description="Assemble a team of 3 or 5 traders. Each team receives a combined account allocation. How you distribute capital is your strategic decision. Highest combined equity wins."
          bullets={[
            "Formats: 3v3 or 5v5",
            "Team accounts from $5K to $1M combined",
            "Capital distribution is your team's choice",
            "Invite teammates by username — permanent",
            "Team leader creates the match (Pro required)",
          ]}
          testId="product-deepdive-tagteam"
          accent="purple"
          side={
            <div className="bg-white rounded-3xl border border-[#ECECEA] p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <div className="text-xs font-mono uppercase tracking-[0.18em] text-[#6B7280]">Team match</div>
                  <div className="text-base font-semibold text-[#0F0F12]">Alpha · 3v3 · $1M</div>
                </div>
                <div className="font-mono text-sm text-[#0F0F12]">02:14:36</div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-[#E6F4C2] rounded-2xl p-4">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#10B981] rounded-full" />
                    <span className="text-xs font-mono text-[#1F2024]/70">Team Alpha</span>
                  </div>
                  <div className="mt-1.5 font-mono text-2xl font-semibold text-[#0F0F12]">+$8,420</div>
                </div>
                <div className="bg-[#EDE7FE] rounded-2xl p-4">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#A78BFA] rounded-full" />
                    <span className="text-xs font-mono text-[#1F2024]/70">Team Capital</span>
                  </div>
                  <div className="mt-1.5 font-mono text-2xl font-semibold text-[#0F0F12]">+$6,180</div>
                </div>
              </div>

              <div className="rounded-2xl bg-[#FAFAF7] border border-[#F1F1EF] p-4">
                <div className="text-xs font-mono uppercase tracking-[0.18em] text-[#6B7280] mb-3">Team Alpha roster</div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  {[
                    { name: "Riley", pnl: "+$3,140" },
                    { name: "Jess", pnl: "+$3,200" },
                    { name: "Mo", pnl: "+$2,080" },
                  ].map((m, i) => (
                    <div key={m.name} className="bg-white rounded-xl border border-[#ECECEA] p-3">
                      <div className="w-8 h-8 rounded-full mx-auto grid place-items-center text-xs font-bold text-white" style={{ background: ["#A78BFA", "#0F0F12", "#1F2024"][i] }}>
                        {m.name[0]}
                      </div>
                      <div className="mt-1.5 text-xs text-[#1F2024]">{m.name}</div>
                      <div className="font-mono text-xs font-semibold text-[#10B981]">{m.pnl}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          }
        >
          <PrimaryCta>Create a team</PrimaryCta>
        </Section>

        {/* 5 — COMMUNITY BATTLES */}
        <div data-testid="product-deepdive-community" className="relative">
          <div className="bg-[#0F0F12] text-white rounded-[32px] overflow-hidden p-8 lg:p-14 grid lg:grid-cols-12 gap-10 items-center relative">
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-[#A78BFA] rounded-full blur-[100px] opacity-40 pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-[#B4E04C] rounded-full blur-[100px] opacity-25 pointer-events-none" />

            <div className="lg:col-span-7 relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#A78BFA] grid place-items-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/10 text-white border border-white/15">
                  Coming soon
                </span>
              </div>
              <h3 className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.05]">
                Community Battles.
              </h3>
              <p className="mt-4 text-lg text-white/70 max-w-lg">
                Entire trading communities go head-to-head — Discord groups, trading schools, regional clubs — in the ultimate test of collective skill.
              </p>
            </div>

            <div className="lg:col-span-5 relative">
              <form onSubmit={submitEmail} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-5" data-testid="community-notify-form">
                <label className="block text-xs font-mono uppercase tracking-[0.18em] text-white/60 mb-3">
                  Get notified at launch
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="trader@email.com"
                    data-testid="community-notify-email"
                    className="flex-1 bg-white/10 border border-white/15 rounded-full px-4 py-3 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-[#B4E04C]"
                  />
                  <button
                    type="submit"
                    data-testid="community-notify-submit"
                    className="bg-[#B4E04C] text-[#0F0F12] font-semibold text-sm px-5 rounded-full hover:bg-white transition-colors"
                  >
                    Notify me
                  </button>
                </div>
                <p className="mt-3 text-xs text-white/40">We'll only email you when Community Battles is live.</p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
