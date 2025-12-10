import { NextRequest, NextResponse } from 'next/server';
import { getEnergyLabel } from '@/lib/epa';

/**
 * GET /api/analysis/epa
 * Get EPA energy label for an address
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const address = searchParams.get('address');
    const postalCode = searchParams.get('postalCode');

    if (!address || !postalCode) {
      return NextResponse.json(
        { error: 'address and postalCode are required' },
        { status: 400 }
      );
    }

    const energyLabel = await getEnergyLabel(address, postalCode);

    if (!energyLabel) {
      return NextResponse.json(
        { error: 'Energy label not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      energyLabel,
    });
  } catch (error) {
    console.error('Error fetching EPA data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch EPA data' },
      { status: 500 }
    );
  }
}

