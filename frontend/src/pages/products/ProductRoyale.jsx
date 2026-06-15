import { Crown, Skull, Clock, Coins, Zap, Users, ShieldAlert, Hourglass } from "lucide-react";
import { motion } from "framer-motion";
import ProductNav from "@/components/products/ProductNav";
import Footer from "@/components/landing/Footer";
import { SectionHeader, NeonBeam, BentoRuleCard, StatStrip, BackToLanding, BottomCTA, TierLadder } from "@/components/products/ProductPrimitives";
import { EliminationTimeline } from "@/components/products/ProductInfographics";

const LOBBY_TIERS = [
  { size: "10p", label: "Quick", tagline: "Sharp, decisive matches", desc: "Built for fast tempo — high decision density.", pool: "$170" },
  { size: "20p", label: "Standard", tagline: "The middle weight", desc: "Most popular lobby — best risk-adjusted runs.", pool: "$340" },
  { size: "50p", label: "Royale", tagline: "Last 1 of 50 wins it all", desc: "Long format, deepest pool, biggest payout.", pool: "$850" },
];

export default function ProductRoyale() {
  return (
    <main className="min-h-screen bg-[#0F0F12] text-white" data-testid="product-page-royale">
      <ProductNav />

      {/* HERO */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 left-1/3 w-[700px] h-[700px] bg-[#EF4444] rounded-full blur-[160px] opacity-10" />
          <div className="absolute top-40 right-0 w-[500px] h-[500px] bg-[#A78BFA] rounded-full blur-[140px] opacity-15" />
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(to right, #FFFFFF 1px, transparent 1px), linear-gradient(to bottom, #FFFFFF 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-5 lg:px-8">
          <BackToLanding />
          <div className="mt-10 grid lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-7">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <div className="flex items-center gap-3 mb-7">
                  <div className="w-12 h-12 rounded-2xl bg-[#A78BFA] grid place-items-center">
                    <Crown className="w-5 h-5 text-white" strokeWidth={2.5} />
                  </div>
                  <div className="text-[11px] font-mono uppercase tracking-[0.28em] text-white/40">Product · 02</div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#EF4444]/20 border border-[#EF4444]/40 text-[#EF4444] px-2.5 py-1 rounded-full">Survival</span>
                </div>
                <h1 data-testid="hero-title" className="text-[clamp(48px,9vw,128px)] font-black tracking-[-0.04em] leading-[0.88] text-white">
                  SPAWN. <br />
                  TRADE. <br />
                  <span className="text-[#EF4444]">SURVIVE.</span>
                </h1>
                <p className="mt-7 text-lg md:text-xl text-white/70 max-w-xl leading-relaxed">
                  Multiple traders. Equal accounts. Once half the timer's gone, the lowest equity gets eliminated every interval — until one remains.
                </p>
                <div className="mt-9 flex flex-wrap gap-3">
                  <NeonBeam href="/app/royale" dataTestid="product-cta-primary" accent="purple">Join a royale</NeonBeam>
                  <a href="/app/royale" data-testid="product-cta-secondary" className="inline-flex items-center gap-2 bg-white/5 border border-white/15 text-white font-medium text-[14px] px-5 py-3.5 rounded-full hover:bg-white/10">
                    Browse lobbies
                  </a>
                </div>
              </motion.div>
            </div>
            <div className="lg:col-span-5">
              <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
                <StatStrip items={[
                  { label: "Lobbies", value: "10 / 20 / 50" },
                  { label: "Entry", value: "$20", sub: "Flat" },
                  { label: "Timelines", value: "5m – 72h" },
                  { label: "Winner share", value: "85%" },
                ]} />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* THE MODEL — Elimination Timeline */}
      <section className="relative py-24 lg:py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-5">
            <SectionHeader kicker="THE MODEL" title="Two phases. One survivor." sub="Phase 1 is a free-for-all — build the lead, take the risks. Phase 2 is execution — protect the rank or you're out." />
            <div className="mt-8 grid grid-cols-2 gap-3">
              {[
                { i: Zap, c: "bg-[#B4E04C]/15 border-[#B4E04C]/30 text-[#B4E04C]", t: "Phase 1", s: "First half · all fighting" },
                { i: Skull, c: "bg-[#EF4444]/15 border-[#EF4444]/30 text-[#EF4444]", t: "Phase 2", s: "Second half · eliminations" },
                { i: Hourglass, c: "bg-white/5 border-white/10 text-white/60", t: "Interval", s: "Half ÷ (n-1), rounded 30s" },
                { i: Crown, c: "bg-[#A78BFA]/15 border-[#A78BFA]/30 text-[#A78BFA]", t: "Winner", s: "Last balance standing" },
              ].map((f, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }} className={`rounded-xl border p-3.5 ${f.c}`}>
                  <f.i className="w-4 h-4 mb-2" />
                  <div className="font-bold text-[13px] text-white">{f.t}</div>
                  <div className="text-[11px] text-white/55 mt-0.5">{f.s}</div>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-7">
            <EliminationTimeline />
          </div>
        </div>
      </section>

      {/* RULES */}
      <section className="relative py-24 lg:py-32 border-t border-white/5 bg-[#0B0B0F]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <SectionHeader kicker="RULES OF ENGAGEMENT" title="No second chances. No rebuys." sub="Once you're eliminated, you stay eliminated. No revive, no rematch, no refund — that's why it pays so well." />
          <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4" data-testid="rules-grid">
            <BentoRuleCard icon={Users} title="Format" value="Free-for-all" sub="Simultaneous spawn" />
            <BentoRuleCard icon={Coins} title="Account" value="$50K" sub="Identical for all participants" />
            <BentoRuleCard icon={Coins} title="Entry" value="$20" sub="Flat across all lobby sizes" />
            <BentoRuleCard icon={Zap} title="Phase 1" value="50% timer" sub="No eliminations · build lead" />
            <BentoRuleCard icon={Skull} title="Phase 2" value="50% timer" sub="Lowest equity eliminated each tick" />
            <BentoRuleCard icon={Hourglass} title="Interval" value="≥ 30s" sub="Rounded to nearest 30 seconds" />
            <BentoRuleCard icon={ShieldAlert} title="Rake" value="15%" sub="Winner gets 85% of pool" />
            <BentoRuleCard icon={Clock} title="Timeline" value="5m – 72h" sub="Pick your stamina" />
          </div>
        </div>
      </section>

      {/* PRIZE / TIER LADDER */}
      <section className="relative py-24 lg:py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10 mb-12 items-end">
            <div className="lg:col-span-7">
              <SectionHeader kicker="PRIZE STRUCTURE" title="Winner takes 85%. Bigger lobby, bigger pool." />
            </div>
            <div className="lg:col-span-5">
              <p className="text-[14px] md:text-[15px] text-white/55 leading-relaxed">Three standardized lobby sizes. Simple math. The 50-player Royale is where most pros congregate — the deepest pool, the longest grind, the biggest brag.</p>
            </div>
          </div>
          <div data-testid="prize-structure">
            <TierLadder tiers={LOBBY_TIERS} />
          </div>
        </div>
      </section>

      <BottomCTA headline="Last one standing wins." sub="A $20 ticket. 49 opponents. Survive long enough and you're $850 richer." primaryLabel="Join a royale" primaryHref="/app/royale" accent="purple" />
      <Footer />
    </main>
  );
}
