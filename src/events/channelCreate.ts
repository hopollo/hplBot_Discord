import { GuildChannel } from "discord.js";
import { Bot_Config } from '../../config.json';
import { Log } from '../utils/logs';
import path from 'path';

export async function channelCreate(channel: GuildChannel) {
  const config = await import(path.join(__dirname, '../..', Bot_Config.Servers_Config.servers_path, channel.guild.id, Bot_Config.Servers_Config.templates.configFile));
  const allowLogs: boolean = config.Channels_Options.logs_channel.logs_options.channels_creations.enabled;

  if (!allowLogs) return;

  const author = channel.guild.owner?.user;
  const msgContent: string = await config.Channels_Options.logs_channel.logs_options.channels_creations.message
    .replace('{{user}}', author?.username)
    .replace('{{channel}}', channel.name);

  new Log(author!, msgContent);
}