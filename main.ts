import Logger from "https://deno.land/x/logger@v1.1.6/logger.ts";
import { Context, Telegraf } from "npm:telegraf";

const token: string = Deno.env.get("EGOR_TOKEN") || "";
const targetChatId: number = parseInt(Deno.env.get("TARGET_CHAT_ID") || "");

const l: Logger = new Logger();
const bot: Telegraf = new Telegraf(token);

bot.use((ctx: Context, next: VoidFunction) => {
  try {
    return next();
  } catch (error) {
    ctx.reply(error);
    l.error(error);
  }
});

bot.use((ctx: Context, next: VoidFunction) => {
  l.info(
    ctx.from?.username,
    ctx.chat?.id,
    ctx.chat?.type,
    ":",
    ctx.text,
  );
  return next();
});

bot.start((ctx: Context) => {
  if (ctx.text === "" || ctx.chat?.type !== "private") return;

  ctx.replyWithMarkdownV2(`Привет, ${ctx.from?.username || "username"}\\!

Ты написал боту обратной связи «Медийной обороны»\\.

Сюда уместно написать отзыв на наши публикации, указать на ошибку, предложить публикацию или иную форму коллаборации\\.

Подписывайся на наш канал: [Медийная Оборона Монтелиберо](https://t.me/mediadefense)`);
});

bot.on("message", (ctx: Context) => {
  if (ctx.text !== "" && ctx.chat?.type === "private") {
    ctx.forwardMessage(targetChatId);
    ctx.reply(`Сообщение принято и передано в редакцию ❤`);
  }
});

bot.launch();

Deno.addSignalListener("SIGINT", () => bot.stop());
Deno.addSignalListener("SIGTERM", () => bot.stop());

l.info("started");
