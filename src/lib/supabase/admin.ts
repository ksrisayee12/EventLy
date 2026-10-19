// src/lib/supabase/admin.ts
// Privileged Supabase Service-Role Client (Strictly Server-Side Only)

import { createClient } from '@supabase/supabase-js';

export function createAdminSupabaseClient() {
  if (typeof window !== 'undefined') {
    throw new Error(
      'SECURITY VIOLATION: createAdminSupabaseClient must NEVER be called in browser context.'
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  if (!supabaseUrl || !serviceRoleKey) {
    console.warn(
      '[EventLy Admin Client] Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL.'
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
