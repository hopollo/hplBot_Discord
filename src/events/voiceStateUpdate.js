"use_strict";

const { Channels_Options, Vocals_Options } = require('../../config.json');
const temporaryChannels = require('../../lib/dictionnaries/tempChannels.json');
const log = require('../utils/logs');

module.exports = (oldChannel, newChannel) => {
  let sourceName, sourceID, destinationName, destinationID, author, msgContent;
  
  if (oldChannel.voiceChannel !== undefined) {
    sourceName = oldChannel.voiceChannel.name;
    sourceID = oldChannel.voiceChannel.id;
    author = oldChannel.user;

    msgContent = Channels_Options.logs_channel.logs_options.users_movements.switch_message
      .replace('{{user}}', author.username)
      .replace('{{old}}', sourceName)
      .replace('{{new}}', destinationName);
  }

  if (newChannel.voiceChannel !== undefined) {
    destinationName = newChannel.voiceChannel.name;
    author = newChannel.user;
    destinationID = newChannel.voiceChannel.id;

    msgContent = Channels_Options.logs_channel.logs_options.users_movements.join_message
      .replace('{{user}}', author.username)
      .replace('{{new}}', destinationName);
  }

  const allowLogs = Channels_Options.logs_channel.logs_options.users_movements.enabled;

  if (allowLogs) { 
    const msg = {author, msgContent};
    log("users_movements", msg);
  }

  // Delete empty temp channels feature
  const allowDeletion = Vocals_Options.purge_options.purge_empty_channels;
  const deleteInviteLink = Vocals_Options.purge_options.purge_old_invites_links;
  //TODO Change that for "better way" to get only true or false
  const tempChannel = temporaryChannels.map(cn => cn.channelID === sourceID)[0];

  if (!allowDeletion || sourceID === undefined || !tempChannel) return;

  const target = oldChannel.voiceChannel;
  const usersCount = target.members.array.length;

  if (usersCount !== 0 || !target.deletable) return;
  // TODO Add invitation deletion if created
  const reason = 'Empty';

  target.delete();

  const msg = Channels_Options.logs_channel.channels_deletions.message
    .replace('{{channel}}', sourceName)
    .replace('{{reason}}', reason);

  log("channels_deletions", msg);

  if (deleteInviteLink) return console.log('should remove the invite');
}