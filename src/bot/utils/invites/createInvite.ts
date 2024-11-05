import path from "node:path";
import { GuildMember, Invite, TextChannel, VoiceChannel } from "discord.js";
import { Log } from "../logs/logs.ts";
import { DataWriter } from "../data/write.ts";
import { Bot_Config } from "../../../../config.json" with { type: "json" };

const serverDir = path.join(
  __dirname,
  "../../../..",
  Bot_Config.Servers_Config.servers_path,
);
const configFile = Bot_Config.Servers_Config.templates.configFile;

export class CreateInvite {
  private _source: VoiceChannel;
  private _author: GuildMember;

  constructor(author: GuildMember, channelSource: VoiceChannel) {
    this._author = author;
    this._source = channelSource;
    this.createInviteToNewTempVoiceChannel(this._author, this._source);
  }

  async createInviteToNewTempVoiceChannel(
    initiator: GuildMember,
    source: VoiceChannel,
  ) {
    const config = await new DataWriter().read(
      path.join(serverDir, source.guild!.id, configFile),
    );
    const invitesChannelContainerID: string =
      config.Channels_Options.invites_channel.id;
    const allowLogs: boolean =
      config.Channels_Options.logs_channel.logs_options.channels_creations
        .enabled;

    const newChannelInvite: Invite = await source.createInvite({
      reason: "Temporary Channel",
    });

    const inviteLink = config.Channels_Options.invites_channel
      .invite_links_message
      .replace("{{user}}", initiator.user.username)
      .replace("{{channel}}", source.name)
      .replace("{{inviteLink}}", newChannelInvite.url);

    // Share the invitation to the correct invitations channel
    const invitationToShare = source.guild.channels.cache.get(
      invitesChannelContainerID,
    ) as TextChannel;
    if (invitationToShare) invitationToShare.send(inviteLink);

    if (!allowLogs) return;
    const author = initiator.user.username;
    const msgContent = config.Channels_Options.logs_channel.logs_options
      .channels_creations.message
      .replace("{{user}}", author)
      .replace("{{channel}}", source.name);

    new Log(initiator.user, msgContent);
  }
}
