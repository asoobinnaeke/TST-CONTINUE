export default function Mission() {
  return (
    <section
      data-testid="mission-section"
      className="relative py-24 lg:py-32 border-t border-[#ECECEA]"
    >
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-4">
            <div className="text-xs font-mono uppercase tracking-[0.18em] text-[#6B7280]">
              01 — Manifesto
            </div>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight text-[#0F0F12] leading-tight">
              A stadium <br /> for skill.
            </h2>
          </div>

          <div className="lg:col-span-8 grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl border border-[#ECECEA] p-7">
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.18em] text-[#0F0F12] bg-[#E6F4C2] rounded-full px-3 py-1">
                Mission
              </div>
              <p className="mt-4 text-[15px] text-[#1F2024] leading-relaxed">
                To give every trader a fair, competitive arena to prove their skill — and earn from it. Trading skill deserves more than a brokerage account.{" "}
                <span className="font-semibold text-[#0F0F12]">It deserves a stadium.</span>
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-[#ECECEA] p-7">
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.18em] text-white bg-[#A78BFA] rounded-full px-3 py-1">
                Vision
              </div>
              <p className="mt-4 text-[15px] text-[#1F2024] leading-relaxed">
                To become the global standard for competitive trading — where the world's best traders are known by name, ranked by performance, and{" "}
                <span className="font-semibold text-[#0F0F12]">rewarded the way esport athletes are.</span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-20 max-w-4xl mx-auto text-center">
          <blockquote className="text-3xl md:text-5xl font-bold tracking-tight text-[#0F0F12] leading-[1.1]">
            What if the world's best traders didn't just beat the market —{" "}
            <span className="text-[#A78BFA]">they beat each other?</span>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
