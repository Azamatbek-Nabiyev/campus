require('dotenv').config();
const bot = require('./src/bot');

bot.launch();
console.log('🚀 Campus bot launched');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
