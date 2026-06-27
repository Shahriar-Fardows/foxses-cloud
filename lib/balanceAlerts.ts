import { Resend } from "resend";
import { LOW_BALANCE_THRESHOLDS, MIN_RECHARGE_AMOUNT } from "@/lib/constants";

const resend = new Resend(process.env.RESEND_API_KEY);

type AlertableClient = {
  name: string;
  email: string;
};

export async function checkLowBalanceAlert(
  client: AlertableClient,
  oldBalance: number,
  newBalance: number
) {
  if (!process.env.RESEND_API_KEY) return;

  const crossed = LOW_BALANCE_THRESHOLDS.find(
    (threshold) => oldBalance >= threshold && newBalance < threshold
  );
  if (!crossed) return;

  const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
  const isFinalWarning = crossed === LOW_BALANCE_THRESHOLDS[LOW_BALANCE_THRESHOLDS.length - 1];

  await resend.emails
    .send({
      from: `Foxses Cloude <${fromEmail}>`,
      to: [client.email],
      subject: isFinalWarning
        ? "Urgent: Your SMS balance is critically low"
        : "Your SMS balance is running low",
      html: `
        <h3>Hello ${client.name},</h3>
        <p>Your current balance is <strong>${newBalance.toFixed(2)} BDT</strong>, which has dropped below ${crossed} BDT.</p>
        <p>${
          isFinalWarning
            ? "Your balance is nearly exhausted. Please recharge immediately to avoid interruption of your SMS service."
            : "Please recharge your account soon to avoid running out of balance."
        }</p>
        <p>Minimum recharge amount is ${MIN_RECHARGE_AMOUNT} BDT. You can recharge from the Purchase page in your dashboard.</p>
        <br/>
        <p>Best regards,<br/>The Foxses Cloude Team</p>
      `,
    })
    .catch((err) => console.error("Resend error (low balance alert):", err));
}
