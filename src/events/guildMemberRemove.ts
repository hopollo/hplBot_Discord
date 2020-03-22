import path from 'path';
import { Bot_Config } from '../../config.json';
import { Log } from '../utils/logs';
import { GuildMember } from 'discord.js';

export async function guildMemberRemove(member: GuildMember) {
  const config = await import(path.join(__dirname, '../..', Bot_Config.Servers_Config.servers_path, member.guild.id, Bot_Config.Servers_Config.templates.configFile));
  const allowLogs = config.Channels_Options.logs_channel.logs_options.server_leaves.enable;
  if (!allowLogs) return;

  const author = member.user;
  const reason: string = (member.deleted) ? 'Server Kicked': 'User Choice';

  const msgContent = config.Channels_Options.logs_channel.logs_options.server_leaves.message
    .replace('{{user}}', author.username)
    .replace('{{reason}}', reason);
    
  new Log(author, msgContent);
}