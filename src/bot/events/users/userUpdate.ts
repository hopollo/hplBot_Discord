import { User, Guild } from "discord.js";
import { Log } from '../../utils/logs/logs';
import { Bot_Config } from '../../../../config.json';
import path from 'path';
import { DataWriter } from '../../utils/data/write';

export async function userUpdate(oldUser: User, newUser: User) {
  try {
    const serverDir = path.join(__dirname, '../../../..', Bot_Config.Servers_Config.servers_path);
    const configFile = Bot_Config.Servers_Config.templates.configFile;
    
    const currentGuild: Guild = (oldUser === undefined) ? newUser.presence.guild! : oldUser.presence.guild!;
    const config = await new DataWriter().read(path.join(serverDir, currentGuild.id, configFile));
    const allowLogs: boolean = config.Channels_Options.logs_channel.logs_options.users_info_changes.enabled;
    
    if (!allowLogs) return;
  
    const msgContent = config.Channels_Options.logs_channel.logs_options.users_info_changes.message
      .replace('{{user}}', newUser.username)
      .replace('{{old}}', oldUser.username)
      .replace('{{new}}', newUser.username);
  
    if (oldUser !== undefined) {
      new Log(oldUser, msgContent);
    } else {
      new Log(newUser, msgContent);  
    }
  } catch (error) { console.error; }
}