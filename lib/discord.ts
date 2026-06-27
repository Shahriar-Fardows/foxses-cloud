export async function notifyDiscord(content: string) {
  const webhook = process.env.DISCORD_WEBHOOK;
  if (!webhook) return;

  try {
    await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
  } catch {
    // Notifications are best-effort; never block the request on a Discord outage.
  }
}
