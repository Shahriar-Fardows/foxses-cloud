import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import SmsLog from "@/models/SmsLog";
import { requireAdmin } from "@/lib/guards";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  await connectDB();

  const byType = await SmsLog.aggregate([
    {
      $group: {
        _id: "$messageType",
        totalSms: { $sum: 1 },
        totalSegments: { $sum: "$segments" },
        revenue: { $sum: "$cost" },
        cost: { $sum: "$buyCost" },
      },
    },
  ]);

  const breakdown = byType.map((row) => ({
    messageType: row._id,
    totalSms: row.totalSms,
    totalSegments: row.totalSegments,
    revenue: row.revenue,
    cost: row.cost,
    profit: row.revenue - row.cost,
  }));

  const totals = breakdown.reduce(
    (acc, row) => ({
      totalSms: acc.totalSms + row.totalSms,
      totalSegments: acc.totalSegments + row.totalSegments,
      revenue: acc.revenue + row.revenue,
      cost: acc.cost + row.cost,
      profit: acc.profit + row.profit,
    }),
    { totalSms: 0, totalSegments: 0, revenue: 0, cost: 0, profit: 0 }
  );

  return NextResponse.json({ response_code: 200, breakdown, totals });
}
