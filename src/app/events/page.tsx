// src/app/events/page.tsx
import Link from 'next/link';
import { DataService } from '@/services/dataService';
import { formatPaiseToINR, formatDateOnly } from '@/lib/utils';
import { 
  Calendar, 
  MapPin, 
  Users, 
  ArrowRight, 
  ShieldCheck, 
  Search, 
  Filter 
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ city?: string; category?: string; search?: string }>;
}) {
  const { city, category, search } = await searchParams;
  const events = await DataService.getPublicEvents({ city, category, search });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Discover Verified Events & Stall Spaces
        </h1>
        <p className="text-sm text-slate-600">
          Showing {events.length} published and approved events currently accepting vendor applications.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <form method="GET" action="/events" className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            <input
              type="text"
              name="search"
              defaultValue={search || ''}
              placeholder="Search by event title or venue..."
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <select
              name="city"
              defaultValue={city || 'All Cities'}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All Cities">All Cities</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Mumbai">Mumbai</option>
              <option value="New Delhi">New Delhi</option>
            </select>
          </div>

          <div>
            <select
              name="category"
              defaultValue={category || 'All Categories'}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All Categories">All Categories</option>
              <option value="Flea Market & Craft Expo">Flea Market & Craft</option>
              <option value="Food & Beverage">Food & Beverage</option>
              <option value="Apparel & Sustainable Fashion">Apparel & Fashion</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl py-2.5 px-4 shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Filter className="w-4 h-4" />
              Apply Filter
            </button>
            <Link
              href="/events"
              className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl flex items-center justify-center transition-colors"
            >
              Reset
            </Link>
          </div>
        </form>
      </div>

      {/* Events Grid */}
      {events.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 space-y-3">
          <p className="text-base font-semibold text-slate-700">No events matched your search filters.</p>
          <p className="text-xs text-slate-500">Try adjusting your city or category selection to find available stalls.</p>
          <Link
            href="/events"
            className="inline-block mt-2 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl"
          >
            Clear All Filters
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div
              key={event.id}
              className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all flex flex-col overflow-hidden"
            >
              {/* Event Poster / Header Badge */}
              <div className="relative h-48 bg-gradient-to-br from-indigo-900 to-slate-800 p-5 flex flex-col justify-between text-white overflow-hidden">
                <div className="flex items-center justify-between relative z-10">
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md text-white border border-white/20">
                    {event.event_category}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 backdrop-blur-md">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                    Verified Event
                  </span>
                </div>

                <div className="relative z-10">
                  <span className="text-xs font-medium text-slate-300 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                    {formatDateOnly(event.starts_at)} – {formatDateOnly(event.ends_at)}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1 line-clamp-2 group-hover:text-indigo-200 transition-colors">
                    {event.title}
                  </h3>
                </div>
              </div>

              {/* Event Details Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-2 text-xs text-slate-600">
                    <MapPin className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                    <span className="line-clamp-1 font-medium">
                      {event.venue_name}, {event.city}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {event.description}
                  </p>

                  {/* Footfall disclaimer */}
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <Users className="w-4 h-4 text-indigo-600" />
                      <span className="font-semibold">{event.expected_footfall?.toLocaleString('en-IN')}+</span>
                      <span className="text-slate-500">Est. Footfall</span>
                    </div>
                    <span className="text-[10px] text-slate-400 italic">Organizer estimate</span>
                  </div>
                </div>

                {/* Card Footer CTA */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">
                      Stall Pricing From
                    </span>
                    <span className="text-base font-extrabold text-indigo-700">
                      {formatPaiseToINR(1200000)}
                    </span>
                  </div>

                  <Link
                    href={`/events/${event.id}`}
                    className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all"
                  >
                    View & Apply
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
