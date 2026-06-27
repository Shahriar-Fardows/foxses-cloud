import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import PricingConfig from "@/models/PricingConfig";
import { requireAdmin } from "@/lib/guards";
import { getPricing } from "@/lib/pricing";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const pricing = await getPricing();
  return NextResponse.json({ response_code: 200, pricing });
}

export async function PATCH(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await request.json();
  const fields = ["nonMaskingBuyPrice", "nonMaskingSellPrice", "maskingBuyPrice", "maskingSellPrice"] as const;

  const update: Record<string, number | Date> = { updatedAt: new Date() };
  for (const field of fields) {
    if (typeof body[field] === "number" && body[field] >= 0) {
      update[field] = body[field];
    }
  }

  await connectDB();
  let pricing = await PricingConfig.findOne();
  if (!pricing) {
    pricing = await PricingConfig.create(update);
  } else {
    Object.assign(pricing, update);
    await pricing.save();
  }

  return NextResponse.json({ response_code: 200, pricing });
}
