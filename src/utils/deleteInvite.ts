import { Log } from "./logs";
import { Message } from "discord.js";
import path from "path";
import { Bot_Config } from '../../config.json';
import { DataWriter } from "./write";

const serverDir = path.join(__dirname, '../..', Bot_Config.Servers_Config.servers_path);
const configFile = Bot_Config.Servers_Config.templates.configFile;

export class DeleteInvite {
  public async deleteInviteLink(target: Message, reason: string) {
    const config = await new DataWriter().readFrom(path.join(serverDir, target.guild!.id, configFile));
    const deleteInviteLink: boolean = config.Vocals_Options.purge_options.purge_old_invites_links;
    const allowLogs: boolean = config.Vocals_Options.logs_options.channels_deletions.enabled;
    
    if (!deleteInviteLink) return;
    
    if (!allowLogs) return;

    const msgContent = config.Vocals_Options.logs_options.channels_deletions.message
      .replace('{{user}}', target.author.username)
      .replace('{{channel}}', target.channel.id)
      .replace('{{reason}}', reason);
    
    new Log(target.author, msgContent);
  }
}