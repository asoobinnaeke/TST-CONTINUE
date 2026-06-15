import { Swords, Clock, Coins, Trophy, Target, Zap, ShieldCheck, Cpu, ArrowDown } from "lucide-react";
import { motion } from "framer-motion";
import ProductNav from "@/components/products/ProductNav";
import Footer from "@/components/landing/Footer";
import { SectionHeader, NeonBeam, BentoRuleCard, StatStrip, BackToLanding, BottomCTA } from "@/components/products/ProductPrimitives";
import { EquityCurveClash } from "@/components/products/ProductInfographics";

const tiers = [
  { size: "$5K", entry: "$60", prize: "$100" },
  { size: "$10K", entry: "$125", prize: "$200" },
  { size: "$25K", entry: "$280", prize: "$500" },
  { size: "$50K", entry: "$550", prize: "$1,000", featured: true },
  { size: "$100K", entry: "$1,100", prize: "$2,000" },
  { size: "$250K", entry: "$2,800", prize: "$5,000" },
  { size: "$500K", entry: "$5,500", prize: "$10,000" },
  { size: "$1M", entry: "$11,000", prize: "$20,000", featured: true },
];

export default function ProductDuel() {
  return (
    <main className="min-h-screen bg-[#0F0F12] text-white" data-testid="product-page-duel">
      <ProductNav />

      {/* HERO — Split arena */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        {/* Spotlight gradients */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-[#B4E04C] rounded-full blur-[140px] opacity-20" />
          <div className="absolute top-20 right-1/4 w-[600px] h-[600px] bg-[#A78BFA] rounded-full blur-[140px] opacity-15" />
          {/* Grid */}
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(to right, #FFFFFF 1px, transparent 1px), linear-gradient(to bottom, #FFFFFF 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-5 lg:px-8">
          <BackToLanding />

          <div className="mt-10 grid lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-7">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <div className="flex items-center gap-3 mb-7">
                  <div className="w-12 h-12 rounded-2xl bg-[#B4E04C] grid place-items-center">
                    <Swords className="w-5 h-5 text-[#0F0F12]" strokeWidth={2.5} />
                  </div>
                  <div className="text-[11px] font-mono uppercase tracking-[0.28em] text-white/40">Product · 01</div>
                </div>
                <h1 data-testid="hero-title" className="text-[clamp(48px,9vw,128px)] font-black tracking-[-0.04em] leading-[0.88] text-white">
                  YOU. <br />
                  <span className="text-[#B4E04C]">THEM.</span> <br />
                  ONE WIN.
                </h1>
                <p className="mt-7 text-lg md:text-xl text-white/70 max-w-xl leading-relaxed">
                  Equal accounts. Same clock. No prop-firm tricks. The trader with the highest equity at the buzzer takes the prize. That's it.
                </p>
                <div className="mt-9 flex flex-wrap gap-3">
                  <NeonBeam href="/app/duel" dataTestid="product-cta-primary">Enter a duel</NeonBeam>
                  <a href="/app/duel" data-testid="product-cta-secondary" className="inline-flex items-center gap-2 bg-white/5 border border-white/15 text-white font-medium text-[14px] px-5 py-3.5 rounded-full hover:bg-white/10">
                    Watch live duels
                  </a>
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-5">
              <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
                <StatStrip items={[
                  { label: "Accounts", value: "$5K–$1M" },
                  { label: "Edge", value: "1.8×", sub: "Entry → prize" },
                  { label: "Clock", value: "4h / 24h" },
                  { label: "Rake", value: "10%" },
                ]} />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* THE MODEL — Equity curve clash */}
      <section className="relative py-24 lg:py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-5">
            <SectionHeader
              kicker="THE MODEL"
              title="Two equity curves. One winner."
              sub="The chart is the truth. Both traders start at the same balance. The one with more equity when time hits zero gets paid. Loser's entry becomes the prize."
            />
            <div className="mt-8 space-y-3">
              {[
                { i: Target, t: "Identical spawn", d: "Same starting capital, same instruments, same leverage" },
                { i: Clock, t: "Hard clock", d: "Server timer — no pause, no extension, no excuses" },
                { i: ShieldCheck, t: "Sealed result", d: "Match equity snapshotted on settlement · audit-hashed" },
              ].map((f, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#B4E04C]/15 border border-[#B4E04C]/30 grid place-items-center shrink-0 mt-0.5">
                    <f.i className="w-4 h-4 text-[#B4E04C]" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-[14px]">{f.t}</div>
                    <div className="text-[13px] text-white/55">{f.d}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-7">
            <EquityCurveClash />
          </div>
        </div>
      </section>

      {/* RULES OF ENGAGEMENT — Bento grid */}
      <section className="relative py-24 lg:py-32 border-t border-white/5 bg-[#0B0B0F]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <SectionHeader kicker="RULES OF ENGAGEMENT" title="Same rules. Both sides. Every time." sub="No hidden filters. No broker-side games. Read it once, then trade." />
          <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4" data-testid="rules-grid">
            <BentoRuleCard icon={Swords} title="Format" value="1 v 1" sub="Simultaneous, head-to-head" span="lg:col-span-2 lg:row-span-1" />
            <BentoRuleCard icon={Coins} title="Account" value="$5K – $1M" sub="Identical on both sides" />
            <BentoRuleCard icon={Zap} title="Leverage" value="1 : 50" sub="Custom on Pro tier" />
            <BentoRuleCard icon={ArrowDown} title="Daily DD" value="15%" sub="Custom on Pro tier" />
            <BentoRuleCard icon={Cpu} title="Instruments" value="FX · Crypto · Indices · Commodities" />
            <BentoRuleCard icon={Clock} title="Timeline" value="4h · 24h" sub="By account tier" />
            <BentoRuleCard icon={ShieldCheck} title="Settlement" value="Auto on buzzer" sub="Winner takes prize" />
            <BentoRuleCard icon={Trophy} title="Tie" value="Refund both" sub="Minus 5% network fee" />
          </div>
        </div>
      </section>

      {/* PRIZE STRUCTURE — Tier ladder */}
      <section className="relative py-24 lg:py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10 mb-12 items-end">
            <div className="lg:col-span-7">
              <SectionHeader kicker="PRIZE STRUCTURE" title="Eight tiers. One winner per match. 100% payout." />
            </div>
            <div className="lg:col-span-5">
              <p className="text-[14px] md:text-[15px] text-white/55 leading-relaxed">Entries are pooled, the platform takes a 10% rake, the rest goes to the winner. Higher tiers carry the same edge mechanics — just bigger numbers.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3" data-testid="prize-structure">
            {tiers.map((t, i) => (
              <motion.div
                key={t.size}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.45, delay: i * 0.05 }}
                className={`group relative rounded-2xl p-6 border overflow-hidden ${t.featured ? "bg-[#B4E04C] border-[#B4E04C] text-[#0F0F12]" : "bg-[#16161D] border-white/10 text-white hover:border-[#B4E04C]/40"} transition-colors`}
              >
                <div className={`text-[10px] font-mono uppercase tracking-[0.22em] ${t.featured ? "text-[#0F0F12]/60" : "text-white/40"}`}>Account</div>
                <div className={`font-black text-3xl md:text-4xl mt-1 tracking-tighter ${t.featured ? "text-[#0F0F12]" : "text-white"}`}>{t.size}</div>
                <div className={`mt-5 pt-5 border-t ${t.featured ? "border-[#0F0F12]/15" : "border-white/10"} space-y-2`}>
                  <Row k="Entry" v={t.entry} featured={t.featured} />
                  <Row k="Prize" v={t.prize} featured={t.featured} accent />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <BottomCTA headline="Ready for the duel?" sub="Pick a tier. Pay the entry. Beat your opponent. Take the prize." primaryLabel="Enter a duel" primaryHref="/app/duel" accent="lime" />
      <Footer />
    </main>
  );
}

function Row({ k, v, featured, accent }) {
  return (
    <div className="flex items-center justify-between">
      <span className={`text-[11.5px] font-mono uppercase tracking-wider ${featured ? "text-[#0F0F12]/60" : "text-white/40"}`}>{k}</span>
      <span className={`font-mono font-bold text-[14px] ${accent ? (featured ? "text-[#0F0F12]" : "text-[#B4E04C]") : (featured ? "text-[#0F0F12]" : "text-white")}`}>{v}</span>
    </div>
  );
}
