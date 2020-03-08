"use_strict";

const { Channels_Options } = require('../../config.json');

module.exports = (member) => {
  const publicChannel = Channels_Options.welcome_channel.id;
  const allowWelcome = Channels_Options.welcome_channel.allow_welcome;
  const allowLogs = Channels_Options.logs_channel.logs_options.server_joins.enabled;

  if (!allowWelcome) return;

  const channel = member.guild.channels.find(ch => ch.id === publicChannel);
  Channels_Options.welcome_channel.welcome_message.replace('{{user}}', member);

  if (channel) channel.send(`${Channels_Options.welcome_channel.welcome_message}`);

  if (!allowLogs) return;

  const author = member.user.username;
  const msgContent = Channels_Options.logs_channel.logs_options.server_joins.message
    .replace('{{user}}', author);
  
  const msg = {author, msgContent};

  log('server_joins', msg);
}