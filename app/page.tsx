'use client';

import { useState } from 'react';
import LeadGenerator from '@/components/LeadGenerator';
import LeadList from '@/components/LeadList';

export default function Home() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleLeadsGenerated = (newLeads: any[]) => {
    setLeads(newLeads);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Kozijn Lead Generator
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Genereer hoogwaardige leads voor kozijnvervanging op basis van data-analyse
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <LeadGenerator
              onLeadsGenerated={handleLeadsGenerated}
              loading={loading}
              setLoading={setLoading}
            />
          </div>
          <div className="lg:col-span-2">
            <LeadList leads={leads} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
}
