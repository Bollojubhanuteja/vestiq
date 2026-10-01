# VESTIQ — Investment Opportunity Discovery & Research Platform

> **Important Legal Position (V1 MVP):**
> Vestiq is strictly an informational discovery, research, and opportunity-management software platform. V1 does **NOT** handle customer money, execute investment transactions, act as a broker/dealer, or provide personalized financial advice.
> 
> *"Investment opportunities involve risk. Information provided on this platform is for discovery and research purposes and is not a guarantee of returns or financial advice."*

---

## 1. Architecture Overview

Vestiq is architected as a modern, maintainable monolithic full-stack application built with Next.js 14 App Router, TypeScript, and Prisma ORM:

```
vestiq/
├── prisma/
│   ├── schema.prisma       # Relational schema (13 models, PostgreSQL/SQLite compatible)
│   └── seed.js             # Realistic test demo data (clearly marked with [DEMO])
├── scripts/
│   ├── test-runner.js      # Automated unit & isolation verification suite (13 tests)
│   └── verify-e2e.js       # Live HTTP end-to-end route testing suite (20 tests)
├── src/
│   ├── app/
│   │   ├── (public pages)  # Home, Explore, How It Works, For Investors, For Businesses, About, FAQ, Contact
│   │   ├── (compliance)    # Risk Disclosure, Terms of Service, Privacy Policy
│   │   ├── (auth)          # Login, Register
│   │   ├── (onboarding)    # Investor 5-step onboarding flow
│   │   ├── (dashboards)    # Investor Dashboard, Business Dashboard, Admin Portal
│   │   └── api/            # 18 RESTful server routes with strict RBAC guards
│   ├── components/         # Reusable UI (Navbar, Footer, DisclaimerBanner, OpportunityCard, MatchScoreBadge)
│   ├── lib/
│   │   ├── db.ts           # Prisma singleton client with connection caching
│   │   ├── auth.ts         # JWT cookie session handling & bcrypt hashing
│   │   ├── rbac.ts         # Role-based authorization rules (INVESTOR, BUSINESS, ADMIN)
│   │   ├── matching.ts     # Transparent, deterministic preference matching engine
│   │   ├── audit.ts        # Immutable administrative audit logger
│   │   ├── analytics.ts    # Lightweight, privacy-respecting product analytics
│   │   └── ai.ts           # Safe, factual assistive aids (diligence questions, term definitions)
│   └── middleware.ts       # Edge route protection & role redirection
```

---

## 2. User Roles & Access Control (RBAC)

The platform enforces strict role-based separation:

| Role | Access Permissions | Data Isolation Guarantees |
| :--- | :--- | :--- |
| **INVESTOR** | Explore directory, configure matching criteria, private watchlist & notes, compare up to 3 ventures, submit information requests to founders. | **Strict Isolation:** Investor A can never view or edit Investor B's watchlist, notes, or preferences. |
| **BUSINESS** | Draft company profile, submit for administrative review, manage documents, reply to inbound investor inquiries. | **Strict Isolation:** Business A can never access or modify Business B's profile, financial claims, or inquiries. |
| **ADMIN** | System-wide metrics, review queue triage, document inspection, approval/rejection decisions, risk flag tagging, matching weights calibration, immutable audit logs. | Only authenticated sessions with `role: 'ADMIN'` can access `/admin/*` and administrative API routes. |

---

## 3. Matching Engine Mechanics

The Preference Match Score is **completely deterministic and rule-based**:
- **Not an AI blackbox.**
- **Never presented as a success probability, profit prediction, or investment endorsement.**
- Clearly labeled on every card as: `"Preference Match: X%"` with an interactive popup breaking down points earned:

$$\text{Match Score} = \sum (\text{Factor Score}_i \times \text{Weight}_i)$$

Configurable weights (calibrated in Admin portal):
1. **Industry Alignment:** 25%
2. **Ticket Size & Amount Compatibility:** 20%
3. **Business Stage Fit:** 15%
4. **Geographic Alignment:** 10%
5. **Investment Horizon Compatibility:** 15%
6. **Risk Tolerance Alignment:** 15%

---

## 4. Environment Variables

Create a `.env` file in the root directory:

```env
# Database connection string
# Local Development:
DATABASE_URL="file:./dev.db"

# Production PostgreSQL:
# DATABASE_URL="postgresql://vestiq_user:your_password@localhost:5432/vestiq_db?schema=public"

# Session JWT secret (minimum 32 random characters)
JWT_SECRET="vestiq-dev-jwt-super-secret-key-32-chars-long-minimum-secure"

# Application domain URL
NEXT_PUBLIC_APP_NAME="Vestiq"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

---

## 5. Quick Start & Local Execution

### Prerequisites
- Node.js v18+ (tested on Node v24.19)
- npm v9+

### Installation & Setup
```bash
# 1. Install dependencies
npm install

# 2. Push database schema
npx prisma db push

# 3. Seed realistic development/demo data
npm run seed

# 4. Run automated test suites
npm run test
node scripts/verify-e2e.js

# 5. Start development server
npm run dev
# Server will be live at: http://localhost:3000
```

---

## 6. Pre-Configured Demo Credentials

The seed script creates realistic demo accounts for quick testing:

| Role | Email | Password | Persona |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@vestiq.com` | `Password123!` | Elena Vance (Lead Compliance Admin) |
| **Investor** | `investor@vestiq.com` | `Password123!` | Vikram Mehta (Private Angel Allocator) |
| **Startup Founder** | `contact@agripulse.demo` | `Password123!` | Ananya Roy (AgriPulse Technologies) |

*(Quick test login shortcuts are also available directly on the `/login` screen and top navigation bar.)*

---

## 7. Security Architecture

1. **Password Security:** All passwords hashed using `bcryptjs` with salt work factor of 10. Passwords are never logged or stored in plaintext.
2. **Session Integrity:** Signed using modern `HS256` JWTs (`jose`) stored in `HttpOnly`, `SameSite: Lax` cookies, inaccessible to JavaScript XSS attacks.
3. **Strict Route Protection:** Edge-runtime middleware blocks unauthorized navigation before SSR payload rendering.
4. **Server-Side Validation:** Every input is validated using `Zod` schemas before executing database mutations.
5. **No Public Discovery Without Approval:** Queries on public discovery strictly enforce `where: { status: 'APPROVED', isPublished: true }`.
6. **Immutable Audit Logging:** All status modifications, verification badge changes, and matching configuration updates record the acting admin's ID, previous state, new state, and timestamp.

---

## 8. Deployment to Production

### Deploying on Vercel / Railway / AWS / Docker:

1. **Database:** Provision a managed PostgreSQL instance (e.g. Supabase, AWS RDS, Neon).
2. **Prisma Configuration:** Change datasource in `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
3. **Environment Secrets:**
   - Configure `DATABASE_URL` with your PostgreSQL connection string.
   - Generate a cryptographically secure 64-character secret for `JWT_SECRET`.
   - Set `NODE_ENV="production"`.
4. **Build & Run:**
   ```bash
   npx prisma migrate deploy
   npm run build
   npm start
   ```

---

## 9. Professional Legal & Compliance Pre-Launch Checklist

Before commercial launch, a licensed legal, corporate securities, and regulatory compliance counsel must review:

- [ ] **Securities Law & Broker-Dealer Exemption:** Confirm that matching and discovery functionality remains firmly within the publisher/directory safe-harbor and does not constitute broker-dealer activity under local jurisdictions (e.g., SEC Rule 3a4-1 / Finra in US, SEBI in India, FCA in UK).
- [ ] **Accredited / Sophisticated Investor Standards:** Determine if local regulations require accredited investor verification before users can view full private business dossiers or request data rooms.
- [ ] **Financial Promotions & Advertising Regulations:** Ensure business pitches submitted by founders do not violate restrictions on public solicitation of private securities.
- [ ] **KYC / AML Readiness:** Establish procedures for verifying identity documents uploaded by company founders before granting "Information Verified" badges.
- [ ] **Terms of Service & Risk Disclosures Review:** Professional review of platform disclaimers, liability caps, and non-brokerage statements.
- [ ] **Cross-Border Capital Considerations:** Implement geographic filtering if foreign investment regulations (e.g. FEMA in India, CFIUS in US) restrict cross-border angel syndication.
- [ ] **Data Protection & Privacy Compliance:** Verify compliance with GDPR, DPDP Act (India), or CCPA regarding the storage and transmission of founder contact data.
