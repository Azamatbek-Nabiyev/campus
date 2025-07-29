const { CHANNEL_ID } = require('../config');

let messageCounter = 1;

function approveMessage(ctx, message) {
  const suffix = `\n\n#${messageCounter++}`; // tartib raqami qo‘shiladi

  if (message.text) {
    return ctx.telegram.sendMessage(CHANNEL_ID, message.text + suffix);
  } else if (message.photo) {
    const largestPhoto = message.photo[message.photo.length - 1];
    const caption = (message.caption || '') + suffix;
    return ctx.telegram.sendPhoto(CHANNEL_ID, largestPhoto.file_id, {
      caption,
    });
  } else if (message.video) {
    const caption = (message.caption || '') + suffix;
    return ctx.telegram.sendVideo(CHANNEL_ID, message.video.file_id, {
      caption,
    });
  } else {
    return ctx.reply('This file type is not supported for posting.');
  }
}

module.exports = { approveMessage };
