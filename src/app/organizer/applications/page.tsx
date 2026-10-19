// src/app/organizer/applications/page.tsx
import { DataService } from '@/services/dataService';
import { formatPaiseToINR, formatDateOnly } from '@/lib/utils';
import { ApplicationReviewActions } from '@/components/organizer/ApplicationReviewActions';
import { Users, Store, Clock, Building2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function OrganizerApplicationsPage() {
  const organizerId = '11111111-1111-1111-1111-111111111111';
  const applications = await DataService.getOrganizerApplications(organizerId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Vendor Applications Queue
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Review vendor brand submissions. Approving an applicant automatically initiates a 30-minute transactional reservation hold on the stall.
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
          <Users className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">No applications received yet.</h3>
          <p className="text-xs text-slate-500">
            When vendors discover your published event and apply for stall categories, their applications will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                      {app.event?.title}
                    </span>
                    <span className="text-xs text-slate-400">• Applied {formatDateOnly(app.created_at)}</span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mt-1">
                    {app.vendor?.business_name || 'Artisan Vendor'}
                  </h2>
                  <div className="text-xs text-slate-500">
                    Category: <strong>{app.vendor?.business_category}</strong> • Phone: {app.vendor?.contact_phone}
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
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-700">
                  <strong className="block text-slate-900 mb-1">Products to Exhibit:</strong>
                  {app.message}
                </div>
              )}

              {/* Stall selection and rate */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100/60">
                  <span className="text-slate-500 block">Requested Stall Category</span>
                  <strong className="text-slate-900 text-sm">{app.stall_type?.name}</strong>
                </div>

                <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100/60">
                  <span className="text-slate-500 block">Quantity</span>
                  <strong className="text-slate-900 text-sm">{app.quantity} Stall(s)</strong>
                </div>

                <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100/60">
                  <span className="text-slate-500 block">Expected Revenue</span>
                  <strong className="text-indigo-700 text-sm">
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
