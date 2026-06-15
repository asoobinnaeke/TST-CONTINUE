import { useState } from "react";
import { Globe, Users, Calendar, ShieldCheck, Coins, Trophy, Flag, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import ProductNav from "@/components/products/ProductNav";
import Footer from "@/components/landing/Footer";
import { SectionHeader, NeonBeam, BentoRuleCard, StatStrip, BackToLanding, BottomCTA } from "@/components/products/ProductPrimitives";
import { TugOfWar } from "@/components/products/ProductInfographics";
import { communityNotify } from "@/lib/api";

export default function ProductCommunity() {
  const [email, setEmail] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { toast.error("Please enter a valid email"); return; }
    try {
      const res = await communityNotify(email, "product-community");
      toast.success(res.already ? "You're already on the list" : "You're on the list. We'll notify you at launch.");
      setEmail("");
    } catch (err) { toast.error(err.message); }
  };

  return (
    <main className="min-h-screen bg-[#0F0F12] text-white" data-testid="product-page-community">
      <ProductNav />

      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#B4E04C] rounded-full blur-[160px] opacity-12" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#A78BFA] rounded-full blur-[160px] opacity-18" />
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(to right, #FFFFFF 1px, transparent 1px), linear-gradient(to bottom, #FFFFFF 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-5 lg:px-8">
          <BackToLanding />
          <div className="mt-10 grid lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-7">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <div className="flex items-center gap-3 mb-7 flex-wrap">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 grid place-items-center">
                    <Globe className="w-5 h-5 text-white" strokeWidth={2.5} />
                  </div>
                  <div className="text-[11px] font-mono uppercase tracking-[0.28em] text-white/40">Product · 05</div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#B4E04C] text-[#0F0F12] px-2.5 py-1 rounded-full">Coming Q3 '26</span>
                </div>
                <h1 data-testid="hero-title" className="text-[clamp(48px,9vw,128px)] font-black tracking-[-0.04em] leading-[0.88] text-white">
                  YOUR <span className="text-[#B4E04C]">DISCORD</span> <br />
                  vs <br />
                  THEIR <span className="text-[#A78BFA]">DISCORD.</span>
                </h1>
                <p className="mt-7 text-lg md:text-xl text-white/70 max-w-xl leading-relaxed">
                  Communities fielding traders, banners, and brag rights. A multi-week season where collective skill is the only metric that matters.
                </p>
                <div className="mt-9 flex flex-wrap gap-3">
                  <NeonBeam href="#notify" dataTestid="product-cta-primary">Get notified at launch</NeonBeam>
                </div>
              </motion.div>
            </div>
            <div className="lg:col-span-5">
              <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
                <StatStrip items={[
                  { label: "Season length", value: "4–12w" },
                  { label: "Roster", value: "10–100" },
                  { label: "Communities", value: "Open" },
                  { label: "Pool", value: "Aggregated" },
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
            <SectionHeader kicker="THE MODEL" title="Imagine your Discord on a leaderboard." sub="Each community fields a roster. Members play standard formats under their community banner. Wins, equity gains and tournament finishes contribute to the community's seasonal score. Push the bar higher than the rival faction." />
            <div className="mt-7 grid grid-cols-2 gap-3">
              {[
                { i: Flag, t: "Banners", d: "Pick your faction colors" },
                { i: Users, t: "Rosters", d: "10–100 verified traders" },
                { i: Trophy, t: "Scoring", d: "Aggregate · tier-weighted" },
                { i: Sparkles, t: "Payouts", d: "Community wallet at close" },
              ].map((f, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }} className="bg-[#16161D] border border-white/10 rounded-xl p-4">
                  <f.i className="w-4 h-4 text-[#B4E04C] mb-2" />
                  <div className="font-bold text-[13px] text-white">{f.t}</div>
                  <div className="text-[11px] text-white/55 mt-0.5">{f.d}</div>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-7">
            <TugOfWar />
          </div>
        </div>
      </section>

      {/* RULES */}
      <section className="relative py-24 lg:py-32 border-t border-white/5 bg-[#0B0B0F]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <SectionHeader kicker="RULES OF ENGAGEMENT" title="Two communities. One season. Sealed result." />
          <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4" data-testid="rules-grid">
            <BentoRuleCard icon={Globe} title="Status" value="Q3 2026" sub="Pre-launch · waitlist open" />
            <BentoRuleCard icon={Users} title="Min roster" value="10" sub="Verified traders" />
            <BentoRuleCard icon={Users} title="Max roster" value="100" />
            <BentoRuleCard icon={ShieldCheck} title="Verification" value="Community admin" sub="Admin verifies the roster" />
            <BentoRuleCard icon={Coins} title="Scoring" value="Aggregate" sub="Wins × tier multipliers" />
            <BentoRuleCard icon={Calendar} title="Season length" value="4–12w" />
            <BentoRuleCard icon={Flag} title="Inter-community" value="Bookable" sub="Direct head-to-head challenges" />
            <BentoRuleCard icon={Sparkles} title="Payout" value="Community wallet" sub="Distributed by admin" />
          </div>
        </div>
      </section>

      {/* NOTIFY FORM */}
      <section id="notify" className="relative py-24 lg:py-32 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-5 lg:px-8">
          <div className="bg-[#16161D] border border-white/10 rounded-3xl p-8 lg:p-12 grid lg:grid-cols-12 gap-8 items-center relative overflow-hidden" data-testid="prize-structure">
            <div className="absolute -top-32 -right-32 w-72 h-72 bg-[#B4E04C] rounded-full blur-[100px] opacity-25 pointer-events-none" />
            <div className="lg:col-span-7 relative">
              <div className="text-[10px] font-mono uppercase tracking-[0.28em] text-[#B4E04C]">Waitlist · Q3 2026</div>
              <h2 className="mt-3 text-3xl md:text-4xl font-black tracking-tighter text-white leading-[1.05]">Lock in your community's slot.</h2>
              <p className="mt-4 text-[15px] text-white/60 max-w-md leading-relaxed">Drop your email — we'll only message you when sign-ups for the first season open. No spam.</p>
            </div>
            <div className="lg:col-span-5 relative">
              <form onSubmit={submit} data-testid="community-notify-form-page" className="space-y-3">
                <label className="block text-[10px] font-mono uppercase tracking-[0.22em] text-white/40">Your email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="trader@email.com" data-testid="community-notify-email-page" className="w-full bg-[#0F0F12] border border-white/15 rounded-full px-5 py-3.5 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-[#B4E04C]" />
                <button type="submit" data-testid="community-notify-submit-page" className="w-full inline-flex items-center justify-center gap-2 bg-[#B4E04C] text-[#0F0F12] font-bold text-[14px] py-3.5 rounded-full hover:brightness-110 transition-all">Notify me at launch</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <BottomCTA headline="Take it to the streets." sub="Trading schools, prop firms, regional clubs — bring your community and represent." primaryLabel="Get notified at launch" primaryHref="#notify" accent="lime" />
      <Footer />
    </main>
  );
}
