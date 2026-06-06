import { Check, X, Sparkles, ArrowUpRight } from "lucide-react";

const freeFeatures = [
  { ok: true, label: "Watch all live and broadcasted duels" },
  { ok: true, label: "View leaderboards and rankings" },
  { ok: true, label: "Join standard 1v1 Duels (platform-created)" },
  { ok: true, label: "Join Trading Royale lobbies" },
  { ok: true, label: "See open spawn listings waiting for a pair" },
  { ok: true, label: "Buy a standard account & enter spawn centre" },
  { ok: true, label: "Basic profile and stats" },
  { ok: false, label: "Cannot create custom duels or events" },
  { ok: false, label: "Cannot join custom Pro duels" },
];

const proFeatures = [
  "Everything in Free",
  "Create fully customised 1v1 Duels",
  "Join custom Pro Duels",
  "Create Tag Team matches",
  "Set leverage (e.g. 1:100), drawdown (0–30%)",
  "Choose your entry fee, timeline & instruments",
  "Account size from $5K to $1M",
  "Swap / Swap-Free · Raw spread / commission",
  "Highlighted broadcast listing for your duels",
  "Priority in spawn matching queue",
  "Advanced analytics & trade replay",
];

export default function Pricing() {
  return (
    <section
      id="pricing"
      data-testid="pricing-section"
      className="relative py-24 lg:py-32 border-t border-[#ECECEA]"
    >
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs font-mono uppercase tracking-[0.18em] text-[#6B7280]">
            05 — Plans
          </div>
          <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-[#0F0F12] leading-[1.05]">
            Choose your plan.
          </h2>
          <p className="mt-5 text-[15px] text-[#4B5563]">
            Free to watch. Free to join. Pro to compete your way.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* FREE */}
          <div
            data-testid="pricing-free-card"
            className="relative bg-white rounded-3xl border border-[#ECECEA] p-8 lg:p-10"
          >
            <div className="text-sm font-medium text-[#6B7280]">Free</div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="font-bold text-5xl text-[#0F0F12] tracking-tight">$0</span>
              <span className="text-sm font-mono text-[#6B7280]">/ month</span>
            </div>
            <p className="mt-3 text-sm text-[#4B5563]">
              Watch, learn and compete in standard duels.
            </p>
            <button
              data-testid="pricing-free-cta"
              className="mt-7 w-full inline-flex items-center justify-center gap-2 bg-[#FAFAF7] border border-[#ECECEA] text-[#0F0F12] font-medium text-[14px] py-3.5 rounded-full hover:bg-[#F5F5F2] transition-all"
            >
              Start free <ArrowUpRight className="w-4 h-4" />
            </button>
            <div className="mt-8 border-t border-[#F1F1EF] pt-6">
              <div className="text-xs font-mono uppercase tracking-[0.18em] text-[#6B7280] mb-4">
                What's included
              </div>
              <ul className="space-y-3">
                {freeFeatures.map((f) => (
                  <li key={f.label} className="flex gap-3 text-[14px]">
                    {f.ok ? (
                      <span className="w-5 h-5 rounded-full bg-[#E6F4C2] grid place-items-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-[#0F0F12]" strokeWidth={3} />
                      </span>
                    ) : (
                      <span className="w-5 h-5 rounded-full bg-[#FEE2E2] grid place-items-center shrink-0 mt-0.5">
                        <X className="w-3 h-3 text-[#DC2626]" strokeWidth={3} />
                      </span>
                    )}
                    <span className={f.ok ? "text-[#1F2024]" : "text-[#9CA3AF] line-through"}>
                      {f.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* PRO */}
          <div
            data-testid="pricing-pro-card"
            className="relative bg-[#0F0F12] text-white rounded-3xl p-8 lg:p-10 overflow-hidden"
          >
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-[#A78BFA] rounded-full blur-[100px] opacity-40 pointer-events-none" />
            <div className="absolute -bottom-32 -left-20 w-72 h-72 bg-[#B4E04C] rounded-full blur-[100px] opacity-15 pointer-events-none" />

            <div className="relative">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-white/60">Pro</div>
                <span className="inline-flex items-center gap-1.5 bg-[#A78BFA] text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                  <Sparkles className="w-3 h-3" /> Most popular
                </span>
              </div>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="font-bold text-5xl tracking-tight">$49</span>
                <span className="text-sm font-mono text-white/60">/ month</span>
              </div>
              <p className="mt-3 text-sm text-white/70">
                Create your own arena. Your rules, your stakes.
              </p>
              <button
                data-testid="pricing-pro-cta"
                className="mt-7 w-full inline-flex items-center justify-center gap-2 bg-[#B4E04C] text-[#0F0F12] font-semibold text-[14px] py-3.5 rounded-full hover:bg-white transition-all hover:-translate-y-0.5"
              >
                Go Pro <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
              </button>
              <p className="mt-3 text-center text-xs font-mono text-white/50">
                14-day free trial · Cancel anytime
              </p>

              <div className="mt-8 border-t border-white/10 pt-6">
                <div className="text-xs font-mono uppercase tracking-[0.18em] text-white/50 mb-4">
                  What's included
                </div>
                <ul className="space-y-3">
                  {proFeatures.map((f, i) => (
                    <li key={i} className="flex gap-3 text-[14px]">
                      <span className="w-5 h-5 rounded-full bg-[#B4E04C] grid place-items-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-[#0F0F12]" strokeWidth={3} />
                      </span>
                      <span className={i === 0 ? "text-white font-semibold" : "text-white/85"}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
