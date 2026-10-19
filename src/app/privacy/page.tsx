// src/app/privacy/page.tsx
export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E5E0D7] shadow-curated p-8 sm:p-10 space-y-6">
        <div className="border-b border-[#E5E0D7] pb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#64786B]">Data Standards</span>
          <h1 className="text-3xl font-extrabold text-[#202A35] tracking-tight mt-1">Privacy Policy</h1>
          <p className="text-xs text-[#747B80] mt-1">Effective Date: October 2026</p>
        </div>

        <div className="text-sm space-y-5 text-[#747B80] leading-relaxed">
          <section className="space-y-1.5">
            <h2 className="text-base font-bold text-[#202A35]">1. Information We Collect</h2>
            <p>
              We collect organizer business registration details, contact numbers, event venue addresses, and vendor brand descriptions to facilitate stall curation and exhibition management.
            </p>
          </section>

          <section className="space-y-1.5">
            <h2 className="text-base font-bold text-[#202A35]">2. Payment Security</h2>
            <p>
              We never store full debit or credit card numbers, CVVs, or banking passwords on our servers. All transactions are tokenized and processed via PCI-DSS compliant Razorpay APIs.
            </p>
          </section>

          <section className="space-y-1.5">
            <h2 className="text-base font-bold text-[#202A35]">3. Internal Verification Notes</h2>
            <p>
              Admin verification notes and private organizer verification records are strictly confidential and are never exposed publicly or to prospective vendors.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
