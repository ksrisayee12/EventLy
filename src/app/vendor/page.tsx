// src/app/vendor/page.tsx
import Link from 'next/link';
import { DataService } from '@/services/dataService';
import { formatPaiseToINR, formatDateOnly } from '@/lib/utils';
import { 
  Store, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  FileText, 
  AlertCircle,
  CreditCard
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function VendorDashboardPage() {
  const vendorId = '22222222-2222-2222-2222-222222222222'; // Rohan Verma demo vendor
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
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            Vendor Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Welcome, {vendor?.business_name || 'Vendor'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Category: <strong>{vendor?.business_category}</strong> • Contact: {vendor?.contact_phone}
          </p>
        </div>

        <Link
          href="/events"
          className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 transition-all shrink-0"
        >
          <Store className="w-4 h-4 mr-1.5" />
          Find More Events
        </Link>
      </div>

      {/* Urgent Alert if Pending Payment Holds exist */}
      {pendingPaymentBookings.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-900">
                You have an approved stall ready for payment!
              </h3>
              <p className="text-xs text-amber-700">
                A 30-minute reservation hold is currently active. Pay now before the hold expires.
              </p>
            </div>
          </div>
          <Link
            href={`/vendor/bookings/${pendingPaymentBookings[0].id}/pay`}
            className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all text-center"
          >
            Complete Payment Now
          </Link>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Applications</span>
            <FileText className="w-5 h-5 text-indigo-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{applications.length}</div>
          <div className="text-xs text-slate-500">{pendingApps} pending organizer review</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Approved / Holds</span>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{approvedApps}</div>
          <div className="text-xs text-amber-600 font-semibold">Active holds ready for payment</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Confirmed Bookings</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{confirmedBookings}</div>
          <div className="text-xs text-emerald-600 font-semibold">Verified passes generated</div>
        </div>
      </div>

      {/* Recent Applications Quick Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Recent Stall Applications</h2>
          <Link
            href="/vendor/applications"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center"
          >
            View all applications <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        <div className="space-y-3">
          {applications.map((app) => (
            <div
              key={app.id}
              className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="font-bold text-sm text-slate-900">{app.event?.title}</div>
                <div className="text-xs text-slate-500">
                  Stall: <strong>{app.stall_type?.name}</strong> • Quantity: {app.quantity}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    app.status === 'approved'
                      ? 'bg-emerald-100 text-emerald-700'
                      : app.status === 'pending'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {app.status}
                </span>

                {app.status === 'approved' && (
                  <Link
                    href={`/vendor/applications`}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm"
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
