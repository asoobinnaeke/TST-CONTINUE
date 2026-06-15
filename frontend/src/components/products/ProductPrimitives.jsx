import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowLeft } from "lucide-react";

/* =========================================================
   SHARED DARK-THEME PRIMITIVES FOR PRODUCT PAGES
   - Bento rule card
   - Section header
   - Neon CTA
   - Kinetic marquee
   - Stat pyramid
   - Tier ladder
   - Elimination timeline
   - Bracket viz
   - Node connection viz
   - Tug-of-war bar
   - Compound bar chart
   ========================================================= */

// ---- Section header ----
export function SectionHeader({ kicker, title, sub, align = "left" }) {
  return (
    <div className={align === "left" ? "max-w-3xl" : "max-w-3xl mx-auto text-center"}>
      <div className="text-[11px] font-mono uppercase tracking-[0.28em] text-[#B4E04C]">{kicker}</div>
      <h2 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-white leading-[0.95]">{title}</h2>
      {sub && <p className="mt-5 text-[15px] md:text-[16px] text-white/60 leading-relaxed max-w-xl">{sub}</p>}
    </div>
  );
}

// ---- Neon CTA Button (dark variant) ----
export function NeonBeam({ children, href, onClick, dataTestid, accent = "lime" }) {
  const accentBg = accent === "purple" ? "bg-[#7C3AED]" : "bg-[#B4E04C]";
  const accentText = accent === "purple" ? "text-white" : "text-[#0F0F12]";
  const Comp = href ? "a" : "button";
  return (
    <Comp
      href={href}
      onClick={onClick}
      data-testid={dataTestid}
      className={`relative inline-flex items-center gap-2 ${accentBg} ${accentText} font-bold text-[14px] px-6 py-3.5 rounded-full hover:brightness-110 hover:-translate-y-0.5 transition-all overflow-hidden`}
    >
      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
        <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
      </span>
      <span className="absolute inset-0 rounded-full bg-white/0 hover:bg-white/10 transition-colors" />
    </Comp>
  );
}

// ---- Bento rule card with huge background icon ----
export function BentoRuleCard({ icon: Icon, title, value, sub, span = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: [0.21, 0.6, 0.35, 1] }}
      className={`relative bg-[#16161D] border border-white/10 rounded-2xl p-7 overflow-hidden group hover:border-[#B4E04C]/40 transition-colors ${span}`}
    >
      {Icon && (
        <Icon className="absolute -right-4 -bottom-4 w-32 h-32 text-white/[0.04] group-hover:text-[#B4E04C]/10 transition-colors" strokeWidth={1.2} />
      )}
      <div className="relative">
        <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-white/40">{title}</div>
        <div className="mt-4 font-mono text-2xl md:text-3xl font-bold text-white tracking-tight">{value}</div>
        {sub && <div className="mt-2 text-[12px] text-white/50 leading-snug max-w-[28ch]">{sub}</div>}
      </div>
    </motion.div>
  );
}

// ---- Stat strip for hero (terminal-style readout) ----
export function StatStrip({ items }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 rounded-2xl overflow-hidden border border-white/10" data-testid="hero-stats">
      {items.map((it, i) => (
        <div key={i} className="bg-[#16161D] p-4 md:p-5 min-w-0">
          <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-white/40 leading-tight">{it.label}</div>
          <div className="mt-2 font-mono text-xl md:text-[24px] font-bold text-white tracking-tight leading-tight">{it.value}</div>
          {it.sub && <div className="mt-1 text-[10.5px] text-white/45 font-mono">{it.sub}</div>}
        </div>
      ))}
    </div>
  );
}

// ---- Kinetic marquee (used behind bottom CTA strip) ----
export function KineticMarquee({ text, accent = "lime", reverse = false }) {
  const color = accent === "purple" ? "text-[#7C3AED]" : "text-[#B4E04C]";
  return (
    <div className="overflow-hidden whitespace-nowrap select-none pointer-events-none" aria-hidden>
      <motion.div
        className={`inline-block ${color} text-[clamp(60px,12vw,180px)] font-black tracking-tighter`}
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration: 24, ease: "linear", repeat: Infinity }}
      >
        <span style={{ WebkitTextStroke: "1.5px currentColor", color: "transparent" }}>
          {(text + " · ").repeat(12)}
        </span>
      </motion.div>
    </div>
  );
}

// ---- Bottom CTA strip (universal) ----
export function BottomCTA({ headline, sub, primaryLabel, primaryHref, accent = "lime" }) {
  return (
    <section className="relative py-24 lg:py-32 bg-[#0F0F12] overflow-hidden border-t border-white/5" data-testid="product-bottom-cta">
      <div className="absolute inset-x-0 top-0 -translate-y-1/2">
        <KineticMarquee text="TRADE NOW. NO BROKER TRICKS." accent={accent} />
      </div>
      <div className="absolute inset-x-0 bottom-0 translate-y-1/2">
        <KineticMarquee text="REAL TRADERS. REAL MONEY." accent={accent} reverse />
      </div>
      <div className="relative max-w-5xl mx-auto px-5 lg:px-8 text-center">
        <h3 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter text-white leading-[0.95]">{headline}</h3>
        {sub && <p className="mt-5 text-[15px] md:text-[16px] text-white/60 max-w-lg mx-auto">{sub}</p>}
        <div className="mt-10">
          <NeonBeam href={primaryHref} accent={accent} dataTestid="product-cta-primary-bottom">{primaryLabel}</NeonBeam>
        </div>
      </div>
    </section>
  );
}

// ---- Back link (for product pages) ----
export function BackToLanding() {
  return (
    <Link to="/" data-testid="back-to-landing" className="inline-flex items-center gap-1.5 text-[12px] font-mono uppercase tracking-[0.18em] text-white/40 hover:text-[#B4E04C] transition-colors">
      <ArrowLeft className="w-3.5 h-3.5" /> Back
    </Link>
  );
}

// ---- Stat Pyramid (Multi Trader prize) ----
export function StatPyramid({ tiers }) {
  // tiers: [{label, share, amount, featured}], top first
  return (
    <div className="flex flex-col gap-2 items-center" data-testid="stat-pyramid">
      {tiers.map((t, i) => {
        const width = `${100 - i * 14}%`;
        return (
          <motion.div
            key={t.label}
            initial={{ opacity: 0, scaleX: 0.7 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: [0.21, 0.6, 0.35, 1] }}
            style={{ width }}
            className={`rounded-xl px-5 py-4 flex items-center justify-between gap-4 ${t.featured ? "bg-[#B4E04C] text-[#0F0F12] shadow-[0_0_30px_-6px_#B4E04C]" : "bg-[#16161D] border border-white/10 text-white"}`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className={`font-mono text-[11px] uppercase tracking-wider ${t.featured ? "text-[#0F0F12]/70" : "text-white/40"}`}>{String(i + 1).padStart(2, "0")}</span>
              <span className="font-bold text-[14px] truncate">{t.label}</span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className={`text-[11px] font-mono ${t.featured ? "text-[#0F0F12]/60" : "text-white/50"}`}>{t.share}</span>
              <span className={`font-mono text-[15px] font-bold ${t.featured ? "text-[#0F0F12]" : "text-[#B4E04C]"}`}>{t.amount}</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ---- Tier Ladder (Royale) ----
export function TierLadder({ tiers }) {
  return (
    <div className="flex flex-col gap-3" data-testid="tier-ladder">
      {tiers.map((t, i) => (
        <motion.div
          key={t.label}
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          className="grid grid-cols-12 gap-4 items-center bg-[#16161D] border border-white/10 rounded-2xl p-5 hover:border-[#B4E04C]/40 transition-colors"
        >
          <div className="col-span-3 md:col-span-2">
            <div className="font-mono text-[44px] md:text-[64px] font-black text-[#B4E04C] leading-none">{t.size}</div>
          </div>
          <div className="col-span-9 md:col-span-7">
            <div className="text-[11px] font-mono uppercase tracking-[0.22em] text-white/40">{t.label}</div>
            <div className="text-[16px] font-bold text-white mt-1">{t.tagline}</div>
            <div className="text-[12.5px] text-white/50 mt-1">{t.desc}</div>
          </div>
          <div className="col-span-12 md:col-span-3 text-left md:text-right">
            <div className="text-[10px] font-mono uppercase tracking-wider text-white/40">Pool</div>
            <div className="font-mono text-2xl font-bold text-white">{t.pool}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
