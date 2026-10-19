// src/app/events/[id]/page.tsx
import { notFound } from 'next/navigation';
import { DataService } from '@/services/dataService';
import { formatPaiseToINR, formatDateOnly, formatDateTime } from '@/lib/utils';
import { ApplyStallModal } from '@/components/events/ApplyStallModal';
import { 
  Calendar, 
  MapPin, 
  Users, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Building2 
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
      {/* Event Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 text-white p-6 sm:p-10 shadow-xl border border-indigo-900/50">
        <div className="max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white border border-white/20">
              {event.event_category}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              Verified Event Organizer
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            {event.title}
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>
                {formatDateTime(event.starts_at)} – {formatDateTime(event.ends_at)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>
                {event.venue_name}, {event.city}, {event.state}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Column Details, Right Column Apply & Stalls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-8">
          {/* About Event */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              About This Event
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {event.description}
            </p>

            {/* Footfall Banner with Disclaimer */}
            <div className="mt-4 p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-base font-bold text-slate-900">
                    {event.expected_footfall?.toLocaleString('en-IN')}+ Attendees
                  </div>
                  <div className="text-xs text-slate-500">
                    Expected overall visitor footfall
                  </div>
                </div>
              </div>
              <span className="text-[11px] text-slate-400 italic bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                Organizer-provided estimate
              </span>
            </div>
          </div>

          {/* Stall Categories Available */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                Stall Options
              </span>
              <h2 className="text-xl font-bold text-slate-900">Available Stall Categories & Pricing</h2>
            </div>

            <div className="space-y-4">
              {stallTypes.map((stall) => (
                <div
                  key={stall.id}
                  className="p-5 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-colors bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-slate-900">{stall.name}</h3>
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-100 text-indigo-700">
                        {stall.vendor_category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 max-w-md">{stall.description}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                      <span>Total Capacity: <strong>{stall.total_capacity} stalls</strong></span>
                      <span className="text-emerald-600 font-semibold">
                        Available: <strong>{stall.available_capacity ?? stall.total_capacity} stalls remaining</strong>
                      </span>
                    </div>
                  </div>

                  <div className="text-right sm:border-l sm:border-slate-200 sm:pl-6 shrink-0">
                    <div className="text-lg font-extrabold text-indigo-700">
                      {formatPaiseToINR(stall.price_paise)}
                    </div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">
                      Per Stall Space
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rules & Inclusions */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Terms & Stall Guidelines</h2>
            <div className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
              {event.terms_text || 'Standard market rules apply. No subletting allowed. Stall placement allocated upon verified payment.'}
            </div>
          </div>
        </div>

        {/* Right Column (Sidebar CTA & Organizer Profile) */}
        <div className="space-y-6">
          {/* Action Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-lg space-y-6 sticky top-24">
            <div className="space-y-2">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Applications Open
              </span>
              <h3 className="text-xl font-bold text-slate-900">Secure Your Stall</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Submit your brand application. Once approved by the organizer, an atomic 30-minute hold will reserve your space for Razorpay checkout.
              </p>
            </div>

            <ApplyStallModal eventId={event.id} stallTypes={stallTypes} />

            <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-500" />
                <span>30-minute reservation hold upon approval</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>100% money protection & verified receipt</span>
              </div>
            </div>

            {/* Organizer Details */}
            {organizer && (
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Organized By
                </h4>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
                    <Building2 className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-900">
                      {organizer.organization_name}
                    </div>
                    <div className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
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
