require('dotenv').config();
const bot = require('./bot');

bot.launch();
console.log('🚀 Campus bot launched');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
