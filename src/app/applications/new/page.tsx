"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Shell } from "@/components/Shell";
import { documentTemplatesByLoanType } from "@/lib/data";

function NewApplicationContent() {
  const sp = useSearchParams();
  const isInternal = sp.get("internal") === "1";

  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loanType, setLoanType] = useState<keyof typeof documentTemplatesByLoanType>("interest_only");

  const requiredDocs = useMemo(() => documentTemplatesByLoanType[loanType], [loanType]);

  if (submitted) {
    return (
      <Shell title="Application submitted" subtitle="The application has been queued for underwriting review">
        <div className="px-8 py-12">
          <div className="max-w-xl mx-auto bg-[var(--color-surface)] hairline rounded-lg p-10 text-center">
            <div className="w-12 h-12 rounded-full bg-[var(--color-primary-soft)] flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-display text-[24px] font-medium mt-5">Application received</h2>
            <p className="text-[13px] text-[var(--color-muted)] mt-2 max-w-sm mx-auto">
              An automated email has been sent to the applicant with a link to upload the remaining documents.
            </p>
            <div className="mt-8 flex justify-center gap-3">
              <button onClick={() => { setSubmitted(false); setStep(0); }} className="px-4 py-2 hairline rounded-md text-[12px] hover:bg-[var(--color-primary-tint)] cursor-pointer">
                Submit another
              </button>
              <Link href="/applications" className="px-4 py-2 bg-[var(--color-primary)] text-[var(--color-bg)] rounded-md text-[12px] font-medium hover:bg-[var(--color-primary-mid)] transition">
                Go to applications
              </Link>
            </div>
          </div>
        </div>
      </Shell>
    );
  }

  return (
    <Shell
      title={isInternal ? "Internal upload — new application" : "New commercial loan application"}
      subtitle={isInternal ? "Lender-completed intake on behalf of borrower" : "Originate a new loan with a borrower"}
      action={
        <Link href={isInternal ? "/applications/new" : "/applications/new?internal=1"} className="text-[12px] text-[var(--color-primary)] hover:underline">
          {isInternal ? "Switch to applicant intake →" : "Switch to internal upload →"}
        </Link>
      }
    >
      <form
        onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
        className="px-8 py-6"
      >
        {/* Step indicator */}
        <ol className="flex items-center gap-3 mb-6">
          {["Borrower", "Loan", "Documents", "Review"].map((label, i) => (
            <li key={label} className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStep(i)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[12px] cursor-pointer transition ${
                  step === i ? "bg-[var(--color-primary)] text-[var(--color-bg)]" :
                  step > i ? "bg-[var(--color-primary-tint)] text-[var(--color-primary)]" :
                  "hairline text-[var(--color-muted)]"
                }`}
              >
                <span className="font-mono text-[10px]">{String(i + 1).padStart(2, "0")}</span>
                {label}
              </button>
              {i < 3 && <span className="w-6 h-px bg-[var(--color-border)]" />}
            </li>
          ))}
        </ol>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Form */}
          <div className="space-y-6">
            {step === 0 && (
              <Section title="Borrower / Applicant" subtitle="Personal details for the principal applicant. This is a commercial loan — personal loans are not offered.">
                <Grid>
                  <Field label="Legal first name *" required><input className={inputCls} /></Field>
                  <Field label="Legal last name *" required><input className={inputCls} /></Field>
                  <Field label="Email *" required><input type="email" className={inputCls} /></Field>
                  <Field label="Phone *" required><input type="tel" className={inputCls} /></Field>
                  <Field label="SSN *" required><input placeholder="XXX-XX-XXXX" className={inputCls} /></Field>
                  <Field label="Date of birth *" required><input type="date" className={inputCls} /></Field>
                  <Field label="Home address *" required full><input placeholder="Street, City, State, ZIP" className={inputCls} /></Field>
                </Grid>

                <SubHeading>Borrowing entity</SubHeading>
                <Grid>
                  <Field label="Entity name"><input className={inputCls} /></Field>
                  <Field label="Entity type">
                    <select className={inputCls}>
                      <option>Individual / Sole Proprietor</option>
                      <option>LLC</option>
                      <option>Corporation</option>
                      <option>Trust</option>
                      <option>Partnership</option>
                    </select>
                  </Field>
                  <Field label="EIN"><input placeholder="XX-XXXXXXX" className={inputCls} /></Field>
                  <Field label="State of formation">
                    <select className={inputCls}>
                      <option>Delaware</option>
                      <option>California</option>
                      <option>Texas</option>
                      <option>Florida</option>
                      <option>New York</option>
                      <option>Other</option>
                    </select>
                  </Field>
                </Grid>

                <SubHeading>Financial profile</SubHeading>
                <Grid>
                  <Field label="Annual income *" required><input type="number" placeholder="$" className={inputCls} /></Field>
                  <Field label="Liquid assets *" required><input type="number" placeholder="$" className={inputCls} /></Field>
                  <Field label="Net worth"><input type="number" placeholder="$" className={inputCls} /></Field>
                  <Field label="Existing debt obligations"><input type="number" placeholder="$" className={inputCls} /></Field>
                </Grid>
              </Section>
            )}

            {step === 1 && (
              <Section title="Loan request" subtitle="Commercial use only. Bridge, fix-and-flip, construction, refinance, or working capital secured by commercial real estate.">
                <Grid>
                  <Field label="Loan amount *" required><input type="number" placeholder="$" className={inputCls} /></Field>
                  <Field label="Loan term (months) *" required>
                    <select className={inputCls}>
                      <option>6</option><option>9</option><option>12</option><option>18</option><option>24</option><option>36</option>
                    </select>
                  </Field>
                  <Field label="Interest rate (%) *" required><input type="number" step="0.125" placeholder="e.g. 11.5" className={inputCls} /></Field>
                  <Field label="Loan type *" required>
                    <select value={loanType} onChange={(e) => setLoanType(e.target.value as keyof typeof documentTemplatesByLoanType)} className={inputCls}>
                      <option value="interest_only">Interest-Only</option>
                      <option value="amortizing">Amortizing</option>
                      <option value="balloon">Balloon (interest + balloon principal)</option>
                      <option value="bridge">Bridge</option>
                    </select>
                  </Field>
                  <Field label="Amortization (months)">
                    <input type="number" placeholder="e.g. 360 (n/a for interest-only)" className={inputCls} />
                  </Field>
                  <Field label="Lien position *" required>
                    <select className={inputCls}>
                      <option>First lien</option>
                      <option>Second lien (junior)</option>
                      <option>Unsecured</option>
                    </select>
                  </Field>
                  <Field label="Commercial purpose *" required>
                    <select className={inputCls}>
                      <option>Acquisition</option>
                      <option>Refinance</option>
                      <option>Cash-out refinance</option>
                      <option>Construction</option>
                      <option>Renovation</option>
                      <option>Working capital (commercial real estate-secured)</option>
                    </select>
                  </Field>
                  <Field label="Loan-to-value (%)"><input type="number" placeholder="e.g. 65" className={inputCls} /></Field>
                </Grid>

                <SubHeading>Guarantors &amp; collateral</SubHeading>
                <div className="bg-[var(--color-primary-tint)] hairline rounded-md p-4 text-[12px] text-[var(--color-ink-soft)]">
                  <p className="font-medium text-[var(--color-primary)] mb-1">Personal guaranty required</p>
                  <p>All commercial loans require a personal guaranty from at least one principal. Add additional guarantors below.</p>
                </div>
                <Grid>
                  <Field label="Guarantor name"><input className={inputCls} /></Field>
                  <Field label="Relationship to borrower"><input placeholder="e.g. Member-Manager, Spouse, Co-Investor" className={inputCls} /></Field>
                  <Field label="Guarantor SSN"><input placeholder="XXX-XX-XXXX" className={inputCls} /></Field>
                  <Field label="Outstanding loans elsewhere"><input type="number" placeholder="$" className={inputCls} /></Field>
                </Grid>
                <button type="button" className="text-[12px] text-[var(--color-primary)] hover:underline cursor-pointer">+ Add another guarantor</button>
              </Section>
            )}

            {step === 2 && (
              <Section
                title="Required documents"
                subtitle={`Document checklist auto-tailored to ${loanTypeLabel(loanType)}. Government-issued ID is required across all loan types.`}
              >
                <SubHeading>Underwriting documents</SubHeading>
                <ul className="bg-[var(--color-surface-soft)] hairline rounded-md divide-y divide-[var(--color-border-soft)]">
                  {requiredDocs.underwriting.map((doc) => (
                    <li key={doc} className="px-4 py-3 flex items-center justify-between">
                      <label className="flex items-center gap-3 text-[13px]">
                        <input type="checkbox" className="rounded-sm accent-[var(--color-primary)]" />
                        {doc}
                      </label>
                      <button type="button" className="px-3 py-1.5 hairline rounded-md text-[11px] hover:bg-[var(--color-primary-tint)] cursor-pointer">Upload</button>
                    </li>
                  ))}
                </ul>

                <SubHeading>Closing documents</SubHeading>
                <p className="text-[12px] text-[var(--color-muted)] -mt-2">Generated automatically at approval. You can preview each template now.</p>
                <ul className="bg-[var(--color-surface-soft)] hairline rounded-md divide-y divide-[var(--color-border-soft)]">
                  {requiredDocs.closing.map((doc) => (
                    <li key={doc} className="px-4 py-3 flex items-center justify-between">
                      <span className="text-[13px]">{doc}</span>
                      <button type="button" className="text-[11px] text-[var(--color-primary)] hover:underline">Preview template</button>
                    </li>
                  ))}
                </ul>

                <SubHeading>Send upload link</SubHeading>
                <div className="bg-[var(--color-surface-soft)] hairline rounded-md p-4">
                  <p className="text-[12px] text-[var(--color-muted)]">
                    {isInternal
                      ? "You're filling this in internally. Documents will be uploaded directly here."
                      : "We'll email a secure upload link to the applicant for any remaining documents."}
                  </p>
                  {!isInternal && (
                    <div className="mt-3 flex items-center gap-2">
                      <input placeholder="applicant@email.com" className={`${inputCls} flex-1`} />
                      <button type="button" className="px-4 py-2 bg-[var(--color-primary)] text-[var(--color-bg)] rounded-md text-[12px] font-medium hover:bg-[var(--color-primary-mid)] cursor-pointer">Send link</button>
                    </div>
                  )}
                </div>
              </Section>
            )}

            {step === 3 && (
              <Section title="Review &amp; submit" subtitle="Confirm the application details. After submission it enters underwriting.">
                <div className="bg-[var(--color-surface-soft)] hairline rounded-md p-5 space-y-3 text-[13px]">
                  <Row k="Loan type" v={loanTypeLabel(loanType)} />
                  <Row k="Source" v={isInternal ? "Internal upload" : "Borrower-initiated"} />
                  <Row k="Required docs" v={`${requiredDocs.underwriting.length + requiredDocs.closing.length} items`} />
                  <Row k="Underwriting type" v="Standard commercial · risk-tiered" />
                </div>
                <div className="flex items-start gap-3 mt-4 text-[12px]">
                  <input id="ack" type="checkbox" className="mt-1 rounded-sm accent-[var(--color-primary)]" />
                  <label htmlFor="ack" className="text-[var(--color-ink-soft)]">
                    I confirm the information above is accurate and the applicant has authorized this submission for underwriting and credit review.
                  </label>
                </div>
              </Section>
            )}

            {/* Step nav */}
            <div className="flex items-center justify-between pt-4 hairline-t">
              <button
                type="button"
                onClick={() => setStep(Math.max(0, step - 1))}
                disabled={step === 0}
                className="px-4 py-2 hairline rounded-md text-[12px] disabled:opacity-40 hover:bg-[var(--color-primary-tint)] transition cursor-pointer"
              >
                ← Back
              </button>
              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="px-5 py-2 bg-[var(--color-primary)] text-[var(--color-bg)] rounded-md text-[12px] font-medium hover:bg-[var(--color-primary-mid)] transition cursor-pointer"
                >
                  Continue →
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-5 py-2 bg-[var(--color-primary)] text-[var(--color-bg)] rounded-md text-[12px] font-medium hover:bg-[var(--color-primary-mid)] transition cursor-pointer"
                >
                  Submit application
                </button>
              )}
            </div>
          </div>

          {/* Aside */}
          <aside className="space-y-4">
            <div className="bg-[var(--color-surface)] hairline rounded-lg p-5">
              <p className="text-[10px] uppercase tracking-[0.12em] text-[var(--color-muted)]">Loan summary</p>
              <p className="font-display text-[18px] font-medium mt-1">{loanTypeLabel(loanType)}</p>
              <p className="text-[12px] text-[var(--color-muted)] mt-1">
                {requiredDocs.underwriting.length} underwriting docs · {requiredDocs.closing.length} closing docs
              </p>
              <hr className="my-4 border-[var(--color-border-soft)]" />
              <p className="text-[10px] uppercase tracking-[0.12em] text-[var(--color-muted)]">Underwriting type</p>
              <p className="text-[13px] mt-1">Standard commercial</p>
              <p className="text-[10px] text-[var(--color-muted)] mt-3">Settings &amp; document templates can be configured under <Link href="/documents" className="text-[var(--color-primary)] hover:underline">Documents</Link>.</p>
            </div>

            <div className="bg-[var(--color-primary-tint)] hairline rounded-lg p-5">
              <p className="text-[10px] uppercase tracking-[0.12em] text-[var(--color-primary)]">Why we ask</p>
              <p className="text-[12px] text-[var(--color-ink-soft)] mt-2 leading-relaxed">
                Northline only originates commercial real estate loans with at least one personal guaranty.
                We collect this information to evaluate the deal, the sponsor, and the collateral.
              </p>
            </div>
          </aside>
        </div>
      </form>
    </Shell>
  );
}

export default function NewApplicationPage() {
  return (
    <Suspense fallback={<Shell title="New application"><div /></Shell>}>
      <NewApplicationContent />
    </Suspense>
  );
}

const inputCls = "w-full px-3 py-2 bg-[var(--color-surface)] hairline rounded-md text-[13px] focus:border-[var(--color-primary)] outline-none transition";

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="bg-[var(--color-surface)] hairline rounded-lg p-6 space-y-4">
      <div>
        <h3 className="font-display text-[18px] font-medium tracking-tight">{title}</h3>
        {subtitle && <p className="text-[12px] text-[var(--color-muted)] mt-1">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>;
}

function Field({ label, children, full, required: _req }: { label: string; children: React.ReactNode; full?: boolean; required?: boolean }) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className="block text-[10px] uppercase tracking-[0.14em] text-[var(--color-muted)] mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return <h4 className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-muted)] pt-3 mt-2 hairline-t">{children}</h4>;
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[var(--color-muted)]">{k}</span>
      <span className="font-medium tabular">{v}</span>
    </div>
  );
}

function loanTypeLabel(t: string) {
  return ({ interest_only: "Interest-Only", amortizing: "Amortizing", balloon: "Balloon", bridge: "Bridge" } as Record<string, string>)[t] || t;
}
