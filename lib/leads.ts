/**
 * Lead management functions
 */

import { sql, Lead, LeadFactor, LeadAnalysis } from './db';
import { calculateLeadScore, LeadScoreFactors } from './scoring';

export interface CreateLeadInput {
  address: string;
  postalCode: string;
  city?: string;
  houseNumber?: number;
  street?: string;
  factors: LeadScoreFactors;
}

/**
 * Create a new lead with scoring
 */
export async function createLead(input: CreateLeadInput): Promise<Lead & { reasons: string[]; estimatedOrderValue: number }> {
  const scoreResult = calculateLeadScore(input.factors);

  // Insert lead
  const result = await sql`
    INSERT INTO leads (
      address, postal_code, city, house_number, street,
      score, estimated_order_value
    )
    VALUES (
      ${input.address},
      ${input.postalCode},
      ${input.city || null},
      ${input.houseNumber || null},
      ${input.street || null},
      ${scoreResult.score},
      ${scoreResult.estimatedOrderValue}
    )
    RETURNING *
  `;
  const lead = (result as any)[0] as Lead;

  // Insert factors
  for (const [key, value] of Object.entries(input.factors)) {
    if (value !== undefined && value !== null) {
      await sql`
        INSERT INTO lead_factors (lead_id, factor_type, factor_value, score_contribution)
        VALUES (
          ${lead.id},
          ${key},
          ${JSON.stringify(value)},
          ${scoreResult.score}
        )
      `;
    }
  }

  return {
    ...lead,
    reasons: scoreResult.reasons,
    estimatedOrderValue: scoreResult.estimatedOrderValue,
  };
}

/**
 * Get leads by postal code
 */
export async function getLeadsByPostalCode(
  postalCode: string,
  limit: number = 50
) {
  const leadsResult = await sql`
    SELECT * FROM leads
    WHERE postal_code = ${postalCode}
    ORDER BY score DESC
    LIMIT ${limit}
  `;
  const leads = leadsResult as Lead[];

  // Get factors for each lead
  const leadsWithFactors = await Promise.all(
    leads.map(async (lead) => {
      const factorsResult = await sql`
        SELECT * FROM lead_factors
        WHERE lead_id = ${lead.id}
      `;
      const factors = factorsResult as LeadFactor[];

      const analysisResult = await sql`
        SELECT * FROM lead_analysis
        WHERE lead_id = ${lead.id}
        ORDER BY created_at DESC
      `;
      const analysis = analysisResult as LeadAnalysis[];

      return {
        ...lead,
        factors: factors.map((f) => ({
          type: f.factor_type,
          value: f.factor_value,
          contribution: f.score_contribution,
        })),
        analysis: analysis.map((a) => ({
          type: a.analysis_type,
          data: a.processed_data,
          confidence: a.confidence_score,
        })),
      };
    })
  );

  return leadsWithFactors;
}

/**
 * Get all leads sorted by score
 */
export async function getAllLeads(limit: number = 100) {
  const result = await sql`
    SELECT * FROM leads
    ORDER BY score DESC, created_at DESC
    LIMIT ${limit}
  `;

  return result as Lead[];
}

/**
 * Save analysis data for a lead
 */
export async function saveLeadAnalysis(
  leadId: string,
  analysisType: string,
  rawData: any,
  processedData: any,
  confidenceScore?: number
) {
  const result = await sql`
    INSERT INTO lead_analysis (
      lead_id, analysis_type, raw_data, processed_data, confidence_score
    )
    VALUES (
      ${leadId},
      ${analysisType},
      ${JSON.stringify(rawData)},
      ${JSON.stringify(processedData)},
      ${confidenceScore || null}
    )
    RETURNING *
  `;

  return result[0] as LeadAnalysis;
}

