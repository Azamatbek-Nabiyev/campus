const { Telegraf, Markup } = require('telegraf');
const { BOT_TOKEN, ADMIN_ID } = require('./config');
const { approveMessage } = require('./utils/forward');

const OWNER_USERNAME = '@campusadmin';

const bot = new Telegraf(BOT_TOKEN);

// Start komandasi
bot.start((ctx) => {
  ctx.reply(
    'Welcome! Please choose an option below',
    Markup.keyboard([['📨 Send Message', '📞 Contact']])
      .resize()
      .oneTime(false)
  );
});

// Reply tugmalar: har doim chat ostida turadi
bot.hears('📨 Send Message', (ctx) => {
  ctx.reply('Please type your message. The admin will review it shortly.');
});

bot.hears('📞 Contact', (ctx) => {
  ctx.reply(`You can contact the admin here: ${OWNER_USERNAME}`);
});

// Xabar kelganda – admin forward qilish
bot.on('message', async (ctx) => {
  const msg = ctx.message;

  // Admin tomonidan reply + /approve
  if (String(ctx.from.id) === ADMIN_ID && msg.reply_to_message) {
    if (msg.text === '/approve') {
      approveMessage(ctx, msg.reply_to_message);
      return ctx.reply('✅ Message has been approved and sent to the channel.');
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
      'Your message has been sent to the admin. It will be posted once approved.'
    );
  }
});

module.exports = bot;
