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
  Sparkles, 
  CheckCircle2, 
  Search,
  Store 
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const events = await DataService.getPublicEvents();

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-900 via-slate-900 to-slate-900 text-white pt-20 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>India&apos;s First Verified Event Stall Marketplace</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Discover & Book Commercial Stalls at{' '}
            <span className="bg-gradient-to-r from-sky-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Verified Events Across India
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            Directly connect with vetted event organizers. Browse stall types with transparent pricing, apply with 1-click, and secure your spot with guaranteed inventory holds.
          </p>

          {/* Quick Search & Filter Bar */}
          <div className="max-w-3xl mx-auto mt-8 p-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
            <form action="/events" method="GET" className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="relative">
                <select
                  name="city"
                  className="w-full bg-slate-800/90 text-white text-sm rounded-xl px-3 py-3 border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  <option value="All Cities">All Cities</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="New Delhi">New Delhi</option>
                </select>
              </div>

              <div className="relative">
                <select
                  name="category"
                  className="w-full bg-slate-800/90 text-white text-sm rounded-xl px-3 py-3 border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  <option value="All Categories">All Categories</option>
                  <option value="Flea Market & Craft Expo">Flea Market & Craft</option>
                  <option value="Food & Beverage">Food & Beverage</option>
                  <option value="Apparel & Sustainable Fashion">Apparel & Fashion</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-sky-500 hover:from-indigo-600 hover:to-sky-600 text-white font-semibold text-sm rounded-xl py-3 px-4 shadow-lg shadow-indigo-500/30 transition-all cursor-pointer"
              >
                <Search className="w-4 h-4" />
                Find Stalls
              </button>
            </form>
          </div>

          {/* Trust Highlights */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-300">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Verified Event Organizers
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-sky-400" />
              30-Min Protected Inventory Hold
            </span>
            <span className="flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-purple-400" />
              Safe Razorpay Payments
            </span>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
              <span>Featured Listings</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Curated Events Accepting Vendor Stalls
            </h2>
          </div>
          <Link
            href="/events"
            className="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            Explore all events
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {/* Event Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div
              key={event.id}
              className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all flex flex-col overflow-hidden"
            >
              {/* Event Poster / Header Badge */}
              <div className="relative h-48 bg-gradient-to-br from-indigo-900 to-slate-800 p-5 flex flex-col justify-between text-white overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:scale-105 transition-transform duration-500" />
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
      </section>

      {/* How it Works Section */}
      <section className="bg-white border-y border-slate-200 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Application-First Model
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              How Stall Booking Works on EventLy
            </h2>
            <p className="text-sm text-slate-600 max-w-xl mx-auto">
              We ensure transparent curation for event organizers while protecting vendor payments with time-limited inventory holds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg mx-auto">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Discover & Apply</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Browse verified events, select your stall category, and submit your brand details without upfront payment.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg mx-auto">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Organizer Review</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                The organizer reviews your products to maintain event quality and approves your application.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg mx-auto">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-sm">30-Min Protected Hold</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Upon approval, an atomic hold reserves the stall capacity for 30 minutes so it cannot be sold to anyone else.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg mx-auto">
                4
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Razorpay Checkout</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Complete payment securely. The server verifies the signature and confirms your booking voucher immediately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dual Persona Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* For Organizers */}
          <div className="bg-gradient-to-br from-indigo-950 to-slate-900 text-white p-8 rounded-3xl border border-indigo-900 shadow-xl space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/20">
                <Store className="w-3.5 h-3.5" />
                <span>For Event Organizers</span>
              </div>
              <h3 className="text-2xl font-bold">List Your Event & Reach Verified Vendors</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Stop managing vendor bookings across WhatsApp and spreadsheets. Create multi-tier stall spaces, review vendor portfolios, and receive direct payments with automated capacity tracking.
              </p>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Custom stall tiers with custom dimensions and electrical inclusions
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Curation dashboard to accept or reject applicant brands
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Real-time booking confirmations and revenue reporting
                </li>
              </ul>
            </div>

            <Link
              href="/organizer/events/new"
              className="inline-flex items-center justify-center px-5 py-3 rounded-xl font-bold text-sm bg-white text-indigo-950 hover:bg-slate-100 transition-colors shadow-lg"
            >
              Submit an Event for Verification
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
          </div>

          {/* For Vendors */}
          <div className="bg-gradient-to-br from-sky-950 to-slate-900 text-white p-8 rounded-3xl border border-sky-900 shadow-xl space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-400/20">
                <Users className="w-3.5 h-3.5" />
                <span>For Commercial & Artisan Vendors</span>
              </div>
              <h3 className="text-2xl font-bold">Sell at Top Flea Markets & Exhibitions</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Find verified exhibitions in your city. Apply with your brand profile, avoid unverified middlemen, and lock in your stall with safe transactional reservations.
              </p>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-400" />
                  Transparent prices and clear stall specifications
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-400" />
                  Pay only after the organizer reviews and approves your brand
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-400" />
                  Download confirmed digital booking passes and receipts
                </li>
              </ul>
            </div>

            <Link
              href="/events"
              className="inline-flex items-center justify-center px-5 py-3 rounded-xl font-bold text-sm bg-sky-500 hover:bg-sky-400 text-white transition-colors shadow-lg shadow-sky-500/20"
            >
              Browse Open Stall Categories
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
