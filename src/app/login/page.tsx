// src/app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Store, ShieldCheck, UserCheck, ArrowRight, Sparkles, Mail, Lock } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState<'vendor' | 'organizer' | 'admin'>('vendor');
  const [notice, setNotice] = useState<string | null>(null);

  function handleDemoLogin(role: 'vendor' | 'organizer' | 'admin') {
    if (role === 'vendor') router.push('/vendor');
    else if (role === 'organizer') router.push('/organizer');
    else router.push('/admin');
  }

  function handleAuthSubmit(e: React.FormEvent) {
    e.preventDefault();
    setNotice(
      'Supabase Auth is configured for production. For local sandbox testing, use the instant 1-click Demo Profiles below.'
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/80 shadow-xl p-8 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-md shadow-indigo-600/30">
            <Store className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Sign In to EventLy
          </h1>
          <p className="text-xs text-slate-500">
            Access your vendor stall applications or manage organized exhibitions.
          </p>
        </div>

        {/* 1-Click Instant Demo Profiles (Crucial for Pair Programming & Testing) */}
        <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Instant Sandbox Sign-In (No Password Needed)</span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={() => handleDemoLogin('vendor')}
              className="w-full py-2.5 px-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl flex items-center justify-between shadow-sm cursor-pointer transition-colors"
            >
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-500" />
                Rohan Verma (Artisan Vendor)
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              onClick={() => handleDemoLogin('organizer')}
              className="w-full py-2.5 px-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl flex items-center justify-between shadow-sm cursor-pointer transition-colors"
            >
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Kavita Sharma (Organizer)
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              onClick={() => handleDemoLogin('admin')}
              className="w-full py-2.5 px-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl flex items-center justify-between shadow-sm cursor-pointer transition-colors"
            >
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                Platform Administrator
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Traditional Auth Form (Configurable for Supabase Auth) */}
        <form onSubmit={handleAuthSubmit} className="space-y-4 pt-2">
          {notice && (
            <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-xl">
              {notice}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.business@email.com"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Account Role</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSelectedRole('vendor')}
                className={`py-2 text-xs font-bold rounded-xl border cursor-pointer ${
                  selectedRole === 'vendor'
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                Vendor
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('organizer')}
                className={`py-2 text-xs font-bold rounded-xl border cursor-pointer ${
                  selectedRole === 'organizer'
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                Organizer
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
          >
            Continue with Email
          </button>
        </form>
      </div>
    </div>
  );
}
