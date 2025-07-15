import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/lib/env';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const fid = searchParams.get('fid');
  if (!fid) return NextResponse.json({ error: 'Missing fid' }, { status: 400 });

  const response = await fetch(
    `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`,
    {
      headers: { 'x-api-key': env.NEYNAR_API_KEY! },
    }
  );
  if (!response.ok) {
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
  const data = await response.json();
  return NextResponse.json(data.users[0]);
}