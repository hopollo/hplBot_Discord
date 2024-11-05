import path from "node:path";
import { GuildChannel } from "discord.js";
import { Log } from "../../utils/logs/logs.ts";
import config from "../../../../config.json" with { type: "json" };
import { DataWriter } from "../../utils/data/write.ts";

export async function channelCreate(channel: GuildChannel) {
  try {
    const configData = await new DataWriter().read(
      path.join(
        __dirname,
        "../../../..",
        config.Bot_Config.Servers_Config.servers_path,
        channel.guild.id!,
        config.Bot_Config.Servers_Config.templates.configFile,
      ),
    );
    const allowLogs: boolean =
      configData.Channels_Options.logs_channel.logs_options.channels_creations
        .enabled;

    if (!allowLogs) return;

    const author = (await channel.guild.fetchOwner()).user;
    const msgContent: string = await configData.Channels_Options.logs_channel
      .logs_options
      .channels_creations.message
      .replace("{{user}}", author!.username)
      .replace("{{channel}}", channel.name);

    new Log(author!, msgContent);
  } catch (e) {
    console.error(e);
  }
}
