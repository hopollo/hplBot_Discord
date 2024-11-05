import path from "node:path";
import { Log } from '../logs/logs.ts';
import { VoiceChannel, GuildManager, TextChannel } from 'discord.js';
import configJSON from '../../../../config.json' with {type: 'json' };
import { DataWriter } from '../data/write.ts';

const serverDir = path.join(__dirname, '../../../..', configJSON.Bot_Config.Servers_Config.servers_path);
const config = configJSON.Bot_Config.Servers_Config.templates.configFile;

export class ChannelDeleter {
  public checkUsersOf(channel: VoiceChannel) {
    const configData = Deno.readDir(path.join(serverDir, channel.guild!.id, config));
    const tempChannelsContainerID = configData.Vocals_Options.vocals_category_id;

    if (channel.isVoiceBased() && channel.parentId === tempChannelsContainerID) {
      this.deleteTempChannel(channel);
    }
  }

  public checkUsersBulk(guild: GuildManager) {
    guild!.cache.forEach(async g => {
      const config = await new DataWriter().read(path.join(serverDir, g.id, config));
      const tempChannelsContainerID = config.Vocals_Options.vocals_category_id;
      const tempChannel = g.channels.cache.filter(c => c.isVoiceBased() && c.parentId === tempChannelsContainerID);

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
      const inviteChannel = invite.guild.channels.cache.get(invitesChannelContainerID) as TextChannel;
      inviteChannel.messages.cache.each(msg => {
        if (msg.content.includes(invite.code) && msg.deletable) return msg.delete();
      });
    });


    const usersCount = target.members.keys.length;

    if (usersCount > 0 || !target.deletable) return undefined;

    target.delete().then(() => {
      const reason = 'EmptyTempChannel'
      const msgContent = config.Channels_Options.logs_channel.logs_options.channels_deletions.message
        .replace("{{user}}", target.client.user?.username)
        .replace("{{channel}}", target.name)
        .replace("{{reason}}", reason);

      new Log(target.client.user!, msgContent);
    }).catch(e => console.error(e));
  }
}