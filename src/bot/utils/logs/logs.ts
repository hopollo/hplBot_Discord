import { MessageEmbed, User, TextChannel } from 'discord.js';
import path from 'path';
import { Bot_Config } from '../../../../config.json';
import { DataWriter } from '../data/write';

const serverDir = path.join(__dirname, '../../../..', Bot_Config.Servers_Config.servers_path);
const configFile = Bot_Config.Servers_Config.templates.configFile;

export class Log {
  private _user: User;
  private _msgContent: string;
  
  constructor(initiator: User, message: string) {
    this._user = initiator;
    this._msgContent = message;

    this.initLog();
  }

  async initLog() {
    /*
    const config = await new DataWriter().read(path.join(serverDir, this._guild!.id, configFile));
    const logsChannel = config.Channels_Options.logs_channel.id;

    const logEmbed = new MessageEmbed()
      .setColor(0xFF0000)
      .setDescription(this._msgContent)
      .setAuthor(this._user, this._user.defaultAvatarURL)
      .setFooter(`ID : ${this._user.id} •`);

    /*
    const found = this._guild.channels.cache.get(logsChannel) as TextChannel;
    if (found) return found.send(logEmbed);
    */
  }
}