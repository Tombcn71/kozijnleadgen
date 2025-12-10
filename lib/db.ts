import { neon } from '@neondatabase/serverless';

// Lazy initialization - only check DATABASE_URL when actually used
// This prevents build-time errors when DATABASE_URL is not set
let sqlInstance: ReturnType<typeof neon> | null = null;

function getSql() {
  if (!sqlInstance) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not set');
    }
    sqlInstance = neon(process.env.DATABASE_URL);
  }
  return sqlInstance;
}

// Create a proxy that initializes on first use
export const sql = new Proxy({} as ReturnType<typeof neon>, {
  get(_target, prop) {
    const sql = getSql();
    const value = (sql as any)[prop];
    if (typeof value === 'function') {
      return value.bind(sql);
    }
    return value;
  },
  apply(_target, _thisArg, argumentsList) {
    const sql = getSql();
    return (sql as any)(...argumentsList);
  },
}) as ReturnType<typeof neon>;

// Types
export interface Lead {
  id: string;
  address: string;
  postal_code: string | null;
  city: string | null;
  house_number: number | null;
  street: string | null;
  score: number;
  estimated_order_value: number | null;
  created_at: Date;
  updated_at: Date;
}

export interface LeadFactor {
  id: string;
  lead_id: string;
  factor_type: string;
  factor_value: any;
  score_contribution: number | null;
  created_at: Date;
}

export interface LeadAnalysis {
  id: string;
  lead_id: string;
  analysis_type: string;
  raw_data: any;
  processed_data: any;
  confidence_score: number | null;
  created_at: Date;
}

