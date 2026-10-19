// src/components/Footer.tsx
import Link from 'next/link';
import { Store, ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#202A35] text-[#A3ABB2] border-t border-[#2E3A47]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#B95335] flex items-center justify-center text-white">
                <Store className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-[#FFFFFF]">EventLy</span>
            </div>
            <p className="text-sm text-[#A3ABB2] leading-relaxed">
              India&apos;s curated two-sided marketplace connecting verified event organizers with artisanal and commercial stall vendors.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#64786B] font-medium pt-1">
              <ShieldCheck className="w-4 h-4 text-[#287653]" />
              <span className="text-[#EFEAE1]">Direct Organizer Verification</span>
            </div>
          </div>

          {/* Vendors */}
          <div>
            <h4 className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider mb-4">
              For Vendors
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/events" className="hover:text-white transition-colors">
                  Discover Exhibitions
                </Link>
              </li>
              <li>
                <Link href="/vendor/applications" className="hover:text-white transition-colors">
                  Application Tracker
                </Link>
              </li>
              <li>
                <Link href="/vendor/bookings" className="hover:text-white transition-colors">
                  Confirmed Stall Passes
                </Link>
              </li>
              <li>
                <Link href="/vendor/refunds" className="hover:text-white transition-colors">
                  Cancellation & Refund Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Organizers */}
          <div>
            <h4 className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider mb-4">
              For Organizers
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/organizer/events/new" className="hover:text-white transition-colors">
                  List Your Exhibition
                </Link>
              </li>
              <li>
                <Link href="/organizer/applications" className="hover:text-white transition-colors">
                  Curation Queue
                </Link>
              </li>
              <li>
                <Link href="/organizer" className="hover:text-white transition-colors">
                  Organizer Dashboard
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition-colors">
                  Verification Guidelines
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h4 className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider mb-4">
              Standards & Legal
            </h4>
            <ul className="space-y-2.5 text-sm">
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
                  Refund Rules & Policy
                </Link>
              </li>
              <li className="pt-2 text-xs text-[#747B80]">
                INR transactions secured with integer paise precision and Razorpay gateway.
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#2E3A47] flex flex-col sm:flex-row items-center justify-between text-xs text-[#747B80]">
          <p>© 2026 EventLy Platforms India Pvt. Ltd. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 font-medium text-[#A3ABB2]">
            Curated Exhibition Marketplace Architecture
          </p>
        </div>
      </div>
    </footer>
  );
}
