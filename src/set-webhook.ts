import "./dotenv.js";
import { config } from "./config.js";

const webhookUrl = process.env.WEBHOOK_URL;
if (!webhookUrl) {
  console.error("Set WEBHOOK_URL to your Vercel deployment URL, e.g. https://app.vercel.app/api/webhook");
  process.exit(1);
}

const res = await fetch(
  `https://api.telegram.org/bot${config.botToken}/setWebhook`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: webhookUrl, allowed_updates: ["message"] }),
  }
);

const data = (await res.json()) as { ok: boolean; description?: string };
if (!data.ok) {
  console.error("Failed to set webhook:", data.description);
  process.exit(1);
}
console.log("Webhook set successfully:", webhookUrl);
