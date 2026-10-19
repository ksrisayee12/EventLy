// src/components/Navbar.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Store, ShieldCheck, Menu, X, ArrowRight } from 'lucide-react';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isVendorActive = pathname.startsWith('/vendor');
  const isOrganizerActive = pathname.startsWith('/organizer');
  const isAdminActive = pathname.startsWith('/admin');
  const isEventsActive = pathname.startsWith('/events');

  return (
    <header className="sticky top-0 z-50 bg-[#FFFFFF] border-b border-[#E5E0D7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-lg bg-[#202A35] flex items-center justify-center text-[#F7F5F0] group-hover:bg-[#B95335] transition-colors">
                <Store className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl tracking-tight text-[#202A35]">
                  EventLy
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[#747B80] -mt-1">
                  Exhibition Marketplace
                </span>
              </div>
            </Link>

            <span className="hidden lg:inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-[#EFEAE1] text-[#64786B] border border-[#E5E0D7]">
              <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-[#287653]" />
              Verified Listings
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#747B80]">
            <Link
              href="/events"
              className={`transition-colors hover:text-[#202A35] ${
                isEventsActive ? 'text-[#202A35] font-semibold' : ''
              }`}
            >
              Discover Exhibitions
            </Link>
            <Link
              href="/vendor"
              className={`transition-colors hover:text-[#202A35] ${
                isVendorActive ? 'text-[#202A35] font-semibold' : ''
              }`}
            >
              Vendor Portal
            </Link>
            <Link
              href="/organizer"
              className={`transition-colors hover:text-[#202A35] ${
                isOrganizerActive ? 'text-[#202A35] font-semibold' : ''
              }`}
            >
              Organizer Hub
            </Link>
            <Link
              href="/admin"
              className={`transition-colors hover:text-[#202A35] ${
                isAdminActive ? 'text-[#202A35] font-semibold' : ''
              }`}
            >
              Admin Ops
            </Link>
          </nav>

          {/* Quick Demo Switcher & Primary Action */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center bg-[#F7F5F0] p-1 rounded-lg border border-[#E5E0D7] text-xs">
              <span className="text-[#747B80] px-2 font-medium">Role:</span>
              <Link
                href="/vendor"
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  isVendorActive
                    ? 'bg-[#FFFFFF] text-[#202A35] shadow-xs font-semibold'
                    : 'text-[#747B80] hover:text-[#202A35]'
                }`}
              >
                Vendor
              </Link>
              <Link
                href="/organizer"
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  isOrganizerActive
                    ? 'bg-[#FFFFFF] text-[#202A35] shadow-xs font-semibold'
                    : 'text-[#747B80] hover:text-[#202A35]'
                }`}
              >
                Organizer
              </Link>
              <Link
                href="/admin"
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  isAdminActive
                    ? 'bg-[#FFFFFF] text-[#202A35] shadow-xs font-semibold'
                    : 'text-[#747B80] hover:text-[#202A35]'
                }`}
              >
                Admin
              </Link>
            </div>

            <Link
              href="/events"
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#B95335] hover:bg-[#98432B] transition-colors"
            >
              Browse Stalls
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#202A35] hover:bg-[#F7F5F0] transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E5E0D7] bg-[#FFFFFF] px-4 pt-4 pb-6 space-y-3">
          <Link
            href="/events"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-[#202A35] hover:bg-[#F7F5F0]"
          >
            Discover Exhibitions
          </Link>
          <Link
            href="/vendor"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-[#202A35] hover:bg-[#F7F5F0]"
          >
            Vendor Portal
          </Link>
          <Link
            href="/organizer"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-[#202A35] hover:bg-[#F7F5F0]"
          >
            Organizer Hub
          </Link>
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-[#202A35] hover:bg-[#F7F5F0]"
          >
            Admin Verification & Refunds
          </Link>
          <div className="pt-3 border-t border-[#E5E0D7] flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-lg text-sm font-semibold bg-[#B95335] text-white hover:bg-[#98432B]"
            >
              Sign In / Role Switcher
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
