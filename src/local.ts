import "./dotenv.js";
import { Bot } from "grammy";
import { config } from "./config.js";
import { registerHandlers } from "./handlers/video.js";

const bot = new Bot(config.botToken);

await registerHandlers(bot);

bot.catch((err) => {
  console.error("Bot error:", err.error);
});

await bot.start({ onStart: () => console.log("Bot started (long polling)") });
