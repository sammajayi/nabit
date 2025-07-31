import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const REVIEWS_FILE = path.join(process.cwd(), "app/api/reviews/reviews.json");

// Define review types
interface Review {
  id: string;
  productId: string;
  productName: string;
  rating: number;
  comment: string;
  userFid?: string | null;
  userName: string;
  userProfileImage?: string | null;
  createdAt: string;
}

interface ReviewInput {
  productId: string;
  productName: string;
  rating: number;
  comment: string;
  userFid?: string | null;
  userName: string;
  userProfileImage?: string | null;
}

async function readReviews(): Promise<Review[]> {
  try {
    const data = await fs.readFile(REVIEWS_FILE, "utf-8");
    return JSON.parse(data) as Review[];
  } catch {
    return [];
  }
}

async function writeReviews(reviews: Review[]): Promise<void> {
  // Ensure directory exists
  const dir = path.dirname(REVIEWS_FILE);
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
  
  await fs.writeFile(REVIEWS_FILE, JSON.stringify(reviews, null, 2), "utf-8");
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");
  const productName = searchParams.get("productName");
  
  const reviews: Review[] = await readReviews();
  
  if (productId) {
    return NextResponse.json(reviews.filter((review) => review.productId === productId));
  }
  
  if (productName) {
    return NextResponse.json(reviews.filter((review) => review.productName === productName));
  }
  
  return NextResponse.json(reviews);
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const reviewData: ReviewInput = await req.json();
    
    // Validate required fields
    if (!reviewData.productId || !reviewData.productName || !reviewData.rating || !reviewData.comment || !reviewData.userName) {
      return NextResponse.json(
        { error: "Missing required fields: productId, productName, rating, comment, userName" },
        { status: 400 }
      );
    }
    
    // Validate rating range
    if (reviewData.rating < 1 || reviewData.rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }
    
    const newReview: Review = {
      id: Date.now().toString(),
      productId: reviewData.productId,
      productName: reviewData.productName,
      rating: reviewData.rating,
      comment: reviewData.comment.trim(),
      userFid: reviewData.userFid || null,
      userName: reviewData.userName,
      userProfileImage: reviewData.userProfileImage || null,
      createdAt: new Date().toISOString(),
    };
    
    const reviews: Review[] = await readReviews();
    reviews.push(newReview);
    await writeReviews(reviews);
    
    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}
