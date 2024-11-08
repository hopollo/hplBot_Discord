import { GuildChannel } from "discord.js";
import path from "node:path";
import { Bot_Config } from "../../../../config.json" with { type: "json" };
import { Log } from "../../utils/logs/logs.ts";
import { DataWriter } from "../../utils/data/write.ts";

export async function channelDelete(channel: GuildChannel) {
  try {
    const config = await new DataWriter().read(
      path.join(
        __dirname,
        "../../../..",
        Bot_Config.Servers_Config.servers_path,
        channel.guild.id,
        Bot_Config.Servers_Config.templates.configFile,
      ),
    );

    const allowLogs =
      Bot_Config.Channels_Options.logs_channel.logs_options.channels_deletions
        .enabled;

    if (!allowLogs) return;

    const author = channel.client.user!;
    const reason = "User choice";
    const msgContent = config.Channels_Options.logs_channel.logs_options
      .channels_deletions.message
      .replace("{{user}}", author.username)
      .replace("{{channel}}", channel.id)
      .replace("{{reason}}", reason);

    new Log(author, msgContent);
  } catch (e) {
    console.error(e);
  }
}
