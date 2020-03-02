"use_strict";

const path = require('path');
const { Channels_Options } = require('../../config.json');
const tempChannelsFile = path.join(__dirname, '../..', 'lib/dictionnaries', 'tempChannels.json');
const tempChannels = require(tempChannelsFile);
const log = require('../utils/logs');
const write = require('../utils/write');

module.exports = (channel) => {
  const channelID = channel.id;
  const allowLogs = Channels_Options.logs_channel.logs_options.channels_deletions.enabled;
  if (!allowLogs) return;

  //Check & remove the entry from tempChannels.json if it was knowned as temporary
  const found = tempChannels.map(cn => cn.id === channelID)[0];
  if (found) write.removeTo(tempChannelsFile, channelID);

  const author = channel.client.user.username;
  const reason = 'User choice';
  const msgContent = Channels_Options.logs_channel.logs_options.channels_deletions.message
    .replace('{{user}}', author)
    .replace('{{channel}}', channelID)
    .replace('{{reason}}', reason);

  const msg = {author, msgContent};

  log('channels_creations', msg);
}