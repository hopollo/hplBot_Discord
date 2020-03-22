import { User } from "discord.js";

const Channels_Options = require('../../config.json');
const log = require('../utils/logs');

export function userUpdate(oldUser: User, newUser: User) {
  const allowLogs: boolean = Channels_Options.logs_channel.logs_options.users_info_changes.enabled;
  // Stops here if the config says to do so
  if (allowLogs) return;

  const msgContent = Channels_Options.logs_channel.logs_options.users_info_changes.message
    .replace('{{user}}', newUser.username)
    .replace('{{old}}', oldUser.username)
    .replace('{{new}}', newUser.username);

  
  const msg = {newUser, msgContent};

  log('users_changes', msg);
}