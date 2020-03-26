import fs from 'fs';
import path = require('path');
import { Log } from './logs';
import { VoiceChannel, GuildManager } from 'discord.js';
import { Bot_Config } from '../../config.json';
import { DataWriter } from './write';

const serverDir = path.join(__dirname, '../..', Bot_Config.Servers_Config.servers_path);
const configFile = Bot_Config.Servers_Config.templates.configFile;

export class ChannelDeleter {
  public async checkUsersOf(channel: VoiceChannel) {
    const config = await import(path.join(serverDir, channel.guild.id, configFile));
    const tempChannelsContainerID = config.Vocals_Options.vocals_category_id;
    if (channel.type === "voice" && channel.parentID === tempChannelsContainerID) {
      this.deleteTempChannel(channel, config);
    }
  }
    
  public checkUsersBulk(guild: GuildManager) {
    guild!.cache.forEach(async g => {
      const config = await new DataWriter().readFrom(path.join(serverDir, g.id, configFile));
      const tempChannelsContainerID = config.Vocals_Options.vocals_category_id;
      const tempChannel = g.channels.cache.filter(c => c.type === "voice" && c.parentID === tempChannelsContainerID);
      tempChannel.forEach(c => {
        this.deleteTempChannel(c as VoiceChannel, config)
      });
    });
  }
  
  private async deleteTempChannel(target: VoiceChannel, config: any) {
    const allowDeletion = config.Vocals_Options.purge_options.purge_empty_channels;

    if (!allowDeletion) return;
    
    const usersCount = target.members.array().length;
    
    if (usersCount !== 0 || !target.deletable) return;

    target.delete();

    const reason = 'EmptyTempChannel'
    const msgContent = config.Channels_Options.logs_channel.logs_options.channels_deletions.message
      .replace("{{user}}", target.client.user?.username)
      .replace("{{channel}}", target.name)
      .replace("{{reason}}", reason);

    new Log(target.client.user!, msgContent);
  }
}