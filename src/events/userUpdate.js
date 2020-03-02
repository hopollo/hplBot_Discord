"use_strict";

const Channels_Options = require('../../config.json');
const log = require('../utils/logs');

module.exports = (oldUser, newUser) => {
  const allowLogs = Channels_Options.logs_channel.logs_options.users_info_changes.enabled;
  let user;
  // Stops here if the config says to do so
  if (allowLogs) return;

  if (oldUser !== undefined) {
    user = oldUser;
  }

  if (newUser !== undefined) {
    user = newUser;
  }

  const author = user;
  const msgContent = Channels_Options.logs_channel.logs_options.users_info_changes.message
    .replace('{{user}}', author.username)
    .replace('{{old}}', sourceName)
    .replace('{{new}}', destinationName);

  const msg = {author, msgContent};

  log('users_changes', msg);
}