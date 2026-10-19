// src/app/organizer/page.tsx
import Link from 'next/link';
import { DataService } from '@/services/dataService';
import { formatDateOnly } from '@/lib/utils';
import { 
  ShieldCheck, 
  Calendar, 
  Users, 
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
      {/* Welcome Banner */}
      <div className="bg-[#FFFFFF] text-[#202A35] rounded-2xl p-7 sm:p-8 border border-[#E5E0D7] shadow-curated flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#64786B]">
              Organizer Hub
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#EFEAE1] text-[#287653] border border-[#E5E0D7]">
              <ShieldCheck className="w-3 h-3 mr-1" />
              Verified Organizer
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#202A35] mt-1">
            {organizer?.organization_name || 'Organizer Workspace'}
          </h1>
          <p className="text-xs sm:text-sm text-[#747B80] mt-1">
            Contact Person: {organizer?.contact_person} • {organizer?.business_email} • {organizer?.business_phone}
          </p>
        </div>

        <Link
          href="/organizer/events/new"
          className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-[#B95335] hover:bg-[#98432B] text-white text-xs font-semibold transition-colors shrink-0"
        >
          <PlusCircle className="w-4 h-4 mr-1.5" />
          Create New Exhibition
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E5E0D7] shadow-curated space-y-2">
          <div className="flex items-center justify-between text-[#747B80]">
            <span className="text-xs font-bold uppercase tracking-wider">Active Listings</span>
            <Calendar className="w-4 h-4 text-[#64786B]" />
          </div>
          <div className="text-3xl font-extrabold text-[#202A35]">{events.length}</div>
          <div className="text-xs text-[#747B80]">Exhibitions accepting vendor stalls</div>
        </div>

        <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E5E0D7] shadow-curated space-y-2">
          <div className="flex items-center justify-between text-[#747B80]">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Applications</span>
            <Users className="w-4 h-4 text-[#94620B]" />
          </div>
          <div className="text-3xl font-extrabold text-[#202A35]">{pendingApps}</div>
          <div className="text-xs text-[#94620B] font-semibold">Requires curation decision</div>
        </div>

        <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E5E0D7] shadow-curated space-y-2">
          <div className="flex items-center justify-between text-[#747B80]">
            <span className="text-xs font-bold uppercase tracking-wider">Approved Stalls</span>
            <CheckCircle2 className="w-4 h-4 text-[#287653]" />
          </div>
          <div className="text-3xl font-extrabold text-[#202A35]">{approvedApps}</div>
          <div className="text-xs text-[#287653] font-semibold">Holds active or confirmed</div>
        </div>
      </div>

      {/* Pending Curation Callout */}
      {pendingApps > 0 && (
        <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#B95335] shadow-curated flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#B95335] text-white flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#202A35]">
                You have {pendingApps} pending vendor application(s) awaiting review
              </h3>
              <p className="text-xs text-[#747B80]">
                Review applicant brands and approve stalls to initiate the 30-minute reservation hold.
              </p>
            </div>
          </div>
          <Link
            href="/organizer/applications"
            className="px-4 py-2 bg-[#B95335] hover:bg-[#98432B] text-white font-semibold text-xs rounded-lg transition-colors text-center shrink-0"
          >
            Open Curation Queue
          </Link>
        </div>
      )}

      {/* Your Events List */}
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E5E0D7] shadow-curated p-6 sm:p-8 space-y-5">
        <div className="flex items-center justify-between border-b border-[#E5E0D7] pb-3">
          <h2 className="text-base font-bold text-[#202A35]">Your Listed Exhibitions</h2>
          <Link
            href="/organizer/events/new"
            className="text-xs font-semibold text-[#B95335] hover:text-[#98432B] flex items-center"
          >
            + New Exhibition
          </Link>
        </div>

        <div className="space-y-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="p-5 rounded-xl border border-[#E5E0D7] bg-[#F7F5F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-[#202A35]">{event.title}</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EFEAE1] text-[#287653] uppercase border border-[#E5E0D7]">
                    Published
                  </span>
                </div>
                <div className="text-xs text-[#747B80]">
                  {event.venue_name}, {event.city} • {formatDateOnly(event.starts_at)}
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Link
                  href={`/events/${event.id}`}
                  className="px-3 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#E5E0D7] text-[#202A35] hover:bg-[#EFEAE1] text-xs font-medium transition-colors"
                >
                  View Public Page
                </Link>
                <Link
                  href="/organizer/applications"
                  className="px-3 py-1.5 rounded-lg bg-[#202A35] hover:bg-[#141A22] text-white text-xs font-medium transition-colors"
                >
                  Curation Queue
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
