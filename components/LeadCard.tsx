'use client';

interface LeadCardProps {
  lead: {
    id: string;
    address: string;
    score: number;
    estimated_order_value: number | null;
    reasons?: string[];
    factors?: any[];
  };
}

export default function LeadCard({ lead }: LeadCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 70) return 'bg-green-100 text-green-800';
    if (score >= 40) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getPriority = (score: number): string => {
    if (score >= 70) return 'Hoog';
    if (score >= 40) return 'Gemiddeld';
    return 'Laag';
  };

  const formatCurrency = (value: number | null) => {
    if (!value) return 'Onbekend';
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {lead.address}
          </h3>
          <div className="flex items-center gap-3 mt-2">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(
                lead.score
              )}`}
            >
              Score: {lead.score}/100
            </span>
            <span className="text-sm text-gray-600">
              Prioriteit: {getPriority(lead.score)}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">Geschatte waarde</p>
          <p className="text-lg font-semibold text-gray-900">
            {formatCurrency(lead.estimated_order_value)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Lead ID</p>
          <p className="text-sm font-mono text-gray-600 truncate">
            {lead.id.slice(0, 8)}...
          </p>
        </div>
      </div>

      {lead.reasons && lead.reasons.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs font-semibold text-gray-700 mb-2">
            Redenen voor hoge score:
          </p>
          <ul className="space-y-1">
            {lead.reasons.map((reason, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                {reason}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
        <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md text-sm hover:bg-blue-700 transition-colors">
          Stuur Offerte
        </button>
        <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md text-sm hover:bg-gray-200 transition-colors">
          Details
        </button>
      </div>
    </div>
  );
}

