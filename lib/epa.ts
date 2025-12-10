/**
 * EPA (Energie Prestatie Advies) Register Client
 * https://www.ep-online.nl/PublicData
 * 
 * Note: EPA register heeft verschillende endpoints per gemeente
 * Dit is een generieke implementatie
 */

interface EPAResponse {
  adres?: string;
  energielabel?: string;
  labelklasse?: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
  isolatie?: {
    glas?: 'enkel' | 'dubbel' | 'hr' | 'hr+' | 'hr++';
    kozijnen?: string;
    isolatiewaarde?: string;
  };
  aanbevelingen?: string[];
  besparing?: string;
  jaar?: number;
}

/**
 * Haal energielabel op voor een adres
 * 
 * Note: EPA register heeft geen uniforme API
 * Verschillende gemeentes hebben verschillende endpoints
 * Dit is een placeholder implementatie
 */
export async function getEnergyLabel(
  address: string,
  postalCode: string
): Promise<EPAResponse | null> {
  try {
    // EPA register heeft geen centrale API
    // Verschillende gemeentes hebben verschillende systemen
    // Voor nu: mock data voor development
    
    if (process.env.NODE_ENV === 'development') {
      // Simuleer verschillende energielabels
      const labels: Array<'D' | 'E' | 'F' | 'G'> = ['D', 'E', 'F', 'G'];
      const randomLabel = labels[Math.floor(Math.random() * labels.length)];
      const hasSingleGlass = Math.random() > 0.5;
      
      return {
        adres: address,
        energielabel: randomLabel,
        labelklasse: randomLabel,
        isolatie: {
          glas: hasSingleGlass ? 'enkel' : 'dubbel',
          kozijnen: 'hout, matige staat',
          isolatiewaarde: hasSingleGlass ? 'Rc 0.5' : 'Rc 1.2',
        },
        aanbevelingen: hasSingleGlass
          ? [
              'Vervang enkele beglazing door HR++ glas',
              'Verbeter kozijnisolatie',
            ]
          : ['Verbeter kozijnisolatie'],
        besparing: hasSingleGlass ? '€850/jaar bij vervanging' : '€400/jaar',
        jaar: 2020,
      };
    }

    // In productie zou je hier de echte EPA API aanroepen
    // Bijvoorbeeld voor Utrecht: https://www.utrecht.nl/epa-register
    // Of via een scraping service
    
    // Placeholder voor echte implementatie
    const city = address.split(',').pop()?.trim() || '';
    
    // Check of er een EPA API endpoint is voor deze gemeente
    // Dit zou per gemeente geconfigureerd moeten worden
    
    return null;
  } catch (error) {
    console.error('EPA API error:', error);
    return null;
  }
}

/**
 * Parse energielabel naar score contribution
 */
export function getEnergyLabelScore(label: string | undefined): number {
  if (!label) return 0;
  
  const scores: Record<string, number> = {
    'G': 50,
    'F': 40,
    'E': 35,
    'D': 30,
    'C': 10,
    'B': 5,
    'A': 0,
  };
  
  return scores[label.toUpperCase()] || 0;
}

/**
 * Check of er enkel glas is (hoge score indicator)
 */
export function hasSingleGlass(isolatie: EPAResponse['isolatie']): boolean {
  return isolatie?.glas === 'enkel';
}

