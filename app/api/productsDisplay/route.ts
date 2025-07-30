import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const PRODUCTS_FILE = path.join(process.cwd(), "app/api/products/products.json");
const UPLOADS_DIR = path.join(process.cwd(), "public/uploads");

// Define proper TypeScript interfaces
interface Product {
  id: string;
  name: string;
  description: string;
  price: number | string;
  category: string;
  images: string[];
  document?: string | null;
  fid?: string | null;
  seller_image?: string | null;
  seller_display_name?: string | null;
  owner?: string; // For compatibility with frontend
  createdAt: string;
}

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  category: string;
  images?: string[];
  seller_image?: string | null;
  seller_display_name?: string | null;
}

async function readProducts(): Promise<Product[]> {
  try {
    const data = await fs.readFile(PRODUCTS_FILE, "utf-8");
    return JSON.parse(data) as Product[];
  } catch {
    return [];
  }
}

async function writeProducts(products: Product[]): Promise<void> {
  await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2), "utf-8");
}

async function saveFile(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const filename = `${Date.now()}-${file.name}`;
  const filePath = path.join(UPLOADS_DIR, filename);
  await fs.writeFile(filePath, buffer);
  return `/uploads/${filename}`;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const products: Product[] = await readProducts();
  const fid = req.nextUrl.searchParams.get("fid");
  if (fid) {
    return NextResponse.json(products.filter((p: Product) => p.fid === fid));
  }
  return NextResponse.json(products);
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const contentType = req.headers.get("content-type") || "";
  let data: Partial<ProductFormData> = {};
  let images: string[] = [];
  let document: string | null = null;

  if (contentType.includes("multipart/form-data")) {
    const formData = await req.formData();
    data.name = formData.get("name") as string;
    data.description = formData.get("description") as string;
    data.price = formData.get("price") as string;
    data.category = formData.get("category") as string;
    
    // Save images to uploads and store URLs
    const imageFiles = formData.getAll("images");
    for (const file of imageFiles) {
      if (file instanceof File && file.type.startsWith("image/")) {
        const url = await saveFile(file);
        images.push(url);
      }
    }
    
    // Document (optional, not handled for now)
    const docFile = formData.get("document");
    if (docFile instanceof File) {
      // You can implement document saving similarly if needed
      document = null;
    }
    
    // Seller info
    data.seller_image = (formData.get("seller_image") as string) || null;
    data.seller_display_name = (formData.get("seller_display_name") as string) || null;
  } else {
    const jsonData: ProductFormData = await req.json();
    data = jsonData;
    // If images are provided as URLs in JSON
    if (Array.isArray(jsonData.images)) {
      images = jsonData.images;
    }
  }

  const fid = req.headers.get("x-user-fid") || null;

  // Validate required fields
  if (!data.name || !data.description || !data.price || !data.category) {
    return NextResponse.json(
      { error: "Missing required fields: name, description, price, category" },
      { status: 400 }
    );
  }

  const newProduct: Product = {
    id: Date.now().toString(),
    name: data.name,
    description: data.description,
    price: data.price,
    category: data.category,
    images,
    document,
    fid,
    seller_image: data.seller_image || null,
    seller_display_name: data.seller_display_name || null,
    owner: data.seller_display_name || "Unknown", // For frontend compatibility
    createdAt: new Date().toISOString(),
  };

  const products: Product[] = await readProducts();
  products.push(newProduct);
  await writeProducts(products);
  return NextResponse.json(newProduct, { status: 201 });
} 