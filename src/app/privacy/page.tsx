// src/app/privacy/page.tsx
export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Privacy Policy</h1>
      <p className="text-xs text-slate-500">Effective Date: October 2026</p>

      <div className="prose prose-slate text-sm space-y-4 text-slate-600 leading-relaxed">
        <h2 className="text-lg font-bold text-slate-900 pt-2">1. Information We Collect</h2>
        <p>
          We collect organizer business registration details, contact numbers, event venue addresses, and vendor brand descriptions to facilitate stall curation and exhibition management.
        </p>

        <h2 className="text-lg font-bold text-slate-900 pt-2">2. Payment Security</h2>
        <p>
          We never store full debit or credit card numbers, CVVs, or banking passwords on our servers. All transactions are tokenized and processed via PCI-DSS compliant Razorpay APIs.
        </p>

        <h2 className="text-lg font-bold text-slate-900 pt-2">3. Internal Verification Notes</h2>
        <p>
          Admin verification notes and private organizer verification records are strictly confidential and are never exposed publicly or to prospective vendors.
        </p>
      </div>
    </div>
  );
}
