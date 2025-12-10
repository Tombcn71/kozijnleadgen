-- Leads table
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  address TEXT NOT NULL,
  postal_code VARCHAR(6),
  city TEXT,
  house_number INTEGER,
  street TEXT,
  score INTEGER DEFAULT 0,
  estimated_order_value DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Lead factors (JSONB voor flexibiliteit)
CREATE TABLE IF NOT EXISTS lead_factors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  factor_type TEXT NOT NULL, -- 'bouwjaar', 'energielabel', 'street_view', etc
  factor_value JSONB,
  score_contribution INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Lead analysis (voor raw API responses)
CREATE TABLE IF NOT EXISTS lead_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  analysis_type TEXT NOT NULL, -- 'bag', 'epa', 'street_view', 'warmtescan'
  raw_data JSONB,
  processed_data JSONB,
  confidence_score DECIMAL(3,2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes voor performance
CREATE INDEX IF NOT EXISTS idx_leads_postal_code ON leads(postal_code);
CREATE INDEX IF NOT EXISTS idx_leads_score ON leads(score DESC);
CREATE INDEX IF NOT EXISTS idx_lead_factors_lead_id ON lead_factors(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_analysis_lead_id ON lead_analysis(lead_id);

