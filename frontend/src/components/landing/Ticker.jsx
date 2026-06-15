const items = [
  { type: "win", text: "@TradeFury +$1,247 · 1v1 Duel · $100K", tone: "green" },
  { type: "live", text: "Royale Final · 3 traders remaining · 50-Player", tone: "neutral" },
  { type: "open", text: "New duel · $100K Account · Open for pairing", tone: "purple" },
  { type: "win", text: "@StealthAlpha won $5,000 · 1v1 · $250K", tone: "green" },
  { type: "loss", text: "@CryptoKing −$2,840 · Royale R3 eliminated", tone: "red" },
  { type: "ev", text: "Multi Trader QF · 8 seats · Starts 14:00 UTC", tone: "neutral" },
  { type: "team", text: "Team Alpha vs Team Capital · 5v5 · $1M combined", tone: "purple" },
  { type: "win", text: "@PaperHandsNoMore +$11,400 · 24h Royale champion", tone: "green" },
];

const toneClass = {
  green: "text-[#10B981]",
  red: "text-[#EF4444]",
  purple: "text-[#7C3AED]",
  neutral: "text-white/85",
};

const tagLabel = {
  win: "Win",
  live: "Live",
  open: "Open",
  loss: "Loss",
  ev: "Event",
  team: "Team",
};

function Row() {
  return (
    <div className="flex shrink-0 items-center">
      {items.map((it, i) => (
        <div key={i} className="flex items-center px-8 gap-3 shrink-0">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45 bg-[#0B0B0F] border border-white/10 px-2 py-0.5 rounded-full">
            {tagLabel[it.type]}
          </span>
          <span className={`font-mono text-sm tracking-tight whitespace-nowrap ${toneClass[it.tone]}`}>
            {it.text}
          </span>
          <span className="text-[#D1D5DB]">•</span>
        </div>
      ))}
    </div>
  );
}

export default function Ticker() {
  return (
    <section
      id="ticker"
      data-testid="live-ticker-section"
      className="relative bg-[#16161D] border-y border-white/10 py-4 overflow-hidden"
    >
      <div className="absolute left-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none" />

      <div className="absolute left-5 lg:left-8 top-1/2 -translate-y-1/2 z-20 flex items-center gap-2 bg-[#0F0F12] text-white px-3 py-1.5 rounded-full">
        <span className="w-1.5 h-1.5 bg-[#B4E04C] rounded-full pulse-soft" />
        <span className="font-mono text-[10px] uppercase tracking-[0.18em]">Live feed</span>
      </div>

      <div className="flex animate-marquee whitespace-nowrap pl-40">
        <Row />
        <Row />
      </div>
    </section>
  );
}
