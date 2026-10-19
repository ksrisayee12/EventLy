// src/app/organizer/events/new/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Loader2, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
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
    'Standard 5A electrical point provided. No single-use plastic permitted. Setup strictly between 7:00 AM - 9:30 AM.'
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
      setTimeout(() => router.push('/organizer'), 1400);
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
        className="inline-flex items-center text-xs font-semibold text-[#747B80] hover:text-[#B95335] gap-1 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Organizer Hub
      </Link>

      <div className="border-b border-[#E5E0D7] pb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-[#64786B]">
          New Listing
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#202A35] tracking-tight mt-0.5">
          List a New Exhibition for Verification
        </h1>
        <p className="text-sm text-[#747B80]">
          Define exhibition details, expected visitor footfall, and multi-tier stall spaces.
        </p>
      </div>

      {success && (
        <div className="p-4 bg-[#EFEAE1] border border-[#287653] text-[#287653] text-sm rounded-xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-[#287653] shrink-0" />
          <span>Exhibition submitted successfully! Redirecting to organizer hub...</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-[#F7F5F0] border border-[#B33A3A] text-[#B33A3A] text-sm rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Basic Event Information */}
        <div className="bg-[#FFFFFF] rounded-2xl border border-[#E5E0D7] shadow-curated p-6 sm:p-8 space-y-4">
          <h2 className="text-base font-bold text-[#202A35] border-b border-[#E5E0D7] pb-2.5">
            1. Exhibition Overview
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#202A35] mb-1">Exhibition Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Pune Spring Artisan & Crafts Carnival 2026"
                className="w-full px-3 py-2 bg-[#F7F5F0] border border-[#E5E0D7] rounded-lg text-sm text-[#202A35] focus:outline-none focus:ring-1 focus:ring-[#B95335]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#202A35] mb-1">Exhibition Category *</label>
              <select
                value={eventCategory}
                onChange={(e) => setEventCategory(e.target.value)}
                className="w-full px-3 py-2 bg-[#F7F5F0] border border-[#E5E0D7] rounded-lg text-sm text-[#202A35] focus:outline-none focus:ring-1 focus:ring-[#B95335]"
              >
                <option value="Flea Market & Craft Expo">Flea Market & Craft Expo</option>
                <option value="Food & Beverage">Food & Beverage Carnival</option>
                <option value="Apparel & Sustainable Fashion">Apparel & Sustainable Fashion</option>
                <option value="Lifestyle & Home Decor">Lifestyle & Home Decor</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#202A35] mb-1">
                Estimated Visitor Footfall *
              </label>
              <input
                type="number"
                min="0"
                required
                value={expectedFootfall}
                onChange={(e) => setExpectedFootfall(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#F7F5F0] border border-[#E5E0D7] rounded-lg text-sm text-[#202A35] focus:outline-none focus:ring-1 focus:ring-[#B95335]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#202A35] mb-1">Description *</label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the curation, target demographic, and live attractions..."
                className="w-full px-3 py-2 bg-[#F7F5F0] border border-[#E5E0D7] rounded-lg text-xs text-[#202A35] focus:outline-none focus:ring-1 focus:ring-[#B95335]"
              />
            </div>
          </div>
        </div>

        {/* Step 2: Venue and Dates */}
        <div className="bg-[#FFFFFF] rounded-2xl border border-[#E5E0D7] shadow-curated p-6 sm:p-8 space-y-4">
          <h2 className="text-base font-bold text-[#202A35] border-b border-[#E5E0D7] pb-2.5">
            2. Venue & Schedule
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#202A35] mb-1">Venue Name *</label>
              <input
                type="text"
                required
                value={venueName}
                onChange={(e) => setVenueName(e.target.value)}
                placeholder="e.g. Royal Palms Exhibition Pavilion"
                className="w-full px-3 py-2 bg-[#F7F5F0] border border-[#E5E0D7] rounded-lg text-sm text-[#202A35] focus:outline-none focus:ring-1 focus:ring-[#B95335]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#202A35] mb-1">City *</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Pune"
                className="w-full px-3 py-2 bg-[#F7F5F0] border border-[#E5E0D7] rounded-lg text-sm text-[#202A35] focus:outline-none focus:ring-1 focus:ring-[#B95335]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#202A35] mb-1">Full Street Address *</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Koregaon Park Annexe, North Main Road"
                className="w-full px-3 py-2 bg-[#F7F5F0] border border-[#E5E0D7] rounded-lg text-sm text-[#202A35] focus:outline-none focus:ring-1 focus:ring-[#B95335]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#202A35] mb-1">Exhibition Starts At *</label>
              <input
                type="datetime-local"
                required
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
                className="w-full px-3 py-2 bg-[#F7F5F0] border border-[#E5E0D7] rounded-lg text-sm text-[#202A35] focus:outline-none focus:ring-1 focus:ring-[#B95335]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#202A35] mb-1">Exhibition Ends At *</label>
              <input
                type="datetime-local"
                required
                value={endsAt}
                onChange={(e) => setEndsAt(e.target.value)}
                className="w-full px-3 py-2 bg-[#F7F5F0] border border-[#E5E0D7] rounded-lg text-sm text-[#202A35] focus:outline-none focus:ring-1 focus:ring-[#B95335]"
              />
            </div>
          </div>
        </div>

        {/* Step 3: Multi-Tier Stall Categories */}
        <div className="bg-[#FFFFFF] rounded-2xl border border-[#E5E0D7] shadow-curated p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between border-b border-[#E5E0D7] pb-2.5">
            <div>
              <h2 className="text-base font-bold text-[#202A35]">3. Stall Categories & Capacity</h2>
              <p className="text-xs text-[#747B80]">
                Define distinct stall sizes, inclusions, capacity, and pricing in INR.
              </p>
            </div>
            <button
              type="button"
              onClick={addStallTier}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#EFEAE1] text-[#202A35] hover:bg-[#E5E0D7] rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Category
            </button>
          </div>

          <div className="space-y-4">
            {stallTiers.map((tier, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-[#E5E0D7] bg-[#F7F5F0] space-y-3 relative"
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#B95335]">
                    Category Tier #{idx + 1}
                  </span>
                  {stallTiers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeStallTier(idx)}
                      className="text-[#B33A3A] hover:text-[#8F2E2E] p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-[#202A35] mb-1">
                      Category Name (e.g. Standard 6x6)
                    </label>
                    <input
                      type="text"
                      required
                      value={tier.name}
                      onChange={(e) => updateStallTier(idx, 'name', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-[#FFFFFF] border border-[#E5E0D7] rounded-lg text-xs text-[#202A35]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#202A35] mb-1">
                      Price (₹ INR)
                    </label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={tier.price_rupees}
                      onChange={(e) => updateStallTier(idx, 'price_rupees', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-[#FFFFFF] border border-[#E5E0D7] rounded-lg text-xs font-semibold text-[#202A35]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#202A35] mb-1">
                      Total Capacity
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={tier.total_capacity}
                      onChange={(e) => updateStallTier(idx, 'total_capacity', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-[#FFFFFF] border border-[#E5E0D7] rounded-lg text-xs font-semibold text-[#202A35]"
                    />
                  </div>

                  <div className="sm:col-span-4">
                    <label className="block text-[11px] font-semibold text-[#202A35] mb-1">
                      Inclusions & Dimension Details
                    </label>
                    <input
                      type="text"
                      value={tier.description}
                      onChange={(e) => updateStallTier(idx, 'description', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-[#FFFFFF] border border-[#E5E0D7] rounded-lg text-xs text-[#202A35]"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Action */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#B95335] hover:bg-[#98432B] text-white font-bold text-sm rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Exhibition for Admin Verification'}
          </button>
        </div>
      </form>
    </div>
  );
}
