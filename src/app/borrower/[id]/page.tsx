"use client";

import { use } from "react";
import Link from "next/link";
import { Shell, StatusBadge, MetricCard, formatCurrency, formatDate } from "@/components/Shell";
import { getBorrowerById } from "@/lib/data";

export default function BorrowerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const b = getBorrowerById(id);

  if (!b) {
    return (
      <Shell title="Borrower not found">
        <div className="p-12 text-center">
          <Link href="/borrowers" className="text-[var(--color-primary)] hover:underline">← Back to Borrowers</Link>
        </div>
      </Shell>
    );
  }

  // Aggregate payments across all loans for journey
  const allPayments = b.loans
    .flatMap((l) => l.payments.map((p) => ({ ...p, loan: l })))
    .sort((a, b) => b.date.localeCompare(a.date));

  // Aggregate guarantors with their own outstanding loans (showing whether risky)
  const guarantorsByName = new Map<string, ReturnType<typeof aggregateGuarantor>>();
  for (const loan of b.loans) {
    for (const g of loan.guarantors) {
      if (!guarantorsByName.has(g.name)) {
        guarantorsByName.set(g.name, aggregateGuarantor(g));
      }
      const agg = guarantorsByName.get(g.name)!;
      agg.guaranteeingLoans.push(loan.id);
    }
  }

  return (
    <Shell
      title={`${b.firstName} ${b.lastName}`}
      subtitle={`${b.id} · ${b.entityName ?? b.entityType} · joined ${formatDate(b.joined)}`}
      action={
        <div className="flex items-center gap-2">
          <Link href="/borrowers" className="text-[12px] text-[var(--color-muted)] hover:text-[var(--color-primary)]">← All borrowers</Link>
        </div>
      }
    >
      <div className="px-8 py-6 space-y-6">
        {/* Profile header */}
        <div className="bg-[var(--color-surface)] hairline rounded-lg p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-[var(--color-primary)] text-[var(--color-bg)] flex items-center justify-center font-display text-[22px] font-semibold shrink-0">
                {b.firstName[0]}{b.lastName[0]}
              </div>
              <div>
                <h2 className="font-display text-[26px] font-medium tracking-tight">{b.firstName} {b.lastName}</h2>
                <p className="text-[13px] text-[var(--color-muted)] mt-0.5">{b.entityName} · {b.entityType}</p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2 text-[12px]">
                  <span className="text-[var(--color-ink-soft)]">{b.email}</span>
                  <span className="text-[var(--color-muted)]">·</span>
                  <span className="text-[var(--color-ink-soft)]">{b.phone}</span>
                  <span className="text-[var(--color-muted)]">·</span>
                  <span className="text-[var(--color-ink-soft)]">{b.homeAddress}</span>
                </div>
                <div className="flex flex-wrap items-center gap-3 mt-3">
                  <StatusBadge status={b.applicationStatus === "approved" ? "current" : b.applicationStatus === "declined" ? "default" : b.applicationStatus === "underwriting" ? "past_due" : "pending"} label={b.applicationStatus.charAt(0).toUpperCase() + b.applicationStatus.slice(1)} />
                  <span className={`text-[12px] ${b.idVerified ? "text-[var(--color-success)]" : "text-[var(--color-warning)]"}`}>
                    ID {b.idVerified ? "verified" : "pending"}
                  </span>
                  <span className={`text-[12px] ${
                    b.backgroundCheck === "passed" ? "text-[var(--color-success)]" :
                    b.backgroundCheck === "flagged" ? "text-[var(--color-danger)]" :
                    "text-[var(--color-warning)]"
                  }`}>
                    Background: {b.backgroundCheck}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-[0.12em] text-[var(--color-muted)]">Risk Score</p>
                <p className={`font-display text-[44px] font-medium tabular leading-none mt-1 ${
                  b.riskLevel === "low" ? "text-[var(--color-success)]" :
                  b.riskLevel === "medium" ? "text-[var(--color-warning)]" :
                  "text-[var(--color-danger)]"
                }`}>{b.riskScore}</p>
                <p className="text-[11px] text-[var(--color-muted)] mt-1 capitalize">{b.riskLevel} risk</p>
              </div>
            </div>
          </div>
        </div>

        {/* Flagged issues */}
        {b.flaggedIssues.length > 0 && (
          <div className="bg-[var(--color-surface)] hairline rounded-lg border-l-2 border-l-[var(--color-danger)]">
            <div className="px-5 py-4 hairline-b flex items-center justify-between">
              <div>
                <h3 className="font-display text-[16px] font-medium">Flagged issues</h3>
                <p className="text-[11px] text-[var(--color-muted)] mt-0.5">{b.flaggedIssues.length} active flag{b.flaggedIssues.length > 1 ? "s" : ""}</p>
              </div>
            </div>
            <ul className="divide-y divide-[var(--color-border-soft)]">
              {b.flaggedIssues.map((f, i) => (
                <li key={i} className="px-5 py-3 flex items-start gap-3">
                  <span className="status-dot mt-2" style={{
                    background: f.severity === "high" ? "var(--color-danger)" : f.severity === "medium" ? "var(--color-warning)" : "var(--color-muted)"
                  }} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase tracking-[0.12em] text-[var(--color-muted)]">{f.category}</span>
                      <span className="text-[10px] uppercase tracking-[0.12em] text-[var(--color-muted)]">·</span>
                      <span className={`text-[10px] uppercase tracking-[0.12em] font-medium ${
                        f.severity === "high" ? "text-[var(--color-danger)]" : f.severity === "medium" ? "text-[var(--color-warning)]" : "text-[var(--color-muted)]"
                      }`}>{f.severity}</span>
                    </div>
                    <p className="text-[13px] mt-1">{f.message}</p>
                  </div>
                  <p className="text-[11px] text-[var(--color-muted)]">{formatDate(f.date)}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Summary metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard label="Total Outstanding" value={formatCurrency(b.totalOutstanding, { compact: true })} sub={`${formatCurrency(b.totalBorrowed, { compact: true })} originated`} />
          <MetricCard label="Active Loans" value={String(b.activeLoans)} sub="across all servicers" />
          <MetricCard label="Annual Income" value={formatCurrency(b.annualIncome, { compact: true })} sub={`Liquid: ${formatCurrency(b.liquidAssets, { compact: true })}`} />
          <MetricCard label="Tenure" value={tenureLabel(b.joined)} sub={`Joined ${formatDate(b.joined)}`} />
        </div>

        {/* Loans */}
        <div className="bg-[var(--color-surface)] hairline rounded-lg">
          <div className="px-5 py-4 hairline-b flex items-center justify-between">
            <h3 className="font-display text-[16px] font-medium">Loans on file</h3>
            <span className="text-[11px] text-[var(--color-muted)]">Click to manage</span>
          </div>
          <div className="divide-y divide-[var(--color-border-soft)]">
            {b.loans.length === 0 ? (
              <p className="px-5 py-6 text-[13px] text-[var(--color-muted)]">No loans on file. This applicant is in {b.applicationStatus}.</p>
            ) : b.loans.map((loan) => (
              <Link key={loan.id} href={`/loans/${loan.id}`} className="block px-5 py-4 hover:bg-[var(--color-surface-soft)] transition">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-mono text-[12px] text-[var(--color-primary)]">{loan.id}</span>
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded-sm text-[10px] font-medium uppercase tracking-[0.08em] ${
                        loan.source === "internal" ? "bg-[var(--color-primary-tint)] text-[var(--color-primary)]" : "bg-[var(--color-border-soft)] text-[var(--color-ink-soft)]"
                      }`}>
                        {loan.source}
                      </span>
                      <span className="text-[10px] uppercase tracking-[0.1em] text-[var(--color-muted)]">{loan.lien} lien</span>
                      <StatusBadge status={loan.status} />
                    </div>
                    <p className="text-[13px] font-medium truncate">{loan.collateralAddress}</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <Stat label="Balance" value={formatCurrency(loan.currentBalance, { compact: true })} />
                    <Stat label="Rate / Term" value={`${loan.interestRate}% · ${loan.termMonths}mo`} />
                    <Stat label="Type" value={loanTypeLabel(loan.loanType)} />
                    <Stat label={loan.daysDelinquent > 0 ? "Days late" : "Next due"} value={loan.daysDelinquent > 0 ? `${loan.daysDelinquent}` : formatDate(loan.nextPaymentDue)} tone={loan.daysDelinquent > 0 ? "danger" : undefined} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Guarantors aggregate */}
        {guarantorsByName.size > 0 && (
          <div className="bg-[var(--color-surface)] hairline rounded-lg">
            <div className="px-5 py-4 hairline-b">
              <h3 className="font-display text-[16px] font-medium">Guarantors &amp; co-signers</h3>
              <p className="text-[11px] text-[var(--color-muted)] mt-0.5">Includes their own outstanding obligations across the portfolio</p>
            </div>
            <table className="w-full">
              <thead>
                <tr className="hairline-b bg-[var(--color-surface-soft)]">
                  <th className="px-4 py-3 text-left text-[10px] uppercase tracking-[0.12em] text-[var(--color-muted)] font-medium">Name</th>
                  <th className="px-4 py-3 text-left text-[10px] uppercase tracking-[0.12em] text-[var(--color-muted)] font-medium">Relationship</th>
                  <th className="px-4 py-3 text-right text-[10px] uppercase tracking-[0.12em] text-[var(--color-muted)] font-medium">Risk</th>
                  <th className="px-4 py-3 text-right text-[10px] uppercase tracking-[0.12em] text-[var(--color-muted)] font-medium">Their loans</th>
                  <th className="px-4 py-3 text-right text-[10px] uppercase tracking-[0.12em] text-[var(--color-muted)] font-medium">Total guaranteed</th>
                  <th className="px-4 py-3 text-left text-[10px] uppercase tracking-[0.12em] text-[var(--color-muted)] font-medium">Guaranteeing</th>
                  <th className="px-4 py-3 text-left text-[10px] uppercase tracking-[0.12em] text-[var(--color-muted)] font-medium">Flag</th>
                </tr>
              </thead>
              <tbody>
                {[...guarantorsByName.values()].map((g) => (
                  <tr key={g.name} className="hairline-b last:border-b-0">
                    <td className="px-4 py-3 text-[13px] font-medium">{g.name}</td>
                    <td className="px-4 py-3 text-[12px] text-[var(--color-ink-soft)]">{g.relationship}</td>
                    <td className={`px-4 py-3 text-right text-[14px] tabular font-display font-medium ${
                      g.riskLevel === "low" ? "text-[var(--color-success)]" :
                      g.riskLevel === "medium" ? "text-[var(--color-warning)]" :
                      "text-[var(--color-danger)]"
                    }`}>{g.riskScore}</td>
                    <td className="px-4 py-3 text-right text-[13px] tabular">{g.outstandingLoans}</td>
                    <td className="px-4 py-3 text-right text-[13px] tabular">{formatCurrency(g.totalGuaranteed, { compact: true })}</td>
                    <td className="px-4 py-3 text-[12px] text-[var(--color-ink-soft)] font-mono">{g.guaranteeingLoans.join(", ")}</td>
                    <td className="px-4 py-3 text-[12px]">
                      {g.flagged
                        ? <span className="text-[var(--color-danger)] font-medium">⚑ {g.flagReason}</span>
                        : <span className="text-[var(--color-muted)]">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Payment journey across loans */}
        {allPayments.length > 0 && (
          <div className="bg-[var(--color-surface)] hairline rounded-lg overflow-hidden">
            <div className="px-5 py-4 hairline-b flex items-center justify-between">
              <div>
                <h3 className="font-display text-[16px] font-medium">Payment history</h3>
                <p className="text-[11px] text-[var(--color-muted)] mt-0.5">Across all loans · most recent first</p>
              </div>
            </div>
            <table className="w-full">
              <thead>
                <tr className="hairline-b bg-[var(--color-surface-soft)]">
                  <th className="px-4 py-3 text-left text-[10px] uppercase tracking-[0.12em] text-[var(--color-muted)] font-medium">Due</th>
                  <th className="px-4 py-3 text-left text-[10px] uppercase tracking-[0.12em] text-[var(--color-muted)] font-medium">Loan</th>
                  <th className="px-4 py-3 text-right text-[10px] uppercase tracking-[0.12em] text-[var(--color-muted)] font-medium">Scheduled</th>
                  <th className="px-4 py-3 text-right text-[10px] uppercase tracking-[0.12em] text-[var(--color-muted)] font-medium">Received</th>
                  <th className="px-4 py-3 text-left text-[10px] uppercase tracking-[0.12em] text-[var(--color-muted)] font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {allPayments.slice(0, 12).map((p) => (
                  <tr key={p.id} className="hairline-b last:border-b-0">
                    <td className="px-4 py-3 text-[13px]">{formatDate(p.date)}</td>
                    <td className="px-4 py-3 text-[12px] font-mono text-[var(--color-primary)]">
                      <Link href={`/loans/${p.loan.id}`} className="hover:underline">{p.loan.id}</Link>
                    </td>
                    <td className="px-4 py-3 text-[13px] text-right tabular text-[var(--color-ink-soft)]">{formatCurrency(p.scheduled)}</td>
                    <td className="px-4 py-3 text-[13px] text-right tabular font-medium">{p.received > 0 ? formatCurrency(p.received) : <span className="text-[var(--color-muted)]">—</span>}</td>
                    <td className="px-4 py-3 text-[12px]">
                      {p.status === "late" ? <span className="text-[var(--color-danger)] font-medium">{p.daysLate} days late</span>
                       : p.status === "overpaid" ? <span className="text-[var(--color-info)] font-medium">+{formatCurrency(p.overpaidAmount || 0)} overpaid</span>
                       : <StatusBadge status={p.status} />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Documents & Income */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-[var(--color-surface)] hairline rounded-lg">
            <div className="px-5 py-4 hairline-b flex items-center justify-between">
              <div>
                <h3 className="font-display text-[16px] font-medium">Documents on file</h3>
                <p className="text-[11px] text-[var(--color-muted)] mt-0.5">Underwriting &amp; supporting documentation</p>
              </div>
              <button className="text-[12px] text-[var(--color-primary)] hover:underline cursor-pointer">+ Upload</button>
            </div>
            <ul className="divide-y divide-[var(--color-border-soft)]">
              {b.additionalDocuments.map((d) => (
                <li key={d.name} className="px-5 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-[var(--color-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9l-6-6H7a2 2 0 00-2 2v16a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="text-[13px]">{d.name}</p>
                      {d.date && <p className="text-[11px] text-[var(--color-muted)]">Submitted {formatDate(d.date)}</p>}
                    </div>
                  </div>
                  <StatusBadge status={d.status} />
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[var(--color-surface)] hairline rounded-lg">
            <div className="px-5 py-4 hairline-b">
              <h3 className="font-display text-[16px] font-medium">Income &amp; financials</h3>
              <p className="text-[11px] text-[var(--color-muted)] mt-0.5">Self-reported, supported by documents above</p>
            </div>
            <div className="p-5 grid grid-cols-2 gap-4 text-[13px]">
              <Stat label="Annual Income" value={formatCurrency(b.annualIncome)} />
              <Stat label="Liquid Assets" value={formatCurrency(b.liquidAssets)} />
              <Stat label="DTI Estimate" value={`${Math.round((b.totalOutstanding * 0.12) / b.annualIncome * 100)}%`} />
              <Stat label="Liquidity Coverage" value={`${(b.liquidAssets / Math.max(b.totalOutstanding, 1)).toFixed(2)}x`} />
              <Stat label="SSN" value={b.ssn} />
              {b.ein && <Stat label="EIN" value={b.ein} />}
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}

function aggregateGuarantor(g: { name: string; relationship: string; ssn: string; riskScore: number; riskLevel: "low" | "medium" | "high" | "critical"; outstandingLoans: number; totalGuaranteed: number; flagged: boolean; flagReason?: string }) {
  return {
    name: g.name,
    relationship: g.relationship,
    riskScore: g.riskScore,
    riskLevel: g.riskLevel,
    outstandingLoans: g.outstandingLoans,
    totalGuaranteed: g.totalGuaranteed,
    flagged: g.flagged,
    flagReason: g.flagReason,
    guaranteeingLoans: [] as string[],
  };
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: "danger" }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.12em] text-[var(--color-muted)]">{label}</p>
      <p className={`tabular font-medium mt-0.5 ${tone === "danger" ? "text-[var(--color-danger)]" : ""}`}>{value}</p>
    </div>
  );
}

function loanTypeLabel(t: string) {
  return ({ interest_only: "Interest-Only", amortizing: "Amortizing", balloon: "Balloon", bridge: "Bridge" } as Record<string, string>)[t] || t;
}

function tenureLabel(joined: string) {
  const start = new Date(joined + "T00:00:00").getTime();
  const today = new Date("2026-04-26T00:00:00").getTime();
  const days = Math.round((today - start) / 86_400_000);
  if (days < 60) return `${days} days`;
  const months = Math.round(days / 30);
  if (months < 24) return `${months} mo`;
  return `${(months / 12).toFixed(1)} yrs`;
}
