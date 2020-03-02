"use_strict";

const { Channels_Options } = require('../../config.json');
const log = require('../utils/logs');

module.exports = (channel) => {
  const channelName = channel.id;
  const allowLogs = Channels_Options.logs_channel.logs_options.channels_creations.enabled;
  if (!allowLogs) return;

  const author = channel.client.user.username;
  const msgContent = Channels_Options.logs_channel.logs_options.channels_creations.message
    .replace('{{user}}', author)
    .replace('{{channel}}', channelName);

  const msg = {author, msgContent};

  log('channels_creations', msg);
}