import { getPaymentStatus } from '@base-org/account';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const txId = searchParams.get('txId');
  
  if (!txId) {
    return NextResponse.json({ error: 'Transaction ID required' }, { status: 400 });
  }
  
  try {
    const status = await getPaymentStatus({ id: txId });
    
    if (status.status === 'completed') {
    
      console.log('Payment completed for:', txId);
    }
    
    return NextResponse.json(status);
  } catch (error) {
    console.error('Error checking payment status:', error);
    return NextResponse.json({ error: 'Failed to check payment status' }, { status: 500 });
  }
}