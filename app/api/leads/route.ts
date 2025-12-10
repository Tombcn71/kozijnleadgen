import { NextRequest, NextResponse } from 'next/server';
import { getLeadsByPostalCode, getAllLeads, createLead } from '@/lib/leads';
import { getAddressesByPostalCode } from '@/lib/bag';
import { getEnergyLabel, getEnergyLabelScore, hasSingleGlass } from '@/lib/epa';

/**
 * GET /api/leads
 * Get leads, optionally filtered by postal code
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const postalCode = searchParams.get('postalCode');
    const limit = parseInt(searchParams.get('limit') || '50');

    if (postalCode) {
      const leads = await getLeadsByPostalCode(postalCode, limit);
      return NextResponse.json({ leads });
    }

    const leads = await getAllLeads(limit);
    return NextResponse.json({ leads });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/leads
 * Generate leads for a postal code
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { postalCode } = body;

    if (!postalCode) {
      return NextResponse.json(
        { error: 'postalCode is required' },
        { status: 400 }
      );
    }

    // 1. Get addresses from BAG
    const addresses = await getAddressesByPostalCode(postalCode);
    
    if (addresses.length === 0) {
      return NextResponse.json(
        { error: 'No addresses found for this postal code' },
        { status: 404 }
      );
    }

    // 2. For each address, gather data and create lead
    const leads = await Promise.all(
      addresses.slice(0, 20).map(async (addr) => {
        // Get energy label
        const energyLabel = await getEnergyLabel(addr.address, addr.postalCode);

        // Calculate factors
        const factors = {
          energielabel: energyLabel?.labelklasse,
          enkelGlas: hasSingleGlass(energyLabel?.isolatie),
          // Add more factors as they become available
        };

        // Create lead
        const lead = await createLead({
          address: addr.address,
          postalCode: addr.postalCode,
          city: addr.city,
          houseNumber: addr.houseNumber,
          street: addr.street,
          factors,
        });

        return lead;
      })
    );

    // Sort by score
    leads.sort((a, b) => b.score - a.score);

    return NextResponse.json({
      success: true,
      leads,
      count: leads.length,
    });
  } catch (error) {
    console.error('Error generating leads:', error);
    return NextResponse.json(
      { error: 'Failed to generate leads', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

