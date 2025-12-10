/**
 * Lead Scoring Algorithm
 * Multi-factor scoring voor kozijnvervanging leads
 */

export interface LeadScoreFactors {
  bouwjaar?: number;
  energielabel?: string;
  enkelGlas?: boolean;
  lastRenovation?: number; // years ago
  wozValue?: number;
  streetViewOldWindows?: boolean;
  warmteverlies?: boolean;
  windowCount?: number;
}

export interface LeadScore {
  score: number;
  factors: LeadScoreFactors;
  estimatedOrderValue: number;
  reasons: string[];
}

/**
 * Calculate lead score based on multiple factors
 */
export function calculateLeadScore(factors: LeadScoreFactors): LeadScore {
  let score = 0;
  const reasons: string[] = [];

  // Bouwjaar factor (ouder = hoger score)
  if (factors.bouwjaar) {
    if (factors.bouwjaar < 1980) {
      score += 30;
      reasons.push(`Bouwjaar ${factors.bouwjaar} - oude kozijnen waarschijnlijk`);
    } else if (factors.bouwjaar < 1990) {
      score += 20;
      reasons.push(`Bouwjaar ${factors.bouwjaar} - mogelijk renovatie nodig`);
    } else if (factors.bouwjaar < 2000) {
      score += 10;
    }
  }

  // Energielabel factor
  if (factors.energielabel) {
    const labelScores: Record<string, number> = {
      'G': 50,
      'F': 40,
      'E': 35,
      'D': 30,
      'C': 10,
      'B': 5,
      'A': 0,
    };
    const labelScore = labelScores[factors.energielabel.toUpperCase()] || 0;
    score += labelScore;
    if (labelScore > 30) {
      reasons.push(`Energielabel ${factors.energielabel} - slechte isolatie`);
    }
  }

  // Enkel glas = jackpot
  if (factors.enkelGlas) {
    score += 50;
    reasons.push('Enkel glas gedetecteerd - hoge prioriteit');
  }

  // Laatste renovatie
  if (factors.lastRenovation) {
    if (factors.lastRenovation > 15) {
      score += 25;
      reasons.push(`${factors.lastRenovation} jaar geen renovatie`);
    } else if (factors.lastRenovation > 10) {
      score += 15;
    }
  }

  // WOZ waarde (kan betalen)
  if (factors.wozValue) {
    if (factors.wozValue > 500000) {
      score += 20;
      reasons.push('Hoge WOZ waarde - kan investering betalen');
    } else if (factors.wozValue > 300000) {
      score += 10;
    }
  }

  // Street View detectie
  if (factors.streetViewOldWindows) {
    score += 30;
    reasons.push('Oude kozijnen zichtbaar op Street View');
  }

  // Warmteverlies
  if (factors.warmteverlies) {
    score += 25;
    reasons.push('Hoog warmteverlies gedetecteerd');
  }

  // Estimate order value based on window count
  const windowCount = factors.windowCount || 8; // Default estimate
  const estimatedOrderValue = windowCount * 850; // €850 per kozijn

  return {
    score: Math.min(score, 100), // Cap at 100
    factors,
    estimatedOrderValue,
    reasons: reasons.length > 0 ? reasons : ['Basis lead - meer data nodig'],
  };
}

/**
 * Determine lead priority based on score
 */
export function getLeadPriority(score: number): 'high' | 'medium' | 'low' {
  if (score >= 70) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
}

