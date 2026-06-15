import { Users, Coins, Network, Layers, Shield, Sparkles, Clock, UserPlus } from "lucide-react";
import { motion } from "framer-motion";
import ProductNav from "@/components/products/ProductNav";
import Footer from "@/components/landing/Footer";
import { SectionHeader, NeonBeam, BentoRuleCard, StatStrip, BackToLanding, BottomCTA } from "@/components/products/ProductPrimitives";
import { TeamConnectionViz } from "@/components/products/ProductInfographics";

const FORMATS = [
  { fmt: "3 v 3 · Standard", combined: "$3K combined", split: "$500 / member", featured: false },
  { fmt: "5 v 5 · Standard", combined: "$5K combined", split: "$500 / member", featured: false },
  { fmt: "3 v 3 · High-Stakes", combined: "$300K combined", split: "$10K / member", featured: true },
  { fmt: "5 v 5 · High-Stakes", combined: "$1M combined", split: "$20K / member", featured: true },
];

export default function ProductTagTeam() {
  return (
    <main className="min-h-screen bg-[#0F0F12] text-white" data-testid="product-page-tagteam">
      <ProductNav />

      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#B4E04C] rounded-full blur-[160px] opacity-15" />
          <div className="absolute top-40 right-0 w-[600px] h-[600px] bg-[#A78BFA] rounded-full blur-[160px] opacity-20" />
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(to right, #FFFFFF 1px, transparent 1px), linear-gradient(to bottom, #FFFFFF 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-5 lg:px-8">
          <BackToLanding />
          <div className="mt-10 grid lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-7">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <div className="flex items-center gap-3 mb-7">
                  <div className="w-12 h-12 rounded-2xl bg-[#A78BFA] grid place-items-center">
                    <Users className="w-5 h-5 text-white" strokeWidth={2.5} />
                  </div>
                  <div className="text-[11px] font-mono uppercase tracking-[0.28em] text-white/40">Product · 04</div>
                </div>
                <h1 data-testid="hero-title" className="text-[clamp(48px,9vw,128px)] font-black tracking-[-0.04em] leading-[0.88] text-white">
                  YOUR <span className="text-[#A78BFA]">SQUAD.</span> <br />
                  YOUR <span className="text-[#B4E04C]">EDGE.</span>
                </h1>
                <p className="mt-7 text-lg md:text-xl text-white/70 max-w-xl leading-relaxed">
                  3 or 5 traders. One combined account. How you split the capital is your first decision. Highest team equity wins it all.
                </p>
                <div className="mt-9 flex flex-wrap gap-3">
                  <NeonBeam href="/app/tagteam" dataTestid="product-cta-primary" accent="purple">Create a team</NeonBeam>
                  <a href="/app/tagteam" data-testid="product-cta-secondary" className="inline-flex items-center gap-2 bg-white/5 border border-white/15 text-white font-medium text-[14px] px-5 py-3.5 rounded-full hover:bg-white/10">Join an open team</a>
                </div>
              </motion.div>
            </div>
            <div className="lg:col-span-5">
              <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
                <StatStrip items={[
                  { label: "Formats", value: "3v3 · 5v5" },
                  { label: "Combined", value: "$5K – $1M" },
                  { label: "Capital split", value: "Your call" },
                  { label: "Edge", value: "1.8×" },
                ]} />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* THE MODEL */}
      <section className="relative py-24 lg:py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-5">
            <SectionHeader kicker="THE MODEL" title="Trading's first real team sport." sub="The captain receives one combined account. They split it across teammates however they like. Each teammate trades independently. Equities aggregate into one live feed. Highest combined balance at the buzzer wins the prize." />
            <div className="mt-7 space-y-3">
              {[
                { i: UserPlus, t: "Captain invites teammates by username" },
                { i: Network, t: "Captain allocates the combined capital" },
                { i: Users, t: "Each teammate gets their own MT5 login" },
                { i: Sparkles, t: "Aggregated team equity is the only score that matters" },
              ].map((f, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#A78BFA]/15 border border-[#A78BFA]/30 grid place-items-center shrink-0 mt-0.5">
                    <f.i className="w-3.5 h-3.5 text-[#A78BFA]" />
                  </div>
                  <span className="text-[14px] text-white/75">{f.t}</span>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-7">
            <TeamConnectionViz />
          </div>
        </div>
      </section>

      {/* RULES */}
      <section className="relative py-24 lg:py-32 border-t border-white/5 bg-[#0B0B0F]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <SectionHeader kicker="RULES OF ENGAGEMENT" title="Team rules. Individual responsibility." />
          <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4" data-testid="rules-grid">
            <BentoRuleCard icon={Users} title="Format" value="3 v 3 · 5 v 5" sub="No asymmetric squads" />
            <BentoRuleCard icon={Network} title="Captain" value="Pro required" sub="Captain creates + invites" />
            <BentoRuleCard icon={Coins} title="Combined" value="$5K – $1M" sub="Combined team account" />
            <BentoRuleCard icon={Layers} title="Split" value="Captain's call" sub="Equal or weighted — disclosed" />
            <BentoRuleCard icon={Clock} title="Match length" value="4h · 24h" sub="By account tier" />
            <BentoRuleCard icon={Shield} title="Mid-match exit" value="Forfeit" sub="That allocation lost" />
            <BentoRuleCard icon={Sparkles} title="Settlement" value="Combined buzzer" sub="Highest team equity wins" />
            <BentoRuleCard icon={UserPlus} title="Rosters" value="Permanent" sub="Switch teams between matches" />
          </div>
        </div>
      </section>

      {/* PRIZE */}
      <section className="relative py-24 lg:py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10 mb-12 items-end">
            <div className="lg:col-span-7">
              <SectionHeader kicker="PRIZE STRUCTURE" title="One pool. Split equally across the squad." />
            </div>
            <div className="lg:col-span-5">
              <p className="text-[14px] md:text-[15px] text-white/55 leading-relaxed">Winning team takes the full prize. By default it splits equally; the captain can pre-set a custom split disclosed to teammates before the match.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3" data-testid="prize-structure">
            {FORMATS.map((f, i) => (
              <motion.div
                key={f.fmt}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                className={`rounded-2xl p-6 border ${f.featured ? "bg-[#A78BFA] text-white border-[#A78BFA] shadow-[0_0_30px_-6px_#A78BFA]" : "bg-[#16161D] border-white/10 hover:border-[#A78BFA]/40"} transition-colors`}
              >
                <div className={`text-[10px] uppercase tracking-[0.22em] font-mono ${f.featured ? "text-white/65" : "text-white/40"}`}>Format</div>
                <div className={`text-[15px] font-bold mt-1 ${f.featured ? "text-white" : "text-white"}`}>{f.fmt}</div>
                <div className={`mt-5 pt-5 border-t ${f.featured ? "border-white/20" : "border-white/10"} space-y-2`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] font-mono uppercase tracking-wider ${f.featured ? "text-white/60" : "text-white/40"}`}>Combined</span>
                    <span className={`font-mono font-bold text-[14px] ${f.featured ? "text-white" : "text-white"}`}>{f.combined}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] font-mono uppercase tracking-wider ${f.featured ? "text-white/60" : "text-white/40"}`}>Per member</span>
                    <span className={`font-mono font-black text-[16px] ${f.featured ? "text-[#B4E04C]" : "text-[#B4E04C]"}`}>{f.split}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <BottomCTA headline="Build your squad. Win together." sub="Pro membership required to captain. Invite anyone by username. The rest is execution." primaryLabel="Create a team" primaryHref="/app/tagteam" accent="purple" />
      <Footer />
    </main>
  );
}
