import path = require('path');
import { Log } from '../logs/logs';
import { VoiceChannel, GuildManager, TextChannel } from 'discord.js';
import { Bot_Config } from '../../../../config.json';
import { DataWriter } from '../data/write';

const serverDir = path.join(__dirname, '../../../..', Bot_Config.Servers_Config.servers_path);
const configFile = Bot_Config.Servers_Config.templates.configFile;

export class ChannelDeleter {
  public async checkUsersOf(channel: VoiceChannel) {
    const config = await new DataWriter().read(path.join(serverDir, channel.guild!.id, configFile));
    const tempChannelsContainerID = config.Vocals_Options.vocals_category_id;
    
    if (channel.type === "voice" && channel.parentID === tempChannelsContainerID) {
      this.deleteTempChannel(channel);
    }
  }
    
  public checkUsersBulk(guild: GuildManager) {
    guild!.cache.forEach(async g => {
      const config = await new DataWriter().read(path.join(serverDir, g.id, configFile));
      const tempChannelsContainerID = config.Vocals_Options.vocals_category_id;
      const tempChannel = g.channels.cache.filter(c => c.type === "voice" && c.parentID === tempChannelsContainerID);
      
      tempChannel.forEach(c => {
        this.deleteTempChannel(c as VoiceChannel);
      });
    });
  }
  
  private async deleteTempChannel(target: VoiceChannel) {
    if (target.members.size !== 0) return undefined;
    
    const config = await new DataWriter().read(path.join(serverDir, target.guild.id, configFile));
    const allowDeletion = config.Vocals_Options.purge_options.purge_empty_channels;
    const invitesChannelContainerID: string = config.Channels_Options.invites_channel.id;

    if (!allowDeletion) return undefined;
    
    const invites = await target.fetchInvites();
    invites.each(invite => {
      const inviteChannel = invite.guild?.channels.cache.get(invitesChannelContainerID) as TextChannel;
      inviteChannel.messages.cache.each(msg => {
        if (msg.content.includes(invite.code) && msg.deletable) return msg.delete();
      });
    });

    
    const usersCount = target.members.array().length;
    
    if (usersCount > 0 || !target.deletable) return undefined;

    target.delete().then(() => {
      const reason = 'EmptyTempChannel'
      const msgContent = config.Channels_Options.logs_channel.logs_options.channels_deletions.message
        .replace("{{user}}", target.client.user?.username)
        .replace("{{channel}}", target.name)
        .replace("{{reason}}", reason);
  
      new Log(target.client.user!, msgContent);
    }).catch(err => { /* DONT WANT TO SEE THOSE UNHANDLED ERRORS IN THE FUTURE */});
  }
}