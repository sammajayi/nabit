import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');

  if (!address) {
    return NextResponse.json({ error: 'Address is required' }, { status: 400 });
  }

  try {
    const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;
    
    if (!NEYNAR_API_KEY) {
      return NextResponse.json({ error: 'Neynar API key not configured' }, { status: 500 });
    }

    const options = {
      method: 'GET',
      headers: {
        'x-api-key': NEYNAR_API_KEY,
        'Content-Type': 'application/json',
      }
    };

    const response = await fetch(
      `https://api.neynar.com/v2/farcaster/user/custody-address/${address}`,
      options
    );

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      throw new Error(`Neynar API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract user data from the response
    const user = data.user;

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      username: user.username,
      displayName: user.display_name,
      pfp: user.pfp_url,
      fid: user.fid,
    });

  } catch (error) {
    console.error('Error fetching Farcaster user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Farcaster user' },
      { status: 500 }
    );
  }
} 