// src/components/Navbar.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Calendar, Store, ShieldCheck, UserCheck, Menu, X, ArrowRight } from 'lucide-react';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<'vendor' | 'organizer' | 'admin'>('vendor');

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-sky-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
                <Store className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 to-indigo-950 bg-clip-text text-transparent">
                  EventLy
                </span>
                <span className="text-[10px] font-semibold text-indigo-700 tracking-wider uppercase -mt-1">
                  Stall Marketplace
                </span>
              </div>
            </Link>

            <span className="hidden md:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60 ml-2">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              Verified Events Only
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link href="/events" className="hover:text-indigo-600 transition-colors flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              Discover Events
            </Link>
            <Link href="/vendor" className="hover:text-indigo-600 transition-colors">
              Vendor Portal
            </Link>
            <Link href="/organizer" className="hover:text-indigo-600 transition-colors">
              Organizer Hub
            </Link>
            <Link href="/admin" className="hover:text-indigo-600 transition-colors">
              Admin Ops
            </Link>
          </nav>

          {/* Quick Demo Role Switcher & CTA */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-semibold">
              <span className="text-slate-500 px-2">Demo Role:</span>
              <Link
                href="/vendor"
                className="px-2.5 py-1 rounded-md transition-colors bg-white text-indigo-700 shadow-sm font-bold"
              >
                Vendor
              </Link>
              <Link
                href="/organizer"
                className="px-2.5 py-1 rounded-md transition-colors hover:text-indigo-700 text-slate-600"
              >
                Organizer
              </Link>
              <Link
                href="/admin"
                className="px-2.5 py-1 rounded-md transition-colors hover:text-indigo-700 text-slate-600"
              >
                Admin
              </Link>
            </div>

            <Link
              href="/events"
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-600/20 transition-all hover:shadow-md"
            >
              Browse Stalls
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <Link
            href="/events"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-800 hover:bg-slate-50"
          >
            Discover Events
          </Link>
          <Link
            href="/vendor"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-800 hover:bg-slate-50"
          >
            Vendor Dashboard
          </Link>
          <Link
            href="/organizer"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-800 hover:bg-slate-50"
          >
            Organizer Dashboard
          </Link>
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-800 hover:bg-slate-50"
          >
            Admin Verification & Refunds
          </Link>
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-lg text-sm font-semibold bg-indigo-600 text-white"
            >
              Sign In / Role Switcher
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
