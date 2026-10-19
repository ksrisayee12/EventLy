// src/components/Footer.tsx
import Link from 'next/link';
import { Store, ShieldCheck, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Store className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-white">EventLy</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              India&apos;s dedicated two-sided marketplace connecting verified event organizers with artisanal and commercial stall vendors.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Manual Organizer Verification Enforced</span>
            </div>
          </div>

          {/* Vendors */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">For Vendors</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/events" className="hover:text-white transition-colors">
                  Discover Events
                </Link>
              </li>
              <li>
                <Link href="/vendor/applications" className="hover:text-white transition-colors">
                  Track Applications
                </Link>
              </li>
              <li>
                <Link href="/vendor/bookings" className="hover:text-white transition-colors">
                  My Stall Bookings
                </Link>
              </li>
              <li>
                <Link href="/vendor/refunds" className="hover:text-white transition-colors">
                  Cancellation & Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Organizers */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">For Organizers</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/organizer/events/new" className="hover:text-white transition-colors">
                  List Your Event
                </Link>
              </li>
              <li>
                <Link href="/organizer/applications" className="hover:text-white transition-colors">
                  Review Vendor Applications
                </Link>
              </li>
              <li>
                <Link href="/organizer" className="hover:text-white transition-colors">
                  Organizer Dashboard
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition-colors">
                  Verification Standards
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Legal & Trust</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-white transition-colors">
                  Refund Rules & Timeline
                </Link>
              </li>
              <li className="pt-2 text-xs text-slate-500">
                Payments processed securely via Razorpay (INR integer paise storage).
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 EventLy Platforms India Pvt. Ltd. All rights reserved.</p>
          <p className="flex items-center gap-1 mt-2 sm:mt-0">
            Engineered with strict atomic concurrency & hold guarantees.
          </p>
        </div>
      </div>
    </footer>
  );
}
