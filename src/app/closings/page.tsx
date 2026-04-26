"use client";

import Link from "next/link";
import { Shell, StatusBadge, formatCurrency, formatDate } from "@/components/Shell";
import { borrowers } from "@/lib/data";

export default function ClosingsPage() {
  const closings = borrowers.flatMap((b) =>
    b.loans.map((l) => ({
      borrower: b,
      loan: l,
      executed: l.documents.filter((d) => d.status === "executed").length,
      total: l.documents.length,
    }))
  );

  return (
    <Shell title="Closings" subtitle="Loan closing packages — execute, deliver, and track">
      <div className="px-8 py-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {closings.map(({ borrower, loan, executed, total }) => (
            <Link key={loan.id} href={`/closings/${loan.id}`} className="block bg-[var(--color-surface)] hairline rounded-lg p-5 hover:border-[var(--color-primary)] transition group">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="font-mono text-[12px] text-[var(--color-primary)]">{loan.id}</span>
                  <p className="font-display text-[16px] font-medium mt-1 group-hover:text-[var(--color-primary)] transition">
                    {borrower.firstName} {borrower.lastName}
                  </p>
                  <p className="text-[11px] text-[var(--color-muted)]">{borrower.entityName}</p>
                </div>
                <StatusBadge status={executed === total ? "executed" : "pending"} label={executed === total ? "Closed" : "In progress"} />
              </div>
              <p className="text-[12px] text-[var(--color-ink-soft)] truncate mb-4">{loan.collateralAddress}</p>
              <div className="grid grid-cols-2 gap-3 text-[12px]">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.1em] text-[var(--color-muted)]">Funded</p>
                  <p className="tabular font-medium mt-0.5">{formatCurrency(loan.loanAmount, { compact: true })}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.1em] text-[var(--color-muted)]">Closed on</p>
                  <p className="tabular font-medium mt-0.5">{formatDate(loan.originationDate)}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 hairline-t flex items-center justify-between">
                <span className="text-[12px] text-[var(--color-muted)]">{executed} of {total} documents</span>
                <div className="w-20 h-1.5 bg-[var(--color-border-soft)] rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--color-primary)]" style={{ width: `${(executed / total) * 100}%` }} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Shell>
  );
}
