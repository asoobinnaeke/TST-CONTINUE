import { Sparkles, Users, TrendingUp, Trophy, Crown, Link2, Coins, ShieldCheck, Calendar, Infinity as InfinityIcon } from "lucide-react";
import { motion } from "framer-motion";
import ProductNav from "@/components/products/ProductNav";
import Footer from "@/components/landing/Footer";
import { SectionHeader, NeonBeam, BentoRuleCard, StatStrip, BackToLanding, BottomCTA } from "@/components/products/ProductPrimitives";
import { AffiliateTree } from "@/components/products/ProductInfographics";

const TIERS = [
  { name: "Rookie", revShare: 10, bonus: 5, refs: 0, vol: "$0", featured: false, gradient: "from-white/5 to-white/0" },
  { name: "Pro", revShare: 15, bonus: 10, refs: 5, vol: "$5K", featured: false, gradient: "from-[#B4E04C]/20 to-transparent" },
  { name: "Elite", revShare: 20, bonus: 15, refs: 20, vol: "$25K", featured: false, gradient: "from-[#A78BFA]/25 to-transparent" },
  { name: "Legend", revShare: 25, bonus: 25, refs: 50, vol: "$100K", featured: true, gradient: "from-[#B4E04C]/40 to-transparent" },
];

export default function ProductAffiliate() {
  return (
    <main className="min-h-screen bg-[#0F0F12] text-white" data-testid="product-page-affiliate">
      <ProductNav />

      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#B4E04C] rounded-full blur-[160px] opacity-20" />
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(to right, #FFFFFF 1px, transparent 1px), linear-gradient(to bottom, #FFFFFF 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-5 lg:px-8">
          <BackToLanding />
          <div className="mt-10 grid lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-7">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <div className="flex items-center gap-3 mb-7">
                  <div className="w-12 h-12 rounded-2xl bg-[#B4E04C] grid place-items-center">
                    <Sparkles className="w-5 h-5 text-[#0F0F12]" strokeWidth={2.5} />
                  </div>
                  <div className="text-[11px] font-mono uppercase tracking-[0.28em] text-white/40">Program · Affiliate</div>
                </div>
                <h1 data-testid="hero-title" className="text-[clamp(48px,9vw,128px)] font-black tracking-[-0.04em] leading-[0.88] text-white">
                  YOUR NETWORK.<br />
                  <span className="text-[#B4E04C]">YOUR NET WORTH.</span>
                </h1>
                <p className="mt-7 text-lg md:text-xl text-white/70 max-w-xl leading-relaxed">
                  Bring traders. Earn 10–25% of their entry fees. Forever. Paid into your wallet on the 1st of every month.
                </p>
                <div className="mt-9 flex flex-wrap gap-3">
                  <NeonBeam href="/app/affiliate" dataTestid="product-cta-primary">Get your link</NeonBeam>
                  <a href="/app/affiliate" data-testid="product-cta-secondary" className="inline-flex items-center gap-2 bg-white/5 border border-white/15 text-white font-medium text-[14px] px-5 py-3.5 rounded-full hover:bg-white/10">View dashboard</a>
                </div>
              </motion.div>
            </div>
            <div className="lg:col-span-5">
              <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
                <StatStrip items={[
                  { label: "Max rev-share", value: "25%" },
                  { label: "Tiers", value: "4" },
                  { label: "Cycle", value: "Monthly" },
                  { label: "Cap", value: "None" },
                ]} />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* THE MODEL — Tree */}
      <section className="relative py-24 lg:py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-5">
            <SectionHeader kicker="THE FLYWHEEL" title="Compounding. Permanent. Paid forever." sub="Once your ref signs up, they're yours for life. Every match they ever enter generates a rev-share for you. No clawback, no reset, no broker-style hidden conditions." />
            <div className="mt-7 space-y-3">
              {[
                { i: InfinityIcon, t: "Lifetime attribution", d: "Refs are yours forever" },
                { i: Calendar, t: "Auto-payouts on the 1st", d: "Drops into your wallet — no claim flow" },
                { i: TrendingUp, t: "Tiers only go up", d: "Hit a tier once · keep that rate forever" },
                { i: ShieldCheck, t: "Full transparency", d: "Every ref's volume visible in your dashboard" },
              ].map((f, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#B4E04C]/15 border border-[#B4E04C]/30 grid place-items-center shrink-0">
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
            <AffiliateTree />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative py-24 lg:py-32 border-t border-white/5 bg-[#0B0B0F]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <SectionHeader kicker="HOW IT WORKS" title="Three steps. Forever after." />
          <div className="mt-12 grid md:grid-cols-3 gap-4">
            {[
              { k: "01", i: Link2, t: "Share your link", d: "Get a unique referral link from your dashboard. Drop it on Discord, X, your channel — anywhere your audience lives." },
              { k: "02", i: Users, t: "They trade", d: "When your refs sign up and enter their first match, they're permanently attributed to you." },
              { k: "03", i: Coins, t: "You earn", d: "10–25% of every entry fee, paid into your wallet on the 1st of each month — for life." },
            ].map((s, i) => (
              <motion.div key={s.k} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-[#16161D] border border-white/10 rounded-3xl p-7 relative overflow-hidden hover:border-[#B4E04C]/40 transition-colors">
                <div className="absolute -top-2 -right-2 font-mono text-[140px] font-black text-white/[0.04] leading-none">{s.k}</div>
                <s.i className="relative w-8 h-8 text-[#B4E04C] mb-5" strokeWidth={2} />
                <div className="relative text-[18px] font-bold text-white">{s.t}</div>
                <p className="relative mt-2 text-[13.5px] text-white/55 leading-relaxed">{s.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TIERS */}
      <section className="relative py-24 lg:py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10 mb-12 items-end">
            <div className="lg:col-span-7">
              <SectionHeader kicker="TIER LADDER" title="Four tiers. One direction: up." />
            </div>
            <div className="lg:col-span-5">
              <p className="text-[14px] md:text-[15px] text-white/55 leading-relaxed">Targets unlock automatically. Hit them once and you keep that rate forever, even if your ref activity dips later. Legend is reserved for the top 1% — top global revenue earners.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3" data-testid="prize-structure">
            {TIERS.map((t, i) => {
              const Icon = [Users, TrendingUp, Trophy, Crown][i];
              return (
                <motion.div
                  key={t.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.08 }}
                  className={`relative rounded-2xl p-6 border overflow-hidden ${t.featured ? "bg-[#B4E04C] border-[#B4E04C] text-[#0F0F12] shadow-[0_0_40px_-6px_#B4E04C]" : "bg-[#16161D] border-white/10 text-white hover:border-[#B4E04C]/40"} transition-colors`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-b ${t.gradient} pointer-events-none`} />
                  {t.featured && (
                    <div className="absolute -top-2.5 left-5 text-[10px] font-bold uppercase tracking-wider bg-[#0F0F12] text-[#B4E04C] px-2 py-1 rounded-full">Top tier</div>
                  )}
                  <div className="relative">
                    <div className={`w-10 h-10 rounded-xl grid place-items-center mb-4 ${t.featured ? "bg-[#0F0F12] text-[#B4E04C]" : "bg-white/5 border border-white/10 text-[#B4E04C]"}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className={`text-[10px] font-mono uppercase tracking-[0.22em] ${t.featured ? "text-[#0F0F12]/60" : "text-white/40"}`}>Tier {i + 1}</div>
                    <div className={`text-[24px] font-black tracking-tight mt-1 ${t.featured ? "text-[#0F0F12]" : "text-white"}`}>{t.name}</div>
                    <div className={`mt-5 font-mono text-5xl font-black ${t.featured ? "text-[#0F0F12]" : "text-[#B4E04C]"}`}>{t.revShare}%</div>
                    <div className={`text-[11px] mt-1 ${t.featured ? "text-[#0F0F12]/60" : "text-white/40"} uppercase tracking-wider font-mono`}>rev-share for life</div>
                    <div className={`mt-5 pt-5 border-t ${t.featured ? "border-[#0F0F12]/15" : "border-white/10"} space-y-1.5 text-[12.5px]`}>
                      <Mini k="Bonus" v={`$${t.bonus}`} featured={t.featured} />
                      <Mini k="Refs" v={`${t.refs}+`} featured={t.featured} />
                      <Mini k="Volume" v={t.vol} featured={t.featured} />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <BottomCTA headline="Your network compounds." sub="Three steps. 60 seconds. Lifetime earnings." primaryLabel="Get your affiliate link" primaryHref="/app/affiliate" accent="lime" />
      <Footer />
    </main>
  );
}

function Mini({ k, v, featured }) {
  return (
    <div className="flex items-center justify-between">
      <span className={`font-mono uppercase tracking-wider ${featured ? "text-[#0F0F12]/55" : "text-white/40"}`}>{k}</span>
      <span className={`font-mono font-bold ${featured ? "text-[#0F0F12]" : "text-white"}`}>{v}</span>
    </div>
  );
}
