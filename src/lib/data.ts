export type LoanSource = "internal" | "external";
export type LienPosition = "first" | "second" | "unsecured";
export type LoanType = "interest_only" | "amortizing" | "balloon" | "bridge";
export type LoanStatus = "current" | "past_due" | "delinquent" | "default" | "paid_off";
export type RiskLevel = "low" | "medium" | "high" | "critical";

export interface Payment {
  id: string;
  loanId: string;
  date: string;
  scheduled: number;
  received: number;
  principal: number;
  interest: number;
  status: "on_time" | "late" | "overpaid" | "missed" | "pending";
  daysLate?: number;
  overpaidAmount?: number;
  method?: "ACH" | "Wire" | "Check";
  reference?: string;
}

export interface ManagementEvent {
  date: string;
  type: "note" | "call" | "email" | "modification" | "default_notice" | "approval";
  user: string;
  detail: string;
}

export interface Guarantor {
  name: string;
  relationship: string;
  ssn: string;
  riskScore: number;
  riskLevel: RiskLevel;
  outstandingLoans: number;
  totalGuaranteed: number;
  flagged: boolean;
  flagReason?: string;
}

export interface FlaggedIssue {
  severity: "low" | "medium" | "high";
  category: "documents" | "payment" | "compliance" | "credit" | "valuation";
  message: string;
  date: string;
}

export interface Loan {
  id: string;
  source: LoanSource;
  borrowerId: string;
  collateralAddress: string;
  loanAmount: number;
  currentBalance: number;
  interestRate: number;
  loanType: LoanType;
  termMonths: number;
  amortizationMonths: number | null;
  lien: LienPosition;
  ltv: number;
  originationDate: string;
  maturityDate: string;
  monthlyPayment: number;
  nextPaymentDue: string;
  status: LoanStatus;
  daysDelinquent: number;
  accruedInterest: number;
  servicer: string;
  payments: Payment[];
  managementHistory: ManagementEvent[];
  guarantors: Guarantor[];
  documents: LoanDocument[];
}

export interface LoanDocument {
  name: string;
  status: "received" | "pending" | "rejected" | "executed";
  date?: string;
  required: boolean;
}

export interface Borrower {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  homeAddress: string;
  ssn: string;
  ein?: string;
  entityName?: string;
  entityType: "Individual" | "LLC" | "Corporation" | "Trust" | "Partnership";
  riskScore: number;
  riskLevel: RiskLevel;
  totalBorrowed: number;
  totalOutstanding: number;
  activeLoans: number;
  loans: Loan[];
  idVerified: boolean;
  backgroundCheck: "passed" | "pending" | "flagged";
  flaggedIssues: FlaggedIssue[];
  applicationStatus: "approved" | "underwriting" | "pending" | "declined";
  joined: string;
  additionalDocuments: LoanDocument[];
  annualIncome: number;
  liquidAssets: number;
}

const mkPayments = (loanId: string, base: Payment[]): Payment[] =>
  base.map((p) => ({ ...p, loanId }));

export const borrowers: Borrower[] = [
  {
    id: "BRW-001",
    firstName: "Marcus",
    lastName: "Johnson",
    email: "marcus.johnson@blackstoneholdings.co",
    phone: "(555) 234-5678",
    homeAddress: "412 Cypress Lane, Austin, TX 78704",
    ssn: "***-**-4521",
    ein: "82-1849221",
    entityName: "Blackstone Holdings LLC",
    entityType: "LLC",
    riskScore: 72,
    riskLevel: "medium",
    totalBorrowed: 1_850_000,
    totalOutstanding: 1_795_000,
    activeLoans: 2,
    idVerified: true,
    backgroundCheck: "passed",
    applicationStatus: "approved",
    joined: "2024-09-12",
    annualIncome: 480_000,
    liquidAssets: 920_000,
    flaggedIssues: [
      { severity: "medium", category: "payment", message: "Missed November 2025 payment on LN-10421", date: "2025-11-01" },
      { severity: "low", category: "documents", message: "Insurance certificate renewal required by May 2026", date: "2026-04-10" },
    ],
    loans: [
      {
        id: "LN-10421",
        source: "internal",
        borrowerId: "BRW-001",
        collateralAddress: "1847 Oakwood Dr, Austin, TX 78704",
        loanAmount: 1_200_000,
        currentBalance: 1_145_000,
        interestRate: 11.5,
        loanType: "interest_only",
        termMonths: 12,
        amortizationMonths: null,
        lien: "first",
        ltv: 68,
        originationDate: "2025-08-15",
        maturityDate: "2026-08-15",
        monthlyPayment: 11_500,
        nextPaymentDue: "2026-05-01",
        status: "current",
        daysDelinquent: 0,
        accruedInterest: 4_321,
        servicer: "Northline Capital",
        guarantors: [
          { name: "Marcus Johnson", relationship: "Member-Manager", ssn: "***-**-4521", riskScore: 72, riskLevel: "medium", outstandingLoans: 2, totalGuaranteed: 1_850_000, flagged: false },
        ],
        documents: [
          { name: "Promissory Note", status: "executed", date: "2025-08-15", required: true },
          { name: "Deed of Trust", status: "executed", date: "2025-08-15", required: true },
          { name: "Loan Agreement", status: "executed", date: "2025-08-15", required: true },
          { name: "Security Agreement", status: "executed", date: "2025-08-15", required: true },
          { name: "Personal Guaranty", status: "executed", date: "2025-08-15", required: true },
          { name: "Title Insurance Policy", status: "received", date: "2025-08-13", required: true },
          { name: "Hazard Insurance Certificate", status: "pending", required: true },
        ],
        payments: mkPayments("LN-10421", [
          { id: "PAY-001", loanId: "", date: "2026-04-01", scheduled: 11_500, received: 11_500, principal: 0, interest: 11_500, status: "on_time", method: "ACH", reference: "ACH-873421" },
          { id: "PAY-002", loanId: "", date: "2026-03-01", scheduled: 11_500, received: 11_500, principal: 0, interest: 11_500, status: "on_time", method: "ACH", reference: "ACH-870189" },
          { id: "PAY-003", loanId: "", date: "2026-02-01", scheduled: 11_500, received: 11_500, principal: 0, interest: 11_500, status: "late", daysLate: 10, method: "Wire", reference: "WIRE-44021" },
          { id: "PAY-004", loanId: "", date: "2026-01-01", scheduled: 11_500, received: 13_000, principal: 1_500, interest: 11_500, status: "overpaid", overpaidAmount: 1_500, method: "ACH", reference: "ACH-866512" },
          { id: "PAY-005", loanId: "", date: "2025-12-01", scheduled: 11_500, received: 11_500, principal: 0, interest: 11_500, status: "on_time", method: "ACH", reference: "ACH-862218" },
          { id: "PAY-006", loanId: "", date: "2025-11-01", scheduled: 11_500, received: 0, principal: 0, interest: 0, status: "missed" },
          { id: "PAY-007", loanId: "", date: "2025-10-01", scheduled: 11_500, received: 11_500, principal: 0, interest: 11_500, status: "late", daysLate: 3, method: "Check", reference: "CHK-1042" },
          { id: "PAY-008", loanId: "", date: "2025-09-01", scheduled: 11_500, received: 11_500, principal: 0, interest: 11_500, status: "on_time", method: "ACH", reference: "ACH-855401" },
        ]),
        managementHistory: [
          { date: "2026-04-10", type: "note", user: "J. Doe", detail: "Insurance renewal reminder sent — borrower acknowledged." },
          { date: "2026-02-11", type: "email", user: "K. Liu", detail: "Late payment notice issued (10 days)." },
          { date: "2025-11-08", type: "default_notice", user: "K. Liu", detail: "Missed payment cured via wire on 2025-11-22." },
          { date: "2025-08-15", type: "approval", user: "T. Reyes", detail: "Loan funded and recorded." },
        ],
      },
      {
        id: "LN-10422",
        source: "internal",
        borrowerId: "BRW-001",
        collateralAddress: "392 Elm Street, Dallas, TX 75201",
        loanAmount: 650_000,
        currentBalance: 650_000,
        interestRate: 12.0,
        loanType: "interest_only",
        termMonths: 6,
        amortizationMonths: null,
        lien: "first",
        ltv: 72,
        originationDate: "2026-01-10",
        maturityDate: "2026-07-10",
        monthlyPayment: 6_500,
        nextPaymentDue: "2026-04-10",
        status: "past_due",
        daysDelinquent: 16,
        accruedInterest: 3_466,
        servicer: "Northline Capital",
        guarantors: [
          { name: "Marcus Johnson", relationship: "Member-Manager", ssn: "***-**-4521", riskScore: 72, riskLevel: "medium", outstandingLoans: 2, totalGuaranteed: 1_850_000, flagged: false },
        ],
        documents: [
          { name: "Promissory Note", status: "executed", date: "2026-01-10", required: true },
          { name: "Deed of Trust", status: "executed", date: "2026-01-10", required: true },
          { name: "Loan Agreement", status: "executed", date: "2026-01-10", required: true },
          { name: "Personal Guaranty", status: "executed", date: "2026-01-10", required: true },
        ],
        payments: mkPayments("LN-10422", [
          { id: "PAY-009", loanId: "", date: "2026-04-10", scheduled: 6_500, received: 0, principal: 0, interest: 0, status: "missed" },
          { id: "PAY-010", loanId: "", date: "2026-03-10", scheduled: 6_500, received: 6_500, principal: 0, interest: 6_500, status: "late", daysLate: 5, method: "ACH", reference: "ACH-870915" },
          { id: "PAY-011", loanId: "", date: "2026-02-10", scheduled: 6_500, received: 6_500, principal: 0, interest: 6_500, status: "on_time", method: "ACH", reference: "ACH-867832" },
        ]),
        managementHistory: [
          { date: "2026-04-15", type: "call", user: "K. Liu", detail: "Spoke with borrower — promises payment by 4/30." },
          { date: "2026-04-12", type: "email", user: "System", detail: "Automated past-due notice issued." },
          { date: "2026-01-10", type: "approval", user: "T. Reyes", detail: "Loan funded." },
        ],
      },
    ],
    additionalDocuments: [
      { name: "2024 Federal Tax Return", status: "received", date: "2025-08-08", required: true },
      { name: "2023 Federal Tax Return", status: "received", date: "2025-08-08", required: true },
      { name: "Personal Financial Statement", status: "received", date: "2025-08-09", required: true },
      { name: "Bank Statements (3 mo)", status: "received", date: "2025-08-10", required: true },
      { name: "K-1 Schedules", status: "received", date: "2025-08-09", required: false },
    ],
  },
  {
    id: "BRW-002",
    firstName: "Sarah",
    lastName: "Chen",
    email: "sarah@meridiancapital.io",
    phone: "(555) 876-4321",
    homeAddress: "78 Bel Air Crescent, Beverly Hills, CA 90210",
    ssn: "***-**-8834",
    ein: "47-3829112",
    entityName: "Meridian Capital Group LLC",
    entityType: "LLC",
    riskScore: 91,
    riskLevel: "low",
    totalBorrowed: 3_200_000,
    totalOutstanding: 2_980_000,
    activeLoans: 1,
    idVerified: true,
    backgroundCheck: "passed",
    applicationStatus: "approved",
    joined: "2024-12-04",
    annualIncome: 1_240_000,
    liquidAssets: 3_400_000,
    flaggedIssues: [],
    loans: [
      {
        id: "LN-10389",
        source: "internal",
        borrowerId: "BRW-002",
        collateralAddress: "5600 Wilshire Blvd, Los Angeles, CA 90036",
        loanAmount: 3_200_000,
        currentBalance: 2_980_000,
        interestRate: 10.0,
        loanType: "amortizing",
        termMonths: 18,
        amortizationMonths: 360,
        lien: "first",
        ltv: 60,
        originationDate: "2025-06-01",
        maturityDate: "2026-12-01",
        monthlyPayment: 26_667,
        nextPaymentDue: "2026-05-01",
        status: "current",
        daysDelinquent: 0,
        accruedInterest: 8_283,
        servicer: "Northline Capital",
        guarantors: [
          { name: "Sarah Chen", relationship: "Managing Member", ssn: "***-**-8834", riskScore: 91, riskLevel: "low", outstandingLoans: 1, totalGuaranteed: 3_200_000, flagged: false },
          { name: "Daniel Chen", relationship: "Spouse / Co-Guarantor", ssn: "***-**-3344", riskScore: 88, riskLevel: "low", outstandingLoans: 0, totalGuaranteed: 3_200_000, flagged: false },
        ],
        documents: [
          { name: "Promissory Note", status: "executed", date: "2025-06-01", required: true },
          { name: "Deed of Trust", status: "executed", date: "2025-06-01", required: true },
          { name: "Loan Agreement", status: "executed", date: "2025-06-01", required: true },
          { name: "Security Agreement", status: "executed", date: "2025-06-01", required: true },
          { name: "Personal Guaranty (Sarah)", status: "executed", date: "2025-06-01", required: true },
          { name: "Personal Guaranty (Daniel)", status: "executed", date: "2025-06-01", required: true },
          { name: "Title Insurance Policy", status: "received", date: "2025-05-30", required: true },
          { name: "Hazard Insurance Certificate", status: "received", date: "2025-06-01", required: true },
        ],
        payments: mkPayments("LN-10389", [
          { id: "PAY-020", loanId: "", date: "2026-04-01", scheduled: 26_667, received: 26_667, principal: 1_853, interest: 24_814, status: "on_time", method: "ACH", reference: "ACH-873980" },
          { id: "PAY-021", loanId: "", date: "2026-03-01", scheduled: 26_667, received: 26_667, principal: 1_837, interest: 24_830, status: "on_time", method: "ACH", reference: "ACH-870720" },
          { id: "PAY-022", loanId: "", date: "2026-02-01", scheduled: 26_667, received: 26_667, principal: 1_822, interest: 24_845, status: "on_time", method: "ACH", reference: "ACH-867430" },
          { id: "PAY-023", loanId: "", date: "2026-01-01", scheduled: 26_667, received: 28_000, principal: 3_140, interest: 24_860, status: "overpaid", overpaidAmount: 1_333, method: "ACH", reference: "ACH-864011" },
          { id: "PAY-024", loanId: "", date: "2025-12-01", scheduled: 26_667, received: 26_667, principal: 1_792, interest: 24_875, status: "on_time", method: "ACH", reference: "ACH-860714" },
          { id: "PAY-025", loanId: "", date: "2025-11-01", scheduled: 26_667, received: 26_667, principal: 1_777, interest: 24_890, status: "on_time", method: "ACH", reference: "ACH-857201" },
        ]),
        managementHistory: [
          { date: "2026-01-04", type: "note", user: "J. Doe", detail: "Borrower made $1,333 principal overpayment — applied to next month." },
          { date: "2025-06-01", type: "approval", user: "T. Reyes", detail: "Loan funded and recorded — strongest underwrite of Q2." },
        ],
      },
    ],
    additionalDocuments: [
      { name: "2024 Federal Tax Return", status: "received", date: "2025-05-25", required: true },
      { name: "2023 Federal Tax Return", status: "received", date: "2025-05-25", required: true },
      { name: "Personal Financial Statement", status: "received", date: "2025-05-26", required: true },
      { name: "Bank Statements (3 mo)", status: "received", date: "2025-05-27", required: true },
      { name: "Operating Agreement", status: "received", date: "2025-05-28", required: true },
    ],
  },
  {
    id: "BRW-003",
    firstName: "David",
    lastName: "Martinez",
    email: "d.martinez@redbrickdev.com",
    phone: "(555) 345-9012",
    homeAddress: "907 Coral Way, Miami, FL 33145",
    ssn: "***-**-2217",
    ein: "61-2284903",
    entityName: "RedBrick Development LLC",
    entityType: "LLC",
    riskScore: 45,
    riskLevel: "high",
    totalBorrowed: 780_000,
    totalOutstanding: 780_000,
    activeLoans: 1,
    idVerified: true,
    backgroundCheck: "flagged",
    applicationStatus: "approved",
    joined: "2025-12-15",
    annualIncome: 185_000,
    liquidAssets: 92_000,
    flaggedIssues: [
      { severity: "high", category: "payment", message: "60+ days delinquent on LN-10501", date: "2026-04-01" },
      { severity: "high", category: "compliance", message: "Background check returned prior bankruptcy (2019)", date: "2026-01-22" },
      { severity: "medium", category: "documents", message: "Proof of income rejected — resubmission required", date: "2026-01-28" },
    ],
    loans: [
      {
        id: "LN-10501",
        source: "internal",
        borrowerId: "BRW-003",
        collateralAddress: "221 Baker St, Miami, FL 33101",
        loanAmount: 780_000,
        currentBalance: 780_000,
        interestRate: 14.0,
        loanType: "interest_only",
        termMonths: 9,
        amortizationMonths: null,
        lien: "second",
        ltv: 75,
        originationDate: "2026-02-01",
        maturityDate: "2026-11-01",
        monthlyPayment: 9_100,
        nextPaymentDue: "2026-04-01",
        status: "delinquent",
        daysDelinquent: 56,
        accruedInterest: 16_996,
        servicer: "Northline Capital",
        guarantors: [
          { name: "David Martinez", relationship: "Managing Member", ssn: "***-**-2217", riskScore: 45, riskLevel: "high", outstandingLoans: 1, totalGuaranteed: 780_000, flagged: true, flagReason: "Prior bankruptcy (2019), 60d delinquent" },
          { name: "Elena Martinez", relationship: "Co-Guarantor", ssn: "***-**-7741", riskScore: 58, riskLevel: "medium", outstandingLoans: 1, totalGuaranteed: 780_000, flagged: true, flagReason: "Co-guarantor on delinquent loan" },
        ],
        documents: [
          { name: "Promissory Note", status: "executed", date: "2026-02-01", required: true },
          { name: "Deed of Trust (2nd Lien)", status: "executed", date: "2026-02-01", required: true },
          { name: "Loan Agreement", status: "executed", date: "2026-02-01", required: true },
          { name: "Personal Guaranty (David)", status: "executed", date: "2026-02-01", required: true },
          { name: "Personal Guaranty (Elena)", status: "executed", date: "2026-02-01", required: true },
          { name: "Subordination Agreement", status: "received", date: "2026-01-28", required: true },
          { name: "Title Insurance Policy", status: "pending", required: true },
        ],
        payments: mkPayments("LN-10501", [
          { id: "PAY-040", loanId: "", date: "2026-04-01", scheduled: 9_100, received: 0, principal: 0, interest: 0, status: "missed" },
          { id: "PAY-041", loanId: "", date: "2026-03-01", scheduled: 9_100, received: 9_100, principal: 0, interest: 9_100, status: "late", daysLate: 22, method: "Check", reference: "CHK-204" },
          { id: "PAY-042", loanId: "", date: "2026-02-01", scheduled: 9_100, received: 0, principal: 0, interest: 0, status: "missed" },
        ]),
        managementHistory: [
          { date: "2026-04-22", type: "default_notice", user: "K. Liu", detail: "Notice of default issued — 56 days delinquent." },
          { date: "2026-04-08", type: "call", user: "K. Liu", detail: "Voicemail left — no callback." },
          { date: "2026-03-15", type: "email", user: "System", detail: "Late payment fees assessed: $455." },
          { date: "2026-02-22", type: "modification", user: "T. Reyes", detail: "Forbearance discussed — declined to modify." },
        ],
      },
    ],
    additionalDocuments: [
      { name: "2024 Federal Tax Return", status: "received", date: "2026-01-22", required: true },
      { name: "Proof of Income", status: "rejected", date: "2026-01-28", required: true },
      { name: "Personal Financial Statement", status: "pending", required: true },
      { name: "Bank Statements (3 mo)", status: "received", date: "2026-01-22", required: true },
    ],
  },
  {
    id: "BRW-004",
    firstName: "Angela",
    lastName: "Williams",
    email: "a.williams@desertvalley.co",
    phone: "(555) 567-8901",
    homeAddress: "1402 Saguaro Way, Phoenix, AZ 85016",
    ssn: "***-**-6643",
    entityName: "Desert Valley Investments",
    entityType: "Corporation",
    riskScore: 28,
    riskLevel: "critical",
    totalBorrowed: 450_000,
    totalOutstanding: 450_000,
    activeLoans: 1,
    idVerified: false,
    backgroundCheck: "pending",
    applicationStatus: "underwriting",
    joined: "2026-02-22",
    annualIncome: 95_000,
    liquidAssets: 18_000,
    flaggedIssues: [
      { severity: "high", category: "payment", message: "Two consecutive missed payments — 60d delinquent", date: "2026-04-01" },
      { severity: "high", category: "compliance", message: "Identity verification incomplete", date: "2026-03-01" },
      { severity: "high", category: "documents", message: "5 of 6 required documents outstanding", date: "2026-03-01" },
    ],
    loans: [
      {
        id: "LN-10515",
        source: "external",
        borrowerId: "BRW-004",
        collateralAddress: "890 Pine Ave, Phoenix, AZ 85001",
        loanAmount: 450_000,
        currentBalance: 450_000,
        interestRate: 15.0,
        loanType: "interest_only",
        termMonths: 6,
        amortizationMonths: null,
        lien: "unsecured",
        ltv: 80,
        originationDate: "2026-03-01",
        maturityDate: "2026-09-01",
        monthlyPayment: 5_625,
        nextPaymentDue: "2026-04-01",
        status: "default",
        daysDelinquent: 56,
        accruedInterest: 10_521,
        servicer: "Westlake Servicing (External)",
        guarantors: [
          { name: "Angela Williams", relationship: "President", ssn: "***-**-6643", riskScore: 28, riskLevel: "critical", outstandingLoans: 1, totalGuaranteed: 450_000, flagged: true, flagReason: "Critical risk — unsecured guarantor with default" },
        ],
        documents: [
          { name: "Promissory Note", status: "executed", date: "2026-03-01", required: true },
          { name: "Loan Agreement", status: "executed", date: "2026-03-01", required: true },
          { name: "Personal Guaranty (Unsecured)", status: "executed", date: "2026-03-01", required: true },
        ],
        payments: mkPayments("LN-10515", [
          { id: "PAY-060", loanId: "", date: "2026-04-01", scheduled: 5_625, received: 0, principal: 0, interest: 0, status: "missed" },
          { id: "PAY-061", loanId: "", date: "2026-03-01", scheduled: 5_625, received: 0, principal: 0, interest: 0, status: "missed" },
        ]),
        managementHistory: [
          { date: "2026-04-25", type: "default_notice", user: "K. Liu", detail: "Acceleration notice prepared — pending counsel review." },
          { date: "2026-04-02", type: "default_notice", user: "K. Liu", detail: "First default notice issued." },
          { date: "2026-03-01", type: "approval", user: "External", detail: "Loan acquired from Westlake Servicing." },
        ],
      },
    ],
    additionalDocuments: [
      { name: "Government ID", status: "pending", required: true },
      { name: "Proof of Income", status: "pending", required: true },
      { name: "Personal Financial Statement", status: "pending", required: true },
      { name: "Bank Statements (3 mo)", status: "pending", required: true },
    ],
  },
  {
    id: "BRW-005",
    firstName: "Robert",
    lastName: "Kim",
    email: "rkim@kim-partners.com",
    phone: "(555) 123-4567",
    homeAddress: "1200 Pacific Heights Pl, San Francisco, CA 94115",
    ssn: "***-**-9910",
    ein: "94-3382217",
    entityName: "Kim Partners Real Estate",
    entityType: "Partnership",
    riskScore: 85,
    riskLevel: "low",
    totalBorrowed: 5_400_000,
    totalOutstanding: 4_800_000,
    activeLoans: 3,
    idVerified: true,
    backgroundCheck: "passed",
    applicationStatus: "approved",
    joined: "2024-01-08",
    annualIncome: 2_100_000,
    liquidAssets: 6_800_000,
    flaggedIssues: [],
    loans: [
      {
        id: "LN-10200",
        source: "internal",
        borrowerId: "BRW-005",
        collateralAddress: "1200 Market St, San Francisco, CA 94103",
        loanAmount: 2_500_000,
        currentBalance: 2_100_000,
        interestRate: 10.5,
        loanType: "amortizing",
        termMonths: 24,
        amortizationMonths: 300,
        lien: "first",
        ltv: 55,
        originationDate: "2025-01-15",
        maturityDate: "2027-01-15",
        monthlyPayment: 21_875,
        nextPaymentDue: "2026-05-01",
        status: "current",
        daysDelinquent: 0,
        accruedInterest: 5_840,
        servicer: "Northline Capital",
        guarantors: [
          { name: "Robert Kim", relationship: "General Partner", ssn: "***-**-9910", riskScore: 85, riskLevel: "low", outstandingLoans: 3, totalGuaranteed: 5_400_000, flagged: false },
          { name: "Lin Kim", relationship: "General Partner", ssn: "***-**-2841", riskScore: 80, riskLevel: "low", outstandingLoans: 3, totalGuaranteed: 5_400_000, flagged: false },
        ],
        documents: [
          { name: "Promissory Note", status: "executed", date: "2025-01-15", required: true },
          { name: "Deed of Trust", status: "executed", date: "2025-01-15", required: true },
          { name: "Loan Agreement", status: "executed", date: "2025-01-15", required: true },
          { name: "Security Agreement", status: "executed", date: "2025-01-15", required: true },
          { name: "Personal Guaranty (Robert)", status: "executed", date: "2025-01-15", required: true },
          { name: "Personal Guaranty (Lin)", status: "executed", date: "2025-01-15", required: true },
        ],
        payments: mkPayments("LN-10200", [
          { id: "PAY-080", loanId: "", date: "2026-04-01", scheduled: 21_875, received: 21_875, principal: 3_500, interest: 18_375, status: "on_time", method: "ACH", reference: "ACH-873701" },
          { id: "PAY-081", loanId: "", date: "2026-03-01", scheduled: 21_875, received: 21_875, principal: 3_469, interest: 18_406, status: "on_time", method: "ACH", reference: "ACH-870501" },
          { id: "PAY-082", loanId: "", date: "2026-02-01", scheduled: 21_875, received: 22_958, principal: 4_521, interest: 18_437, status: "overpaid", overpaidAmount: 1_083, method: "ACH", reference: "ACH-867201" },
        ]),
        managementHistory: [
          { date: "2025-01-15", type: "approval", user: "T. Reyes", detail: "Funded — anchor relationship." },
        ],
      },
      {
        id: "LN-10350",
        source: "external",
        borrowerId: "BRW-005",
        collateralAddress: "456 Broadway, New York, NY 10013",
        loanAmount: 1_800_000,
        currentBalance: 1_650_000,
        interestRate: 11.0,
        loanType: "interest_only",
        termMonths: 12,
        amortizationMonths: null,
        lien: "first",
        ltv: 62,
        originationDate: "2025-09-01",
        maturityDate: "2026-09-01",
        monthlyPayment: 16_500,
        nextPaymentDue: "2026-05-01",
        status: "current",
        daysDelinquent: 0,
        accruedInterest: 4_592,
        servicer: "Cantor Fitzgerald (External)",
        guarantors: [
          { name: "Robert Kim", relationship: "General Partner", ssn: "***-**-9910", riskScore: 85, riskLevel: "low", outstandingLoans: 3, totalGuaranteed: 5_400_000, flagged: false },
        ],
        documents: [
          { name: "Promissory Note", status: "executed", date: "2025-09-01", required: true },
          { name: "Deed of Trust", status: "executed", date: "2025-09-01", required: true },
          { name: "Loan Agreement", status: "executed", date: "2025-09-01", required: true },
          { name: "Personal Guaranty", status: "executed", date: "2025-09-01", required: true },
        ],
        payments: mkPayments("LN-10350", [
          { id: "PAY-090", loanId: "", date: "2026-04-01", scheduled: 16_500, received: 16_500, principal: 0, interest: 16_500, status: "on_time", method: "Wire", reference: "WIRE-44102" },
          { id: "PAY-091", loanId: "", date: "2026-03-01", scheduled: 16_500, received: 16_500, principal: 0, interest: 16_500, status: "on_time", method: "Wire", reference: "WIRE-43880" },
        ]),
        managementHistory: [
          { date: "2025-09-15", type: "note", user: "T. Reyes", detail: "Loan acquired from Cantor — externally serviced." },
        ],
      },
      {
        id: "LN-10480",
        source: "internal",
        borrowerId: "BRW-005",
        collateralAddress: "789 Lake Shore Dr, Chicago, IL 60611",
        loanAmount: 1_100_000,
        currentBalance: 1_050_000,
        interestRate: 11.5,
        loanType: "balloon",
        termMonths: 12,
        amortizationMonths: 240,
        lien: "first",
        ltv: 65,
        originationDate: "2025-12-01",
        maturityDate: "2026-12-01",
        monthlyPayment: 10_542,
        nextPaymentDue: "2026-05-01",
        status: "current",
        daysDelinquent: 0,
        accruedInterest: 3_018,
        servicer: "Northline Capital",
        guarantors: [
          { name: "Robert Kim", relationship: "General Partner", ssn: "***-**-9910", riskScore: 85, riskLevel: "low", outstandingLoans: 3, totalGuaranteed: 5_400_000, flagged: false },
        ],
        documents: [
          { name: "Promissory Note", status: "executed", date: "2025-12-01", required: true },
          { name: "Deed of Trust", status: "executed", date: "2025-12-01", required: true },
          { name: "Loan Agreement", status: "executed", date: "2025-12-01", required: true },
          { name: "Security Agreement", status: "executed", date: "2025-12-01", required: true },
          { name: "Personal Guaranty", status: "executed", date: "2025-12-01", required: true },
        ],
        payments: mkPayments("LN-10480", [
          { id: "PAY-100", loanId: "", date: "2026-04-01", scheduled: 10_542, received: 10_542, principal: 467, interest: 10_075, status: "on_time", method: "ACH", reference: "ACH-873990" },
          { id: "PAY-101", loanId: "", date: "2026-03-01", scheduled: 10_542, received: 10_542, principal: 463, interest: 10_079, status: "on_time", method: "ACH", reference: "ACH-870790" },
        ]),
        managementHistory: [
          { date: "2025-12-01", type: "approval", user: "T. Reyes", detail: "Funded." },
        ],
      },
    ],
    additionalDocuments: [
      { name: "2024 Federal Tax Return", status: "received", date: "2024-01-05", required: true },
      { name: "2023 Federal Tax Return", status: "received", date: "2024-01-05", required: true },
      { name: "Personal Financial Statement", status: "received", date: "2024-01-06", required: true },
      { name: "Partnership Agreement", status: "received", date: "2024-01-06", required: true },
    ],
  },
  {
    id: "BRW-006",
    firstName: "Priya",
    lastName: "Patel",
    email: "priya@patelconstruction.com",
    phone: "(555) 998-1144",
    homeAddress: "522 Birch Hollow, Atlanta, GA 30309",
    ssn: "***-**-3318",
    entityName: "Patel Construction Group",
    entityType: "LLC",
    riskScore: 78,
    riskLevel: "medium",
    totalBorrowed: 0,
    totalOutstanding: 0,
    activeLoans: 0,
    idVerified: true,
    backgroundCheck: "passed",
    applicationStatus: "pending",
    joined: "2026-04-18",
    annualIncome: 340_000,
    liquidAssets: 280_000,
    flaggedIssues: [
      { severity: "low", category: "documents", message: "Awaiting CPA-prepared P&L for 2025", date: "2026-04-22" },
    ],
    loans: [],
    additionalDocuments: [
      { name: "2024 Federal Tax Return", status: "received", date: "2026-04-19", required: true },
      { name: "2023 Federal Tax Return", status: "received", date: "2026-04-19", required: true },
      { name: "Personal Financial Statement", status: "received", date: "2026-04-20", required: true },
      { name: "2025 P&L (CPA-prepared)", status: "pending", required: true },
      { name: "Bank Statements (3 mo)", status: "received", date: "2026-04-20", required: true },
    ],
  },
];

export function searchBorrowers(query: string): Borrower[] {
  const q = query.toLowerCase().trim();
  if (!q) return borrowers;
  return borrowers.filter(
    (b) =>
      b.firstName.toLowerCase().includes(q) ||
      b.lastName.toLowerCase().includes(q) ||
      `${b.firstName} ${b.lastName}`.toLowerCase().includes(q) ||
      b.id.toLowerCase().includes(q) ||
      b.email.toLowerCase().includes(q) ||
      (b.entityName?.toLowerCase().includes(q) ?? false)
  );
}

export function getBorrowerById(id: string): Borrower | undefined {
  return borrowers.find((b) => b.id === id);
}

export function getAllLoans(): Loan[] {
  return borrowers.flatMap((b) => b.loans);
}

export function getLoanById(id: string): { loan: Loan; borrower: Borrower } | undefined {
  for (const b of borrowers) {
    const loan = b.loans.find((l) => l.id === id);
    if (loan) return { loan, borrower: b };
  }
  return undefined;
}

export interface PortfolioStats {
  totalOutstanding: number;
  paymentsCollectedThisMonth: number;
  paymentsScheduledThisMonth: number;
  delinquentReceivables: number;
  activeLoans: number;
  internalLoans: number;
  externalLoans: number;
  aging: { current: number; d30: number; d60: number; d90plus: number };
  paidThisMonth: { borrowerId: string; name: string; loanId: string; amount: number; date: string }[];
  unpaidThisMonth: { borrowerId: string; name: string; loanId: string; amount: number; due: string; daysLate: number }[];
}

export function getPortfolioStats(): PortfolioStats {
  const allLoans = getAllLoans();
  const totalOutstanding = allLoans.reduce((s, l) => s + l.currentBalance, 0);

  const currentMonth = "2026-04";
  let paymentsCollectedThisMonth = 0;
  let paymentsScheduledThisMonth = 0;
  const paidThisMonth: PortfolioStats["paidThisMonth"] = [];
  const unpaidThisMonth: PortfolioStats["unpaidThisMonth"] = [];

  for (const b of borrowers) {
    for (const loan of b.loans) {
      const monthPay = loan.payments.find((p) => p.date.startsWith(currentMonth));
      if (!monthPay) continue;
      paymentsScheduledThisMonth += monthPay.scheduled;
      if (monthPay.received > 0) {
        paymentsCollectedThisMonth += monthPay.received;
        paidThisMonth.push({
          borrowerId: b.id,
          name: `${b.firstName} ${b.lastName}`,
          loanId: loan.id,
          amount: monthPay.received,
          date: monthPay.date,
        });
      } else {
        const due = new Date(monthPay.date + "T00:00:00");
        const today = new Date("2026-04-26T00:00:00");
        const daysLate = Math.max(0, Math.round((today.getTime() - due.getTime()) / 86_400_000));
        unpaidThisMonth.push({
          borrowerId: b.id,
          name: `${b.firstName} ${b.lastName}`,
          loanId: loan.id,
          amount: monthPay.scheduled,
          due: monthPay.date,
          daysLate,
        });
      }
    }
  }

  const delinquentReceivables = allLoans
    .filter((l) => l.daysDelinquent > 0)
    .reduce((s, l) => s + l.monthlyPayment * Math.ceil(l.daysDelinquent / 30) + l.accruedInterest, 0);

  const aging = { current: 0, d30: 0, d60: 0, d90plus: 0 };
  for (const l of allLoans) {
    if (l.daysDelinquent === 0) aging.current += l.currentBalance;
    else if (l.daysDelinquent <= 30) aging.d30 += l.monthlyPayment;
    else if (l.daysDelinquent <= 60) aging.d60 += l.monthlyPayment * 2;
    else aging.d90plus += l.monthlyPayment * 3 + l.accruedInterest;
  }

  return {
    totalOutstanding,
    paymentsCollectedThisMonth,
    paymentsScheduledThisMonth,
    delinquentReceivables,
    activeLoans: allLoans.filter((l) => l.status !== "paid_off").length,
    internalLoans: allLoans.filter((l) => l.source === "internal").length,
    externalLoans: allLoans.filter((l) => l.source === "external").length,
    aging,
    paidThisMonth,
    unpaidThisMonth,
  };
}

export const documentTemplatesByLoanType: Record<string, { closing: string[]; underwriting: string[] }> = {
  interest_only: {
    closing: ["Promissory Note", "Deed of Trust", "Loan Agreement", "Security Agreement", "Personal Guaranty", "Title Insurance Policy", "Hazard Insurance Certificate"],
    underwriting: ["Government-Issued ID", "2 Years Tax Returns", "Personal Financial Statement", "Bank Statements (3 mo)", "Entity Documents", "Property Appraisal", "Title Report"],
  },
  amortizing: {
    closing: ["Promissory Note", "Deed of Trust", "Loan Agreement", "Security Agreement", "Personal Guaranty", "Amortization Schedule", "Title Insurance Policy", "Hazard Insurance Certificate"],
    underwriting: ["Government-Issued ID", "2 Years Tax Returns", "Personal Financial Statement", "Bank Statements (6 mo)", "Entity Documents", "Property Appraisal", "Title Report", "DSCR Analysis"],
  },
  balloon: {
    closing: ["Promissory Note (Balloon)", "Deed of Trust", "Loan Agreement", "Security Agreement", "Personal Guaranty", "Balloon Disclosure", "Title Insurance Policy"],
    underwriting: ["Government-Issued ID", "2 Years Tax Returns", "Personal Financial Statement", "Exit Strategy Documentation", "Bank Statements (3 mo)", "Entity Documents", "Property Appraisal"],
  },
  bridge: {
    closing: ["Promissory Note", "Deed of Trust", "Loan Agreement", "Personal Guaranty", "Take-Out Commitment Letter", "Title Insurance Policy"],
    underwriting: ["Government-Issued ID", "Take-Out Lender Approval", "Personal Financial Statement", "Bank Statements (3 mo)", "Property Appraisal"],
  },
};
