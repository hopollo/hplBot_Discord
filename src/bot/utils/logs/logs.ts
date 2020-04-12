import { MessageEmbed, User, TextChannel, Guild } from 'discord.js';
import path from 'path';
import { Bot_Config } from '../../../../config.json';
import { DataWriter } from '../data/write';

const serverDir = path.join(__dirname, '../../../..', Bot_Config.Servers_Config.servers_path);
const configFile = Bot_Config.Servers_Config.templates.configFile;

export class Log {
  constructor(initiator: User, message: string) {
    this.initLog(initiator, message);
  }

  async initLog(user: User, message: string) {
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