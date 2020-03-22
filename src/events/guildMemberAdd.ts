import { GuildMember, TextChannel} from "discord.js";
import { Bot_Config } from '../../config.json';
import path from "path";
import { Log } from "../utils/logs";

const serverDir = path.join(__dirname, '../..', Bot_Config.Servers_Config.servers_path);
const configFile = Bot_Config.Servers_Config.templates.configFile;

export async function guildMemberAdd(member: GuildMember) {
  const config = await import(path.join(serverDir, member.guild.id, configFile)); 
  const allowWelcome: boolean = config.Channels_Options.welcome_channel.allow_welcome;
  const allowLogs: boolean = config.Channels_Options.logs_channel.logs_options.server_joins.enabled;

  if (!allowWelcome) return; 

  let channel: TextChannel = member.guild.systemChannel!;
  const welcomeMsg: string = config.Channels_Options.welcome_channel.welcome_message
    .replace('{{user}}', member.user.username)
    .repalce('{{server}}', member.guild.name)
  
  channel.send(welcomeMsg);

  if (!allowLogs) return;

  const author = member.user.username;
  const msgContent = config.Channels_Options.logs_channel.logs_options.server_joins.message
    .replace('{{user}}', author);

  new Log(member.user, msgContent);
}