import { GuildChannel } from "discord.js";
import { Bot_Config } from '../../../../config.json' with { type: "json" };
import { Log } from '../../utils/logs/logs.ts';
import path from 'node:path';
import { DataWriter } from "../../utils/data/write.ts";

export async function channelCreate(channel: GuildChannel) {
  try {
    const config = await new DataWriter().read(path.join(__dirname, '../../../..', Bot_Config.Servers_Config.servers_path, channel.guild.id!, Bot_Config.Servers_Config.templates.configFile));
    const allowLogs: boolean = Channels_Options.logs_channel.logs_options.channels_creations.enabled;

    if (!allowLogs) return;

    const author = (await channel.guild.fetchOwner()).user;
    const msgContent: string = await Channels_Options.logs_channel.logs_options.channels_creations.message
      .replace('{{user}}', author!.username)
      .replace('{{channel}}', channel.name);

    new Log(author!, msgContent);
  } catch (e) { console.error(e) }
}