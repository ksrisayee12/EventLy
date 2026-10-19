// src/app/refund-policy/page.tsx
export default function RefundPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Cancellation & Refund Policy</h1>
      <p className="text-xs text-slate-500">Effective Date: October 2026</p>

      <div className="prose prose-slate text-sm space-y-4 text-slate-600 leading-relaxed">
        <h2 className="text-lg font-bold text-slate-900 pt-2">1. Vendor-Initiated Cancellation</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>7+ Days Prior to Event Start:</strong> Eligible for up to 80% refund of total stall fees paid, subject to organizer and platform admin review.</li>
          <li><strong>3 to 6 Days Prior to Event Start:</strong> Eligible for up to 50% refund.</li>
          <li><strong>Less Than 48 Hours Prior or No-Show:</strong> Strictly non-refundable due to reserved venue footprint and electrical provisioning.</li>
        </ul>

        <h2 className="text-lg font-bold text-slate-900 pt-2">2. Event Cancellation by Organizer</h2>
        <p>
          In the event an exhibition is cancelled or revoked by the organizer or municipal authorities, vendors are entitled to a full (100%) refund of captured fees processed back to their original Razorpay payment method.
        </p>

        <h2 className="text-lg font-bold text-slate-900 pt-2">3. Refund Processing Time</h2>
        <p>
          Once an admin approves a refund request, the gateway refund is initiated via Razorpay and typically reflects in the vendor&apos;s source bank account within 5 to 7 business days.
        </p>
      </div>
    </div>
  );
}
