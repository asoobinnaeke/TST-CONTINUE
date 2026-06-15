import { Link } from "react-router-dom";
import { HelpCircle, ArrowUpRight } from "lucide-react";

const HIGHLIGHTS = [
  { label: "Platform basics" },
  { label: "1v1 Duel" },
  { label: "Trading Royale" },
  { label: "Multi Trader" },
  { label: "Tag Team" },
  { label: "Affiliate" },
  { label: "MT5 & Trading" },
];

/**
 * Slim landing-page FAQ teaser. Full FAQ lives on /faq.
 */
export default function Faq() {
  return (
    <section id="faq" data-testid="faq-section" className="relative bg-[#0F0F12] py-20 lg:py-24 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="bg-[#16161D] border border-white/10 rounded-3xl p-7 lg:p-10 grid lg:grid-cols-12 gap-8 items-center" data-testid="faq-teaser">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 mb-4">
              <HelpCircle className="w-3.5 h-3.5 text-[#B4E04C]" />
              <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-white">FAQ · 65+ answers</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter text-white leading-[1.05]">
              Got questions? <br className="hidden sm:block" />
              <span className="text-[#B4E04C]">We've answered every one.</span>
            </h2>
            <p className="mt-4 text-[14.5px] text-white/55 max-w-xl leading-relaxed">
              Detailed walkthroughs for the platform, every product, the wallet, KYC, MT5 setup, the affiliate program, and more. Sorted by topic.
            </p>
            <div className="mt-6 flex flex-wrap gap-2" data-testid="faq-topics">
              {HIGHLIGHTS.map((h) => (
                <span key={h.label} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 bg-white/5 border border-white/10 text-[12px] font-medium text-white/75">
                  {h.label}
                </span>
              ))}
            </div>
          </div>
          <div className="lg:col-span-5 flex flex-col gap-3 lg:items-end">
            <Link to="/faq" data-testid="faq-cta-full"
              className="inline-flex items-center gap-2 bg-[#B4E04C] text-[#0F0F12] text-[14px] font-bold px-6 py-3.5 rounded-full hover:brightness-110 transition-all hover:-translate-y-0.5 w-fit">
              See full FAQ
              <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
            </Link>
            <a href="mailto:support@selecttraders.com" data-testid="faq-cta-support" className="text-[12.5px] text-white/45 hover:text-white underline-offset-2 hover:underline">Or contact support →</a>
          </div>
        </div>
      </div>
    </section>
  );
}
