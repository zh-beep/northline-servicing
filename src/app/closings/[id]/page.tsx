"use client";

import { use, useState } from "react";
import Link from "next/link";
import { Shell, StatusBadge, formatCurrency, formatDate } from "@/components/Shell";
import { getLoanById } from "@/lib/data";

export default function ClosingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const result = getLoanById(id);
  const [emailSent, setEmailSent] = useState(false);
  const [showEmail, setShowEmail] = useState(true);

  if (!result) {
    return (
      <Shell title="Closing not found">
        <div className="p-12 text-center">
          <Link href="/closings" className="text-[var(--color-primary)] hover:underline">← All closings</Link>
        </div>
      </Shell>
    );
  }

  const { loan, borrower } = result;
  const closingDocs = loan.documents.filter((d) => isClosingDoc(d.name));
  const executedCount = closingDocs.filter((d) => d.status === "executed").length;

  return (
    <Shell
      title={`Closing — ${loan.id}`}
      subtitle={`${borrower.firstName} ${borrower.lastName} · ${loan.collateralAddress}`}
      action={
        <Link href={`/loans/${loan.id}`} className="text-[12px] text-[var(--color-primary)] hover:underline">
          View loan →
        </Link>
      }
    >
      <div className="px-8 py-6 space-y-6">
        {/* Closing summary */}
        <div className="bg-[var(--color-surface)] hairline rounded-lg p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.12em] text-[var(--color-muted)]">Closing package</p>
              <h2 className="font-display text-[26px] font-medium tracking-tight mt-1">{loanTypeLabel(loan.loanType)} · {loan.lien} lien</h2>
              <p className="text-[13px] text-[var(--color-muted)] mt-1">{closingDocs.length} required documents · {executedCount} executed</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-[0.12em] text-[var(--color-muted)]">Loan amount</p>
              <p className="font-display text-[28px] font-semibold tabular leading-none mt-1">{formatCurrency(loan.loanAmount)}</p>
              <p className="text-[12px] text-[var(--color-muted)] mt-1">Funds {formatDate(loan.originationDate)}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-4 hairline-t text-[13px]">
            <Detail label="Rate" value={`${loan.interestRate}%`} />
            <Detail label="Term" value={`${loan.termMonths} months`} />
            <Detail label="Amortization" value={loan.amortizationMonths ? `${loan.amortizationMonths} mo` : "Interest-Only"} />
            <Detail label="Monthly payment" value={formatCurrency(loan.monthlyPayment)} />
          </div>
        </div>

        {/* Documents grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
          <div className="bg-[var(--color-surface)] hairline rounded-lg">
            <div className="px-5 py-4 hairline-b flex items-center justify-between">
              <div>
                <h3 className="font-display text-[16px] font-medium">Loan documents</h3>
                <p className="text-[11px] text-[var(--color-muted)] mt-0.5">Generated from approved loan terms</p>
              </div>
              <button className="text-[12px] text-[var(--color-primary)] hover:underline">+ Add document</button>
            </div>
            <ul className="divide-y divide-[var(--color-border-soft)]">
              {closingDocs.map((d) => (
                <li key={d.name} className="px-5 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-11 rounded-sm bg-[var(--color-primary-tint)] hairline flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9l-6-6H7a2 2 0 00-2 2v16a2 2 0 002 2z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 3v6h6" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium">{d.name}</p>
                      <p className="text-[11px] text-[var(--color-muted)]">
                        {d.status === "executed"
                          ? `Executed ${d.date ? formatDate(d.date) : ""}`
                          : d.status === "received"
                          ? "Awaiting execution"
                          : "Generated, awaiting review"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={d.status} />
                    <button className="px-3 py-1.5 hairline rounded-md text-[11px] hover:bg-[var(--color-primary-tint)] cursor-pointer">Preview</button>
                    <button className="px-3 py-1.5 hairline rounded-md text-[11px] hover:bg-[var(--color-primary-tint)] cursor-pointer">Download</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Email preview */}
          <div className="bg-[var(--color-surface)] hairline rounded-lg flex flex-col">
            <div className="px-5 py-4 hairline-b flex items-center justify-between">
              <div>
                <h3 className="font-display text-[16px] font-medium">Send to borrower</h3>
                <p className="text-[11px] text-[var(--color-muted)] mt-0.5">Email preview · attachments included</p>
              </div>
              <button onClick={() => setShowEmail(!showEmail)} className="text-[11px] text-[var(--color-muted)] hover:text-[var(--color-primary)] cursor-pointer">
                {showEmail ? "Hide" : "Show"}
              </button>
            </div>

            {showEmail && (
              <div className="p-5 flex-1 flex flex-col">
                <div className="space-y-2 text-[12px] pb-3 hairline-b">
                  <div className="flex">
                    <span className="text-[var(--color-muted)] w-12">From</span>
                    <span className="text-[var(--color-ink-soft)]">closings@northline.com</span>
                  </div>
                  <div className="flex">
                    <span className="text-[var(--color-muted)] w-12">To</span>
                    <span className="text-[var(--color-ink-soft)]">{borrower.email}</span>
                  </div>
                  <div className="flex">
                    <span className="text-[var(--color-muted)] w-12">Cc</span>
                    <span className="text-[var(--color-ink-soft)]">title@escrowco.com</span>
                  </div>
                  <div className="flex">
                    <span className="text-[var(--color-muted)] w-12">Subj.</span>
                    <span className="text-[var(--color-ink-soft)] font-medium">Closing documents — {loan.id} · {loan.collateralAddress}</span>
                  </div>
                </div>

                <div className="mt-4 text-[13px] text-[var(--color-ink-soft)] leading-relaxed space-y-3 flex-1">
                  <p>Dear {borrower.firstName},</p>
                  <p>
                    Attached please find the closing package for loan <span className="font-mono">{loan.id}</span> in
                    the amount of <span className="font-medium">{formatCurrency(loan.loanAmount)}</span>, secured by the
                    property at <em>{loan.collateralAddress}</em>.
                  </p>
                  <p>The package contains the following executed documents:</p>
                  <ul className="list-disc pl-5 space-y-0.5 text-[var(--color-ink-soft)]">
                    {closingDocs.map((d) => <li key={d.name}>{d.name}</li>)}
                  </ul>
                  <p>
                    Please review, sign where indicated, and return via DocuSign within 48 hours. Funding is scheduled
                    for <span className="font-medium">{formatDate(loan.originationDate)}</span>, contingent on receipt of
                    fully executed documents and confirmation of hazard insurance.
                  </p>
                  <p>Reach out to your closing coordinator with any questions.</p>
                  <p className="pt-2">
                    Regards,<br />
                    <span className="font-medium">Tessa Reyes</span><br />
                    <span className="text-[var(--color-muted)]">Director of Closings · Northline Capital</span>
                  </p>
                </div>

                <div className="mt-4 pt-4 hairline-t flex items-center gap-2 text-[11px] text-[var(--color-muted)]">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  {closingDocs.length} attachments
                </div>

                <button
                  onClick={() => setEmailSent(true)}
                  disabled={emailSent}
                  className="mt-4 w-full py-2.5 bg-[var(--color-primary)] text-[var(--color-bg)] rounded-md text-[12px] font-medium hover:bg-[var(--color-primary-mid)] disabled:bg-[var(--color-success)] transition cursor-pointer"
                >
                  {emailSent ? "✓ Email sent to borrower" : "Send closing package"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Shell>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.12em] text-[var(--color-muted)]">{label}</p>
      <p className="tabular font-medium mt-0.5">{value}</p>
    </div>
  );
}

function isClosingDoc(name: string): boolean {
  const closingTerms = ["promissory", "deed", "agreement", "guaranty", "subordination", "schedule", "disclosure", "policy", "certificate", "letter"];
  return closingTerms.some((t) => name.toLowerCase().includes(t));
}

function loanTypeLabel(t: string) {
  return ({ interest_only: "Interest-Only", amortizing: "Amortizing", balloon: "Balloon", bridge: "Bridge" } as Record<string, string>)[t] || t;
}
