// src/app/terms/page.tsx
export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Terms of Service</h1>
      <p className="text-xs text-slate-500">Effective Date: October 2026 • Platform Version 1.0</p>

      <div className="prose prose-slate text-sm space-y-4 text-slate-600 leading-relaxed">
        <h2 className="text-lg font-bold text-slate-900 pt-2">1. Nature of the Platform</h2>
        <p>
          EventLy operates as an application-first commercial stall aggregator and discovery marketplace connecting independent event organizers with commercial and artisan vendors across India.
        </p>

        <h2 className="text-lg font-bold text-slate-900 pt-2">2. Organizer Verification & Footfall Estimates</h2>
        <p>
          Event organizers undergo manual verification prior to listing publication. Visitor footfall numbers displayed on event listings represent organizer-provided forward estimates and do not constitute a financial guarantee of attendee traffic or vendor sales revenue.
        </p>

        <h2 className="text-lg font-bold text-slate-900 pt-2">3. Inventory Reservation Holds</h2>
        <p>
          Upon an organizer approving a vendor application, an atomic 30-minute reservation hold is placed on the requested stall capacity. Vendors must complete checkout via Razorpay within this 30-minute window. If payment is not completed before hold expiry, the inventory is automatically released.
        </p>

        <h2 className="text-lg font-bold text-slate-900 pt-2">4. Payment Processing</h2>
        <p>
          All stall fees are collected in Indian Rupees (INR) stored with integer paise precision and processed securely through Razorpay. Server-side signature validation is required prior to confirmed pass issuance.
        </p>
      </div>
    </div>
  );
}
