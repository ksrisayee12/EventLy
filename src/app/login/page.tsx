// src/app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Store, ArrowRight, Sparkles, Mail } from 'lucide-react';

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
      'Supabase Auth is configured for production. For local sandbox testing, select one of the 1-click Demo Profiles below.'
    );
  }

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-[#FFFFFF] rounded-2xl border border-[#E5E0D7] shadow-curated p-8 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-lg bg-[#202A35] text-white flex items-center justify-center mx-auto">
            <Store className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#202A35] tracking-tight">
            Sign In to EventLy
          </h1>
          <p className="text-xs text-[#747B80]">
            Access your vendor applications or manage exhibition stall listings.
          </p>
        </div>

        {/* 1-Click Instant Demo Profiles */}
        <div className="p-4 bg-[#F7F5F0] border border-[#E5E0D7] rounded-xl space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#202A35]">
            <Sparkles className="w-3.5 h-3.5 text-[#B95335]" />
            <span>Instant Sandbox Sign-In</span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={() => handleDemoLogin('vendor')}
              className="w-full py-2 px-3 bg-[#FFFFFF] hover:bg-[#EFEAE1] border border-[#E5E0D7] text-[#202A35] text-xs font-semibold rounded-lg flex items-center justify-between transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#64786B]" />
                Rohan Verma (Artisan Vendor)
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-[#747B80]" />
            </button>

            <button
              onClick={() => handleDemoLogin('organizer')}
              className="w-full py-2 px-3 bg-[#FFFFFF] hover:bg-[#EFEAE1] border border-[#E5E0D7] text-[#202A35] text-xs font-semibold rounded-lg flex items-center justify-between transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#B95335]" />
                Kavita Sharma (Organizer)
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-[#747B80]" />
            </button>

            <button
              onClick={() => handleDemoLogin('admin')}
              className="w-full py-2 px-3 bg-[#FFFFFF] hover:bg-[#EFEAE1] border border-[#E5E0D7] text-[#202A35] text-xs font-semibold rounded-lg flex items-center justify-between transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#202A35]" />
                Platform Administrator
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-[#747B80]" />
            </button>
          </div>
        </div>

        {/* Traditional Auth Form */}
        <form onSubmit={handleAuthSubmit} className="space-y-4 pt-1">
          {notice && (
            <div className="p-3 bg-[#EFEAE1] border border-[#E5E0D7] text-[#202A35] text-xs rounded-lg">
              {notice}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#202A35] mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#747B80] absolute left-3 top-2.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.business@email.com"
                className="w-full pl-9 pr-3 py-2 bg-[#F7F5F0] border border-[#E5E0D7] rounded-lg text-xs text-[#202A35] focus:outline-none focus:ring-1 focus:ring-[#B95335]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#202A35] mb-1">Select Account Type</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSelectedRole('vendor')}
                className={`py-2 text-xs font-semibold rounded-lg border cursor-pointer transition-colors ${
                  selectedRole === 'vendor'
                    ? 'bg-[#202A35] text-white border-[#202A35]'
                    : 'bg-[#F7F5F0] text-[#747B80] border-[#E5E0D7]'
                }`}
              >
                Vendor
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('organizer')}
                className={`py-2 text-xs font-semibold rounded-lg border cursor-pointer transition-colors ${
                  selectedRole === 'organizer'
                    ? 'bg-[#202A35] text-white border-[#202A35]'
                    : 'bg-[#F7F5F0] text-[#747B80] border-[#E5E0D7]'
                }`}
              >
                Organizer
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-[#B95335] hover:bg-[#98432B] text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
          >
            Continue with Email
          </button>
        </form>
      </div>
    </div>
  );
}
