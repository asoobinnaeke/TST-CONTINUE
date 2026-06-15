import { useState } from "react";
import { toast } from "sonner";
import { Plus, ChevronRight, Trash2, Clock, Trophy } from "lucide-react";
import { useFetch } from "@/lib/useFetch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { adminListTournaments, adminCreateTournament, adminAdvanceTournament, adminSetStageLength, adminVoidTournament } from "@/lib/adminApi";

/**
 * Admin Multi Trader management.
 * - Lists every tournament with stage, stage_length, prize pool, capacity
 * - Create a new tournament (stage_length: 1d or 5d)
 * - Advance stage (Group → R16 → QF → SF → Final → Completed)
 * - Toggle stage_length while in Registration
 * - Void with refunds
 */
export default function AdminTournaments() {
  const { data: list, refetch } = useFetch(() => adminListTournaments("all"), { pollMs: 8000 });
  const [creating, setCreating] = useState(false);
  const tournaments = list || [];

  const advance = async (id) => {
    if (!window.confirm("Advance this tournament to the next stage?")) return;
    try { const res = await adminAdvanceTournament(id); toast.success(`Advanced → ${res.stage}`); refetch(); }
    catch (e) { toast.error(e.message); }
  };
  const toggleLength = async (id, current) => {
    const next = current === "5d" ? "1d" : "5d";
    try { await adminSetStageLength(id, next); toast.success(`Stage length → ${next}`); refetch(); }
    catch (e) { toast.error(e.message); }
  };
  const voidT = async (id) => {
    const reason = window.prompt("Reason for voiding this tournament? (refunds all registered)");
    if (!reason) return;
    try { const res = await adminVoidTournament(id, reason); toast.success(`Voided · refunded ${res.refunded}`); refetch(); }
    catch (e) { toast.error(e.message); }
  };

  return (
    <div className="space-y-4" data-testid="admin-tournaments">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--muted-2)]">Multi Trader</div>
          <div className="text-[15px] font-semibold text-[var(--ink)]">{tournaments.length} tournaments</div>
        </div>
        <button data-testid="admin-tournament-create" onClick={() => setCreating(true)} className="inline-flex items-center gap-2 bg-[var(--inverse)] text-[var(--inverse-fg)] text-[13px] font-semibold px-4 py-2.5 rounded-full hover:bg-[var(--ink-soft)]">
          <Plus className="w-3.5 h-3.5" /> New tournament
        </button>
      </div>

      {tournaments.length === 0 ? (
        <div className="bg-[var(--surface)] border border-dashed border-[var(--border)] rounded-2xl p-12 text-center">
          <Trophy className="w-6 h-6 text-[var(--muted-2)] mx-auto mb-2" />
          <div className="text-[13px] text-[var(--muted)]">No tournaments yet. Click "New tournament" to create the first one.</div>
        </div>
      ) : (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-x-auto" data-testid="admin-tournaments-table">
          <table className="w-full text-[13px] min-w-[1000px]">
            <thead className="text-[var(--muted-2)] text-[11px] border-b border-[var(--border)]">
              <tr>
                <th className="text-left font-medium py-3 px-5">Tournament</th>
                <th className="text-left font-medium py-3 px-3">Stage</th>
                <th className="text-left font-medium py-3 px-3">Stage length</th>
                <th className="text-right font-medium py-3 px-3">Account</th>
                <th className="text-right font-medium py-3 px-3">Prize pool</th>
                <th className="text-right font-medium py-3 px-3">Registered</th>
                <th className="text-right font-medium py-3 px-5">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tournaments.map((t) => {
                const inProgress = t.stage !== "Registration" && t.stage !== "Completed";
                return (
                  <tr key={t.id} className="border-b border-[var(--border-soft)] last:border-0 hover:bg-[var(--bg)]" data-testid={`tournament-row-${t.id}`}>
                    <td className="py-3 px-5">
                      <div className="font-semibold text-[var(--ink)]">{t.name}</div>
                      <div className="font-mono text-[11px] text-[var(--muted-2)]">{t.id} · {t.start_date}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`text-[11px] font-medium px-2 py-1 rounded-full ${t.stage === "Completed" ? "bg-[#10B981]/10 text-[#10B981]" : t.stage === "Registration" ? "bg-[var(--tag)] text-[var(--muted)]" : "bg-[#7C3AED]/10 text-[#7C3AED]"}`}>{t.stage}</span>
                    </td>
                    <td className="py-3 px-3">
                      <button
                        data-testid={`stage-length-${t.id}`}
                        disabled={t.stage !== "Registration"}
                        onClick={() => toggleLength(t.id, t.stage_length)}
                        className="inline-flex items-center gap-1.5 font-mono text-[12px] px-2.5 py-1 rounded-full bg-[var(--bg)] border border-[var(--border)] hover:bg-[var(--lime-soft)] disabled:opacity-50 disabled:hover:bg-[var(--bg)]"
                        title={t.stage === "Registration" ? "Click to toggle between 1 day and 5 days" : "Locked once the tournament starts"}
                      >
                        <Clock className="w-3 h-3" />
                        {t.stage_length === "1d" ? "1 trading day" : "5 trading days"}
                      </button>
                    </td>
                    <td className="py-3 px-3 text-right font-mono">${(t.account_size || 0).toLocaleString()}</td>
                    <td className="py-3 px-3 text-right font-mono text-[#10B981] font-semibold">${(t.prize_pool || 0).toLocaleString()}</td>
                    <td className="py-3 px-3 text-right font-mono">{t.registered}/{t.capacity}</td>
                    <td className="py-3 px-5 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {t.stage !== "Completed" && (
                          <button data-testid={`advance-${t.id}`} onClick={() => advance(t.id)} className="inline-flex items-center gap-1 text-[12px] font-medium text-[var(--ink)] bg-[var(--bg)] border border-[var(--border)] px-2.5 py-1.5 rounded-full hover:bg-[var(--lime-soft)] hover:border-[#B4E04C]">
                            Advance <ChevronRight className="w-3 h-3" />
                          </button>
                        )}
                        {t.stage !== "Completed" && (
                          <button data-testid={`void-${t.id}`} onClick={() => voidT(t.id)} className="inline-flex items-center gap-1 text-[12px] font-medium text-[#EF4444] bg-[#EF4444]/5 border border-[#EF4444]/30 px-2.5 py-1.5 rounded-full hover:bg-[#EF4444]/10">
                            <Trash2 className="w-3 h-3" /> Void
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <CreateTournamentDialog open={creating} onClose={() => setCreating(false)} onCreated={() => { setCreating(false); refetch(); }} />
    </div>
  );
}

function CreateTournamentDialog({ open, onClose, onCreated }) {
  const [form, setForm] = useState({
    name: "", start_date: "", prize_pool: 25000, account_size: 50000, stage_length: "5d", capacity: 32,
  });
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    setBusy(true);
    try {
      const res = await adminCreateTournament({ ...form, prize_pool: Number(form.prize_pool), account_size: Number(form.account_size), capacity: Number(form.capacity) });
      toast.success(`Created tournament ${res.id}`);
      onCreated?.();
    } catch (err) { toast.error(err.message); }
    finally { setBusy(false); }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose?.()}>
      <DialogContent className="max-w-md rounded-3xl bg-[var(--surface)] border-[var(--border)]" data-testid="create-tournament-dialog">
        <DialogHeader>
          <DialogTitle className="text-[var(--ink)] text-xl">New tournament</DialogTitle>
          <DialogDescription className="text-[var(--muted)]">Configure the basics. Brackets and groups are seeded once registration closes.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-3 mt-2">
          <Field label="Name">
            <input data-testid="t-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Diamond Open 2026" className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-full px-4 py-2.5 text-[13.5px] text-[var(--ink)] focus:outline-none focus:border-[var(--inverse)]" />
          </Field>
          <Field label="Start date (display)">
            <input data-testid="t-start" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} placeholder="Feb 25" className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-full px-4 py-2.5 text-[13.5px] text-[var(--ink)] focus:outline-none focus:border-[var(--inverse)]" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Account size ($)">
              <input data-testid="t-account" type="number" value={form.account_size} onChange={(e) => setForm({ ...form, account_size: e.target.value })} className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-full px-4 py-2.5 text-[13.5px] text-[var(--ink)] font-mono focus:outline-none focus:border-[var(--inverse)]" />
            </Field>
            <Field label="Prize pool ($)">
              <input data-testid="t-prize" type="number" value={form.prize_pool} onChange={(e) => setForm({ ...form, prize_pool: e.target.value })} className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-full px-4 py-2.5 text-[13.5px] text-[var(--ink)] font-mono focus:outline-none focus:border-[var(--inverse)]" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Capacity">
              <input data-testid="t-capacity" type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-full px-4 py-2.5 text-[13.5px] text-[var(--ink)] font-mono focus:outline-none focus:border-[var(--inverse)]" />
            </Field>
            <Field label="Stage length">
              <div className="grid grid-cols-2 bg-[var(--bg)] border border-[var(--border)] rounded-full p-1">
                {["1d", "5d"].map((s) => (
                  <button type="button" key={s} data-testid={`t-stage-${s}`} onClick={() => setForm({ ...form, stage_length: s })} className={`rounded-full py-2 text-[12.5px] font-medium transition-colors ${form.stage_length === s ? "bg-[var(--inverse)] text-[var(--inverse-fg)]" : "text-[var(--muted)] hover:text-[var(--ink)]"}`}>
                    {s === "1d" ? "1 day" : "5 days"}
                  </button>
                ))}
              </div>
            </Field>
          </div>
          <div className="text-[11px] text-[var(--muted)] bg-[var(--bg)] rounded-xl px-3 py-2 leading-relaxed">
            Stage length applies to every stage (group + knockouts). Top 2 by equity in each group advance. Knockouts are sealed 1v1 — highest equity at the buzzer wins.
          </div>
          <div className="pt-2 flex gap-2">
            <button type="button" onClick={onClose} className="flex-1 text-[13px] font-medium text-[var(--muted)] py-2.5 rounded-full border border-[var(--border)] hover:bg-[var(--bg)]">Cancel</button>
            <button type="submit" disabled={busy} data-testid="t-submit" className="flex-1 inline-flex items-center justify-center gap-2 bg-[var(--inverse)] text-[var(--inverse-fg)] text-[13px] font-semibold py-2.5 rounded-full hover:bg-[var(--ink-soft)] disabled:opacity-50">
              {busy ? "Creating…" : "Create"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-[10.5px] font-mono uppercase tracking-wider text-[var(--muted-2)] block mb-1">{label}</span>
      {children}
    </label>
  );
}
