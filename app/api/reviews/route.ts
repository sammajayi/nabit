import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const productId = req.nextUrl.searchParams.get("productId");
    
    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }
    
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select(`
        *,
        users!reviews_reviewer_fid_fkey (
          display_name,
          pfp_url
        )
      `)
      .eq('product_id', productId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching reviews:', error);
      return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
    }
    
    return NextResponse.json(reviews || []);
  } catch (error) {
    console.error('Error in GET /api/reviews:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { productId, rating, comment } = await req.json();
    
    if (!productId || !rating) {
      return NextResponse.json({ 
        error: 'Product ID and rating are required' 
      }, { status: 400 });
    }
    
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ 
        error: 'Rating must be between 1 and 5' 
      }, { status: 400 });
    }
    
    const fid = req.headers.get("x-user-fid");
    if (!fid) {
      return NextResponse.json({ error: 'User FID required' }, { status: 400 });
    }
    
    // Check if user already reviewed this product
    const { data: existingReview } = await supabase
      .from('reviews')
      .select('id')
      .eq('product_id', productId)
      .eq('reviewer_fid', fid)
      .single();
    
    if (existingReview) {
      return NextResponse.json({ 
        error: 'You have already reviewed this product' 
      }, { status: 400 });
    }
    
    // Ensure user exists
    const { error: userError } = await supabase
      .from('users')
      .upsert({ 
        fid,
        created_at: new Date().toISOString()
      });

    if (userError) {
      console.error('Error upserting user:', userError);
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
    
    // Create review
    const { data: review, error } = await supabase
      .from('reviews')
      .insert({
        product_id: productId,
        reviewer_fid: fid,
        rating,
        comment: comment || null
      })
      .select(`
        *,
        users!reviews_reviewer_fid_fkey (
          display_name,
          pfp_url
        )
      `)
      .single();
    
    if (error) {
      console.error('Error creating review:', error);
      return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
    }
    
    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/reviews:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
