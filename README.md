# EventLy - Event Stall Aggregator & Booking Platform

**EventLy** is a production-minded two-sided commercial stall aggregator and booking marketplace connecting verified event organizers across India with artisan and commercial vendors.

---

## Key Features Built

- **Public Marketplace & Discovery**:
  - Filter and search by city, event category, dates, and stall types.
  - Transparent pricing stored with integer `paise` precision (INR).
  - Explicit footfall disclosure labeled as organizer-provided estimates.
- **Application-First Booking Workflow**:
  1. Vendor submits an application with brand details and desired stall quantity (no upfront payment).
  2. Organizer reviews the applicant's brand in their curation queue.
  3. Upon approval, an **atomic database transaction with row-level locking (`FOR UPDATE`)** checks capacity and reserves a **30-minute hold**.
  4. Vendor completes payment via **Razorpay**.
  5. Authoritative server verification confirms the booking and generates a verified digital stall pass.
- **Role-Based Portals**:
  - **Vendor Portal** (`/vendor`): Applications tracker, active hold countdown, checkout, confirmed digital vouchers, and cancellation/refund requests.
  - **Organizer Portal** (`/organizer`): Multi-tier stall creator, listing management, vendor application curation queue with feedback.
  - **Admin Operations** (`/admin`): Event publication queue, organizer verification audit, and refund processing center.
- **Dual Mode Flexibility**:
  - **Live Production Mode**: Connects directly to Supabase PostgreSQL and Razorpay webhooks.
  - **Instant Sandbox Demo Mode**: Automatically active when external API keys are not yet configured, allowing full end-to-end testing with demo data.

---

## Project Structure

```text
EventLy/
├── src/
│   ├── app/
│   │   ├── page.tsx                     # Landing page with search & featured events
│   │   ├── events/                      # Discovery & event details with Apply modal
│   │   ├── vendor/                      # Vendor dashboard, applications, bookings, refunds
│   │   ├── organizer/                   # Organizer hub, new event creator, review queue
│   │   ├── admin/                       # Admin verification, publication & refund queues
│   │   ├── login/                       # Sign in & 1-click role switcher
│   │   ├── terms/                       # Terms of Service
│   │   ├── refund-policy/               # Cancellation & refund rules
│   │   ├── privacy/                     # Privacy Policy
│   │   └── api/v1/                      # Authoritative REST API route handlers
│   │       ├── events/                  # Public listings & organizer submissions
│   │       ├── applications/            # Application submission & organizer approvals
│   │       ├── bookings/                # Booking details & Razorpay checkout sessions
│   │       ├── payments/verify/         # Authoritative signature verification
│   │       ├── webhooks/razorpay/       # Idempotent webhook handler
│   │       ├── refunds/                 # Vendor refund submission & admin decisions
│   │       └── admin/                   # Admin approval endpoints
│   ├── components/                      # Reusable UI components & modals
│   ├── lib/
│   │   ├── supabase/                    # Browser, server, and privileged admin clients
│   │   ├── razorpay/                    # Razorpay order creator & signature verifier
│   │   └── utils.ts                     # Paise-to-rupee, date, and styling helpers
│   ├── services/                        # Authoritative domain data service
│   └── types/                           # Complete database & API contracts
└── supabase/
    ├── migrations/
    │   ├── 001_initial_schema.sql       # 15 production tables, constraints & indexes
    │   ├── 002_rls_policies.sql         # Row Level Security for all roles
    │   └── 003_inventory_and_booking_functions.sql # Atomic hold & expiry stored procedures
    └── seed.sql                         # Dev demo seed data
```

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables (Optional for Live Mode)
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your credentials when ready:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `RAZORPAY_WEBHOOK_SECRET`

*(If keys are omitted, the platform runs in local sandbox simulation mode).*

### 3. Apply Supabase Database Migrations
Run the SQL files in `supabase/migrations/` in order in your Supabase SQL Editor:
1. `001_initial_schema.sql`
2. `002_rls_policies.sql`
3. `003_inventory_and_booking_functions.sql`
4. `seed.sql` (optional, for development)

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Immediate Demo Navigation

Use the **Demo Role** badge in the header or visit `/login` to switch between:
- **Vendor (`Rohan Verma`)**: Apply for stalls, test the 30-minute hold, and pay via Razorpay.
- **Organizer (`Kavita Sharma`)**: Review applicant portfolios, approve stalls, and define new events.
- **Administrator**: Verify organizers, approve listings for public discovery, and authorize refund requests.
