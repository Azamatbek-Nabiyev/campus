const { CHANNEL_ID } = require('../config');

function approveMessage(ctx, message) {
  if (message.text) {
    return ctx.telegram.sendMessage(CHANNEL_ID, message.text);
  } else if (message.photo) {
    const largestPhoto = message.photo[message.photo.length - 1];
    return ctx.telegram.sendPhoto(CHANNEL_ID, largestPhoto.file_id, {
      caption: message.caption || '',
    });
  } else if (message.video) {
    return ctx.telegram.sendVideo(CHANNEL_ID, message.video.file_id, {
      caption: message.caption || '',
    });
  } else {
    return ctx.reply('Bu turdagi xabar qo‘llab-quvvatlanmaydi.');
  }
}

module.exports = { approveMessage };
