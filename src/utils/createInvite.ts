import path from 'path';
import { Invite, VoiceChannel, TextChannel, GuildChannel } from 'discord.js';
import { Log } from './logs';
import { DataWriter } from './write';
import { Bot_Config } from '../../config.json';

export class CreateInvite {
  private _source: VoiceChannel;
  
  constructor(channelSource: VoiceChannel) {
    this._source = channelSource;
    this.createInviteToNewTempVoiceChannel(this._source);
  }

  async createInviteToNewTempVoiceChannel(source: VoiceChannel) {
    const config = await import(path.join(__dirname, '../..', Bot_Config.Servers_Config.servers_path, source.guild.id, Bot_Config.Servers_Config.templates.configFile));
    const invitesChannelContainerID: string = config.Channels_Options.invites_channel.id;
    const allowLogs: boolean = config.Channels_Options.logs_channel.logs_options.channels_creations.enabled;
    const tempChannels = await import(path.join(__dirname, '../..', Bot_Config.Servers_Config.servers_path, source.guild.id, Bot_Config.Servers_Config.templates.tempChannelsFile));

    const newChannelInvite: Invite = await source.createInvite({reason: 'Temporary Channel'});

    const inviteLink = config.Channels_Options.invites_channel.invite_links_message
      .replace('{{user}}', source.client.user?.username)
      .replace('{{channel}}', source.name)
      .replace('{{inviteLink}}', newChannelInvite.url);

    // Add both to use them for deletions after
    new DataWriter().appendTo(tempChannels, {channelID: source.id, inviteID: source.client.user?.lastMessageID});

    // Share the invitation to the correct invitations channel
    const invitationToShare = source.guild.channels.cache.get(invitesChannelContainerID) as TextChannel;
    if (invitationToShare) return invitationToShare.send(inviteLink);

    const author = source.client.user;
    const msgContent = config.Channels_Options.logs_channel.logs_options.channels_creations.message
      .replace('{{user}}', author?.username)
      .replace('{{channel}}', source.name);

    if (allowLogs) new Log(author!, msgContent);
  }
}