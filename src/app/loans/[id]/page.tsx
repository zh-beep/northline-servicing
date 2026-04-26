"use client";

import { use } from "react";
import Link from "next/link";
import { Shell, StatusBadge, formatCurrency, formatDate, MetricCard } from "@/components/Shell";
import { getLoanById } from "@/lib/data";

export default function LoanDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const result = getLoanById(id);

  if (!result) {
    return (
      <Shell title="Loan not found">
        <div className="p-12 text-center">
          <p className="text-[var(--color-muted)]">No loan with ID “{id}”.</p>
          <Link href="/loans" className="mt-4 inline-block text-[var(--color-primary)] hover:underline">← Back to Loans</Link>
        </div>
      </Shell>
    );
  }

  const { loan, borrower } = result;
  const totalReceived = loan.payments.reduce((s, p) => s + p.received, 0);
  const onTimeCount = loan.payments.filter((p) => p.status === "on_time" || p.status === "overpaid").length;
  const onTimeRate = loan.payments.length ? Math.round((onTimeCount / loan.payments.length) * 100) : 0;

  return (
    <Shell
      title={`${loan.id}`}
      subtitle={`${borrower.firstName} ${borrower.lastName} · ${loan.collateralAddress}`}
      action={
        <Link href={`/borrower/${borrower.id}`} className="text-[12px] text-[var(--color-primary)] hover:underline">
          View borrower →
        </Link>
      }
    >
      <div className="px-8 py-6 space-y-6">
        {/* Loan summary */}
        <div className="bg-[var(--color-surface)] hairline rounded-lg p-6">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-[11px] font-medium ${
                  loan.source === "internal" ? "bg-[var(--color-primary-tint)] text-[var(--color-primary)]" : "bg-[var(--color-border-soft)] text-[var(--color-ink-soft)]"
                }`}>
                  {loan.source === "internal" ? "Internal" : "External"} · {loan.servicer}
                </span>
                <StatusBadge status={loan.status} />
              </div>
              <h2 className="font-display text-[24px] font-medium tracking-tight">{loan.collateralAddress}</h2>
              <p className="text-[12px] text-[var(--color-muted)] mt-1">
                Originated {formatDate(loan.originationDate)} · Matures {formatDate(loan.maturityDate)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--color-muted)]">Current Balance</p>
              <p className="font-display text-[32px] font-semibold tabular leading-none mt-1">{formatCurrency(loan.currentBalance)}</p>
              <p className="text-[12px] text-[var(--color-muted)] mt-2 tabular">of {formatCurrency(loan.loanAmount)} originated</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-x-6 gap-y-4 text-[13px]">
            <Detail label="Loan Type" value={loanTypeLabel(loan.loanType)} />
            <Detail label="Lien" value={loan.lien.charAt(0).toUpperCase() + loan.lien.slice(1)} />
            <Detail label="Rate" value={`${loan.interestRate}%`} />
            <Detail label="Term" value={`${loan.termMonths} mo`} />
            <Detail label="Amortization" value={loan.amortizationMonths ? `${loan.amortizationMonths} mo` : "—"} />
            <Detail label="LTV" value={`${loan.ltv}%`} />
            <Detail label="Monthly Payment" value={formatCurrency(loan.monthlyPayment)} />
            <Detail label="Accrued Interest" value={formatCurrency(loan.accruedInterest)} />
            <Detail label="Next Payment" value={formatDate(loan.nextPaymentDue)} />
            <Detail label="Days Delinquent" value={loan.daysDelinquent.toString()} tone={loan.daysDelinquent > 0 ? "danger" : undefined} />
            <Detail label="Servicer" value={loan.servicer} />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <MetricCard label="Total Received" value={formatCurrency(totalReceived, { compact: true })} sub={`${loan.payments.length} payments recorded`} />
          <MetricCard label="On-Time Rate" value={`${onTimeRate}%`} sub={`${onTimeCount} of ${loan.payments.length}`} />
          <MetricCard label="Guarantors" value={String(loan.guarantors.length)} sub={loan.guarantors.some((g) => g.flagged) ? "1+ flagged" : "All clear"} />
        </div>

        {/* Payment history */}
        <div className="bg-[var(--color-surface)] hairline rounded-lg overflow-hidden">
          <div className="px-5 py-4 hairline-b">
            <h3 className="font-display text-[16px] font-medium">Payment history</h3>
            <p className="text-[11px] text-[var(--color-muted)] mt-0.5">All scheduled payments and receipts</p>
          </div>
          <table className="w-full">
            <thead>
              <tr className="hairline-b bg-[var(--color-surface-soft)]">
                <Th>Due Date</Th>
                <Th align="right">Scheduled</Th>
                <Th align="right">Received</Th>
                <Th align="right">Principal</Th>
                <Th align="right">Interest</Th>
                <Th>Method</Th>
                <Th>Reference</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {loan.payments.map((p) => (
                <tr key={p.id} className="hairline-b last:border-b-0">
                  <td className="px-4 py-3 text-[13px]">{formatDate(p.date)}</td>
                  <td className="px-4 py-3 text-[13px] text-right tabular text-[var(--color-ink-soft)]">{formatCurrency(p.scheduled)}</td>
                  <td className="px-4 py-3 text-[13px] text-right tabular font-medium">
                    {p.received > 0 ? formatCurrency(p.received) : <span className="text-[var(--color-muted)]">—</span>}
                  </td>
                  <td className="px-4 py-3 text-[13px] text-right tabular text-[var(--color-ink-soft)]">{p.principal ? formatCurrency(p.principal) : "—"}</td>
                  <td className="px-4 py-3 text-[13px] text-right tabular text-[var(--color-ink-soft)]">{p.interest ? formatCurrency(p.interest) : "—"}</td>
                  <td className="px-4 py-3 text-[12px] text-[var(--color-muted)]">{p.method || "—"}</td>
                  <td className="px-4 py-3 text-[12px] font-mono text-[var(--color-muted)]">{p.reference || "—"}</td>
                  <td className="px-4 py-3">
                    <PaymentStatusLabel p={p} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Management history + Guarantors */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-[var(--color-surface)] hairline rounded-lg">
            <div className="px-5 py-4 hairline-b">
              <h3 className="font-display text-[16px] font-medium">Management history</h3>
              <p className="text-[11px] text-[var(--color-muted)] mt-0.5">Notes, calls, notices, and modifications</p>
            </div>
            <ol className="p-5 space-y-4">
              {loan.managementHistory.map((evt, i) => (
                <li key={i} className="flex gap-3">
                  <div className="flex flex-col items-center pt-1">
                    <span className="status-dot" style={{
                      background:
                        evt.type === "default_notice" ? "var(--color-danger)" :
                        evt.type === "modification" ? "var(--color-warning)" :
                        evt.type === "approval" ? "var(--color-success)" :
                        "var(--color-muted)"
                    }} />
                    {i < loan.managementHistory.length - 1 && <span className="w-px flex-1 bg-[var(--color-border)] mt-1" />}
                  </div>
                  <div className="flex-1 pb-2">
                    <div className="flex items-center justify-between">
                      <p className="text-[12px] font-medium uppercase tracking-[0.1em] text-[var(--color-ink-soft)]">{evt.type.replace("_", " ")}</p>
                      <p className="text-[11px] text-[var(--color-muted)]">{formatDate(evt.date)} · {evt.user}</p>
                    </div>
                    <p className="text-[13px] mt-1 text-[var(--color-ink-soft)]">{evt.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="bg-[var(--color-surface)] hairline rounded-lg">
            <div className="px-5 py-4 hairline-b">
              <h3 className="font-display text-[16px] font-medium">Guarantors</h3>
              <p className="text-[11px] text-[var(--color-muted)] mt-0.5">Personal guaranties on this loan</p>
            </div>
            <div className="divide-y divide-[var(--color-border-soft)]">
              {loan.guarantors.map((g) => (
                <div key={g.name} className="px-5 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[13px] font-medium">{g.name}</p>
                      <p className="text-[11px] text-[var(--color-muted)]">{g.relationship} · SSN {g.ssn}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--color-muted)]">Risk</p>
                      <p className={`text-[16px] font-display font-medium tabular ${
                        g.riskLevel === "low" ? "text-[var(--color-success)]" :
                        g.riskLevel === "medium" ? "text-[var(--color-warning)]" :
                        "text-[var(--color-danger)]"
                      }`}>{g.riskScore}</p>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-4 text-[12px]">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.12em] text-[var(--color-muted)]">Outstanding loans</p>
                      <p className="tabular font-medium mt-0.5">{g.outstandingLoans}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.12em] text-[var(--color-muted)]">Total guaranteed</p>
                      <p className="tabular font-medium mt-0.5">{formatCurrency(g.totalGuaranteed, { compact: true })}</p>
                    </div>
                  </div>
                  {g.flagged && g.flagReason && (
                    <div className="mt-3 px-3 py-2 bg-[#fdf2f2] border border-[#f0d3d3] rounded-md text-[12px] text-[var(--color-danger)]">
                      <span className="font-medium">⚑ Flagged:</span> {g.flagReason}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Loan documents */}
        <div className="bg-[var(--color-surface)] hairline rounded-lg">
          <div className="px-5 py-4 hairline-b flex items-center justify-between">
            <div>
              <h3 className="font-display text-[16px] font-medium">Loan documents</h3>
              <p className="text-[11px] text-[var(--color-muted)] mt-0.5">Closing package &amp; ongoing requirements</p>
            </div>
            <Link href={`/closings/${loan.id}`} className="text-[12px] text-[var(--color-primary)] hover:underline">
              Open closing package →
            </Link>
          </div>
          <table className="w-full">
            <tbody>
              {loan.documents.map((d) => (
                <tr key={d.name} className="hairline-b last:border-b-0">
                  <td className="px-5 py-3 text-[13px] flex items-center gap-2">
                    <svg className="w-4 h-4 text-[var(--color-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9l-6-6H7a2 2 0 00-2 2v16a2 2 0 002 2z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 3v6h6" />
                    </svg>
                    {d.name}
                    {d.required && <span className="text-[10px] uppercase tracking-[0.12em] text-[var(--color-muted)]">Required</span>}
                  </td>
                  <td className="px-5 py-3 text-[12px] text-[var(--color-muted)] text-right">{d.date ? formatDate(d.date) : "—"}</td>
                  <td className="px-5 py-3 text-right">
                    <StatusBadge status={d.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Shell>
  );
}

function Detail({ label, value, tone }: { label: string; value: string; tone?: "danger" }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.12em] text-[var(--color-muted)]">{label}</p>
      <p className={`mt-1 tabular font-medium ${tone === "danger" ? "text-[var(--color-danger)]" : "text-[var(--color-ink)]"}`}>{value}</p>
    </div>
  );
}

function Th({ children, align = "left" }: { children: React.ReactNode; align?: "left" | "right" }) {
  return (
    <th className={`px-4 py-3 text-[10px] uppercase tracking-[0.12em] text-[var(--color-muted)] font-medium ${align === "right" ? "text-right" : "text-left"}`}>
      {children}
    </th>
  );
}

function PaymentStatusLabel({ p }: { p: { status: string; daysLate?: number; overpaidAmount?: number } }) {
  if (p.status === "late") return <span className="text-[12px] font-medium text-[var(--color-danger)]">⚑ {p.daysLate} days late</span>;
  if (p.status === "overpaid") return <span className="text-[12px] font-medium text-[var(--color-info)]">+ {formatCurrency(p.overpaidAmount || 0)} overpaid</span>;
  return <StatusBadge status={p.status} />;
}

function loanTypeLabel(t: string) {
  return ({ interest_only: "Interest-Only", amortizing: "Amortizing", balloon: "Balloon", bridge: "Bridge" } as Record<string, string>)[t] || t;
}
