# Clipper — AI-Powered Short-Form Editing & One-to-One Distribution Marketplace

A complete, production-grade web application and marketplace platform where content creators submit long-form source videos, the internal production team transforms them into high-retention short edits, and deterministic AI recommends verified social channels to publish each finished edit on **exactly one page**.

---

## 🌟 Core Non-Negotiable Business Rules

1. **`ONE_EDIT_ONE_PAGE`**:
   - **Rule**: One finalized unique edit may be distributed to **ONE social page only**. One Edit ID maps to no more than one distribution partner page for its entire lifecycle.
   - **Enforcement**: Enforced in backend service logic and database engine via `@unique([finalEditId])` on the `DistributionAssignment` table and transactional locking (`db.$transaction`). Second assignment attempts, even by an administrator, are strictly rejected with HTTP `409 Conflict`.
   - **Audit Trail**: Once committed, an Edit ID is immutable. If an assignment fails or is cancelled, a materially distinct creative must be approved with a new Edit ID.

2. **`DISTRIBUTION_PARTNER_DOES_NOT_EDIT`**:
   - Distribution partners only receive approved finished videos. They do not edit raw footage or alter subtitles. They publish the creative on their assigned channel and submit the public post URL and proof for automated and QA verification.

3. **`INTERNAL_TEAM_OWNS_EDITING_WORKFLOW`**:
   - The platform’s internal video editors control cuts, pacing, vertical 9:16 re-framing, and subtitles. Quality reviewers verify audio normalization (-14 LUFS standard) and accuracy before creator review.

4. **`CREATOR_APPROVAL`**:
   - Creators must approve the final edit cut in their personal Studio and explicitly approve the proposed destination channel before the assignment lock is committed.

5. **`NO_FAKE_ANALYTICS`**:
   - Every metric displays its verifiable data source (`PLATFORM_API`, `MANUAL_VERIFIED`, `PARTNER_SUBMITTED`, `ESTIMATED`), collection timestamp, and attribution limitation caveats. Never fabricates live view counts or virality guarantees.

6. **`NO_SOCIAL_PASSWORDS`**:
   - Channel ownership verification is performed via official OAuth 2.0 flows or temporary public bio verification codes. No user passwords are ever collected or stored.

7. **`RIGHTS_BEFORE_DISTRIBUTION`**:
   - Creators must certify ownership or commercial synchronization licenses for source footage, B-roll, and music before production and distribution can commence.

---

## 🏗️ Architecture & Technology Stack

- **Frontend**: Next.js 15 (App Router, Server Components & Client Components), React 19, TypeScript.
- **Styling & UI**: Tailwind CSS, Lucide React, accessible data tables, badge indicators, and interactive status chips.
- **Database & ORM**: PostgreSQL-compatible SQLite / Prisma ORM with strict unique constraints, foreign keys, and indexes.
- **AI Matching Engine**: 7-factor deterministic recommendation model:
  - Niche & Content Relevance: **25%**
  - Median Views & Consistency: **20%**
  - Audience Demographics & Geography: **15%**
  - Budget & Placement Price Fit: **15%**
  - Cadence & Posting Frequency: **10%**
  - Historical Delivery Reliability: **10%**
  - Verification Completeness: **5%**
- **Storage Layer**: Private object storage adapter with short-lived presigned upload URLs (up to 10GB) and 15-minute expiring download links.
- **Finance Engine**: Transparent unbundled quotes (Editing Subtotal + Placement Subtotal + 10% Platform Fee), double-entry ledger entries table, and marketplace payout batch processor.
- **Social Integration Adapters**: YouTube Data & Analytics API, Meta Graph API (Instagram Professional), and TikTok Developer API.

---

## 🗺️ Route Map & Marketplace Portals

### 1. Public Marketing Website
- `/` — Homepage with value proposition, interactive live workflow simulator, trust indicators, and CTA.
- `/for-creators` — Creator service overview, 1:1 distribution guarantee, internal studio benefits.
- `/for-distribution-partners` — Partner recruitment, monetization rates, and no-editing policy.
- `/how-it-works` — Visual 9-step timeline from raw upload to payout settlement.
- `/pricing` — Unbundled quotes, live calculator, platform commission explanation.
- `/about` — Editorial mission and philosophy against duplicate spam.
- `/contact` — Validated operational contact form with departmental SLA routing.
- `/faq` — Detailed answers regarding 1:1 exclusivity, analytics caveats, and payouts.
- `/terms` — Reviewed marketplace terms and single-distribution covenants.
- `/privacy` — Privacy policy, AES-256 token encryption, and no-password pledge.
- `/copyright` — Formal DMCA takedown complaint and intellectual property form.

### 2. Authentication & Onboarding
- `/login` — Sign in with quick-switch demo persona buttons.
- `/register` — Account registration with role selection.
- `/select-account-type` — Split pathway for Creators vs Distribution Partners.
- `/onboarding` — First-run onboarding setup wizard.

### 3. Content Creator Portal
- `/creator/dashboard` — Executive overview, spend, approved Edit IDs, and observed views.
- `/creator/campaigns` — Campaign directory with status filters and metrics.
- `/creator/campaigns/new` — 4-Step Interactive Campaign Wizard (Upload, Brief, Rights, Quote & Pay).
- `/creator/studio` — Interactive Studio review: 9:16 vertical video player, version history, revision request, and final Edit ID approval.
- `/creator/discover` — AI Page Discovery matrix with 7-factor scores, gap caveats, and 1:1 commit action.
- `/creator/placements` — 1:1 Placement Tracker with live post URLs and verification badges.
- `/creator/analytics` — Detailed performance tables, effective CPM, and CSV data export.
- `/creator/billing` — Quotes, invoices, receipts, and ledger records.
- `/creator/messages` — Campaign-scoped communication with internal production staff.
- `/creator/settings` — Brand profile, default licensing territories, and data export/deletion controls.

### 4. Distribution Partner Portal
- `/partner/dashboard` — Invitations, active assignments, earnings, and channel status.
- `/partner/pages` — Registered social pages directory with verification levels.
- `/partner/pages/new` — Add new channel with non-invasive bio code challenge.
- `/partner/invitations` — Review placement compensation, brief guidelines, and accept/decline.
- `/partner/assignments` — Accepted assignments, expiring signed video downloads (15 min), and caption copy.
- `/partner/submit-post` — Submit live post URL, timestamp, and proof screenshot.
- `/partner/analytics` — Channel performance and permitted post insights.
- `/partner/earnings` — Payout history, Stripe Connected Account status, and ledger records.
- `/partner/settings` — Business profile, W-9 tax classification, and bank transfer settings.

### 5. Internal Production & QA Portal
- `/team/dashboard` — Production work queue, SLA deadlines, and review status.
- `/team/editing` — Video editor workspace: source file download, hook selector, 9:16 re-framing, and draft upload.
- `/team/quality-review` — QA gate checklist (LUFS audio normalization, aspect ratio, hook quality, subtitles, rights check) to approve or return edits.
- `/team/campaign-operations` — Campaign milestones and publishing window monitoring.

### 6. Admin Governance & Executive Portal
- `/admin/dashboard` — Global telemetry: GMV, revenues, payables, and dispute rates.
- `/admin/users` — User management, RBAC roles, and suspension controls.
- `/admin/pages` — Channel verification audit queue and reviewer approvals.
- `/admin/campaigns` — Global campaign supervisor and budget control.
- `/admin/assets` — Immutable Asset & Edit Vault with SHA-256 hashes and lock bindings.
- `/admin/assignments` — Distribution 1:1 Operations Console with interactive duplicate assignment violation tester.
- `/admin/finance` — Double-entry ledger, invoice receipts, and marketplace payout batch disbursement.
- `/admin/analytics` — Macro business intelligence, conversion funnels, and retention.
- `/admin/disputes` — Dispute resolution tickets and DMCA takedown actions.
- `/admin/integrations` — Official OAuth application configurations and sync status.
- `/admin/settings` — Configurable pricing rules, commission rates, and AI weights.
- `/admin/audit-logs` — Cryptographically recorded immutable audit trail.

---

## 🚀 Quickstart & Setup Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Initialize Database Schema
Sync database tables and unique constraints:
```bash
npm run db:push
```

### 4. Seed Realistic Demo Data
Populate users across all roles, campaigns, source files, approved Edit IDs, and verified placements:
```bash
npm run db:seed
```

### 5. Run Automated Acceptance Tests
Verify database unique constraints and business rules:
```bash
npm test
```

### 6. Launch Application
Start the Next.js development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Automated Acceptance Tests

The included test suite (`scripts/run-tests.mjs`) verifies:
- **Test 1**: Strict rejection of duplicate Edit ID assignments (`ONE_EDIT_ONE_PAGE`) via Prisma unique constraint `P2002`.
- **Test 2**: Assignment state and immutable audit trail verification.
- **Test 3**: Provenance attribution and non-fake metrics enforcement.
- **Test 4**: Mandatory rights and licensing declarations.
- **Test 5**: Financial math, unbundled quotes, and double-entry ledger balance.

---

## 🔒 Security & Platform Policies

- **Envelope Encryption**: Tokens and private secrets are stored securely and never exposed in client bundles.
- **Least-Privilege RBAC**: Server-side role and resource ownership checks on every API endpoint.
- **Audited Ledger**: Every customer payment, platform fee, and partner disbursement generates an immutable audit record with actor ID, timestamp, and IP address.
- **Platform Policy Compliance**: Designed in strict alignment with YouTube API Services Terms of Service, Meta Platform Terms, and TikTok Developer Terms.
