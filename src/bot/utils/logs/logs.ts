//import path from "node:path";
import { User } from "discord.js";
//import config from "../../../../config.json" with { type: "json" };
//import { DataWriter } from '../data/write.ts';
/*
const serverDir = path.join(__dirname, '../../../..', config.Bot_Config.Servers_Config.servers_path);
const configFile = config.Bot_Config.Servers_Config.templates.configFile;
*/

export class Log {
  constructor(initiator: User, message: string) {
    this.initLog(initiator, message);
  }

  async initLog(_user: User, _message: string) {
    // TODO : HoPollo : Fix execptions errors
    /*
    const currentGuild: Guild = user.presence.guild!;
    const config = await new DataWriter().read(path.join(serverDir, currentGuild.id, configFile)).catch(console.error);
    const logsChannel = config.Channels_Options.logs_channel.id;

    const logEmbed = new MessageEmbed()
      .setColor(0xFF0000)
      .setDescription(message)
      .setAuthor(user, user.avatar!)
      .setFooter(`ID : ${user.id} •`);

    const found = currentGuild.channels.cache.get(logsChannel) as TextChannel;
    if (found) return found.send(logEmbed).catch(console.error);
    */
  }
}
