import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const apiKey = process.env.COINBASE_COMMERCE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not set' }, { status: 500 });
    }

    const response = await fetch('https://api.commerce.coinbase.com/charges/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CC-Api-Key': apiKey,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) {
      // Log the error from Coinbase
      console.error('Coinbase API error:', data);
      return NextResponse.json({ error: data }, { status: response.status });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (err) {
    // Log the error for debugging
    console.error('Server error:', err);
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
