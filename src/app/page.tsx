// src/app/page.tsx
import Link from 'next/link';
import { DataService } from '@/services/dataService';
import { formatPaiseToINR, formatDateOnly } from '@/lib/utils';
import { 
  Calendar, 
  MapPin, 
  Users, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  CreditCard, 
  Search, 
  CheckCircle2,
  Store,
  Sparkles
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const events = await DataService.getPublicEvents();

  return (
    <div className="space-y-16 pb-24">
      {/* Editorial Exhibition Hero */}
      <section className="relative bg-[#FFFFFF] border-b border-[#E5E0D7] pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Headline & Supporting Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#EFEAE1] text-[#64786B] border border-[#E5E0D7]">
                <Sparkles className="w-3.5 h-3.5 text-[#B95335]" />
                <span>The Curated Marketplace for Event Stalls</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#202A35] leading-[1.12]">
                Book commercial stalls at{' '}
                <span className="text-[#B95335]">
                  verified cultural expos
                </span>{' '}
                & lifestyle festivals.
              </h1>

              <p className="text-base sm:text-lg text-[#747B80] leading-relaxed max-w-xl font-normal">
                Directly connect with vetted event organizers across India. Apply with your brand portfolio, lock in your stall with a 30-minute guaranteed hold, and pay securely via Razorpay.
              </p>

              {/* Trust Indicators */}
              <div className="pt-2 flex flex-wrap items-center gap-6 text-xs font-medium text-[#747B80]">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#287653]" />
                  Direct Organizer Verification
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#B95335]" />
                  30-Min Protected Inventory Hold
                </span>
                <span className="flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-[#64786B]" />
                  Secure Razorpay Settlements
                </span>
              </div>
            </div>

            {/* Right Search & Filter Card */}
            <div className="lg:col-span-5">
              <div className="bg-[#F7F5F0] rounded-2xl border border-[#E5E0D7] p-6 sm:p-7 shadow-curated space-y-5">
                <div>
                  <h3 className="text-base font-bold text-[#202A35]">Find Upcoming Exhibitions</h3>
                  <p className="text-xs text-[#747B80] mt-0.5">
                    Filter by city and category to discover open stall spaces.
                  </p>
                </div>

                <form action="/events" method="GET" className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-[#202A35] mb-1">
                      Exhibition City
                    </label>
                    <select
                      name="city"
                      className="w-full bg-[#FFFFFF] text-[#202A35] text-sm rounded-lg px-3.5 py-2.5 border border-[#E5E0D7] focus:outline-none focus:ring-1 focus:ring-[#B95335]"
                    >
                      <option value="All Cities">All Cities (India)</option>
                      <option value="Bengaluru">Bengaluru</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="New Delhi">New Delhi</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#202A35] mb-1">
                      Vendor Category
                    </label>
                    <select
                      name="category"
                      className="w-full bg-[#FFFFFF] text-[#202A35] text-sm rounded-lg px-3.5 py-2.5 border border-[#E5E0D7] focus:outline-none focus:ring-1 focus:ring-[#B95335]"
                    >
                      <option value="All Categories">All Exhibition Categories</option>
                      <option value="Flea Market & Craft Expo">Flea Market & Craft</option>
                      <option value="Food & Beverage">Food & Beverage Carnival</option>
                      <option value="Apparel & Sustainable Fashion">Apparel & Sustainable Fashion</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-[#B95335] hover:bg-[#98432B] text-white font-semibold text-sm rounded-lg py-3 px-4 transition-colors cursor-pointer"
                  >
                    <Search className="w-4 h-4" />
                    Discover Available Stalls
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Exhibitions Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 border-b border-[#E5E0D7] pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#64786B]">
              Curated Selection
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#202A35] tracking-tight mt-0.5">
              Featured Exhibitions Accepting Applications
            </h2>
          </div>
          <Link
            href="/events"
            className="inline-flex items-center text-sm font-semibold text-[#B95335] hover:text-[#98432B] transition-colors"
          >
            Explore all exhibitions
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {/* Exhibition Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-[#FFFFFF] rounded-2xl border border-[#E5E0D7] shadow-curated hover:border-[#64786B] transition-all flex flex-col justify-between overflow-hidden"
            >
              {/* Event Image Top */}
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

              {/* Event Info Body */}
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

                {/* Pricing & CTA Footer */}
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
      </section>

      {/* How it Works - 4 Step Editorial Process */}
      <section className="bg-[#FFFFFF] border-y border-[#E5E0D7] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#64786B]">
              The Application-First Workflow
            </span>
            <h2 className="text-3xl font-extrabold text-[#202A35] tracking-tight">
              Transparent Curation. Guaranteed Holds.
            </h2>
            <p className="text-sm text-[#747B80] max-w-xl mx-auto">
              We eliminate unverified middlemen and WhatsApp chaos. You apply, get approved by the organizer, and lock in your stall with an atomic 30-minute hold before paying.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-xl bg-[#F7F5F0] border border-[#E5E0D7] space-y-3">
              <div className="w-8 h-8 rounded-md bg-[#202A35] text-[#F7F5F0] flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h3 className="font-bold text-[#202A35] text-sm">Discover & Apply</h3>
              <p className="text-xs text-[#747B80] leading-relaxed">
                Browse verified events and choose your stall category. Submit brand details with zero upfront payment.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#F7F5F0] border border-[#E5E0D7] space-y-3">
              <div className="w-8 h-8 rounded-md bg-[#202A35] text-[#F7F5F0] flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h3 className="font-bold text-[#202A35] text-sm">Organizer Review</h3>
              <p className="text-xs text-[#747B80] leading-relaxed">
                The organizer reviews your product lineup to ensure strong event curation, approving or declining with feedback.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#F7F5F0] border border-[#E5E0D7] space-y-3">
              <div className="w-8 h-8 rounded-md bg-[#B95335] text-[#FFFFFF] flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h3 className="font-bold text-[#202A35] text-sm">30-Minute Hold</h3>
              <p className="text-xs text-[#747B80] leading-relaxed">
                Upon approval, an atomic database lock reserves your stall for 30 minutes so it cannot be oversold.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#F7F5F0] border border-[#E5E0D7] space-y-3">
              <div className="w-8 h-8 rounded-md bg-[#287653] text-[#FFFFFF] flex items-center justify-center font-bold text-sm">
                4
              </div>
              <h3 className="font-bold text-[#202A35] text-sm">Razorpay Checkout</h3>
              <p className="text-xs text-[#747B80] leading-relaxed">
                Pay securely online. Server signature verification immediately confirms your booking voucher.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dual Persona Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* For Organizers */}
          <div className="bg-[#202A35] text-[#F7F5F0] p-8 rounded-2xl border border-[#2E3A47] space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#64786B]">
                For Event Organizers
              </span>
              <h3 className="text-2xl font-bold text-[#FFFFFF]">Curate & Fill Your Commercial Stalls</h3>
              <p className="text-sm text-[#A3ABB2] leading-relaxed">
                List multi-tier stall categories with custom dimensions and electrical specs. Review vendor portfolios in a dedicated curation dashboard with automated capacity tracking.
              </p>
              <ul className="space-y-2 text-xs text-[#EFEAE1]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#64786B]" />
                  Multi-tier stall options with customized pricing & capacity
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#64786B]" />
                  Curation queue with 1-click approvals and automated reservation holds
                </li>
              </ul>
            </div>

            <Link
              href="/organizer/events/new"
              className="inline-flex items-center justify-center px-5 py-3 rounded-lg font-bold text-xs bg-[#B95335] hover:bg-[#98432B] text-white transition-colors"
            >
              List an Exhibition
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
          </div>

          {/* For Vendors */}
          <div className="bg-[#EFEAE1] text-[#202A35] p-8 rounded-2xl border border-[#E5E0D7] space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#64786B]">
                For Commercial & Artisan Vendors
              </span>
              <h3 className="text-2xl font-bold text-[#202A35]">Showcase at Premier Lifestyle Events</h3>
              <p className="text-sm text-[#747B80] leading-relaxed">
                Discover verified exhibitions in your city. Apply with your brand profile, skip unverified intermediaries, and lock in your stall with safe transactional reservations.
              </p>
              <ul className="space-y-2 text-xs text-[#202A35]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#287653]" />
                  Pay only after the organizer reviews and approves your brand
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#287653]" />
                  Download official digital entry vouchers with verified QR references
                </li>
              </ul>
            </div>

            <Link
              href="/events"
              className="inline-flex items-center justify-center px-5 py-3 rounded-lg font-bold text-xs bg-[#202A35] hover:bg-[#141A22] text-white transition-colors"
            >
              Browse Open Stalls
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
