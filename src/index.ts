import { Context, Telegraf } from "telegraf";

const token: string = process.env.EGOR_TOKEN || "";
const targetChatId: number = parseInt(process.env.TARGET_CHAT_ID || "");

const bot: Telegraf = new Telegraf(token);

bot.use((ctx: Context, next: VoidFunction) => {
  console.log(ctx.from?.username, ctx.chat?.id, ctx.chat?.type, ":", ctx.text);
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

process.on("SIGINT", () => bot.stop());
process.on("SIGTERM", () => bot.stop());

console.log("started");
