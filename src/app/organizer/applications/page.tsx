// src/app/organizer/applications/page.tsx
import { DataService } from '@/services/dataService';
import { formatPaiseToINR, formatDateOnly } from '@/lib/utils';
import { ApplicationReviewActions } from '@/components/organizer/ApplicationReviewActions';
import { Users } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function OrganizerApplicationsPage() {
  const organizerId = '11111111-1111-1111-1111-111111111111';
  const applications = await DataService.getOrganizerApplications(organizerId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-[#E5E0D7] pb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-[#64786B]">
          Curation Operations
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#202A35] tracking-tight mt-0.5">
          Vendor Applications Queue
        </h1>
        <p className="text-sm text-[#747B80]">
          Review applicant portfolios. Approving a brand automatically creates a 30-minute reservation hold on the stall.
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="p-12 text-center bg-[#FFFFFF] rounded-2xl border border-[#E5E0D7] shadow-curated space-y-3">
          <Users className="w-12 h-12 text-[#747B80] mx-auto" />
          <h3 className="text-base font-bold text-[#202A35]">No applications received yet.</h3>
          <p className="text-xs text-[#747B80]">
            When vendors apply for stall categories in your exhibitions, their brand submissions will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-[#FFFFFF] rounded-2xl border border-[#E5E0D7] shadow-curated p-6 sm:p-7 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#E5E0D7] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#B95335]">
                      {app.event?.title}
                    </span>
                    <span className="text-xs text-[#747B80]">• Applied {formatDateOnly(app.created_at)}</span>
                  </div>
                  <h2 className="text-xl font-bold text-[#202A35] mt-1">
                    {app.vendor?.business_name || 'Artisan Brand'}
                  </h2>
                  <div className="text-xs text-[#747B80]">
                    Category: <strong className="text-[#202A35]">{app.vendor?.business_category}</strong> • Contact: {app.vendor?.contact_phone}
                  </div>
                </div>

                <div className="shrink-0">
                  <ApplicationReviewActions
                    applicationId={app.id}
                    currentStatus={app.status}
                  />
                </div>
              </div>

              {/* Message from applicant */}
              {app.message && (
                <div className="p-3.5 bg-[#F7F5F0] rounded-xl border border-[#E5E0D7] text-xs text-[#202A35]">
                  <strong className="block text-[#202A35] font-semibold mb-1">Products to Exhibit:</strong>
                  {app.message}
                </div>
              )}

              {/* Stall selection and rate */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-[#F7F5F0] rounded-lg border border-[#E5E0D7]">
                  <span className="text-[#747B80] block">Requested Category</span>
                  <strong className="text-[#202A35] text-sm">{app.stall_type?.name}</strong>
                </div>

                <div className="p-3 bg-[#F7F5F0] rounded-lg border border-[#E5E0D7]">
                  <span className="text-[#747B80] block">Quantity</span>
                  <strong className="text-[#202A35] text-sm">{app.quantity} Stall(s)</strong>
                </div>

                <div className="p-3 bg-[#F7F5F0] rounded-lg border border-[#E5E0D7]">
                  <span className="text-[#747B80] block">Stall Value</span>
                  <strong className="text-[#202A35] text-sm font-extrabold">
                    {formatPaiseToINR((app.stall_type?.price_paise || 0) * app.quantity)}
                  </strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
