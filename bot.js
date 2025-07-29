const { Telegraf } = require('telegraf');
const { BOT_TOKEN, ADMIN_ID } = require('./config');
const { approveMessage } = require('./utils/forward');

const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply('Xush kelibsiz! Xabaringizni yuboring, admin ko‘rib chiqadi.');
});

bot.on('message', async (ctx) => {
  const msg = ctx.message;

  if (String(ctx.from.id) === ADMIN_ID && msg.reply_to_message) {
    if (msg.text === '/approve') {
      approveMessage(ctx, msg.reply_to_message);
      return ctx.reply('✅ Xabar kanalga yuborildi.');
    }
    return;
  }

  // Userdan xabar kelganda, adminga yuboriladi
  const forwardMsg = await ctx.telegram.forwardMessage(
    ADMIN_ID,
    ctx.chat.id,
    msg.message_id
  );
  await ctx.telegram.sendMessage(
    ADMIN_ID,
    'Yuqoridagi xabarni kanalga yuborish uchun unga reply qilib `/approve` deb yozing.'
  );
  await ctx.reply(
    'Xabaringiz adminga yuborildi. Tasdiqlangach kanalga chiqadi.'
  );
});

bot.launch();
