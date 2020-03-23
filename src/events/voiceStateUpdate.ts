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

  if (!allowLogs) return;

  if (oldState.channel?.id && newState.channel?.id) {
    const msgContent: string = config.Channels_Options.logs_channel.logs_options.users_movements.switch_message
        .replace('{{user}}', newState.client.user?.username)
        .replace('{{old}}', oldState.channel!.name)
        .replace('{{new}}', newState.channel!.name)

    new Log(newState.client.user!, msgContent)
    
    new ChannelDeleter().checkUsersOf(oldState.channel!);
  } else if (oldState.channel?.id === undefined && newState.channel?.id) {
    const msgContent: string = config.Channels_Options.logs_channel.logs_options.users_movements.join_message
        .replace('{{user}}', newState.client.user!.username)
        .replace('{{channel}}', newState.channel!.name)
    
    new Log(newState.client.user!, msgContent)

    new ChannelDeleter().checkUsersOf(newState.channel!);
  } else {
    // Handles disconnect
    new ChannelDeleter().checkUsersOf(oldState.channel!);
  }
}