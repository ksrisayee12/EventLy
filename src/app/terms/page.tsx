// src/app/terms/page.tsx
export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E5E0D7] shadow-curated p-8 sm:p-10 space-y-6">
        <div className="border-b border-[#E5E0D7] pb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#64786B]">Legal Agreement</span>
          <h1 className="text-3xl font-extrabold text-[#202A35] tracking-tight mt-1">Terms of Service</h1>
          <p className="text-xs text-[#747B80] mt-1">Effective Date: October 2026 • Platform Version 1.0</p>
        </div>

        <div className="text-sm space-y-5 text-[#747B80] leading-relaxed">
          <section className="space-y-1.5">
            <h2 className="text-base font-bold text-[#202A35]">1. Nature of the Platform</h2>
            <p>
              EventLy operates as an application-first commercial stall aggregator and discovery marketplace connecting independent event organizers with commercial and artisan vendors across India.
            </p>
          </section>

          <section className="space-y-1.5">
            <h2 className="text-base font-bold text-[#202A35]">2. Organizer Verification & Footfall Estimates</h2>
            <p>
              Event organizers undergo manual verification prior to listing publication. Visitor footfall numbers displayed on event listings represent organizer-provided forward estimates and do not constitute a financial guarantee of attendee traffic or vendor sales revenue.
            </p>
          </section>

          <section className="space-y-1.5">
            <h2 className="text-base font-bold text-[#202A35]">3. Inventory Reservation Holds</h2>
            <p>
              Upon an organizer approving a vendor application, an atomic 30-minute reservation hold is placed on the requested stall capacity. Vendors must complete checkout via Razorpay within this 30-minute window. If payment is not completed before hold expiry, the inventory is automatically released.
            </p>
          </section>

          <section className="space-y-1.5">
            <h2 className="text-base font-bold text-[#202A35]">4. Payment Processing</h2>
            <p>
              All stall fees are collected in Indian Rupees (INR) stored with integer paise precision and processed securely through Razorpay. Server-side signature validation is required prior to confirmed pass issuance.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
