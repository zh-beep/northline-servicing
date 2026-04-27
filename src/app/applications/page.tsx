"use client";

import Link from "next/link";
import { Shell, StatusBadge, FlagPill, topSeverity, formatCurrency, formatDate } from "@/components/Shell";
import { borrowers } from "@/lib/data";

export default function ApplicationsPage() {
  const pending = borrowers.filter((b) => b.applicationStatus === "pending" || b.applicationStatus === "underwriting");
  const recent = borrowers.filter((b) => b.applicationStatus === "approved").slice(0, 4);

  return (
    <Shell
      title="Applications"
      subtitle="Pending and recently approved applications"
      action={
        <Link href="/applications/new" className="px-3 py-1.5 bg-[var(--color-primary)] text-[var(--color-bg)] rounded-md text-[12px] font-medium hover:bg-[var(--color-primary-mid)] transition">
          + New Application
        </Link>
      }
    >
      <div className="px-8 py-6 space-y-6">
        <div className="bg-[var(--color-surface)] hairline rounded-lg">
          <div className="px-5 py-4 hairline-b flex items-center justify-between">
            <div>
              <h3 className="font-display text-[16px] font-medium">In progress</h3>
              <p className="text-[11px] text-[var(--color-muted)] mt-0.5">{pending.length} application{pending.length === 1 ? "" : "s"} pending decision</p>
            </div>
          </div>
          {pending.length === 0 ? (
            <p className="px-5 py-8 text-[13px] text-[var(--color-muted)] text-center">No applications in progress.</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="hairline-b bg-[var(--color-surface-soft)]">
                  <th className="px-4 py-3 text-left text-[10px] uppercase tracking-[0.12em] text-[var(--color-muted)] font-medium">Applicant</th>
                  <th className="px-4 py-3 text-left text-[10px] uppercase tracking-[0.12em] text-[var(--color-muted)] font-medium">Entity</th>
                  <th className="px-4 py-3 text-left text-[10px] uppercase tracking-[0.12em] text-[var(--color-muted)] font-medium">Flags</th>
                  <th className="px-4 py-3 text-right text-[10px] uppercase tracking-[0.12em] text-[var(--color-muted)] font-medium">Income</th>
                  <th className="px-4 py-3 text-left text-[10px] uppercase tracking-[0.12em] text-[var(--color-muted)] font-medium">Documents</th>
                  <th className="px-4 py-3 text-left text-[10px] uppercase tracking-[0.12em] text-[var(--color-muted)] font-medium">Status</th>
                  <th className="px-4 py-3 text-right text-[10px] uppercase tracking-[0.12em] text-[var(--color-muted)] font-medium">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {pending.map((b) => {
                  const total = b.additionalDocuments.length;
                  const received = b.additionalDocuments.filter((d) => d.status === "received").length;
                  return (
                    <tr key={b.id} className="hairline-b last:border-b-0 hover:bg-[var(--color-surface-soft)] transition">
                      <td className="px-4 py-3 text-[13px]">
                        <Link href={`/borrower/${b.id}`} className="font-medium hover:text-[var(--color-primary)]">{b.firstName} {b.lastName}</Link>
                        <p className="text-[11px] text-[var(--color-muted)]">{b.email}</p>
                      </td>
                      <td className="px-4 py-3 text-[12px] text-[var(--color-ink-soft)]">
                        {b.entityName ?? "—"}
                        <p className="text-[11px] text-[var(--color-muted)]">{b.entityType}</p>
                      </td>
                      <td className="px-4 py-3"><FlagPill count={b.flaggedIssues.length} severity={topSeverity(b.flaggedIssues)} /></td>
                      <td className="px-4 py-3 text-right text-[13px] tabular">{formatCurrency(b.annualIncome, { compact: true })}</td>
                      <td className="px-4 py-3 text-[12px]">
                        <div className="flex items-center gap-2">
                          <span className="tabular text-[var(--color-ink-soft)]">{received} / {total}</span>
                          <div className="w-20 h-1.5 bg-[var(--color-border-soft)] rounded-full overflow-hidden">
                            <div className="h-full bg-[var(--color-primary)]" style={{ width: `${(received / total) * 100}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={b.applicationStatus === "underwriting" ? "past_due" : "pending"} label={b.applicationStatus} /></td>
                      <td className="px-4 py-3 text-right text-[12px] text-[var(--color-muted)]">{formatDate(b.joined)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <div className="bg-[var(--color-surface)] hairline rounded-lg">
          <div className="px-5 py-4 hairline-b flex items-center justify-between">
            <h3 className="font-display text-[16px] font-medium">Recently approved</h3>
            <Link href="/borrowers" className="text-[12px] text-[var(--color-primary)] hover:underline">All borrowers →</Link>
          </div>
          <div className="divide-y divide-[var(--color-border-soft)]">
            {recent.map((b) => (
              <Link key={b.id} href={`/borrower/${b.id}`} className="block px-5 py-3 hover:bg-[var(--color-surface-soft)] transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[13px] font-medium">{b.firstName} {b.lastName} <span className="text-[var(--color-muted)] font-normal">· {b.entityName}</span></p>
                    <p className="text-[11px] text-[var(--color-muted)]">Approved {formatDate(b.joined)} · {b.activeLoans} loans · {formatCurrency(b.totalOutstanding, { compact: true })}</p>
                  </div>
                  <StatusBadge status="current" label="Approved" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}
