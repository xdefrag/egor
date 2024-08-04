import { Telegraf } from "npm:telegraf";

const token = Deno.env.get("EGOR_TOKEN") || "";
const bot = new Telegraf(token);

bot.hears("/start", (ctx) => {
  ctx.reply("Hello World");
});

bot.launch();
