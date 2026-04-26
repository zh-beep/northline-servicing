"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => router.push("/dashboard"), 600);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-[1.1fr_1fr] bg-[var(--color-bg)]">
      {/* Left — editorial */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-[var(--color-primary)] text-[var(--color-bg)] relative overflow-hidden">
        <div className="flex items-center gap-3 z-10">
          <div className="w-9 h-9 rounded-md bg-[var(--color-bg)] flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
              <path d="M4 20L4 6L20 20L20 6" stroke="#1f3a2e" strokeWidth="2" strokeLinecap="square" />
            </svg>
          </div>
          <span className="font-display text-[20px] font-semibold tracking-tight">Northline</span>
        </div>

        <div className="z-10 max-w-lg">
          <h1 className="font-display text-[64px] leading-[1.02] font-light tracking-tight">
            Loan servicing,<br />
            <em className="italic">made clear.</em>
          </h1>
          <p className="mt-6 text-[15px] text-[#cdd9cd] max-w-md leading-relaxed">
            Modern infrastructure that brings clarity, control, and speed to every stage of the borrower lifecycle.
          </p>
        </div>

        <div className="z-10 flex items-center gap-8 text-[12px] text-[#a8b6a8]">
          <div>
            <p className="font-display text-[22px] text-[var(--color-bg)] font-medium tabular">$312.5M</p>
            <p className="mt-1 uppercase tracking-[0.14em] text-[10px]">Loans Serviced</p>
          </div>
          <div>
            <p className="font-display text-[22px] text-[var(--color-bg)] font-medium tabular">98.4%</p>
            <p className="mt-1 uppercase tracking-[0.14em] text-[10px]">On-Time Rate</p>
          </div>
          <div>
            <p className="font-display text-[22px] text-[var(--color-bg)] font-medium tabular">SOC 2</p>
            <p className="mt-1 uppercase tracking-[0.14em] text-[10px]">Type II Certified</p>
          </div>
        </div>

        {/* Decorative geometric */}
        <svg className="absolute -right-20 top-1/2 -translate-y-1/2 w-[700px] h-[700px] opacity-[0.08]" viewBox="0 0 100 100" fill="none">
          <path d="M10 90 L10 10 L90 90 L90 10" stroke="#f4f1e8" strokeWidth="0.5" />
          <path d="M20 80 L20 20 L80 80 L80 20" stroke="#f4f1e8" strokeWidth="0.5" />
          <path d="M30 70 L30 30 L70 70 L70 30" stroke="#f4f1e8" strokeWidth="0.5" />
        </svg>
      </div>

      {/* Right — form */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-3 mb-12">
            <div className="w-9 h-9 rounded-md bg-[var(--color-primary)] flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                <path d="M4 20L4 6L20 20L20 6" stroke="#f4f1e8" strokeWidth="2" strokeLinecap="square" />
              </svg>
            </div>
            <span className="font-display text-[20px] font-semibold tracking-tight">Northline</span>
          </div>

          <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-muted)]">Sign in</p>
          <h2 className="font-display text-[32px] font-medium mt-2 tracking-tight">Welcome back.</h2>
          <p className="text-[13px] text-[var(--color-muted)] mt-2">
            Sign in to access your servicing portfolio.
          </p>

          <form onSubmit={handleLogin} className="space-y-5 mt-10">
            <div>
              <label className="block text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted)] mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@firm.com"
                className="w-full px-0 py-2 bg-transparent border-0 border-b border-[var(--color-border)] focus:border-[var(--color-primary)] outline-none text-[var(--color-ink)] placeholder:text-[var(--color-muted)] transition"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted)] mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                className="w-full px-0 py-2 bg-transparent border-0 border-b border-[var(--color-border)] focus:border-[var(--color-primary)] outline-none text-[var(--color-ink)] placeholder:text-[var(--color-muted)] transition"
              />
            </div>

            <div className="flex items-center justify-between text-[12px] pt-2">
              <label className="flex items-center gap-2 text-[var(--color-ink-soft)]">
                <input type="checkbox" className="rounded-sm border-[var(--color-border)] accent-[var(--color-primary)]" />
                Remember me
              </label>
              <a href="#" className="text-[var(--color-primary)] hover:underline">Forgot?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-mid)] disabled:bg-[var(--color-muted)] text-[var(--color-bg)] font-medium rounded-md transition cursor-pointer text-[13px] tracking-wide"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="mt-12 text-[11px] text-[var(--color-muted)]">
            Demo credentials accepted: any email + password.
          </p>
        </div>
      </div>
    </div>
  );
}
