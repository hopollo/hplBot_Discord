import path from 'path';
import { Invite, VoiceChannel, TextChannel, GuildChannel } from 'discord.js';
import { Log } from '../logs/logs';
import { DataWriter } from '../data/write';
import { Bot_Config } from '../../../../config.json';

const serverDir = path.join(__dirname, '../../../..', Bot_Config.Servers_Config.servers_path);
const configFile = Bot_Config.Servers_Config.templates.configFile;

export class CreateInvite {
  private _source: VoiceChannel;
  
  constructor(channelSource: VoiceChannel) {
    this._source = channelSource;
    this.createInviteToNewTempVoiceChannel(this._source);
  }

  async createInviteToNewTempVoiceChannel(source: VoiceChannel) {
    const config = await new DataWriter().read(path.join(serverDir, source.guild!.id, configFile));
    const invitesChannelContainerID: string = config.Channels_Options.invites_channel.id;
    const allowLogs: boolean = config.Channels_Options.logs_channel.logs_options.channels_creations.enabled;

    const newChannelInvite: Invite = await source.createInvite({reason: 'Temporary Channel'});

    const inviteLink = config.Channels_Options.invites_channel.invite_links_message
      .replace('{{user}}', source.client.user!.username)
      .replace('{{channel}}', source.name)
      .replace('{{inviteLink}}', newChannelInvite.url);

    // Share the invitation to the correct invitations channel
    const invitationToShare = source.guild.channels.cache.get(invitesChannelContainerID) as TextChannel;
    if (invitationToShare) invitationToShare.send(inviteLink);

    if (!allowLogs) return;
    const author = source.client.user;
    const msgContent = config.Channels_Options.logs_channel.logs_options.channels_creations.message
      .replace('{{user}}', author?.username)
      .replace('{{channel}}', source.name);

    new Log(author!, msgContent);
  }
}