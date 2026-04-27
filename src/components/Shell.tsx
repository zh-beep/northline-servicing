"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV: { label: string; href: string; icon: React.ReactNode }[] = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M5 10v10h14V10" />
      </svg>
    ),
  },
  {
    label: "Loans",
    href: "/loans",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h18M3 17h12" />
      </svg>
    ),
  },
  {
    label: "Borrowers",
    href: "/borrowers",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM3 21v-1a7 7 0 0114 0v1" />
      </svg>
    ),
  },
  {
    label: "Applications",
    href: "/applications",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v12a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    label: "Closings",
    href: "/closings",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M21 12c0 5-4 9-9 9s-9-4-9-9 4-9 9-9 9 4 9 9z" />
      </svg>
    ),
  },
  {
    label: "Demo & Journey",
    href: "/demo",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    label: "Documents",
    href: "/documents",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9l-6-6H7a2 2 0 00-2 2v16a2 2 0 002 2z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 3v6h6" />
      </svg>
    ),
  },
];

const SECONDARY: { label: string; href: string }[] = [
  { label: "Settings", href: "/settings" },
];

export function Shell({ children, title, subtitle, action }: {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-[var(--color-bg)] text-[var(--color-ink)]">
      {/* Sidebar */}
      <aside className="w-60 hairline-r bg-[var(--color-surface-soft)] flex flex-col shrink-0">
        {/* Brand */}
        <div className="h-16 px-5 flex items-center gap-3 hairline-b">
          <Logo />
          <div className="flex flex-col leading-tight">
            <span className="font-display text-[18px] font-semibold tracking-tight">Northline</span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-muted)]">Servicing</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="px-3 py-4 flex-1 overflow-y-auto">
          <ul className="space-y-0.5">
            {NAV.map((item) => {
              const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] transition ${
                      active
                        ? "bg-[var(--color-primary)] text-[var(--color-bg)] font-medium"
                        : "text-[var(--color-ink-soft)] hover:bg-[var(--color-primary-tint)] hover:text-[var(--color-primary)]"
                    }`}
                  >
                    <span className={active ? "text-[var(--color-bg)]" : "text-[var(--color-muted)]"}>{item.icon}</span>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 px-3 text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">Account</div>
          <ul className="mt-2 space-y-0.5">
            {SECONDARY.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] transition ${
                      active
                        ? "bg-[var(--color-primary)] text-[var(--color-bg)] font-medium"
                        : "text-[var(--color-ink-soft)] hover:bg-[var(--color-primary-tint)] hover:text-[var(--color-primary)]"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User */}
        <div className="px-4 py-3 hairline-t flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-[var(--color-bg)] flex items-center justify-center text-[11px] font-semibold">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-medium truncate">Jane Doe</p>
            <p className="text-[10px] text-[var(--color-muted)] truncate">Operations</p>
          </div>
          <Link href="/" className="text-[var(--color-muted)] hover:text-[var(--color-primary)] transition" title="Sign out">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="h-16 hairline-b bg-[var(--color-surface)] flex items-center justify-between px-8">
          <div>
            {title && <h1 className="font-display text-[22px] font-semibold tracking-tight leading-tight">{title}</h1>}
            {subtitle && <p className="text-[12px] text-[var(--color-muted)] mt-0.5">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-3">
            {action}
            <button className="w-8 h-8 rounded-full hover:bg-[var(--color-primary-tint)] flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-primary)] transition cursor-pointer">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2a2 2 0 01-.6 1.4L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

function Logo() {
  return (
    <div className="w-8 h-8 rounded-md bg-[var(--color-primary)] flex items-center justify-center">
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
        <path d="M4 20L4 6L20 20L20 6" stroke="#f4f1e8" strokeWidth="2" strokeLinecap="square" />
      </svg>
    </div>
  );
}

export function StatusDot({ status }: { status: "current" | "past_due" | "delinquent" | "default" | "paid_off" | "on_time" | "late" | "missed" | "overpaid" | "pending" | "received" | "executed" | "rejected" }) {
  const colors: Record<string, string> = {
    current: "var(--color-status-current)",
    on_time: "var(--color-status-current)",
    received: "var(--color-status-current)",
    executed: "var(--color-status-current)",
    overpaid: "var(--color-info)",
    past_due: "var(--color-status-pastdue)",
    late: "var(--color-status-pastdue)",
    pending: "var(--color-warning)",
    delinquent: "var(--color-status-delinquent)",
    missed: "var(--color-status-delinquent)",
    rejected: "var(--color-status-delinquent)",
    default: "#7a1f1f",
    paid_off: "var(--color-status-paid)",
  };
  return <span className="status-dot" style={{ background: colors[status] || "var(--color-muted)" }} />;
}

export function StatusBadge({ status, label }: { status: string; label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[var(--color-ink-soft)]">
      <StatusDot status={status as never} />
      {label || formatStatus(status)}
    </span>
  );
}

function formatStatus(s: string): string {
  return s.split("_").map((p) => p[0].toUpperCase() + p.slice(1)).join(" ");
}

export function MetricCard({ label, value, delta, deltaTone, sub }: {
  label: string;
  value: string;
  delta?: string;
  deltaTone?: "up" | "down" | "neutral";
  sub?: string;
}) {
  const tone =
    deltaTone === "up" ? "text-[var(--color-success)]" :
    deltaTone === "down" ? "text-[var(--color-danger)]" :
    "text-[var(--color-muted)]";
  return (
    <div className="bg-[var(--color-surface)] hairline rounded-lg px-5 py-4">
      <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--color-muted)]">{label}</p>
      <p className="font-display text-[28px] font-semibold mt-1 tabular leading-none">{value}</p>
      <div className="mt-2 flex items-baseline gap-2 text-[12px]">
        {delta && <span className={`tabular ${tone}`}>{delta}</span>}
        {sub && <span className="text-[var(--color-muted)]">{sub}</span>}
      </div>
    </div>
  );
}

export function FlagPill({ count, severity }: { count: number; severity?: "low" | "medium" | "high" | null }) {
  if (count === 0) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-[11px] font-medium bg-[var(--color-primary-tint)] text-[var(--color-primary)]">
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        Clear
      </span>
    );
  }
  const tone = severity === "high"
    ? "bg-[#fdf2f2] text-[var(--color-danger)] border-[#f0d3d3]"
    : severity === "medium"
    ? "bg-[#fdf6ec] text-[var(--color-warning)] border-[#ecdcb8]"
    : "bg-[var(--color-border-soft)] text-[var(--color-ink-soft)] border-[var(--color-border)]";
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-[11px] font-medium border ${tone}`}>
      <span className="text-[10px]">⚑</span>
      {count} flag{count > 1 ? "s" : ""}
    </span>
  );
}

export function topSeverity(issues: { severity: "low" | "medium" | "high" }[]): "low" | "medium" | "high" | null {
  if (issues.some((i) => i.severity === "high")) return "high";
  if (issues.some((i) => i.severity === "medium")) return "medium";
  if (issues.length > 0) return "low";
  return null;
}

export function formatCurrency(n: number, opts: { compact?: boolean } = {}) {
  if (opts.compact && Math.abs(n) >= 1_000_000) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2, notation: "compact" }).format(n);
  }
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

export function formatDate(d: string) {
  return new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
