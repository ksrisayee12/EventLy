// src/app/events/[id]/page.tsx
import { notFound } from 'next/navigation';
import { DataService } from '@/services/dataService';
import { formatPaiseToINR, formatDateTime } from '@/lib/utils';
import { ApplyStallModal } from '@/components/events/ApplyStallModal';
import { 
  Calendar, 
  MapPin, 
  Users, 
  ShieldCheck, 
  Clock, 
  FileText, 
  Building2,
  Store,
  CheckCircle2
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await DataService.getEventById(id);

  if (!event) {
    notFound();
  }

  const stallTypes = await DataService.getStallTypesForEvent(id);
  const organizer = await DataService.getOrganizerProfile(event.organizer_id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Editorial Header Banner */}
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E5E0D7] p-8 sm:p-10 shadow-curated">
        <div className="max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-[#EFEAE1] text-[#64786B] border border-[#E5E0D7]">
              {event.event_category}
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-[#EFEAE1] text-[#287653] border border-[#E5E0D7]">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              Verified Event Organizer
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#202A35] leading-tight">
            {event.title}
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-sm text-[#747B80]">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#B95335] shrink-0" />
              <span className="text-[#202A35] font-medium">
                {formatDateTime(event.starts_at)} – {formatDateTime(event.ends_at)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#B95335] shrink-0" />
              <span className="text-[#202A35] font-medium">
                {event.venue_name}, {event.city}, {event.state}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Column Details, Right Column Apply & Stall Options */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-8">
          {/* About Event */}
          <div className="bg-[#FFFFFF] rounded-2xl p-6 sm:p-8 border border-[#E5E0D7] shadow-curated space-y-4">
            <h2 className="text-xl font-bold text-[#202A35] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#B95335]" />
              About This Exhibition
            </h2>
            <p className="text-sm text-[#747B80] leading-relaxed whitespace-pre-line">
              {event.description}
            </p>

            {/* Footfall Banner with Disclaimer */}
            <div className="mt-4 p-4 rounded-xl bg-[#F7F5F0] border border-[#E5E0D7] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#202A35] text-[#F7F5F0] flex items-center justify-center font-bold">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-[#202A35]">
                    {event.expected_footfall?.toLocaleString('en-IN')}+ Attendees
                  </div>
                  <div className="text-xs text-[#747B80]">
                    Expected overall visitor footfall
                  </div>
                </div>
              </div>
              <span className="text-[11px] text-[#747B80] italic bg-[#FFFFFF] px-2.5 py-1 rounded-md border border-[#E5E0D7]">
                Organizer estimate
              </span>
            </div>
          </div>

          {/* Stall Categories Available */}
          <div className="bg-[#FFFFFF] rounded-2xl p-6 sm:p-8 border border-[#E5E0D7] shadow-curated space-y-6">
            <div>
              <span className="text-xs font-bold text-[#64786B] uppercase tracking-wider">
                Stall Specifications
              </span>
              <h2 className="text-xl font-bold text-[#202A35]">Available Stall Categories & Pricing</h2>
            </div>

            <div className="space-y-4">
              {stallTypes.map((stall) => (
                <div
                  key={stall.id}
                  className="p-5 rounded-xl border border-[#E5E0D7] bg-[#F7F5F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-[#202A35]">{stall.name}</h3>
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#EFEAE1] text-[#64786B]">
                        {stall.vendor_category}
                      </span>
                    </div>
                    <p className="text-xs text-[#747B80] max-w-md">{stall.description}</p>
                    <div className="flex items-center gap-4 text-xs text-[#747B80] pt-1">
                      <span>Total Capacity: <strong className="text-[#202A35]">{stall.total_capacity} stalls</strong></span>
                      <span className="text-[#287653] font-semibold">
                        Available: <strong>{stall.available_capacity ?? stall.total_capacity} stalls remaining</strong>
                      </span>
                    </div>
                  </div>

                  <div className="text-right sm:border-l sm:border-[#E5E0D7] sm:pl-6 shrink-0">
                    <div className="text-xl font-extrabold text-[#202A35]">
                      {formatPaiseToINR(stall.price_paise)}
                    </div>
                    <div className="text-[10px] text-[#747B80] uppercase font-semibold">
                      Per Stall Space
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Guidelines */}
          <div className="bg-[#FFFFFF] rounded-2xl p-6 sm:p-8 border border-[#E5E0D7] shadow-curated space-y-3">
            <h2 className="text-base font-bold text-[#202A35]">Terms & Stall Guidelines</h2>
            <div className="text-xs text-[#747B80] leading-relaxed bg-[#F7F5F0] p-4 rounded-xl border border-[#E5E0D7]">
              {event.terms_text || 'Standard market rules apply. No subletting allowed. Stall placement allocated upon verified payment.'}
            </div>
          </div>
        </div>

        {/* Right Column (Sidebar CTA & Organizer Profile) */}
        <div className="space-y-6">
          <div className="bg-[#FFFFFF] rounded-2xl p-6 sm:p-7 border border-[#E5E0D7] shadow-curated space-y-5 sticky top-24">
            <div className="space-y-1 border-b border-[#E5E0D7] pb-3">
              <span className="text-xs font-bold text-[#287653] uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Applications Open
              </span>
              <h3 className="text-lg font-bold text-[#202A35]">Secure Your Stall Space</h3>
              <p className="text-xs text-[#747B80]">
                Submit your brand application. When approved by the organizer, an atomic 30-minute hold reserves your space for Razorpay checkout.
              </p>
            </div>

            <ApplyStallModal eventId={event.id} stallTypes={stallTypes} />

            <div className="pt-2 space-y-2 text-xs text-[#747B80]">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#B95335]" />
                <span>30-minute reservation hold upon approval</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#287653]" />
                <span>100% money protection & verified pass</span>
              </div>
            </div>

            {/* Organizer Details */}
            {organizer && (
              <div className="pt-4 border-t border-[#E5E0D7]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#747B80] block mb-2">
                  Organized By
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#F7F5F0] border border-[#E5E0D7] flex items-center justify-center text-[#202A35]">
                    <Building2 className="w-4 h-4 text-[#64786B]" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-[#202A35]">
                      {organizer.organization_name}
                    </div>
                    <div className="text-[11px] text-[#287653] font-medium flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Verified Business Organizer
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
