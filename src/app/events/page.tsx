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
      <div className="space-y-1 border-b border-[#E5E0D7] pb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-[#64786B]">
          Exhibition Directory
        </span>
        <h1 className="text-3xl font-extrabold text-[#202A35] tracking-tight">
          Discover Verified Exhibitions & Stall Spaces
        </h1>
        <p className="text-sm text-[#747B80]">
          Showing {events.length} verified events across India currently accepting vendor applications.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E5E0D7] shadow-curated">
        <form method="GET" action="/events" className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#747B80] absolute left-3.5 top-3" />
            <input
              type="text"
              name="search"
              defaultValue={search || ''}
              placeholder="Search by title or venue..."
              className="w-full pl-10 pr-3 py-2 bg-[#F7F5F0] border border-[#E5E0D7] rounded-lg text-sm text-[#202A35] focus:outline-none focus:ring-1 focus:ring-[#B95335]"
            />
          </div>

          <div>
            <select
              name="city"
              defaultValue={city || 'All Cities'}
              className="w-full px-3 py-2 bg-[#F7F5F0] border border-[#E5E0D7] rounded-lg text-sm text-[#202A35] focus:outline-none focus:ring-1 focus:ring-[#B95335]"
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
              className="w-full px-3 py-2 bg-[#F7F5F0] border border-[#E5E0D7] rounded-lg text-sm text-[#202A35] focus:outline-none focus:ring-1 focus:ring-[#B95335]"
            >
              <option value="All Categories">All Categories</option>
              <option value="Flea Market & Craft Expo">Flea Market & Craft</option>
              <option value="Food & Beverage">Food & Beverage Carnival</option>
              <option value="Apparel & Sustainable Fashion">Apparel & Fashion</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-[#B95335] hover:bg-[#98432B] text-white font-semibold text-xs rounded-lg py-2 px-4 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5" />
              Apply Filters
            </button>
            <Link
              href="/events"
              className="px-3.5 py-2 bg-[#EFEAE1] hover:bg-[#E5E0D7] text-[#202A35] text-xs font-semibold rounded-lg flex items-center justify-center transition-colors"
            >
              Reset
            </Link>
          </div>
        </form>
      </div>

      {/* Events Grid */}
      {events.length === 0 ? (
        <div className="text-center py-16 bg-[#FFFFFF] rounded-2xl border border-[#E5E0D7] p-8 space-y-3">
          <p className="text-base font-semibold text-[#202A35]">No exhibitions matched your search criteria.</p>
          <p className="text-xs text-[#747B80]">Try clearing or adjusting your city or category selection.</p>
          <Link
            href="/events"
            className="inline-block mt-2 px-4 py-2 bg-[#B95335] text-white text-xs font-semibold rounded-lg"
          >
            Clear Filters
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-[#FFFFFF] rounded-2xl border border-[#E5E0D7] shadow-curated hover:border-[#64786B] transition-all flex flex-col justify-between overflow-hidden"
            >
              {/* Event Header Graphic */}
              <div className="relative h-48 bg-[#202A35] p-5 flex flex-col justify-between text-white overflow-hidden">
                <div className="flex items-center justify-between relative z-10">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-[#202A35]/80 text-[#EFEAE1] border border-[#E5E0D7]/20">
                    {event.event_category}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#287653] text-[#FFFFFF]">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                    Verified
                  </span>
                </div>

                <div className="relative z-10">
                  <span className="text-xs text-[#EFEAE1] flex items-center gap-1 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-[#EFEAE1]" />
                    {formatDateOnly(event.starts_at)} – {formatDateOnly(event.ends_at)}
                  </span>
                  <h3 className="text-lg font-bold text-[#FFFFFF] mt-1 line-clamp-2">
                    {event.title}
                  </h3>
                </div>
              </div>

              {/* Event Details Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-2 text-xs text-[#747B80]">
                    <MapPin className="w-4 h-4 text-[#B95335] shrink-0 mt-0.5" />
                    <span className="font-medium text-[#202A35]">
                      {event.venue_name}, {event.city}
                    </span>
                  </div>

                  <p className="text-xs text-[#747B80] line-clamp-2 leading-relaxed">
                    {event.description}
                  </p>

                  {/* Footfall Disclosure */}
                  <div className="bg-[#F7F5F0] border border-[#E5E0D7] rounded-lg p-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-[#202A35]">
                      <Users className="w-4 h-4 text-[#64786B]" />
                      <span className="font-bold">{event.expected_footfall?.toLocaleString('en-IN')}+</span>
                      <span className="text-[#747B80]">Est. Footfall</span>
                    </div>
                    <span className="text-[10px] text-[#747B80] italic">Organizer estimate</span>
                  </div>
                </div>

                {/* Card Footer CTA */}
                <div className="pt-4 border-t border-[#E5E0D7] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#747B80] uppercase tracking-wider block font-semibold">
                      Stall Pricing From
                    </span>
                    <span className="text-base font-bold text-[#202A35]">
                      {formatPaiseToINR(1200000)}
                    </span>
                  </div>

                  <Link
                    href={`/events/${event.id}`}
                    className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#B95335] hover:bg-[#98432B] transition-colors"
                  >
                    View Details
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
