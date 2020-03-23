import { VoiceState } from "discord.js";
import { Log } from "../utils/logs";
import { Bot_Config } from '../../config.json';
import path from 'path';
import { ChannelDeleter } from "../utils/deleteChannel";

const serverDir = path.join(__dirname, '../..', Bot_Config.Servers_Config.servers_path);
const configFile = Bot_Config.Servers_Config.templates.configFile;

export async function voiceStateUpdate(oldState: VoiceState , newState: VoiceState) {
  const config = await import(path.join(serverDir, newState.guild.id, configFile));
  const allowLogs = config.Channels_Options.logs_channel.logs_options.users_movements.enabled;
  //log("users_movements", msg, option);
  
  const membersInside: number = oldState.channel?.members.array.length as number;

  if (!allowLogs) return;
    
  const msgContent: string = config.Channels_Options.logs_channel.logs_options.users_movements.switch_message
      .replace('{{user}}', newState.client.user?.username)
      .replace('{{old}}', oldState.channel?.name)
      .replace('{{new}}', newState.channel?.name)
  
  new Log(newState.client.user!, msgContent)
  
  new ChannelDeleter().checkUsersOf(oldState.channel!);
}