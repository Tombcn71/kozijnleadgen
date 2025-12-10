'use client';

import { useState } from 'react';

interface LeadGeneratorProps {
  onLeadsGenerated: (leads: any[]) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export default function LeadGenerator({
  onLeadsGenerated,
  loading,
  setLoading,
}: LeadGeneratorProps) {
  const [postalCode, setPostalCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postalCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate leads');
      }

      onLeadsGenerated(data.leads || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        Genereer Leads
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        Voer een postcode in om leads te genereren voor kozijnvervanging
      </p>

      <form onSubmit={handleGenerate} className="space-y-4">
        <div>
          <label
            htmlFor="postalCode"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Postcode
          </label>
          <input
            type="text"
            id="postalCode"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value.toUpperCase())}
            placeholder="3581XT"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
            pattern="[0-9]{4}[A-Z]{2}"
            maxLength={6}
          />
          <p className="mt-1 text-xs text-gray-500">
            Format: 1234AB (cijfers + letters)
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !postalCode}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Genereren...' : 'Genereer Leads'}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">
          Hoe het werkt:
        </h3>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Haalt adressen op via BAG API</li>
          <li>• Analyseert energielabels (EPA)</li>
          <li>• Berekent lead score</li>
          <li>• Sorteert op kans + waarde</li>
        </ul>
      </div>
    </div>
  );
}

