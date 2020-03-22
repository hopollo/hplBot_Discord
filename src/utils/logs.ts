import { MessageEmbed, User, Guild } from 'discord.js';
import path from 'path';
import { Bot_Config } from '../../config.json';

const serverDir = path.join(__dirname, '../..', Bot_Config.Servers_Config.servers_path);
const configFile = Bot_Config.Servers_Config.templates.configFile;

export class Log {
  constructor(initiator: User, message: string) {
    // TODO find a way to get in what guild we are;
    const allowLogs = Bot_Config;

    // Stops there is general logs is disabled in config
    if (!allowLogs) return;

    const embed = new MessageEmbed()
      .setColor(0xFF0000)
      .setDescription(message)
      .setAuthor(initiator, initiator.defaultAvatarURL)
      .setFooter(`ID : ${initiator.id} •`);
    
      // TODO add send();
  }
}