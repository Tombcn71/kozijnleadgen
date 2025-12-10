'use client';

import LeadCard from './LeadCard';

interface LeadListProps {
  leads: any[];
  loading: boolean;
}

export default function LeadList({ leads, loading }: LeadListProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Leads
        </h2>
        <div className="text-center py-12">
          <p className="text-gray-500">
            Voer een postcode in om leads te genereren
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-900">
          Leads ({leads.length})
        </h2>
        <div className="text-sm text-gray-600">
          Gesorteerd op score
        </div>
      </div>

      <div className="space-y-4">
        {leads.map((lead) => (
          <LeadCard key={lead.id} lead={lead} />
        ))}
      </div>
    </div>
  );
}

