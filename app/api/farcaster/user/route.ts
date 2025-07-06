import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json({ error: 'username is required' }, { status: 400 });
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
        'accept': 'application/json',
      }
    };

    const response = await fetch(
      `https://api.neynar.com/v2/farcaster/user/by_username/${username}`,
      options
    );

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      throw new Error(`Neynar API error: ${response.status}`);
    }

    const data = await response.json();
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

export async function POST(req: Request) {
  const { fids } = await req.json();
  if (!Array.isArray(fids) || fids.length === 0) {
    return new Response("Missing or invalid fids", { status: 400 });
  }

  const res = await fetch(
    "https://api.neynar.com/v2/farcaster/user/bulk/",
    {
      method: "POST",
      headers: {
        "accept": "application/json",
        "content-type": "application/json",
        "x-api-key": process.env.NEYNAR_API_KEY!,
      },
      body: JSON.stringify({ fids }),
    }
  );

  if (!res.ok) {
    return new Response("Failed to fetch from Neynar", { status: 500 });
  }

  const data = await res.json();
  return Response.json(data);
} 