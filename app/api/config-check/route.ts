import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    onchainKitApiKey: process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY ? "✓ Set" : "✗ Missing",
    recipientAddress: process.env.NEXT_PUBLIC_RECIPIENT_ADDRESS ? "✓ Set" : "✗ Missing",
    projectName: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME || "Not Set",
    apiKeyLength: process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY?.length || 0,
    recipient: process.env.NEXT_PUBLIC_RECIPIENT_ADDRESS,
  });
}
