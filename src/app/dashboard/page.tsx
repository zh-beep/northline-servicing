"use client";

import Link from "next/link";
import { Shell, MetricCard, StatusBadge, FlagPill, topSeverity, formatCurrency, formatDate } from "@/components/Shell";
import { borrowers, getPortfolioStats } from "@/lib/data";

export default function OverviewPage() {
  const stats = getPortfolioStats();
  const collectionRate = stats.paymentsScheduledThisMonth > 0
    ? ((stats.paymentsCollectedThisMonth / stats.paymentsScheduledThisMonth) * 100).toFixed(1)
    : "0.0";

  const flagged = borrowers.filter((b) => b.flaggedIssues.length > 0).slice(0, 4);

  return (
    <Shell
      title="Overview"
      subtitle="Real-time snapshot of your portfolio · Period: April 2026"
      action={
        <div className="flex items-center gap-2 text-[12px] text-[var(--color-muted)]">
          <button className="px-3 py-1.5 hairline rounded-md hover:bg-[var(--color-primary-tint)] transition cursor-pointer">
            May 12 — Jun 11, 2026
          </button>
          <button className="px-3 py-1.5 bg-[var(--color-primary)] text-[var(--color-bg)] rounded-md text-[12px] font-medium hover:bg-[var(--color-primary-mid)] transition cursor-pointer">
            Export CSV
          </button>
        </div>
      }
    >
      <div className="px-8 py-6 space-y-6">
        {/* Top metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Total Outstanding"
            value={formatCurrency(stats.totalOutstanding, { compact: true })}
            delta="+ 7.24%"
            deltaTone="up"
            sub="vs last month"
          />
          <MetricCard
            label="Payments Collected"
            value={formatCurrency(stats.paymentsCollectedThisMonth, { compact: true })}
            delta={`${collectionRate}%`}
            deltaTone="up"
            sub={`of ${formatCurrency(stats.paymentsScheduledThisMonth, { compact: true })} scheduled`}
          />
          <MetricCard
            label="Active Loans"
            value={String(stats.activeLoans)}
            sub={`${stats.internalLoans} internal · ${stats.externalLoans} external`}
          />
          <MetricCard
            label="Delinquent A/R"
            value={formatCurrency(stats.delinquentReceivables, { compact: true })}
            delta="-1.02%"
            deltaTone="down"
            sub="vs last month"
          />
        </div>

        {/* Aging + Status legend */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Aging */}
          <div className="lg:col-span-2 bg-[var(--color-surface)] hairline rounded-lg">
            <div className="px-5 py-4 hairline-b flex items-center justify-between">
              <div>
                <h3 className="font-display text-[16px] font-medium">Receivables Aging</h3>
                <p className="text-[11px] text-[var(--color-muted)] mt-0.5">Days past due, by outstanding balance</p>
              </div>
              <Link href="/loans" className="text-[12px] text-[var(--color-primary)] hover:underline">View all loans →</Link>
            </div>
            <div className="p-5">
              <AgingChart aging={stats.aging} />
              <div className="grid grid-cols-4 gap-4 mt-6">
                <AgingBucket label="Current" value={stats.aging.current} tone="current" />
                <AgingBucket label="1—30 days" value={stats.aging.d30} tone="past_due" />
                <AgingBucket label="31—60 days" value={stats.aging.d60} tone="past_due" />
                <AgingBucket label="60+ days" value={stats.aging.d90plus} tone="delinquent" />
              </div>
            </div>
          </div>

          {/* Status legend */}
          <div className="bg-[var(--color-surface)] hairline rounded-lg">
            <div className="px-5 py-4 hairline-b">
              <h3 className="font-display text-[16px] font-medium">Status Legend</h3>
              <p className="text-[11px] text-[var(--color-muted)] mt-0.5">Across all loans</p>
            </div>
            <div className="p-5 space-y-3 text-[13px]">
              <div className="flex items-center justify-between">
                <StatusBadge status="current" label="On Track" />
                <span className="tabular text-[var(--color-muted)]">{stats.activeLoans - countByStatus("past_due") - countByStatus("delinquent") - countByStatus("default")}</span>
              </div>
              <div className="flex items-center justify-between">
                <StatusBadge status="past_due" label="Past Due (1—29)" />
                <span className="tabular text-[var(--color-muted)]">{countByStatus("past_due")}</span>
              </div>
              <div className="flex items-center justify-between">
                <StatusBadge status="delinquent" label="Delinquent (30+)" />
                <span className="tabular text-[var(--color-muted)]">{countByStatus("delinquent")}</span>
              </div>
              <div className="flex items-center justify-between">
                <StatusBadge status="default" label="Default" />
                <span className="tabular text-[var(--color-muted)]">{countByStatus("default")}</span>
              </div>
              <div className="flex items-center justify-between">
                <StatusBadge status="paid_off" label="Paid in Full" />
                <span className="tabular text-[var(--color-muted)]">{countByStatus("paid_off")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Paid / Unpaid this month */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-[var(--color-surface)] hairline rounded-lg">
            <div className="px-5 py-4 hairline-b flex items-center justify-between">
              <div>
                <h3 className="font-display text-[16px] font-medium">Received this month</h3>
                <p className="text-[11px] text-[var(--color-muted)] mt-0.5">{stats.paidThisMonth.length} payments · {formatCurrency(stats.paymentsCollectedThisMonth)}</p>
              </div>
              <span className="status-dot" style={{ background: "var(--color-success)" }} />
            </div>
            <div className="divide-y divide-[var(--color-border-soft)]">
              {stats.paidThisMonth.length === 0 ? (
                <p className="px-5 py-6 text-[13px] text-[var(--color-muted)]">No payments received yet this month.</p>
              ) : stats.paidThisMonth.map((p) => (
                <Link key={p.loanId + p.borrowerId} href={`/borrower/${p.borrowerId}`} className="px-5 py-3 flex items-center justify-between hover:bg-[var(--color-surface-soft)] transition">
                  <div>
                    <p className="text-[13px] font-medium">{p.name}</p>
                    <p className="text-[11px] text-[var(--color-muted)]">{p.loanId} · received {formatDate(p.date)}</p>
                  </div>
                  <span className="text-[13px] tabular font-medium">{formatCurrency(p.amount)}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-[var(--color-surface)] hairline rounded-lg">
            <div className="px-5 py-4 hairline-b flex items-center justify-between">
              <div>
                <h3 className="font-display text-[16px] font-medium">Outstanding this month</h3>
                <p className="text-[11px] text-[var(--color-muted)] mt-0.5">{stats.unpaidThisMonth.length} payments not yet received</p>
              </div>
              <span className="status-dot" style={{ background: "var(--color-danger)" }} />
            </div>
            <div className="divide-y divide-[var(--color-border-soft)]">
              {stats.unpaidThisMonth.length === 0 ? (
                <p className="px-5 py-6 text-[13px] text-[var(--color-muted)]">All payments received this month. Excellent.</p>
              ) : stats.unpaidThisMonth.map((p) => (
                <Link key={p.loanId + p.borrowerId} href={`/borrower/${p.borrowerId}`} className="px-5 py-3 flex items-center justify-between hover:bg-[var(--color-surface-soft)] transition">
                  <div>
                    <p className="text-[13px] font-medium">{p.name}</p>
                    <p className="text-[11px] text-[var(--color-muted)]">{p.loanId} · due {formatDate(p.due)} · <span className="text-[var(--color-danger)]">{p.daysLate} days late</span></p>
                  </div>
                  <span className="text-[13px] tabular font-medium text-[var(--color-danger)]">{formatCurrency(p.amount)}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Flagged + Quick actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-[var(--color-surface)] hairline rounded-lg">
            <div className="px-5 py-4 hairline-b flex items-center justify-between">
              <h3 className="font-display text-[16px] font-medium">Flagged borrowers</h3>
              <Link href="/borrowers" className="text-[12px] text-[var(--color-primary)] hover:underline">All borrowers →</Link>
            </div>
            <div className="divide-y divide-[var(--color-border-soft)]">
              {flagged.map((b) => (
                <Link key={b.id} href={`/borrower/${b.id}`} className="block px-5 py-4 hover:bg-[var(--color-surface-soft)] transition">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)] flex items-center justify-center text-[11px] font-semibold">
                        {b.firstName[0]}{b.lastName[0]}
                      </div>
                      <div>
                        <p className="text-[13px] font-medium">{b.firstName} {b.lastName} <span className="text-[var(--color-muted)] font-normal">· {b.entityName}</span></p>
                        <p className="text-[11px] text-[var(--color-muted)]">{b.flaggedIssues.length} flag{b.flaggedIssues.length === 1 ? "" : "s"} · {b.activeLoans} active loans · {formatCurrency(b.totalOutstanding, { compact: true })}</p>
                      </div>
                    </div>
                    <FlagPill count={b.flaggedIssues.length} severity={topSeverity(b.flaggedIssues)} />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-[var(--color-primary)] text-[var(--color-bg)] rounded-lg p-6 flex flex-col justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-[#a8b6a8]">Quick start</p>
              <h3 className="font-display text-[22px] font-medium mt-2 leading-tight">Originate a new loan</h3>
              <p className="text-[12px] text-[#cdd9cd] mt-2 leading-relaxed">
                Take an application from a new borrower or upload a written application internally.
              </p>
            </div>
            <div className="flex flex-col gap-2 mt-6">
              <Link href="/applications/new" className="px-4 py-2.5 bg-[var(--color-bg)] text-[var(--color-primary)] rounded-md text-[12px] font-medium text-center hover:bg-white transition">
                Start new application
              </Link>
              <Link href="/applications/new?internal=1" className="px-4 py-2.5 border border-[#a8b6a8] text-[var(--color-bg)] rounded-md text-[12px] font-medium text-center hover:bg-white/5 transition">
                Upload internal form
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}

function countByStatus(status: string) {
  return borrowers.flatMap((b) => b.loans).filter((l) => l.status === status).length;
}

function AgingChart({ aging }: { aging: { current: number; d30: number; d60: number; d90plus: number } }) {
  const total = aging.current + aging.d30 + aging.d60 + aging.d90plus;
  const segments = [
    { value: aging.current, color: "var(--color-status-current)" },
    { value: aging.d30, color: "var(--color-status-pastdue)" },
    { value: aging.d60, color: "#d97a3b" },
    { value: aging.d90plus, color: "var(--color-status-delinquent)" },
  ];
  return (
    <div className="flex h-3 w-full rounded-sm overflow-hidden bg-[var(--color-border-soft)]">
      {segments.map((s, i) => (
        <div key={i} style={{ width: `${(s.value / total) * 100}%`, background: s.color }} />
      ))}
    </div>
  );
}

function AgingBucket({ label, value, tone }: { label: string; value: number; tone: "current" | "past_due" | "delinquent" }) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <span className="status-dot" style={{ background: tone === "current" ? "var(--color-status-current)" : tone === "past_due" ? "var(--color-status-pastdue)" : "var(--color-status-delinquent)" }} />
        <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--color-muted)]">{label}</p>
      </div>
      <p className="font-display text-[20px] font-semibold mt-1.5 tabular leading-none">{formatCurrency(value, { compact: true })}</p>
    </div>
  );
}
