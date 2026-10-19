// src/app/vendor/page.tsx
import Link from 'next/link';
import { DataService } from '@/services/dataService';
import { formatPaiseToINR, formatDateOnly } from '@/lib/utils';
import { 
  Store, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  FileText 
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function VendorDashboardPage() {
  const vendorId = '22222222-2222-2222-2222-222222222222';
  const vendor = await DataService.getVendorProfile('00000000-0000-0000-0000-000000000003');
  const applications = await DataService.getVendorApplications(vendorId);
  const bookings = await DataService.getVendorBookings(vendorId);

  const pendingApps = applications.filter((a) => a.status === 'pending').length;
  const approvedApps = applications.filter((a) => a.status === 'approved').length;
  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed').length;
  const pendingPaymentBookings = bookings.filter((b) => b.status === 'pending_payment');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-[#FFFFFF] text-[#202A35] rounded-2xl p-7 sm:p-8 border border-[#E5E0D7] shadow-curated flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#64786B]">
            Vendor Operations
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#202A35] mt-0.5">
            {vendor?.business_name || 'Vendor Workspace'}
          </h1>
          <p className="text-xs sm:text-sm text-[#747B80] mt-1">
            Category: <strong className="text-[#202A35]">{vendor?.business_category}</strong> • Contact: {vendor?.contact_phone}
          </p>
        </div>

        <Link
          href="/events"
          className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-[#B95335] hover:bg-[#98432B] text-white text-xs font-semibold transition-colors shrink-0"
        >
          <Store className="w-4 h-4 mr-1.5" />
          Discover Exhibitions
        </Link>
      </div>

      {/* Urgent Alert if Pending Payment Holds exist */}
      {pendingPaymentBookings.length > 0 && (
        <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#B95335] shadow-curated flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#B95335] text-white flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#202A35]">
                You have an approved stall ready for payment
              </h3>
              <p className="text-xs text-[#747B80]">
                A 30-minute reservation hold is currently active. Complete checkout to secure your stall.
              </p>
            </div>
          </div>
          <Link
            href={`/vendor/bookings/${pendingPaymentBookings[0].id}/pay`}
            className="px-4 py-2 bg-[#B95335] hover:bg-[#98432B] text-white font-semibold text-xs rounded-lg transition-colors text-center shrink-0"
          >
            Complete Payment Now
          </Link>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E5E0D7] shadow-curated space-y-2">
          <div className="flex items-center justify-between text-[#747B80]">
            <span className="text-xs font-bold uppercase tracking-wider">Total Applications</span>
            <FileText className="w-4 h-4 text-[#64786B]" />
          </div>
          <div className="text-3xl font-extrabold text-[#202A35]">{applications.length}</div>
          <div className="text-xs text-[#747B80]">{pendingApps} pending organizer review</div>
        </div>

        <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E5E0D7] shadow-curated space-y-2">
          <div className="flex items-center justify-between text-[#747B80]">
            <span className="text-xs font-bold uppercase tracking-wider">Approved Holds</span>
            <Clock className="w-4 h-4 text-[#B95335]" />
          </div>
          <div className="text-3xl font-extrabold text-[#202A35]">{approvedApps}</div>
          <div className="text-xs text-[#B95335] font-semibold">Active holds ready for checkout</div>
        </div>

        <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E5E0D7] shadow-curated space-y-2">
          <div className="flex items-center justify-between text-[#747B80]">
            <span className="text-xs font-bold uppercase tracking-wider">Confirmed Bookings</span>
            <CheckCircle2 className="w-4 h-4 text-[#287653]" />
          </div>
          <div className="text-3xl font-extrabold text-[#202A35]">{confirmedBookings}</div>
          <div className="text-xs text-[#287653] font-semibold">Digital passes verified</div>
        </div>
      </div>

      {/* Applications Quick List */}
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E5E0D7] shadow-curated p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between border-b border-[#E5E0D7] pb-3">
          <h2 className="text-base font-bold text-[#202A35]">Recent Stall Applications</h2>
          <Link
            href="/vendor/applications"
            className="text-xs font-semibold text-[#B95335] hover:text-[#98432B] flex items-center"
          >
            View all applications <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        <div className="space-y-3">
          {applications.map((app) => (
            <div
              key={app.id}
              className="p-4 rounded-xl border border-[#E5E0D7] bg-[#F7F5F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="font-bold text-sm text-[#202A35]">{app.event?.title}</div>
                <div className="text-xs text-[#747B80]">
                  Stall: <strong className="text-[#202A35]">{app.stall_type?.name}</strong> • Quantity: {app.quantity}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`px-2.5 py-1 rounded text-xs font-bold uppercase ${
                    app.status === 'approved'
                      ? 'bg-[#EFEAE1] text-[#287653] border border-[#E5E0D7]'
                      : app.status === 'pending'
                      ? 'bg-[#EFEAE1] text-[#94620B] border border-[#E5E0D7]'
                      : 'bg-[#EFEAE1] text-[#B33A3A] border border-[#E5E0D7]'
                  }`}
                >
                  {app.status}
                </span>

                {app.status === 'approved' && (
                  <Link
                    href={`/vendor/applications`}
                    className="px-3 py-1.5 rounded-lg bg-[#B95335] hover:bg-[#98432B] text-white text-xs font-semibold"
                  >
                    Proceed to Pay
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
