import { Wallet, ShieldAlert, Sparkles, ArrowRight } from "lucide-react";

const cards = [
  {
    icon: Wallet,
    tag: "Option 01",
    title: "Trading your own capital",
    body: "Brokers profit when you lose. Your money is always at risk. The system isn't built for you.",
    tone: "loss",
  },
  {
    icon: ShieldAlert,
    tag: "Option 02",
    title: "Prop trading firms",
    body: "80%+ failure rates. Punishing rules. Payout disputes. Designed for re-attempt fees, not your success.",
    tone: "neutral",
  },
  {
    icon: Sparkles,
    tag: "Option 03",
    title: "No competitive path",
    body: "Until now, there was nowhere to compete trader vs trader — to prove skill and earn from it directly.",
    tone: "purple",
  },
];

export default function Problem() {
  return (
    <section
      data-testid="problem-section"
      className="relative py-24 lg:py-32 bg-[#F5F5F2] border-t border-[#ECECEA]"
    >
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="max-w-2xl mb-14">
          <div className="text-xs font-mono uppercase tracking-[0.18em] text-[#6B7280]">
            02 — The problem
          </div>
          <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-[#0F0F12] leading-[1.05]">
            Traders have always had <br />
            <span className="text-[#6B7280]">two bad options.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((c, i) => (
            <div
              key={c.title}
              data-testid={`problem-card-${i + 1}`}
              className="group bg-white rounded-3xl border border-[#ECECEA] p-7 hover:-translate-y-1 hover:shadow-[0_18px_36px_-12px_rgba(15,15,18,0.1)] transition-all"
            >
              <div
                className={`w-11 h-11 rounded-xl grid place-items-center mb-5 ${
                  c.tone === "loss"
                    ? "bg-[#FEE2E2] text-[#DC2626]"
                    : c.tone === "purple"
                    ? "bg-[#EDE7FE] text-[#7C3AED]"
                    : "bg-[#F3F4F6] text-[#1F2024]"
                }`}
              >
                <c.icon className="w-5 h-5" strokeWidth={2} />
              </div>
              <div className="text-xs font-mono uppercase tracking-[0.18em] text-[#6B7280]">
                {c.tag}
              </div>
              <h3 className="mt-2 text-xl font-semibold text-[#0F0F12]">{c.title}</h3>
              <p className="mt-3 text-[15px] text-[#4B5563] leading-relaxed">{c.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 flex items-center justify-center">
          <div className="inline-flex items-center gap-3 bg-[#0F0F12] text-white rounded-full pl-2 pr-5 py-2">
            <span className="inline-flex items-center gap-1.5 bg-[#B4E04C] text-[#0F0F12] rounded-full px-3 py-1 text-xs font-semibold">
              <ArrowRight className="w-3 h-3" strokeWidth={3} />
              Third path
            </span>
            <span className="text-sm font-medium">We built the one option that wasn't there.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
