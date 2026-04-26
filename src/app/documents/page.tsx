"use client";

import { Shell } from "@/components/Shell";
import { documentTemplatesByLoanType } from "@/lib/data";

const LOAN_TYPES: { key: keyof typeof documentTemplatesByLoanType; label: string; description: string }[] = [
  { key: "interest_only", label: "Interest-Only", description: "Standard hard-money product with monthly interest payments and principal due at maturity." },
  { key: "amortizing", label: "Amortizing", description: "Fully amortizing schedule over the term or longer am. period." },
  { key: "balloon", label: "Balloon", description: "Amortized payments with remaining principal due at term end." },
  { key: "bridge", label: "Bridge", description: "Short-term financing pending refinance or sale, paired with take-out commitment." },
];

export default function DocumentsPage() {
  return (
    <Shell title="Documents &amp; underwriting settings" subtitle="Configure required documents per loan type. Used by intake forms and closing packages.">
      <div className="px-8 py-6 space-y-4">
        {LOAN_TYPES.map(({ key, label, description }) => {
          const template = documentTemplatesByLoanType[key];
          return (
            <div key={key} className="bg-[var(--color-surface)] hairline rounded-lg">
              <div className="px-6 py-4 hairline-b flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-[18px] font-medium tracking-tight">{label}</h3>
                  <p className="text-[12px] text-[var(--color-muted)] mt-1 max-w-xl">{description}</p>
                </div>
                <button className="px-3 py-1.5 hairline rounded-md text-[11px] hover:bg-[var(--color-primary-tint)] cursor-pointer">Edit template</button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-[var(--color-border-soft)]">
                <div className="p-6">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted)] mb-3">Underwriting docs</p>
                  <ul className="space-y-2">
                    {template.underwriting.map((d) => (
                      <li key={d} className="flex items-center gap-2 text-[13px] text-[var(--color-ink-soft)]">
                        <span className="status-dot" style={{ background: "var(--color-primary)" }} />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-6">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted)] mb-3">Closing docs</p>
                  <ul className="space-y-2">
                    {template.closing.map((d) => (
                      <li key={d} className="flex items-center gap-2 text-[13px] text-[var(--color-ink-soft)]">
                        <span className="status-dot" style={{ background: "var(--color-success)" }} />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Shell>
  );
}
