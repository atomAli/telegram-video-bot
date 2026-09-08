import { Bot, webhookCallback } from "grammy";
import { config } from "../src/config.js";
import { registerHandlers } from "../src/handlers/video.js";

const bot = new Bot(config.botToken);

await registerHandlers(bot);

bot.catch((err) => {
  console.error("Bot error:", err.error);
});

export default webhookCallback(bot, "https");
