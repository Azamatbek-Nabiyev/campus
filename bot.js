const { Telegraf, Markup } = require('telegraf');
const { BOT_TOKEN, ADMIN_ID } = require('./config');
const { approveMessage } = require('./utils/forward');

const OWNER_USERNAME = '@Azamat_Nabiyev'; // o‘rniga @sizning_username’ingizsiz yozing

const bot = new Telegraf(BOT_TOKEN);

// Start komandasi
bot.start((ctx) => {
  ctx.reply(
    'Xush kelibsiz! Quyidagi tugmalardan birini tanlang:',
    Markup.inlineKeyboard([
      [Markup.button.callback('📨 Send Message', 'SEND_MESSAGE')],
      [Markup.button.callback('📞 Contact', 'CONTACT')],
    ])
  );
});

// "Send Message" bosilganda
bot.action('SEND_MESSAGE', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply('Xabaringizni yozing. Admin ko‘rib chiqadi.');
});

// "Contact" bosilganda
bot.action('CONTACT', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply(`Admin bilan bog‘lanish: @${OWNER_USERNAME}`);
});

// Xabar kelganda – admin forward qilish
bot.on('message', async (ctx) => {
  const msg = ctx.message;

  // Admin tomonidan reply + /approve
  if (String(ctx.from.id) === ADMIN_ID && msg.reply_to_message) {
    if (msg.text === '/approve') {
      approveMessage(ctx, msg.reply_to_message);
      return ctx.reply('✅ Xabar kanalga yuborildi.');
    }
    return;
  }

  // Oddiy foydalanuvchidan kelgan xabarni adminga forward qilish
  if (!msg.via_bot) {
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
  }
});

module.exports = bot;
