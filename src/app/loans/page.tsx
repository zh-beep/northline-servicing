"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Shell, StatusBadge, formatCurrency, formatDate } from "@/components/Shell";
import { borrowers, getAllLoans } from "@/lib/data";

export default function LoansPage() {
  const allLoans = getAllLoans();
  const [query, setQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState<"all" | "internal" | "external">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "current" | "past_due" | "delinquent" | "default">("all");

  const rows = useMemo(() => {
    return allLoans
      .map((l) => {
        const borrower = borrowers.find((b) => b.id === l.borrowerId)!;
        return { loan: l, borrower };
      })
      .filter(({ loan, borrower }) => {
        const q = query.toLowerCase().trim();
        if (q && !`${borrower.firstName} ${borrower.lastName} ${loan.id} ${loan.collateralAddress} ${borrower.entityName ?? ""}`.toLowerCase().includes(q)) return false;
        if (sourceFilter !== "all" && loan.source !== sourceFilter) return false;
        if (statusFilter !== "all" && loan.status !== statusFilter) return false;
        return true;
      });
  }, [allLoans, query, sourceFilter, statusFilter]);

  return (
    <Shell title="Loans" subtitle={`${rows.length} of ${allLoans.length} loans`}>
      <div className="px-8 py-6 space-y-4">
        {/* Filter bar */}
        <div className="bg-[var(--color-surface)] hairline rounded-lg p-3 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search loan #, borrower, address, or entity"
              className="w-full pl-9 pr-3 py-2 bg-[var(--color-surface-soft)] hairline rounded-md text-[13px] focus:border-[var(--color-primary)] focus:bg-[var(--color-surface)] outline-none"
            />
          </div>
          <FilterPills
            label="Source"
            value={sourceFilter}
            options={[
              { value: "all", label: "All" },
              { value: "internal", label: "Internal" },
              { value: "external", label: "External" },
            ]}
            onChange={(v) => setSourceFilter(v as typeof sourceFilter)}
          />
          <FilterPills
            label="Status"
            value={statusFilter}
            options={[
              { value: "all", label: "All" },
              { value: "current", label: "Current" },
              { value: "past_due", label: "Past Due" },
              { value: "delinquent", label: "Delinquent" },
              { value: "default", label: "Default" },
            ]}
            onChange={(v) => setStatusFilter(v as typeof statusFilter)}
          />
        </div>

        {/* Table */}
        <div className="bg-[var(--color-surface)] hairline rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="hairline-b">
                  <Th>Loan #</Th>
                  <Th>Borrower</Th>
                  <Th>Source</Th>
                  <Th>Type</Th>
                  <Th>Lien</Th>
                  <Th align="right">Balance</Th>
                  <Th align="right">Rate</Th>
                  <Th>Next Payment</Th>
                  <Th>Status</Th>
                  <Th align="right">Days</Th>
                </tr>
              </thead>
              <tbody>
                {rows.map(({ loan, borrower }) => (
                  <tr key={loan.id} className="hairline-b last:border-b-0 hover:bg-[var(--color-surface-soft)] transition group">
                    <td className="px-4 py-3 text-[13px] font-mono text-[var(--color-primary)]">
                      <Link href={`/loans/${loan.id}`} className="hover:underline">{loan.id}</Link>
                    </td>
                    <td className="px-4 py-3 text-[13px]">
                      <Link href={`/borrower/${borrower.id}`} className="font-medium hover:text-[var(--color-primary)]">
                        {borrower.firstName} {borrower.lastName}
                      </Link>
                      <p className="text-[11px] text-[var(--color-muted)] truncate max-w-[220px]">{loan.collateralAddress}</p>
                    </td>
                    <td className="px-4 py-3 text-[12px]">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-[11px] font-medium ${
                        loan.source === "internal" ? "bg-[var(--color-primary-tint)] text-[var(--color-primary)]" : "bg-[var(--color-border-soft)] text-[var(--color-ink-soft)]"
                      }`}>
                        {loan.source === "internal" ? "Internal" : "External"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-[var(--color-ink-soft)]">
                      {loanTypeLabel(loan.loanType)}
                      <p className="text-[10px] text-[var(--color-muted)]">{loan.termMonths} mo</p>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-[var(--color-ink-soft)] capitalize">
                      {loan.lien}
                    </td>
                    <td className="px-4 py-3 text-[13px] text-right tabular font-medium">{formatCurrency(loan.currentBalance)}</td>
                    <td className="px-4 py-3 text-[13px] text-right tabular text-[var(--color-ink-soft)]">{loan.interestRate}%</td>
                    <td className="px-4 py-3 text-[12px] text-[var(--color-ink-soft)]">{formatDate(loan.nextPaymentDue)}</td>
                    <td className="px-4 py-3"><StatusBadge status={loan.status} /></td>
                    <td className="px-4 py-3 text-[13px] text-right tabular">
                      {loan.daysDelinquent === 0 ? <span className="text-[var(--color-muted)]">0</span> : <span className="text-[var(--color-danger)] font-medium">{loan.daysDelinquent}</span>}
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={10} className="px-4 py-12 text-center text-[13px] text-[var(--color-muted)]">No loans match the current filters.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Shell>
  );
}

function Th({ children, align = "left" }: { children: React.ReactNode; align?: "left" | "right" }) {
  return (
    <th className={`px-4 py-3 text-[10px] uppercase tracking-[0.12em] text-[var(--color-muted)] font-medium ${align === "right" ? "text-right" : "text-left"}`}>
      {children}
    </th>
  );
}

function FilterPills({ label, value, options, onChange }: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] uppercase tracking-[0.12em] text-[var(--color-muted)]">{label}</span>
      <div className="flex hairline rounded-md overflow-hidden">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`px-3 py-1.5 text-[12px] transition cursor-pointer ${
              value === opt.value
                ? "bg-[var(--color-primary)] text-[var(--color-bg)]"
                : "bg-[var(--color-surface)] hover:bg-[var(--color-primary-tint)] text-[var(--color-ink-soft)]"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function loanTypeLabel(t: string) {
  return ({ interest_only: "Interest-Only", amortizing: "Amortizing", balloon: "Balloon", bridge: "Bridge" } as Record<string, string>)[t] || t;
}
