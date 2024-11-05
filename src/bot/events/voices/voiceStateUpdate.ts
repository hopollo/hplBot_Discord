import { VoiceState } from "discord.js";
//import { Log } from "../../utils/logs/logs";
//import { Bot_Config } from '../../../../config.json';
//import path from 'path';
//import { ChannelDeleter } from "../../utils/channels/deleteChannel";

export const voiceStateUpdate = async (
  oldState: VoiceState,
  _newState: VoiceState,
) => {
  try {
    //const serverDir = path.join(__dirname, '../../../..', Bot_Config.Servers_Config.servers_path);
    //const configFile = Bot_Config.Servers_Config.templates.configFile;

    //const currentGuild: Guild = (oldState === undefined) ? newState.guild! : oldState.guild!;
    //const config = await import(path.join(serverDir, currentGuild.id, configFile));
    //const allowLogs = config.Channels_Options.logs_channel.logs_options.users_movements.enabled;

    //if (!allowLogs) return;
    /*
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
    */

    if (
      oldState.channel?.members.values.length === 0 &&
      oldState.channel.deletable
    ) {
      await oldState.channel.delete("Purge du canal temporaire vide.");
    }
  } catch (e) {
    console.error(e);
  }
};
