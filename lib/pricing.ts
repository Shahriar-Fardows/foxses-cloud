import { connectDB } from "@/lib/db";
import PricingConfig, { IPricingConfig } from "@/models/PricingConfig";

export async function getPricing(): Promise<IPricingConfig> {
  await connectDB();
  let config = await PricingConfig.findOne();
  if (!config) {
    config = await PricingConfig.create({});
  }
  return config;
}

export function getPriceForType(
  pricing: IPricingConfig,
  messageType: "Masking" | "Non-Masking"
) {
  return messageType === "Masking"
    ? { buyPrice: pricing.maskingBuyPrice, sellPrice: pricing.maskingSellPrice }
    : { buyPrice: pricing.nonMaskingBuyPrice, sellPrice: pricing.nonMaskingSellPrice };
}
