import { Context, Bot } from "grammy";
import { config } from "../config";

function unauthorizedText(): string {
  return "Sorry, you are not authorized to use this bot.";
}

export function isAuthorized(ctx: Context): boolean {
  if (config.allowedUserIds.size === 0) return true;
  const userId = ctx.from?.id;
  return userId !== undefined && config.allowedUserIds.has(userId);
}

export async function registerHandlers(bot: Bot): Promise<void> {
  bot.command("start", async (ctx) => {
    await ctx.reply(
      [
        "Welcome! Send me a video and I'll return a streamable MP4 link.",
        "",
        "Just send any video file to get started.",
      ].join("\n")
    );
  });

  bot.command("help", async (ctx) => {
    await ctx.reply(
      "Send me a video file and I will upload it and reply with a streamable MP4 link."
    );
  });

  bot.on("message:video", async (ctx) => {
    if (!isAuthorized(ctx)) {
      await ctx.reply(unauthorizedText());
      return;
    }

    const video = ctx.message.video;
    const fileId = video.file_id;

    try {
      await ctx.reply("Uploading your video...", { reply_to_message_id: ctx.message.message_id });

      const file = await ctx.api.getFile(fileId);
      if (!file.file_path) {
        await ctx.reply("Could not resolve the video file.");
        return;
      }

      const url = `https://api.telegram.org/file/bot${config.botToken}/${file.file_path}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to download video: ${response.status}`);
      }
      const buffer = Buffer.from(await response.arrayBuffer());

      const key = `videos/${Date.now()}-${Math.random().toString(36).slice(2)}.mp4`;
      const { uploadVideo } = await import("../storage");
      const publicUrl = await uploadVideo(key, buffer);

      await ctx.reply(`Here is your streamable link:\n${publicUrl}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      await ctx.reply(`Failed to process the video: ${message}`);
    }
  });
}
