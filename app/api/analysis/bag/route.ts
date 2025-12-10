import { NextRequest, NextResponse } from 'next/server';
import { getAddressesByPostalCode } from '@/lib/bag';

/**
 * GET /api/analysis/bag
 * Get BAG data for a postal code
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const postalCode = searchParams.get('postalCode');

    if (!postalCode) {
      return NextResponse.json(
        { error: 'postalCode is required' },
        { status: 400 }
      );
    }

    const addresses = await getAddressesByPostalCode(postalCode);

    return NextResponse.json({
      success: true,
      addresses,
      count: addresses.length,
    });
  } catch (error) {
    console.error('Error fetching BAG data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch BAG data' },
      { status: 500 }
    );
  }
}

