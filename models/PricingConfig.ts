import { Schema, models, model } from "mongoose";

export interface IPricingConfig {
  nonMaskingBuyPrice: number;
  nonMaskingSellPrice: number;
  maskingBuyPrice: number;
  maskingSellPrice: number;
  updatedAt: Date;
}

const PricingConfigSchema = new Schema<IPricingConfig>({
  nonMaskingBuyPrice: { type: Number, default: 0.4 },
  nonMaskingSellPrice: { type: Number, default: 0.6 },
  maskingBuyPrice: { type: Number, default: 0.4 },
  maskingSellPrice: { type: Number, default: 0.6 },
  updatedAt: { type: Date, default: Date.now },
});

export default models.PricingConfig || model<IPricingConfig>("PricingConfig", PricingConfigSchema);
