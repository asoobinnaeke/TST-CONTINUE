import { UserPlus, Target, CreditCard, Zap } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Create your account",
    body: "Sign up in under 2 minutes. Choose your username carefully — it's permanent and it's your trading identity.",
  },
  {
    icon: Target,
    title: "Choose your arena",
    body: "Browse open duels, active Royale lobbies, upcoming tournaments, or team battles. Join or create based on your plan.",
  },
  {
    icon: CreditCard,
    title: "Buy your account & get paired",
    body: "Select your account size, pay your entry fee. The platform pairs you automatically. Once both traders confirm, your trading account is unlocked.",
  },
  {
    icon: Zap,
    title: "Trade & win",
    body: "Compete in real time. Watch your opponent's P&L. Best trader wins the prize. Results are final, verified, paid out instantly.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how"
      data-testid="how-it-works-section"
      className="relative py-24 lg:py-32 border-t border-white/10 bg-[#0B0B0F]"
    >
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="max-w-2xl mb-14">
          <div className="text-xs font-mono uppercase tracking-[0.18em] text-white/45">
            04 — The flow
          </div>
          <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.05]">
            How it works.
          </h2>
          <p className="mt-5 text-[15px] text-white/65 leading-relaxed">
            From sign-up to your first win in four steps.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((s, i) => (
            <div
              key={s.title}
              data-testid={`step-${i + 1}`}
              className="relative bg-[#16161D] rounded-3xl border border-white/10 p-7 hover:-translate-y-1 hover:shadow-[0_18px_36px_-12px_rgba(0,0,0,0.5)] transition-all"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#0F0F12] text-white grid place-items-center">
                  <s.icon className="w-5 h-5" strokeWidth={2} />
                </div>
                <span className="font-mono text-sm font-medium text-white/45">
                  0{i + 1}
                </span>
              </div>
              <h3 className="text-lg font-semibold tracking-tight text-white">
                {s.title}
              </h3>
              <p className="mt-2 text-[14px] text-white/65 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
