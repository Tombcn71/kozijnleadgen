import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

export const sql = neon(process.env.DATABASE_URL);

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

