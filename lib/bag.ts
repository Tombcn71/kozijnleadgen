/**
 * BAG (Basisregistratie Adressen en Gebouwen) API Client
 * https://api.bag.kadaster.nl/lvbag/individuelebevragingen/v2/
 */

interface BAGAddress {
  postcode: string;
  huisnummer: number;
  huisletter?: string;
  huisnummertoevoeging?: string;
  openbareRuimte?: string;
  woonplaats?: string;
}

interface BAGResponse {
  _embedded?: {
    adressen?: Array<{
      identificatie: string;
      adresseerbaarObject?: {
        geometrie?: {
          coordinates?: [number, number];
        };
      };
      nummeraanduiding?: {
        postcode: string;
        huisnummer: number;
        huisletter?: string;
        huisnummertoevoeging?: string;
      };
      openbareRuimte?: {
        naam?: string;
      };
      woonplaats?: {
        naam?: string;
      };
    }>;
  };
}

/**
 * Haal adressen op voor een postcode
 */
export async function getAddressesByPostalCode(
  postalCode: string
): Promise<Array<{ address: string; postalCode: string; houseNumber: number; street?: string; city?: string }>> {
  try {
    // BAG API endpoint
    const url = `https://api.bag.kadaster.nl/lvbag/individuelebevragingen/v2/adressen?postcode=${postalCode}`;
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'X-Api-Key': process.env.BAG_API_KEY || '', // Optioneel, meestal niet nodig
      },
    });

    if (!response.ok) {
      throw new Error(`BAG API error: ${response.status}`);
    }

    const data: BAGResponse = await response.json();
    
    if (!data._embedded?.adressen) {
      return [];
    }

    return data._embedded.adressen.map((adres) => {
      const nummer = adres.nummeraanduiding;
      const street = adres.openbareRuimte?.naam;
      const city = adres.woonplaats?.naam;
      const houseNumber = nummer?.huisnummer || 0;
      
      // Build full address
      let address = `${street || ''} ${houseNumber}`.trim();
      if (nummer?.huisletter) address += ` ${nummer.huisletter}`;
      if (nummer?.huisnummertoevoeging) address += `-${nummer.huisnummertoevoeging}`;
      if (city) address += `, ${city}`;
      if (nummer?.postcode) address += ` ${nummer.postcode}`;

      return {
        address: address.trim(),
        postalCode: nummer?.postcode || postalCode,
        houseNumber,
        street,
        city,
      };
    });
  } catch (error) {
    console.error('BAG API error:', error);
    // Fallback: return mock data for development
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          address: `Straat 1, ${postalCode}`,
          postalCode,
          houseNumber: 1,
          street: 'Straat',
          city: 'Utrecht',
        },
      ];
    }
    throw error;
  }
}

/**
 * Haal bouwjaar en woningtype op voor een adres
 * Note: Dit vereist een specifiek adres ID, wat complexer is
 */
export async function getBuildingData(address: string): Promise<{
  bouwjaar?: number;
  woningtype?: string;
  oppervlakte?: number;
}> {
  // Dit is een vereenvoudigde versie
  // In productie zou je het BAG object ID nodig hebben
  // Voor nu returnen we null - dit kan later uitgebreid worden
  return {};
}

