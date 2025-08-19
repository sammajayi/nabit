import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const fid = req.headers.get("x-user-fid");
    const type = req.nextUrl.searchParams.get("type"); // 'purchases' or 'sales'
    
    if (!fid) {
      return NextResponse.json({ error: 'User FID required' }, { status: 400 });
    }
    
    let query = supabase
      .from('orders')
      .select(`
        *,
        products (
          id,
          name,
          price,
          images
        ),
        buyer:users!orders_buyer_fid_fkey (
          display_name,
          pfp_url
        ),
        seller:users!orders_seller_fid_fkey (
          display_name,
          pfp_url
        )
      `);
    
    if (type === 'purchases') {
      query = query.eq('buyer_fid', fid);
    } else if (type === 'sales') {
      query = query.eq('seller_fid', fid);
    } else {
      // Return both purchases and sales
      query = query.or(`buyer_fid.eq.${fid},seller_fid.eq.${fid}`);
    }
    
    const { data: orders, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching orders:', error);
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
    
    return NextResponse.json(orders || []);
  } catch (error) {
    console.error('Error in GET /api/orders:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { productId, paymentId, transactionHash } = await req.json();
    
    if (!productId) {
      return NextResponse.json({ 
        error: 'Product ID is required' 
      }, { status: 400 });
    }
    
    const buyerFid = req.headers.get("x-user-fid");
    if (!buyerFid) {
      return NextResponse.json({ error: 'User FID required' }, { status: 400 });
    }
    
    // Get product details
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id, price, fid')
      .eq('id', productId)
      .single();
    
    if (productError || !product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    // Ensure buyer exists
    const { error: userError } = await supabase
      .from('users')
      .upsert({ 
        fid: buyerFid,
        created_at: new Date().toISOString()
      });

    if (userError) {
      console.error('Error upserting user:', userError);
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
    
    // Create order
    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        product_id: productId,
        buyer_fid: buyerFid,
        seller_fid: product.fid,
        amount: product.price,
        status: transactionHash ? 'completed' : 'pending',
        payment_id: paymentId,
        transaction_hash: transactionHash
      })
      .select(`
        *,
        products (
          id,
          name,
          price,
          images
        ),
        buyer:users!orders_buyer_fid_fkey (
          display_name,
          pfp_url
        ),
        seller:users!orders_seller_fid_fkey (
          display_name,
          pfp_url
        )
      `)
      .single();
    
    if (error) {
      console.error('Error creating order:', error);
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }
    
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/orders:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { orderId, status, transactionHash } = await req.json();
    
    if (!orderId) {
      return NextResponse.json({ 
        error: 'Order ID is required' 
      }, { status: 400 });
    }
    
    const fid = req.headers.get("x-user-fid");
    if (!fid) {
      return NextResponse.json({ error: 'User FID required' }, { status: 400 });
    }
    
    // Update order (only buyer or seller can update)
    const { data: order, error } = await supabase
      .from('orders')
      .update({
        status: status || 'completed',
        transaction_hash: transactionHash,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .or(`buyer_fid.eq.${fid},seller_fid.eq.${fid}`)
      .select(`
        *,
        products (
          id,
          name,
          price,
          images
        ),
        buyer:users!orders_buyer_fid_fkey (
          display_name,
          pfp_url
        ),
        seller:users!orders_seller_fid_fkey (
          display_name,
          pfp_url
        )
      `)
      .single();
    
    if (error) {
      console.error('Error updating order:', error);
      return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }
    
    return NextResponse.json(order);
  } catch (error) {
    console.error('Error in PATCH /api/orders:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
