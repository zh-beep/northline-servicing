"use client";

import Link from "next/link";
import { Shell } from "@/components/Shell";
import { documentTemplatesByLoanType } from "@/lib/data";

const STAGES = [
  {
    n: "01",
    title: "Application intake",
    description: "Borrower submits a commercial loan application — or your team fills it in on their behalf via the internal-upload mode.",
    actions: ["Borrower personal & entity details", "Loan request: amount, term, type, lien position", "Required documents auto-determined by loan type"],
    cta: { label: "See application form →", href: "/applications/new" },
  },
  {
    n: "02",
    title: "Documents & verification",
    description: "We email a secure upload link and track every document through the underwriting checklist.",
    actions: ["Government-issued ID", "Tax returns (last 2 years)", "Personal financial statement", "Bank statements", "Entity formation docs", "Property appraisal & title report"],
    cta: { label: "View pending applications →", href: "/applications" },
  },
  {
    n: "03",
    title: "Underwriting & approval",
    description: "Decision-makers review the deal, run background and entity checks, and flag issues that need attention.",
    actions: ["Background check passed/flagged", "Identity verified", "Lien position confirmed", "Guarantor obligations cross-checked"],
    cta: { label: "View borrower profile →", href: "/borrower/BRW-002" },
  },
  {
    n: "04",
    title: "Closing package",
    description: "On approval, the closing package is generated automatically and emailed to the borrower for execution.",
    actions: ["Documents auto-tailored to loan type", "DocuSign-ready packet", "Cc title/escrow company", "Funding confirmed once countersigned"],
    cta: { label: "Open closing package →", href: "/closings/LN-10421" },
  },
  {
    n: "05",
    title: "Servicing & monitoring",
    description: "Once funded, every loan flows into the servicing dashboard. Track payments, AR aging, delinquencies, and management activity.",
    actions: ["AR aging: 30 / 60 / 90+", "Paid vs unpaid this month", "Late fees and default notices", "Internal vs external loan distinction"],
    cta: { label: "Open overview →", href: "/dashboard" },
  },
];

const ALL_DOCUMENTS = [
  {
    group: "Underwriting (collected from borrower)",
    items: [
      { name: "Government-Issued Photo ID", purpose: "Identity verification (KYC)" },
      { name: "Federal Tax Returns (last 2 years)", purpose: "Income substantiation" },
      { name: "Personal Financial Statement", purpose: "Net-worth & liquidity assessment" },
      { name: "Bank Statements (3—6 months)", purpose: "Cash-flow verification" },
      { name: "Entity Documents", purpose: "LLC/Corp/Partnership formation, operating agreement" },
      { name: "Property Appraisal / BPO", purpose: "Collateral valuation" },
      { name: "Title Report", purpose: "Lien priority confirmation" },
      { name: "Hazard Insurance Certificate", purpose: "Collateral protection" },
      { name: "Take-Out Commitment Letter", purpose: "Bridge loans only — exit strategy proof" },
      { name: "DSCR Analysis", purpose: "Amortizing loans — debt service coverage" },
    ],
  },
  {
    group: "Closing package (sent to borrower for signature)",
    items: [
      { name: "Promissory Note", purpose: "Borrower's promise to repay; sets rate, term, payment schedule" },
      { name: "Deed of Trust / Mortgage", purpose: "Records lender's lien against collateral property" },
      { name: "Loan Agreement", purpose: "Master agreement covering covenants, defaults, remedies" },
      { name: "Security Agreement", purpose: "Pledges any non-real-estate collateral" },
      { name: "Personal Guaranty", purpose: "Principal's personal obligation to repay" },
      { name: "Subordination Agreement", purpose: "Junior liens — confirms priority" },
      { name: "Balloon Disclosure", purpose: "Required for balloon-payment loans" },
      { name: "Title Insurance Policy", purpose: "Protects against title defects" },
    ],
  },
  {
    group: "Ongoing servicing (sent by lender)",
    items: [
      { name: "Payment Confirmations", purpose: "Receipt of each payment, with reference number" },
      { name: "Late Payment Notice", purpose: "Sent when payment is past due (auto-generated)" },
      { name: "Default Notice", purpose: "After 30+ days delinquent" },
      { name: "Notice of Acceleration", purpose: "Demand for full balance due upon material default" },
      { name: "Maturity / Payoff Statement", purpose: "Issued near term-end with payoff figures" },
      { name: "Lien Release / Reconveyance", purpose: "After loan is paid in full" },
    ],
  },
];

const LOAN_TYPE_LABELS: Record<string, string> = {
  interest_only: "Interest-Only",
  amortizing: "Amortizing",
  balloon: "Balloon",
  bridge: "Bridge",
};

export default function DemoPage() {
  return (
    <Shell
      title="How Northline works"
      subtitle="A guided tour of the platform, end-to-end — from intake through servicing"
      action={
        <Link href="/dashboard" className="text-[12px] text-[var(--color-primary)] hover:underline">
          Skip to dashboard →
        </Link>
      }
    >
      <div className="px-8 py-8 space-y-12 max-w-[1100px]">
        {/* Hero */}
        <section className="bg-[var(--color-primary)] text-[var(--color-bg)] rounded-lg p-10 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#a8b6a8]">The journey</p>
            <h2 className="font-display text-[42px] leading-[1.05] mt-3">
              From application to payoff,<br />
              <em>tracked in one place.</em>
            </h2>
            <p className="text-[14px] text-[#cdd9cd] mt-5 max-w-lg leading-relaxed">
              Northline gives commercial lenders one system of record for the entire borrower lifecycle —
              intake, underwriting, closing, and servicing. This walkthrough shows what gets done at each
              step and exactly which documents move between you and the borrower.
            </p>
          </div>
          <svg className="absolute -right-16 -bottom-16 w-[500px] h-[500px] opacity-[0.06]" viewBox="0 0 100 100" fill="none">
            <path d="M10 90 L10 10 L90 90 L90 10" stroke="#f4f1e8" strokeWidth="0.6" />
            <path d="M25 75 L25 25 L75 75 L75 25" stroke="#f4f1e8" strokeWidth="0.6" />
            <path d="M40 60 L40 40 L60 60 L60 40" stroke="#f4f1e8" strokeWidth="0.6" />
          </svg>
        </section>

        {/* Stages */}
        <section>
          <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-muted)]">Five stages</p>
          <h3 className="font-display text-[28px] mt-2">The borrower lifecycle</h3>
          <p className="text-[13px] text-[var(--color-muted)] mt-2 max-w-2xl">
            Every loan moves through these five stages. Click any link to jump straight to the live page.
          </p>

          <ol className="mt-8 space-y-4">
            {STAGES.map((stage, i) => (
              <li key={stage.n} className="bg-[var(--color-surface)] hairline rounded-lg p-6 grid grid-cols-1 md:grid-cols-[120px_1fr_auto] gap-6 items-start">
                <div>
                  <p className="font-display text-[44px] text-[var(--color-primary)] leading-none">{stage.n}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="status-dot" style={{ background: "var(--color-primary)" }} />
                    <span className="text-[10px] uppercase tracking-[0.14em] text-[var(--color-muted)]">Stage {i + 1}</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-display text-[22px]">{stage.title}</h4>
                  <p className="text-[13px] text-[var(--color-ink-soft)] mt-2 leading-relaxed">{stage.description}</p>
                  <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
                    {stage.actions.map((a) => (
                      <li key={a} className="flex items-start gap-2 text-[12px] text-[var(--color-ink-soft)]">
                        <svg className="w-3.5 h-3.5 mt-0.5 text-[var(--color-primary)] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href={stage.cta.href} className="text-[12px] text-[var(--color-primary)] hover:underline whitespace-nowrap">
                  {stage.cta.label}
                </Link>
              </li>
            ))}
          </ol>
        </section>

        {/* Email example */}
        <section>
          <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-muted)]">Sample communication</p>
          <h3 className="font-display text-[28px] mt-2">Closing email — what the borrower receives</h3>
          <p className="text-[13px] text-[var(--color-muted)] mt-2 max-w-2xl">
            On approval, this email is auto-generated with all closing documents attached and ready for DocuSign.
            One click sends it.
          </p>

          <div className="mt-6 bg-[var(--color-surface)] hairline rounded-lg overflow-hidden max-w-3xl">
            <div className="px-5 py-3 bg-[var(--color-surface-soft)] hairline-b text-[12px] space-y-1">
              <div className="flex"><span className="text-[var(--color-muted)] w-14">From</span><span>closings@northline.com</span></div>
              <div className="flex"><span className="text-[var(--color-muted)] w-14">To</span><span>marcus.johnson@blackstoneholdings.co</span></div>
              <div className="flex"><span className="text-[var(--color-muted)] w-14">Cc</span><span>title@firstamericanescrow.com</span></div>
              <div className="flex"><span className="text-[var(--color-muted)] w-14">Subj.</span><span className="font-medium">Closing documents — LN-10421 · 1847 Oakwood Dr, Austin, TX</span></div>
            </div>
            <div className="px-5 py-5 text-[13px] leading-relaxed space-y-3 text-[var(--color-ink-soft)]">
              <p>Dear Marcus,</p>
              <p>
                Attached please find the closing package for loan <span className="font-mono">LN-10421</span> in the
                amount of <span className="font-medium">$1,200,000</span>, secured by the property at
                <em> 1847 Oakwood Dr, Austin, TX 78704</em>.
              </p>
              <p>The package contains the following executed documents:</p>
              <ul className="list-disc pl-5 space-y-0.5">
                <li>Promissory Note</li>
                <li>Deed of Trust</li>
                <li>Loan Agreement</li>
                <li>Security Agreement</li>
                <li>Personal Guaranty</li>
                <li>Title Insurance Policy</li>
                <li>Hazard Insurance Certificate</li>
              </ul>
              <p>
                Please review, sign where indicated, and return via DocuSign within 48 hours. Funding is scheduled
                for <span className="font-medium">Aug 15, 2025</span>, contingent on receipt of fully executed
                documents and confirmation of hazard insurance.
              </p>
              <p>Reach out to your closing coordinator with any questions.</p>
              <p className="pt-2">Regards,<br /><span className="font-medium">Tessa Reyes</span><br /><span className="text-[var(--color-muted)]">Director of Closings · Northline Capital</span></p>
            </div>
            <div className="px-5 py-3 hairline-t flex items-center gap-2 text-[11px] text-[var(--color-muted)]">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              7 attachments · 2.4 MB · DocuSign envelope ready
            </div>
          </div>
        </section>

        {/* All documents */}
        <section>
          <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-muted)]">Complete document catalogue</p>
          <h3 className="font-display text-[28px] mt-2">Every document the platform sends</h3>
          <p className="text-[13px] text-[var(--color-muted)] mt-2 max-w-2xl">
            Across the borrower lifecycle, these are the documents Northline collects, generates, and dispatches —
            either to the borrower, the title company, or for internal records.
          </p>

          <div className="mt-6 space-y-4">
            {ALL_DOCUMENTS.map((g) => (
              <div key={g.group} className="bg-[var(--color-surface)] hairline rounded-lg">
                <div className="px-5 py-3 hairline-b">
                  <h4 className="font-display text-[18px]">{g.group}</h4>
                </div>
                <ul className="divide-y divide-[var(--color-border-soft)]">
                  {g.items.map((d) => (
                    <li key={d.name} className="px-5 py-3 grid grid-cols-1 md:grid-cols-[280px_1fr] gap-2 md:gap-6">
                      <p className="text-[13px] font-medium">{d.name}</p>
                      <p className="text-[13px] text-[var(--color-muted)]">{d.purpose}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Documents by loan type */}
        <section>
          <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-muted)]">Templates by loan type</p>
          <h3 className="font-display text-[28px] mt-2">Required documents change by product</h3>
          <p className="text-[13px] text-[var(--color-muted)] mt-2 max-w-2xl">
            The intake form auto-tailors its document checklist based on the selected loan type. Bridge loans need
            take-out proof; amortizing loans need DSCR analysis; balloons need disclosures.
          </p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(documentTemplatesByLoanType).map(([key, t]) => (
              <div key={key} className="bg-[var(--color-surface)] hairline rounded-lg p-5">
                <h4 className="font-display text-[20px]">{LOAN_TYPE_LABELS[key]}</h4>
                <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted)] mt-4">Underwriting</p>
                <ul className="mt-2 space-y-1">
                  {t.underwriting.map((d) => (
                    <li key={d} className="flex items-start gap-2 text-[12px] text-[var(--color-ink-soft)]">
                      <span className="status-dot mt-1.5" style={{ background: "var(--color-primary)" }} />
                      {d}
                    </li>
                  ))}
                </ul>
                <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted)] mt-4">Closing</p>
                <ul className="mt-2 space-y-1">
                  {t.closing.map((d) => (
                    <li key={d} className="flex items-start gap-2 text-[12px] text-[var(--color-ink-soft)]">
                      <span className="status-dot mt-1.5" style={{ background: "var(--color-success)" }} />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[var(--color-surface)] hairline rounded-lg p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-lg">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-muted)]">Ready to look around?</p>
            <h3 className="font-display text-[24px] mt-2">Try it on real demo data.</h3>
            <p className="text-[13px] text-[var(--color-muted)] mt-2">
              Five borrowers, ten loans, payments stretching back six months — all populated, all clickable.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Link href="/dashboard" className="px-4 py-2.5 bg-[var(--color-primary)] text-[var(--color-bg)] rounded-md text-[12px] font-medium hover:bg-[var(--color-primary-mid)] transition">
              Open the dashboard
            </Link>
            <Link href="/borrowers" className="px-4 py-2.5 hairline rounded-md text-[12px] hover:bg-[var(--color-primary-tint)] transition">
              Browse borrowers
            </Link>
          </div>
        </section>
      </div>
    </Shell>
  );
}
