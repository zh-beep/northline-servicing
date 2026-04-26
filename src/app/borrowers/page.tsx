"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Shell, StatusBadge, formatCurrency } from "@/components/Shell";
import { borrowers, searchBorrowers } from "@/lib/data";

type View = "card" | "table";
type StatusFilter = "all" | "approved" | "underwriting" | "pending" | "declined";

export default function BorrowersPage() {
  const [query, setQuery] = useState("");
  const [view, setView] = useState<View>("card");
  const [status, setStatus] = useState<StatusFilter>("all");

  const results = useMemo(() => {
    let r = searchBorrowers(query);
    if (status !== "all") r = r.filter((b) => b.applicationStatus === status);
    return r;
  }, [query, status]);

  return (
    <Shell title="Borrowers" subtitle={`${results.length} of ${borrowers.length} borrowers · click to view profile`}>
      <div className="px-8 py-6 space-y-4">
        {/* Filters */}
        <div className="bg-[var(--color-surface)] hairline rounded-lg p-3 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[260px]">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, entity, email, or borrower ID"
              className="w-full pl-9 pr-3 py-2 bg-[var(--color-surface-soft)] hairline rounded-md text-[13px] focus:border-[var(--color-primary)] focus:bg-[var(--color-surface)] outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-[0.12em] text-[var(--color-muted)]">Status</span>
            <div className="flex hairline rounded-md overflow-hidden">
              {(["all", "approved", "underwriting", "pending", "declined"] as StatusFilter[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`px-3 py-1.5 text-[12px] capitalize cursor-pointer transition ${
                    status === s
                      ? "bg-[var(--color-primary)] text-[var(--color-bg)]"
                      : "bg-[var(--color-surface)] hover:bg-[var(--color-primary-tint)] text-[var(--color-ink-soft)]"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex hairline rounded-md overflow-hidden ml-auto">
            <button onClick={() => setView("card")} className={`px-3 py-1.5 text-[12px] cursor-pointer transition ${view === "card" ? "bg-[var(--color-primary)] text-[var(--color-bg)]" : "bg-[var(--color-surface)] text-[var(--color-ink-soft)]"}`}>
              Cards
            </button>
            <button onClick={() => setView("table")} className={`px-3 py-1.5 text-[12px] cursor-pointer transition ${view === "table" ? "bg-[var(--color-primary)] text-[var(--color-bg)]" : "bg-[var(--color-surface)] text-[var(--color-ink-soft)]"}`}>
              Table
            </button>
          </div>

          <Link href="/applications/new" className="px-3 py-1.5 bg-[var(--color-primary)] text-[var(--color-bg)] rounded-md text-[12px] font-medium hover:bg-[var(--color-primary-mid)] transition">
            + New Application
          </Link>
        </div>

        {/* Results */}
        {view === "card" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {results.map((b) => <BorrowerCard key={b.id} b={b} />)}
            {results.length === 0 && (
              <div className="col-span-full bg-[var(--color-surface)] hairline rounded-lg p-12 text-center text-[13px] text-[var(--color-muted)]">
                No borrowers match your filters.
              </div>
            )}
          </div>
        ) : (
          <div className="bg-[var(--color-surface)] hairline rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="hairline-b bg-[var(--color-surface-soft)]">
                  <th className="px-4 py-3 text-left text-[10px] uppercase tracking-[0.12em] text-[var(--color-muted)] font-medium">Borrower</th>
                  <th className="px-4 py-3 text-left text-[10px] uppercase tracking-[0.12em] text-[var(--color-muted)] font-medium">Entity</th>
                  <th className="px-4 py-3 text-left text-[10px] uppercase tracking-[0.12em] text-[var(--color-muted)] font-medium">Status</th>
                  <th className="px-4 py-3 text-right text-[10px] uppercase tracking-[0.12em] text-[var(--color-muted)] font-medium">Risk</th>
                  <th className="px-4 py-3 text-right text-[10px] uppercase tracking-[0.12em] text-[var(--color-muted)] font-medium">Outstanding</th>
                  <th className="px-4 py-3 text-right text-[10px] uppercase tracking-[0.12em] text-[var(--color-muted)] font-medium">Loans</th>
                  <th className="px-4 py-3 text-right text-[10px] uppercase tracking-[0.12em] text-[var(--color-muted)] font-medium">Flags</th>
                </tr>
              </thead>
              <tbody>
                {results.map((b) => (
                  <tr key={b.id} className="hairline-b last:border-b-0 hover:bg-[var(--color-surface-soft)] transition">
                    <td className="px-4 py-3 text-[13px]">
                      <Link href={`/borrower/${b.id}`} className="font-medium hover:text-[var(--color-primary)]">
                        {b.firstName} {b.lastName}
                      </Link>
                      <p className="text-[11px] text-[var(--color-muted)]">{b.email}</p>
                    </td>
                    <td className="px-4 py-3 text-[13px] text-[var(--color-ink-soft)]">
                      {b.entityName ?? "—"}
                      <p className="text-[11px] text-[var(--color-muted)]">{b.entityType}</p>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={b.applicationStatus === "approved" ? "current" : b.applicationStatus === "declined" ? "default" : b.applicationStatus === "underwriting" ? "past_due" : "pending"} label={b.applicationStatus} /></td>
                    <td className={`px-4 py-3 text-right text-[14px] tabular font-display font-medium ${riskColor(b.riskLevel)}`}>{b.riskScore}</td>
                    <td className="px-4 py-3 text-right text-[13px] tabular">{formatCurrency(b.totalOutstanding, { compact: true })}</td>
                    <td className="px-4 py-3 text-right text-[13px] tabular">{b.activeLoans}</td>
                    <td className="px-4 py-3 text-right text-[13px] tabular">
                      {b.flaggedIssues.length > 0
                        ? <span className="text-[var(--color-danger)] font-medium">{b.flaggedIssues.length}</span>
                        : <span className="text-[var(--color-muted)]">0</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Shell>
  );
}

function BorrowerCard({ b }: { b: ReturnType<typeof searchBorrowers>[number] }) {
  return (
    <Link href={`/borrower/${b.id}`} className="group block bg-[var(--color-surface)] hairline rounded-lg p-5 hover:border-[var(--color-primary)] transition">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)] flex items-center justify-center text-[12px] font-semibold shrink-0">
            {b.firstName[0]}{b.lastName[0]}
          </div>
          <div className="min-w-0">
            <h3 className="font-display text-[16px] font-medium leading-tight truncate group-hover:text-[var(--color-primary)] transition">
              {b.firstName} {b.lastName}
            </h3>
            <p className="text-[11px] text-[var(--color-muted)] truncate">{b.entityName} · {b.entityType}</p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[10px] uppercase tracking-[0.1em] text-[var(--color-muted)]">Risk</p>
          <p className={`font-display text-[20px] tabular font-medium leading-none mt-0.5 ${riskColor(b.riskLevel)}`}>{b.riskScore}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-5 text-[12px]">
        <div>
          <p className="text-[10px] uppercase tracking-[0.1em] text-[var(--color-muted)]">Outstanding</p>
          <p className="tabular font-display text-[15px] font-medium mt-0.5">{formatCurrency(b.totalOutstanding, { compact: true })}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.1em] text-[var(--color-muted)]">Active Loans</p>
          <p className="tabular font-display text-[15px] font-medium mt-0.5">{b.activeLoans}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.1em] text-[var(--color-muted)]">Annual Income</p>
          <p className="tabular font-medium mt-0.5">{formatCurrency(b.annualIncome, { compact: true })}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.1em] text-[var(--color-muted)]">Liquid Assets</p>
          <p className="tabular font-medium mt-0.5">{formatCurrency(b.liquidAssets, { compact: true })}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 pt-4 hairline-t">
        <StatusBadge status={b.applicationStatus === "approved" ? "current" : b.applicationStatus === "declined" ? "default" : b.applicationStatus === "underwriting" ? "past_due" : "pending"} label={b.applicationStatus.charAt(0).toUpperCase() + b.applicationStatus.slice(1)} />
        <span className={`text-[11px] ${b.idVerified ? "text-[var(--color-success)]" : "text-[var(--color-warning)]"}`}>
          ID {b.idVerified ? "verified" : "pending"}
        </span>
        <span className={`text-[11px] ${
          b.backgroundCheck === "passed" ? "text-[var(--color-success)]" :
          b.backgroundCheck === "flagged" ? "text-[var(--color-danger)]" :
          "text-[var(--color-warning)]"
        }`}>
          BG: {b.backgroundCheck}
        </span>
        {b.flaggedIssues.length > 0 && (
          <span className="text-[11px] text-[var(--color-danger)] font-medium">
            ⚑ {b.flaggedIssues.length} issue{b.flaggedIssues.length > 1 ? "s" : ""}
          </span>
        )}
      </div>
    </Link>
  );
}

function riskColor(level: string) {
  return level === "low" ? "text-[var(--color-success)]"
    : level === "medium" ? "text-[var(--color-warning)]"
    : "text-[var(--color-danger)]";
}
