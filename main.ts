import Logger from "https://deno.land/x/logger@v1.1.6/logger.ts";
import { Telegraf } from "npm:telegraf";

const token = Deno.env.get("EGOR_TOKEN") || "";
const targetChatId = Deno.env.get("TARGET_CHAT_ID") || 0;

const l = new Logger();
const bot = new Telegraf(token);

bot.use((ctx, next) => {
  l.info("[msg]", ctx.from?.username, ctx.chat?.id, ":", ctx.text);
  return next();
});

bot.start((ctx) => {
  ctx.reply("Hello World");
});

bot.on("message", (ctx) => {
  if (ctx.text === "" || ctx.chat.type === "supergroup") return;

  ctx.forwardMessage(targetChatId);
  ctx.reply("Thanks. Wait for contact");
});

bot.launch();

Deno.addSignalListener("SIGINT", () => bot.stop());
Deno.addSignalListener("SIGTERM", () => bot.stop());

l.info("[egor] started");
