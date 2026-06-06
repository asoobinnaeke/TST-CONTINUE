import { Twitter, Instagram, MessageCircle, Youtube, ArrowUpRight } from "lucide-react";

const LOGO_DARK = "https://customer-assets.emergentagent.com/job_trade-duel-arena/artifacts/aemoxt7k_Asset%2025%404x-8.png";

const cols = [
  {
    title: "Platform",
    links: ["Products", "Leaderboard", "Live Duels", "Pricing"],
  },
  {
    title: "Company",
    links: ["About", "Blog", "Careers", "Press"],
  },
  {
    title: "Legal",
    links: ["Terms & Conditions", "Privacy Policy", "Cookie Policy", "Responsible Trading"],
  },
  {
    title: "Support",
    links: ["FAQ", "Contact", "Discord Community"],
  },
];

export default function Footer() {
  return (
    <footer
      id="footer"
      data-testid="footer-section"
      className="relative bg-[#FAFAF7] border-t border-[#ECECEA] pt-20 pb-10"
    >
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        {/* Closing CTA */}
        <div className="relative bg-[#0F0F12] text-white rounded-[32px] overflow-hidden p-10 lg:p-16 mb-20">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#A78BFA] rounded-full blur-[120px] opacity-30 pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#B4E04C] rounded-full blur-[120px] opacity-20 pointer-events-none" />

          <div className="relative max-w-3xl">
            <div className="text-xs font-mono uppercase tracking-[0.18em] text-white/50">
              Ready
            </div>
            <h2 className="mt-3 text-4xl md:text-6xl font-bold tracking-tight leading-[1.02]">
              Stop trading against the broker. <br />
              <span className="text-[#B4E04C]">Start trading against people.</span>
            </h2>
            <div className="mt-10 flex flex-wrap gap-3">
              <button className="inline-flex items-center gap-2 bg-[#B4E04C] text-[#0F0F12] font-semibold text-[15px] px-6 py-3.5 rounded-full hover:bg-white transition-all hover:-translate-y-0.5">
                Create your account
                <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
              </button>
              <button className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/15 text-white font-medium text-[15px] px-6 py-3.5 rounded-full hover:bg-white/15 transition-colors">
                Talk to us
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-5">
            <img src={LOGO_DARK} alt="The Select Traders" className="h-12 w-auto -ml-1" />
            <p className="mt-5 text-[#4B5563] max-w-md leading-relaxed">
              The peer-to-peer arena for competitive traders. Trade smart. Compete harder.
            </p>
            <div className="mt-7 flex items-center gap-2">
              {[
                { Icon: Twitter, label: "twitter" },
                { Icon: Instagram, label: "instagram" },
                { Icon: MessageCircle, label: "discord" },
                { Icon: Youtube, label: "youtube" },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href={`#${label}`}
                  data-testid={`social-${label}`}
                  aria-label={label}
                  className="w-10 h-10 grid place-items-center bg-white border border-[#ECECEA] rounded-full text-[#1F2024] hover:bg-[#0F0F12] hover:text-white transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-4 gap-8">
            {cols.map((c) => (
              <div key={c.title}>
                <div className="text-xs font-mono uppercase tracking-[0.18em] text-[#6B7280] mb-4">
                  {c.title}
                </div>
                <ul className="space-y-3">
                  {c.links.map((l) => (
                    <li key={l}>
                      <a
                        href={`#${l.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                        className="text-[#1F2024] hover:text-[#0F0F12] text-[14px] transition-colors"
                      >
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-[#ECECEA] pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="text-xs font-mono text-[#6B7280]">
            © 2026 The Select Traders. All rights reserved.
          </div>
          <div className="text-xs text-[#6B7280]">
            Trade smart. Compete harder.
          </div>
        </div>
      </div>
    </footer>
  );
}
