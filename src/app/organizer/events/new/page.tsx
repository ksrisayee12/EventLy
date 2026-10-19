// src/app/organizer/events/new/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Calendar, MapPin, Loader2, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { rupeesToPaise } from '@/lib/utils';
import Link from 'next/link';

interface StallTier {
  name: string;
  description: string;
  vendor_category: string;
  price_rupees: number;
  total_capacity: number;
}

export default function NewEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Event basic fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventCategory, setEventCategory] = useState('Flea Market & Craft Expo');
  const [venueName, setVenueName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [state, setState] = useState('Karnataka');
  const [startsAt, setStartsAt] = useState('');
  const [endsAt, setEndsAt] = useState('');
  const [expectedFootfall, setExpectedFootfall] = useState(5000);
  const [termsText, setTermsText] = useState(
    'Standard 5A power plug included. No plastic bags allowed. Setup strictly between 7:00 AM - 9:30 AM.'
  );

  // Multi-tier stall categories
  const [stallTiers, setStallTiers] = useState<StallTier[]>([
    {
      name: 'Standard Stall (6x6 ft)',
      description: '1 table, 2 chairs, canopy shade and 5A lighting socket.',
      vendor_category: 'Handmade / Lifestyle',
      price_rupees: 10000,
      total_capacity: 25,
    },
    {
      name: 'Premium Corner Canopy (10x10 ft)',
      description: '2 sides open, 2 tables, 4 chairs, and 15A power plug.',
      vendor_category: 'Gourmet Food & Beverage',
      price_rupees: 20000,
      total_capacity: 10,
    },
  ]);

  function addStallTier() {
    setStallTiers([
      ...stallTiers,
      {
        name: `Stall Tier ${stallTiers.length + 1}`,
        description: 'Standard stall space with table and chairs.',
        vendor_category: 'Commercial / Brand',
        price_rupees: 15000,
        total_capacity: 15,
      },
    ]);
  }

  function removeStallTier(index: number) {
    if (stallTiers.length === 1) return;
    setStallTiers(stallTiers.filter((_, i) => i !== index));
  }

  function updateStallTier(index: number, field: keyof StallTier, value: any) {
    const updated = [...stallTiers];
    updated[index] = { ...updated[index], [field]: value };
    setStallTiers(updated);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (new Date(endsAt) <= new Date(startsAt)) {
        throw new Error('Event end time must be after start time.');
      }

      const res = await fetch('/api/v1/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          event_category: eventCategory,
          venue_name: venueName,
          address,
          city,
          state,
          starts_at: new Date(startsAt).toISOString(),
          ends_at: new Date(endsAt).toISOString(),
          expected_footfall: Number(expectedFootfall),
          terms_text: termsText,
          stall_types: stallTiers.map((tier) => ({
            name: tier.name,
            description: tier.description,
            vendor_category: tier.vendor_category,
            price_paise: rupeesToPaise(Number(tier.price_rupees)),
            total_capacity: Number(tier.total_capacity),
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Failed to create event');

      setSuccess(true);
      setTimeout(() => router.push('/organizer'), 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Link
        href="/organizer"
        className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-indigo-600 gap-1"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Organizer Hub
      </Link>

      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          List a New Event for Verification
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Submit comprehensive event specifications, footfall estimate, and stall capacity tiers.
        </p>
      </div>

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-2xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Event submitted successfully! Redirecting to organizer hub...</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Basic Event Information */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-4">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">
            1. Event Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Event Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Hyderabad Spring Flea & Food Carnival 2026"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
              <select
                value={eventCategory}
                onChange={(e) => setEventCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Flea Market & Craft Expo">Flea Market & Craft Expo</option>
                <option value="Food & Beverage">Food & Beverage Carnival</option>
                <option value="Apparel & Sustainable Fashion">Apparel & Sustainable Fashion</option>
                <option value="Lifestyle & Home Decor">Lifestyle & Home Decor</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Estimated Visitor Footfall *
              </label>
              <input
                type="number"
                min="0"
                required
                value={expectedFootfall}
                onChange={(e) => setExpectedFootfall(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Description *</label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed summary of the festival, live attractions, target demographic..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Step 2: Venue and Dates */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-4">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">
            2. Venue & Dates
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Venue Name *</label>
              <input
                type="text"
                required
                value={venueName}
                onChange={(e) => setVenueName(e.target.value)}
                placeholder="e.g. Hitex Exhibition Center"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">City *</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Hyderabad"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Street Address *</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Trade Fair Office Building, Izzat Nagar, Madhapur"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Event Starts At *</label>
              <input
                type="datetime-local"
                required
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Event Ends At *</label>
              <input
                type="datetime-local"
                required
                value={endsAt}
                onChange={(e) => setEndsAt(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Step 3: Multi-Tier Stall Categories */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h2 className="text-lg font-bold text-slate-900">3. Stall Categories & Pricing</h2>
              <p className="text-xs text-slate-500">
                Define distinct stall sizes, inclusions, capacity, and pricing in INR.
              </p>
            </div>
            <button
              type="button"
              onClick={addStallTier}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Tier
            </button>
          </div>

          <div className="space-y-4">
            {stallTiers.map((tier, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3 relative"
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                    Tier #{idx + 1}
                  </span>
                  {stallTiers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeStallTier(idx)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Tier Name (e.g. Standard 6x6)
                    </label>
                    <input
                      type="text"
                      required
                      value={tier.name}
                      onChange={(e) => updateStallTier(idx, 'name', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Price (₹ INR)
                    </label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={tier.price_rupees}
                      onChange={(e) => updateStallTier(idx, 'price_rupees', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Total Capacity
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={tier.total_capacity}
                      onChange={(e) => updateStallTier(idx, 'total_capacity', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold"
                    />
                  </div>

                  <div className="sm:col-span-4">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Inclusions & Dimension Details
                    </label>
                    <input
                      type="text"
                      value={tier.description}
                      onChange={(e) => updateStallTier(idx, 'description', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Event for Admin Review'}
          </button>
        </div>
      </form>
    </div>
  );
}
