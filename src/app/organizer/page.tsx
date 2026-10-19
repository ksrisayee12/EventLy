// src/app/organizer/page.tsx
import Link from 'next/link';
import { DataService } from '@/services/dataService';
import { formatPaiseToINR, formatDateOnly } from '@/lib/utils';
import { 
  Building2, 
  ShieldCheck, 
  Calendar, 
  Users, 
  ArrowRight, 
  PlusCircle, 
  CheckCircle2, 
  FileText 
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function OrganizerDashboardPage() {
  const organizer = await DataService.getOrganizerProfile('00000000-0000-0000-0000-000000000002');
  const events = await DataService.getPublicEvents();
  const applications = await DataService.getOrganizerApplications('11111111-1111-1111-1111-111111111111');

  const pendingApps = applications.filter((a) => a.status === 'pending').length;
  const approvedApps = applications.filter((a) => a.status === 'approved').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Welcome & Verification Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Organizer Operations Hub
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              <ShieldCheck className="w-3 h-3 mr-1 text-emerald-400" />
              Verified Organizer
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            {organizer?.organization_name || 'Organizer Dashboard'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Contact Person: {organizer?.contact_person} • {organizer?.business_email} • {organizer?.business_phone}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/organizer/events/new"
            className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 transition-all"
          >
            <PlusCircle className="w-4 h-4 mr-1.5" />
            Create New Event
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Active Listings</span>
            <Calendar className="w-5 h-5 text-indigo-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{events.length}</div>
          <div className="text-xs text-slate-500">Events accepting vendor applications</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Applications</span>
            <Users className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{pendingApps}</div>
          <div className="text-xs text-amber-600 font-semibold">Requires your review</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Approved Stalls</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{approvedApps}</div>
          <div className="text-xs text-emerald-600 font-semibold">Holds active or paid</div>
        </div>
      </div>

      {/* Quick Review Callout */}
      {pendingApps > 0 && (
        <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-indigo-950">
                You have {pendingApps} pending vendor application(s) awaiting review
              </h3>
              <p className="text-xs text-indigo-700">
                Review applicant brand details and approve stalls to initiate the 30-minute reservation hold.
              </p>
            </div>
          </div>
          <Link
            href="/organizer/applications"
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all text-center"
          >
            Open Review Queue
          </Link>
        </div>
      )}

      {/* Your Events List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Your Listed Events</h2>
          <Link
            href="/organizer/events/new"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center"
          >
            + New Event
          </Link>
        </div>

        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="p-5 rounded-2xl border border-slate-100 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-slate-900">{event.title}</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                    Published
                  </span>
                </div>
                <div className="text-xs text-slate-500">
                  {event.venue_name}, {event.city} • {formatDateOnly(event.starts_at)}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href={`/events/${event.id}`}
                  className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors"
                >
                  View Public Page
                </Link>
                <Link
                  href="/organizer/applications"
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors"
                >
                  Manage Applications
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
