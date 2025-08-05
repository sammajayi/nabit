import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { promises as fs } from "fs";
import path from "path";

const UPLOADS_DIR = path.join(process.cwd(), "public/uploads");

async function saveFile(file: any) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const filename = `${Date.now()}-${file.name}`;
  const filePath = path.join(UPLOADS_DIR, filename);
  await fs.writeFile(filePath, buffer);
  return `/uploads/${filename}`;
}

export async function GET(req: NextRequest) {
  try {
    const fid = req.nextUrl.searchParams.get("fid");
    
    let query = supabase.from('products').select('*');
    
    if (fid) {
      query = query.eq('fid', fid);
    }
    
    const { data: products, error } = await query;
    
    if (error) {
      console.error('Error fetching products:', error);
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
    
    return NextResponse.json(products || []);
  } catch (error) {
    console.error('Error in GET /api/products:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let data: any = {};
    let images: string[] = [];
    let document: string | null = null;

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      data.name = formData.get("name");
      data.description = formData.get("description");
      data.price = formData.get("price");
      data.category = formData.get("category");
      
      // Validate required fields
      if (!data.name || !data.description || !data.price || !data.category) {
        return NextResponse.json({ 
          error: 'Missing required fields: name, description, price, category' 
        }, { status: 400 });
      }
      
      // Convert price to number
      const price = parseFloat(data.price as string);
      if (isNaN(price) || price <= 0) {
        return NextResponse.json({ 
          error: 'Invalid price value' 
        }, { status: 400 });
      }
      data.price = price;
      
      // Save images to uploads and store URLs
      const imageFiles = formData.getAll("images");
      for (const file of imageFiles) {
        if (typeof file === "object" && file.type && file.type.startsWith("image/")) {
          const url = await saveFile(file);
          images.push(url);
        }
      }
      
      // Document (optional)
      const docFile = formData.get("document");
      if (docFile && typeof docFile === "object" && "name" in docFile) {
        document = await saveFile(docFile);
      }
      
      // Seller info
      data.seller_image = formData.get("seller_image") || null;
      data.seller_display_name = formData.get("seller_display_name") || null;
    } else {
      data = await req.json();
      
      // Validate required fields
      if (!data.name || !data.description || !data.price || !data.category) {
        return NextResponse.json({ 
          error: 'Missing required fields: name, description, price, category' 
        }, { status: 400 });
      }
      
      // Convert price to number
      const price = parseFloat(data.price);
      if (isNaN(price) || price <= 0) {
        return NextResponse.json({ 
          error: 'Invalid price value' 
        }, { status: 400 });
      }
      data.price = price;
      
      if (Array.isArray(data.images)) {
        images = data.images;
      }
    }

    const fid = req.headers.get("x-user-fid");
    if (!fid) {
      return NextResponse.json({ error: 'User FID required' }, { status: 400 });
    }

    // First, ensure user exists in database
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

    // Create new product
    const newProduct = {
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category,
      images,
      document,
      fid,
      seller_image: data.seller_image,
      seller_display_name: data.seller_display_name,
    };

    const { data: product, error } = await supabase
      .from('products')
      .insert(newProduct)
      .select()
      .single();

    if (error) {
      console.error('Error creating product:', error);
      return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/products:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 