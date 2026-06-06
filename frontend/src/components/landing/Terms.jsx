import { ShieldCheck, ArrowUpRight } from "lucide-react";

const points = [
  "Entry fees are non-refundable once a match has begun",
  "Username is permanent and cannot be transferred",
  "Winnings are subject to identity verification before first withdrawal",
  "Automated trading systems (EAs/bots) are prohibited",
  "Traders must be 18 years or older to participate",
  "Platform results are final and verified via trade logs",
  "The Select Traders is not a broker or financial institution",
  "Trading involves risk — past performance is not indicative of future results",
];

export default function Terms() {
  return (
    <section
      data-testid="terms-section"
      className="relative py-24 lg:py-32 border-t border-[#ECECEA] bg-[#F5F5F2]"
    >
      <div className="max-w-5xl mx-auto px-5 lg:px-8">
        <div className="bg-white rounded-3xl border border-[#ECECEA] p-8 lg:p-12">
          <div className="flex items-start justify-between gap-6 mb-8 flex-wrap">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#EDE7FE] grid place-items-center text-[#7C3AED]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-mono uppercase tracking-[0.18em] text-[#6B7280]">
                  07 — Legal
                </div>
                <h2 className="mt-1 text-2xl md:text-3xl font-bold tracking-tight text-[#0F0F12]">
                  Terms & Conditions — Summary
                </h2>
              </div>
            </div>
            <a
              href="/terms"
              data-testid="terms-fullpage-link"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#0F0F12] hover:gap-2 transition-all"
            >
              Read full T&Cs <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          <ul className="grid md:grid-cols-2 gap-x-10 gap-y-4">
            {points.map((p, i) => (
              <li key={i} className="flex gap-3 text-[14px] text-[#1F2024]">
                <span className="font-mono text-[#A78BFA] shrink-0 font-semibold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
