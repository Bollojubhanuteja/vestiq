/**
 * Vestiq Platform - Institutional Legal Agreement Generator
 * 
 * Generates legally structured contracts under Indian corporate & contract law:
 * 1. Indicative Term Sheets (Option 1: Fixed Return / Option 2: Equity Partnership)
 * 2. Formal Loan & Debenture Deeds (Asset-Backed Debt Facility)
 * 3. Formal Shareholders' Agreements (SHA) & Share Subscription Agreements (SSA)
 */

export interface LegalPartyInfo {
  name: string;
  legalEntity?: string;
  email: string;
  city?: string;
  country?: string;
  panOrCin?: string;
  designation?: string;
}

export interface FixedReturnParams {
  principalAmount: number;
  couponRatePercent: number; // e.g. 16.0
  tenureMonths: number; // e.g. 24
  repaymentFrequency: 'MONTHLY' | 'QUARTERLY' | 'BULLET';
  collateralDescription: string;
  intendedUseOfFunds?: string;
}

export interface EquityParams {
  investmentAmount: number;
  preMoneyValuation: number;
  equityOfferedPercent: number;
  postMoneyValuation: number;
  investorRights: string;
  intendedUseOfFunds?: string;
}

export function formatINR(val: number): string {
  if (val >= 10000000) {
    return `₹${(val / 10000000).toFixed(2)} Crore`;
  }
  if (val >= 100000) {
    return `₹${(val / 100000).toFixed(2)} Lakhs`;
  }
  return `₹${val.toLocaleString('en-IN')}`;
}

/**
 * Generate Indicative Term Sheet (Stage 1)
 */
export function generateIndicativeTermSheet(
  agreementType: 'FIXED_RETURN_DEBT' | 'EQUITY_PARTNERSHIP',
  business: {
    companyName: string;
    founderName: string;
    city?: string;
    industry?: string;
    proposedReturnRate?: number | null;
    investmentTenureMonths?: number | null;
    repaymentFrequency?: string | null;
    collateralDetails?: string | null;
    valuation?: number | null;
    equityOffered?: number | null;
    investorRights?: string | null;
  },
  amount: number
): string {
  if (agreementType === 'FIXED_RETURN_DEBT') {
    const coupon = business.proposedReturnRate || 16.0;
    const tenure = business.investmentTenureMonths || 24;
    const freq = business.repaymentFrequency || 'MONTHLY';
    const collateral = business.collateralDetails || 'First hypothecation charge on commercial receivables and operational assets';

    return `INDICATIVE TERM SHEET: SECURED FIXED-RETURN FUNDING FACILITY
================================================================================
Company / Borrower:   ${business.companyName}
Promoter / Founder:   ${business.founderName}
Facility Amount:      ₹${amount.toLocaleString('en-IN')} (${formatINR(amount)})
Proposed Coupon Rate: ${coupon}% p.a.
Tenure Duration:      ${tenure} Months
Repayment Cadence:    ${freq} Amortization
Security / Charge:    ${collateral}
Governing Law:        Laws of the Republic of India

KEY INDICATIVE TERMS:
1. FACILITY NATURE: Senior secured debt facility with fixed coupon distribution.
2. AMORTIZATION: Interest and principal repayment disbursed on agreed ${freq.toLowerCase()} cadence.
3. SECURITY: Exclusive first charge on company receivables and operational equipment registered with ROC on Form CHG-1.
4. COVENANTS: Borrower shall deliver monthly revenue statements and quarterly compliance certificates.
5. CONVERSION: Parties agree to promote this term sheet into a formal Loan & Debenture Deed upon bilateral confirmation.`;
  } else {
    const val = business.valuation || (amount * 10);
    const equity = business.equityOffered || ((amount / val) * 100);
    const postVal = val + amount;
    const rights = business.investorRights || 'Information rights, quarterly audited financial MIS, affirmative voting on reserved matters, pro-rata subscription rights';

    return `INDICATIVE TERM SHEET: DIRECT EQUITY & STRATEGIC PARTNERSHIP
================================================================================
Company / Issuer:     ${business.companyName}
Founding Partner:     ${business.founderName}
Investment Check:     ₹${amount.toLocaleString('en-IN')} (${formatINR(amount)})
Pre-Money Valuation:  ₹${val.toLocaleString('en-IN')} (${formatINR(val)})
Post-Money Valuation: ₹${postVal.toLocaleString('en-IN')} (${formatINR(postVal)})
Equity Pool Offered:  ${equity.toFixed(2)}%
Governance Rights:    ${rights}
Governing Law:        Companies Act, 2013 & Laws of India

KEY INDICATIVE TERMS:
1. CAPITAL STRUCTURE: Issuance of fresh equity/CCPS shares equivalent to ${equity.toFixed(2)}% post-money cap table.
2. USE OF PROCEEDS: Growth expansion, working capital, and product milestones as detailed in verified diligence room.
3. GOVERNANCE: Standard affirmative covenants on major corporate actions, quarterly audited reporting, and observer rights.
4. ANTI-DILUTION: Broad-based weighted average anti-dilution protection and pre-emptive rights on future capital rounds.
5. CONVERSION: Parties agree to promote this term sheet into a formal Shareholders' Agreement (SHA) upon bilateral confirmation.`;
  }
}

/**
 * Generate Formal Loan & Debenture Deed (Stage 2 - Fixed Return)
 */
export function generateFormalLoanDebentureDeed(params: {
  deedId: string;
  companyName: string;
  companyCity?: string;
  founderName: string;
  investorName: string;
  investorCity?: string;
  principalAmount: number;
  couponRatePercent: number;
  tenureMonths: number;
  repaymentFrequency: string;
  collateralDescription: string;
  intendedUseOfFunds?: string;
}): string {
  const annualInterest = (params.principalAmount * (params.couponRatePercent / 100));
  const totalInterest = (annualInterest * (params.tenureMonths / 12));
  const totalRepayment = params.principalAmount + totalInterest;

  return `================================================================================
DEED OF SECURED LOAN & DEBENTURE FACILITY
================================================================================
REFERENCE ID: ${params.deedId}
EXECUTION FRAMEWORK: Indian Contract Act, 1872 & Companies Act, 2013

THIS SECURED LOAN & DEBENTURE FACILITY DEED ("Deed") is entered into by and between:

1. THE BORROWER:
   ${params.companyName}, a private company incorporated under the laws of India, having its principal place of business at ${params.companyCity || 'Bengaluru, India'} (hereinafter referred to as the "Company" or "Borrower", which expression shall include its successors and permitted assigns);

2. THE PROMOTER-GUARANTOR:
   ${params.founderName}, Founder & Director of the Company (hereinafter referred to as the "Promoter Guarantor"); and

3. THE INVESTOR / LENDER:
   ${params.investorName}, residing/operating at ${params.investorCity || 'India'} (hereinafter referred to as the "Lender" or "Investor").

(The Borrower, Promoter-Guarantor, and Lender are collectively referred to as the "Parties" and individually as a "Party".)

--------------------------------------------------------------------------------
RECITALS:
--------------------------------------------------------------------------------
A. The Borrower is engaged in commercial business operations and requires structured growth capital for: ${params.intendedUseOfFunds || 'business expansion, inventory procurement, and working capital'}.
B. The Borrower listed its capital requirement on the Vestiq Platform, and the Lender reviewed and accepted the investment proposal.
C. The Lender has agreed to advance a secured funding facility to the Borrower, subject to the contractual covenants, fixed returns, and security provisions set forth herein.

NOW, THEREFORE, IN CONSIDERATION OF THE MUTUAL COVENANTS CONTAINED HEREIN, THE PARTIES AGREE AS FOLLOWS:

--------------------------------------------------------------------------------
CLAUSE 1: PRINCIPAL FACILITY & DRAWDOWN
--------------------------------------------------------------------------------
1.1 Facility Amount: The Lender sanctions and advances a facility of ₹${params.principalAmount.toLocaleString('en-IN')} (${formatINR(params.principalAmount)}) to the designated bank account of the Company.
1.2 Purpose: The Borrower shall deploy the proceeds exclusively for approved business objectives.
1.3 Tenure: The facility is granted for a fixed duration of ${params.tenureMonths} Months from the date of final electronic execution.

--------------------------------------------------------------------------------
CLAUSE 2: FIXED RETURN, COUPON & REPAYMENT SCHEDULE
--------------------------------------------------------------------------------
2.1 Coupon / Return Rate: The facility carries an agreed fixed return rate of ${params.couponRatePercent}% per annum (p.a.).
2.2 Repayment Frequency: Repayments shall be disbursed on a ${params.repaymentFrequency} schedule.
2.3 Total Repayment Obligation:
    - Principal Amount:        ₹${params.principalAmount.toLocaleString('en-IN')}
    - Total Agreed Return:     ₹${totalInterest.toLocaleString('en-IN')}
    - Total Repayment Amount:  ₹${totalRepayment.toLocaleString('en-IN')}
2.4 Pre-Payment: The Company may pre-pay the outstanding balance with prior written notice without penalty, provided accrued interest is settled.

--------------------------------------------------------------------------------
CLAUSE 3: SECURITY, HYPOTHECATION & ROC CHARGE CREATION
--------------------------------------------------------------------------------
3.1 Exclusive First Charge: As security for the timely repayment of the facility, the Company hereby creates an exclusive first charge by way of hypothecation over:
    "${params.collateralDescription || 'Company commercial receivables, plant & machinery, and inventory'}".
3.2 Statutory ROC Filing: The Company covenants to file Form CHG-1 with the Registrar of Companies (ROC), Ministry of Corporate Affairs, within 30 days of execution.
3.3 Personal Guarantee: The Promoter-Guarantor irrevocably and unconditionally guarantees the due and punctual performance of the Company's repayment obligations.

--------------------------------------------------------------------------------
CLAUSE 4: COVENANTS & REPORTING REQUIREMENTS
--------------------------------------------------------------------------------
4.1 Monthly Information Statement (MIS): The Company shall furnish monthly financial reports, revenue numbers, and GST summaries to the Lender within 15 days of each month-end.
4.2 Inspection Rights: The Lender or its authorized representative shall have reasonable inspection rights over accounts, inventory, and pledged collateral upon prior notice.
4.3 Solvency & Good Standing: The Company represents that it is solvent, has paid all statutory taxes, and has no pending insolvency or winding-up proceedings.

--------------------------------------------------------------------------------
CLAUSE 5: EVENTS OF DEFAULT & ACCELERATION
--------------------------------------------------------------------------------
5.1 Any of the following shall constitute an Event of Default:
    (a) Failure by the Borrower to remit any scheduled principal or coupon payment within 15 days of the due date;
    (b) Material breach of any covenant, warranty, or representation contained herein;
    (c) Insolvency, bankruptcy, or voluntary winding-up of the Company.
5.2 Consequence of Default: Upon occurrence of an Event of Default, the entire outstanding facility and accrued return shall immediately become due and payable, and the Lender shall be entitled to enforce the charge against the hypothecated assets.

--------------------------------------------------------------------------------
CLAUSE 6: DISPUTE RESOLUTION & GOVERNING LAW
--------------------------------------------------------------------------------
6.1 Arbitration: Any dispute arising out of this Deed shall be resolved by binding arbitration in accordance with the Arbitration & Conciliation Act, 1996 of India.
6.2 Seat & Venue: The seat of arbitration shall be ${params.companyCity || 'Bengaluru'}, India. The proceedings shall be conducted in English by a sole arbitrator.
6.3 Governing Law: This Deed is governed exclusively by the laws of India.

--------------------------------------------------------------------------------
CLAUSE 7: ELECTRONIC EXECUTION & STATUTORY VALIDITY
--------------------------------------------------------------------------------
7.1 The Parties confirm that electronic execution on the Vestiq Platform constitutes a valid and binding execution under Section 10A of the Information Technology Act, 2000.
7.2 This Deed shall become fully operative upon digital execution by both the Investor and the authorized Founder-Director.
================================================================================`;
}

/**
 * Generate Formal Shareholders' Agreement (SHA) (Stage 2 - Equity Partnership)
 */
export function generateShareholdersAgreement(params: {
  deedId: string;
  companyName: string;
  companyCity?: string;
  founderName: string;
  investorName: string;
  investorCity?: string;
  investmentAmount: number;
  preMoneyValuation: number;
  equityOfferedPercent: number;
  postMoneyValuation?: number;
  investorRights?: string;
  intendedUseOfFunds?: string;
}): string {
  const postVal = params.postMoneyValuation || (params.preMoneyValuation + params.investmentAmount);

  return `================================================================================
SHAREHOLDERS' AGREEMENT (SHA) & SHARE SUBSCRIPTION AGREEMENT
================================================================================
REFERENCE ID: ${params.deedId}
EXECUTION FRAMEWORK: Companies Act, 2013 & Indian Contract Act, 1872

THIS SHAREHOLDERS' AGREEMENT & SHARE SUBSCRIPTION AGREEMENT ("Agreement") is executed by and among:

1. THE COMPANY:
   ${params.companyName}, a company incorporated under the Companies Act, having its registered office at ${params.companyCity || 'Bengaluru, India'} (hereinafter referred to as the "Company");

2. THE FOUNDERS / PROMOTERS:
   ${params.founderName}, holding majority equity shareholding and executive management of the Company (hereinafter referred to as the "Founders"); and

3. THE INVESTOR:
   ${params.investorName}, residing/operating at ${params.investorCity || 'India'} (hereinafter referred to as the "Investor").

(The Company, Founders, and Investor are collectively referred to as the "Parties" and individually as a "Party".)

--------------------------------------------------------------------------------
RECITALS:
--------------------------------------------------------------------------------
A. The Company operates a private enterprise and has sought strategic capital investment on the Vestiq Platform.
B. The Investor has conducted preliminary diligence on the Company's business model, traction, and capital capitalization table.
C. The Investor wishes to subscribe to equity / convertible shares of the Company, and the Company wishes to issue and allot such shares, in consideration of the investment amount and on the terms set forth herein.

NOW, THEREFORE, THE PARTIES MUTUALLY AGREE AS FOLLOWS:

--------------------------------------------------------------------------------
CLAUSE 1: INVESTMENT SUBSCRIPTION & VALUATION
--------------------------------------------------------------------------------
1.1 Subscription Amount: The Investor agrees to subscribe to equity shares for an aggregate consideration of ₹${params.investmentAmount.toLocaleString('en-IN')} (${formatINR(params.investmentAmount)}).
1.2 Valuation:
    - Pre-Money Valuation:   ₹${params.preMoneyValuation.toLocaleString('en-IN')} (${formatINR(params.preMoneyValuation)})
    - Investment Check:      ₹${params.investmentAmount.toLocaleString('en-IN')} (${formatINR(params.investmentAmount)})
    - Post-Money Valuation:  ₹${postVal.toLocaleString('en-IN')} (${formatINR(postVal)})
1.3 Equity Allocation: Against receipt of the Subscription Amount, the Company shall allot equity shares representing ${params.equityOfferedPercent.toFixed(2)}% of the fully diluted share capital.
1.4 Statutory Allotment: Within 30 days of subscription funds receipt, the Company shall convene a Board meeting, pass share allotment resolutions, and file Form PAS-3 with the Registrar of Companies (ROC).

--------------------------------------------------------------------------------
CLAUSE 2: GOVERNANCE, BOARD & OBSERVER RIGHTS
--------------------------------------------------------------------------------
2.1 Board Representation / Observer: The Investor shall have the right to appoint one (1) Board Observer entitled to attend all meetings of the Board of Directors, receive all Board packs, and participate in deliberations.
2.2 Information Rights: The Company shall provide to the Investor:
    (a) Monthly unaudited MIS including P&L, balance sheet, and cash flow statement within 15 days of month-end;
    (b) Quarterly financial performance updates within 30 days of quarter-end;
    (c) Annual audited financial statements prepared by an independent chartered accountant within 90 days of fiscal year-end.

--------------------------------------------------------------------------------
CLAUSE 3: RESERVED MATTERS & AFFIRMATIVE VOTING RIGHTS
--------------------------------------------------------------------------------
3.1 The Company and Founders covenant that no decision shall be taken regarding the following Reserved Matters without prior affirmative consent of the Investor:
    (a) Any amendment to the Memorandum of Association (MOA) or Articles of Association (AOA);
    (b) Issue of shares ranking senior in liquidation or dividend to the Investor's shares;
    (c) Entering into any debt or borrowing exceeding 25% of annual net revenue;
    (d) Any merger, acquisition, sale of substantial business assets, or liquidation of the Company;
    (e) Related-party transactions exceeding ₹5,00,000 annually.

--------------------------------------------------------------------------------
CLAUSE 4: PRE-EMPTIVE RIGHTS & ANTI-DILUTION PROTECTION
--------------------------------------------------------------------------------
4.1 Pro-Rata Rights: In any future issuance of shares or convertible instruments, the Investor shall have the right to subscribe pro-rata to maintain its ${params.equityOfferedPercent.toFixed(2)}% ownership.
4.2 Anti-Dilution: In the event of any subsequent round of financing at an effective per-share price lower than the Investor's subscription price (Down Round), the Investor shall be entitled to broad-based weighted average anti-dilution adjustments.

--------------------------------------------------------------------------------
CLAUSE 5: TRANSFER OF SHARES, ROFR & TAG-ALONG RIGHTS
--------------------------------------------------------------------------------
5.1 Lock-In Period: The Founders agree to a 24-month equity lock-in from the Execution Date to ensure commitment to operational growth.
5.2 Right of First Refusal (ROFR): If any Founder desires to sell equity, the Investor shall have the first right to purchase such shares on identical terms.
5.3 Tag-Along Right: If any Founder proposes to transfer shares to a third party, the Investor shall have the right to participate in the sale on equal terms and price pro-rata.

--------------------------------------------------------------------------------
CLAUSE 6: REPRESENTATIONS & WARRANTIES
--------------------------------------------------------------------------------
6.1 The Company and Founders represent that the financial metrics, customer contracts, and intellectual property disclosed on the Vestiq data room are true, accurate, and free of undisclosed liabilities.
6.2 The Founders agree to devote their full commercial time, skill, and attention to the business of the Company.

--------------------------------------------------------------------------------
CLAUSE 7: DISPUTE RESOLUTION & GOVERNING LAW
--------------------------------------------------------------------------------
7.1 Arbitration: Any dispute under this Agreement shall be resolved through arbitration under the Arbitration & Conciliation Act, 1996 of India.
7.2 Seat & Venue: The seat of arbitration shall be ${params.companyCity || 'Bengaluru'}, India.
7.3 Governing Law: This Agreement is governed by the laws of India and subject to the exclusive jurisdiction of the courts at ${params.companyCity || 'Bengaluru'}.

--------------------------------------------------------------------------------
CLAUSE 8: DIGITAL EXECUTION VALIDITY
--------------------------------------------------------------------------------
8.1 Electronic Signature: Digital execution on the Vestiq platform constitutes valid and binding legal assent under Section 10A of the Information Technology Act, 2000.
8.2 Effectiveness: This Agreement shall take full effect upon execution by both the Founder on behalf of the Company and the Investor.
================================================================================`;
}
