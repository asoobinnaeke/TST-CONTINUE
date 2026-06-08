import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { ShieldCheck, Lock, ArrowRight } from "lucide-react";
import { adminLogin, isAdminAuthed } from "@/lib/adminApi";
import { toast } from "sonner";

const LOGO = "https://customer-assets.emergentagent.com/job_trade-duel-arena/artifacts/aemoxt7k_Asset%2025%404x-8.png";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@selecttraders.com");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (isAdminAuthed()) return <Navigate to="/admin" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await adminLogin(email, password);
      toast.success("Signed in");
      navigate("/admin");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F12] grid place-items-center px-5" data-testid="admin-login">
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#A78BFA] rounded-full blur-[120px] opacity-30 pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#B4E04C] rounded-full blur-[120px] opacity-15 pointer-events-none" />

      <form onSubmit={submit} className="relative w-full max-w-md bg-white rounded-3xl p-8 lg:p-10">
        <div className="flex items-center justify-between mb-8">
          <img src={LOGO} alt="The Select Traders" className="h-8 w-auto" />
          <span className="text-[10px] font-bold tracking-[0.18em] uppercase bg-[#A78BFA] text-white px-2.5 py-1 rounded">Admin</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[#0F0F12]">Sign in to the admin portal</h1>
        <p className="mt-1 text-[14px] text-[#6B7280]">Staff access only. All actions are audit-logged.</p>

        <div className="mt-7 space-y-4">
          <label className="block">
            <span className="text-[12px] font-medium text-[#0F0F12]">Email</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} data-testid="admin-login-email" className="mt-1.5 w-full bg-[#FAFAF7] border border-[#ECECEA] rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#0F0F12]" />
          </label>
          <label className="block">
            <span className="text-[12px] font-medium text-[#0F0F12]">Password</span>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} data-testid="admin-login-password" className="mt-1.5 w-full bg-[#FAFAF7] border border-[#ECECEA] rounded-xl pl-10 pr-4 py-3 text-[14px] focus:outline-none focus:border-[#0F0F12]" placeholder="••••••••" />
            </div>
          </label>
        </div>

        <button type="submit" disabled={submitting} data-testid="admin-login-submit" className="mt-7 w-full inline-flex items-center justify-center gap-2 bg-[#0F0F12] text-white font-semibold text-[14px] py-3.5 rounded-full hover:bg-[#1F2024] disabled:opacity-50">
          {submitting ? "Signing in..." : "Sign in"}
          <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
        </button>

        <div className="mt-6 rounded-xl bg-[#FEF3C7] border border-[#FCD34D] px-4 py-3 flex items-start gap-3">
          <ShieldCheck className="w-4 h-4 text-[#92400E] mt-0.5 shrink-0" />
          <div className="text-[12px] text-[#92400E]">
            <strong>Demo creds:</strong> <span className="font-mono">admin@selecttraders.com / admin-2026</span>
          </div>
        </div>
      </form>
    </div>
  );
}
