import path from 'path';
import { Bot_Config } from '../../../../config.json';
import { Message } from 'discord.js';
import { Command } from '../../utils/commands/defaultCommands';

const serverDir = path.join(__dirname, '../../../..', Bot_Config.Servers_Config.servers_path);
const configFile = Bot_Config.Servers_Config.templates.configFile;

export async function message(msg: Message) {
  const stableMode: boolean = Bot_Config.stable_mode.enabled;
  const msgContent: string = msg.content.toLowerCase();
  const commandsPrefix: string = Bot_Config.commands_prefix || '!';
  const config = await import(path.join(serverDir, msg.guild?.id!, configFile));
  const isCommand: boolean = msgContent.startsWith(commandsPrefix);
  const invitesChannelID: string = config.Channels_Options.invites_channel.id;
  const isInvitesChannel: boolean = msg.channel.id === invitesChannelID;
  const onlyCommands: boolean = config.Channels_Options.invites_channel.allow_only_commands_messages;
  const onlyCreations: boolean = config.Channels_Options.invites_channel.allow_only_creation_messages;

  if (isInvitesChannel && !msg.author.bot && onlyCommands && !isCommand) {
    if (msg.deletable) return msg.delete({reason: "Not allowed in this channel"}).catch(console.error);
  }
  
  if (msg.author.bot || !isCommand) return undefined;
  if (!stableMode) return msg.reply('Maintenance en cours du bot, merci de réessayer plus tard.');
  
  new Command(msg);
}