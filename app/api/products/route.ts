import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const PRODUCTS_FILE = path.join(process.cwd(), "app/api/products/products.json");
const UPLOADS_DIR = path.join(process.cwd(), "public/uploads");

async function readProducts() {
  try {
    const data = await fs.readFile(PRODUCTS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

async function writeProducts(products: any[]) {
  await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2), "utf-8");
}

async function saveFile(file: any) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const filename = `${Date.now()}-${file.name}`;
  const filePath = path.join(UPLOADS_DIR, filename);
  await fs.writeFile(filePath, buffer);
  return `/uploads/${filename}`;
}

export async function GET(req: NextRequest) {
  const products: any[] = await readProducts();
  const fid = req.nextUrl.searchParams.get("fid");
  if (fid) {
    return NextResponse.json(products.filter((p: any) => p.fid === fid));
  }
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type") || "";
  let data: any = {};
  let images: any[] = [];
  let document: any = null;

  if (contentType.includes("multipart/form-data")) {
    const formData = await req.formData();
    data.name = formData.get("name");
    data.description = formData.get("description");
    data.price = formData.get("price");
    data.category = formData.get("category");
    // Save images to uploads and store URLs
    const imageFiles = formData.getAll("images");
    for (const file of imageFiles) {
      if (typeof file === "object" && file.type && file.type.startsWith("image/")) {
        const url = await saveFile(file);
        images.push(url);
      }
    }
    // Document (optional, not handled for now)
    const docFile = formData.get("document");
    if (docFile && typeof docFile === "object" && "name" in docFile) {
      // You can implement document saving similarly if needed
      document = null;
    }
    // Seller info
    data.seller_image = formData.get("seller_image") || null;
    data.seller_display_name = formData.get("seller_display_name") || null;
  } else {
    data = await req.json();
    // If images are provided as URLs in JSON
    if (Array.isArray(data.images)) {
      images = data.images;
    }
  }

  const fid = req.headers.get("x-user-fid") || null;

  const newProduct = {
    id: Date.now().toString(),
    ...data,
    images,
    document,
    fid,
    createdAt: new Date().toISOString(),
  };

  const products: any[] = await readProducts();
  products.push(newProduct);
  await writeProducts(products);
  return NextResponse.json(newProduct, { status: 201 });
} 