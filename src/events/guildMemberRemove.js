"use_strict";

const { Channels_Options } = require('../../config.json');
const log = require('../utils/logs');

module.exports = (member) => {
  const allowLogs = Channels_Options.logs_channel.logs_options.server_leaves.enabled;
  if (!allowLogs) return;

  const author = member.user.username;
  const reason = (member.deleted) ? 'Server Kicked': 'User Choice';

  const msgContent = Channels_Options.logs_channel.logs_options.server_leaves.message
    .replace('{{user}}', author)
    .replace('{{reason}}', reason);
    
  const msg = {author, msgContent};

  log("server_leaves", msg);
}