import path from 'path';
import { Bot_Config } from '../../config.json';
import { Message, VoiceChannel } from 'discord.js';
import { Log } from './logs';
import { Mover } from './move';
import { CreateInvite } from './createInvite';

export class ChannelCreator {
  private readonly _name: string;
  private readonly _slots: number;
  private readonly _msg : Message;
  
  constructor(msg: Message, name: string, slots: number) {
    this._name = name;
    this._slots = slots;
    this._msg = msg;

    this.createNewVoiceChannel(this._msg, this._name, this._slots);
  }

  async createNewVoiceChannel(msg: Message, channelName: string, slotsLimit: number) {
    const config = await import(path.join(__dirname, '../..', Bot_Config.Servers_Config.servers_path, msg.guild!.id, Bot_Config.Servers_Config.templates.configFile));
    const vocalsContainerID: string = config.Vocals_Options.vocals_category_id;
    const vocalsMaxSlots: number = config.Vocals_Options.max_users.count;
    const reachedMessage: string = config.Vocals_Options.max_users.reached_message;
    const deleteCreationCommand: boolean = config.Vocals_Options.purge_options.purge_creation_commands;
    const msgDeleteIdle: number = config.Vocals_Options.purge_options.purge_creation_commands_idle;
    const moveCreator: boolean = config.Vocals_Options.move_creator_inside;
    const shareInvite: boolean = config.Channels_Options.invites_channel.post_invite_links;
    const allowLogs: boolean = config.Channels_Options.logs_channel.logs_options.channels_creations.enabled;
    
    // Issues & security tweaks for custom numbers especially
    if (isNaN(slotsLimit)) return undefined;
    if (slotsLimit >= vocalsMaxSlots) return msg.reply(reachedMessage);

    // Generate the temp channel with users specs
    const newChannel = await msg.guild!.channels.create(channelName, {
      type: "voice",
      userLimit: slotsLimit,
      // REMARK : Huge issue there, there's no way to convert channel id to "1615616",
      // the only way to makes it works is to set the "" manually inside the config line
      // it's never working otherwise, is it a lib issue ??
      parent: vocalsContainerID
    }).catch(console.error) as VoiceChannel;

    // Delete the command msg for clearance
    if (deleteCreationCommand) msg.delete({timeout: msgDeleteIdle}).catch(console.error);

    // Create an invite for the new temp channel
    if (shareInvite) new CreateInvite(newChannel);

    // Moves the user into his new temporary channel feature
    if (moveCreator) new Mover(msg.member!, newChannel);

    const msgContent = config.Channels_Options.logs_channel.logs_options.channels_creations.message
      .replace('{{user}}', msg.author.username)
      .replace('{{channel}}', newChannel.name);

    if (allowLogs) new Log(msg.client.user!, msgContent);
  };
}