import path from "node:path";
import { Message } from "discord.js";
import { Log } from "../logs/logs.ts";
import { Bot_Config } from "../../../../config.json" with { type: "json" };
import { DataWriter } from "../data/write.ts";

const serverDir = path.join(
  __dirname,
  "../..",
  Bot_Config.Servers_Config.servers_path,
);
const configFile = Bot_Config.Servers_Config.templates.configFile;

export class DeleteInvite {
  public async deleteInviteLink(target: Message, reason: string) {
    const config = await new DataWriter().read(
      path.join(serverDir, target.guild!.id, configFile),
    );
    const deleteInviteLink: boolean =
      config.Vocals_Options.purge_options.purge_old_invites_links;
    const allowLogs: boolean =
      config.Vocals_Options.logs_options.channels_deletions.enabled;

    if (!deleteInviteLink) return;

    if (!allowLogs) return;

    const msgContent = config.Vocals_Options.logs_options.channels_deletions
      .message
      .replace("{{user}}", target.author.username)
      .replace("{{channel}}", target.channel.id)
      .replace("{{reason}}", reason);

    new Log(target.author, msgContent);
  }
}
