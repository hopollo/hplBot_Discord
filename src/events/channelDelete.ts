import { GuildChannel } from "discord.js";
import path from 'path';
import { Bot_Config } from '../../config.json';
import { Log } from '../utils/logs';
import { DataWriter } from '../utils/write';

export async function channelDelete(channel: GuildChannel) {
  const config = await import(path.join(__dirname, '../..', Bot_Config.Servers_Config.servers_path, channel.guild.id, Bot_Config.Servers_Config.templates.configFile)); 
  const tempChannels = await import(path.join(__dirname, '../..', Bot_Config.Servers_Config.servers_path, channel.guild.id, Bot_Config.Servers_Config.templates.tempChannelsFile)); 
  const channelID = channel.id;
  const allowLogs = config.config.Channels_Options.logs_channel.logs_options.channels_deletions.enabled;
  
  //Check & remove the entry from tempChannels.json if it was knowned as temporary
  const found: boolean = tempChannels.map((cn: { id: string; }) => cn.id === channelID)[0];
  if (found) new DataWriter().removeTo(tempChannels, channelID);

  if (!allowLogs) return;

  const author = channel.client.user!;
  const reason = 'User choice';
  const msgContent = config.Channels_Options.logs_channel.logs_options.channels_deletions.message
    .replace('{{user}}', author.username)
    .replace('{{channel}}', channelID)
    .replace('{{reason}}', reason);

  new Log(author, msgContent);
}