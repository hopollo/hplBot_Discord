//import path from 'path';
import { Bot_Config } from "../../../../config.json";
//import { Command } from '../../utils/commands/defaultCommands';
//import { DataWriter } from '../../utils/data/write';
import { Guild, Message, GuildMember } from "discord.js";

export const message: any = async (msg: Message) => {
  try {
    //const serverDir = path.join(__dirname, '../../../..', Bot_Config.Servers_Config.servers_path);
    //const configFile = Bot_Config.Servers_Config.templates.configFile;
    const stableMode: boolean = Bot_Config.stable_mode.enabled;
    const msgContent: string = msg.content.toLowerCase();
    const commandsPrefix: string = Bot_Config.commands_prefix || "!";
    //const config = await new DataWriter().read(path.join(serverDir, msg.guild!.id, configFile));
    const isCommand = msgContent.startsWith(commandsPrefix);
    //const invitesChannelID: string = config.Channels_Options.invites_channel.id;
    //const isInvitesChannel: boolean = msg.channel.id === invitesChannelID;
    //const onlyCommands: boolean = config.Channels_Options.invites_channel.allow_only_commands_messages;
    //const onlyCreations: boolean = config.Channels_Options.invites_channel.allow_only_creation_messages;

    if (!stableMode)
      return await msg.reply(
        "Maintenance en cours du bot, merci de réessayer plus tard."
      );
    if (msg.author.bot) return null;
    if (!isCommand) return null;
    if (!msg.deletable) return null;

    switch (msg.content) {
      case "!duo":
        return createVoiceChannel(
          msg.guild!,
          msg.member!,
          `${msg.author.username}'s Duos`,
          2
        );
      case "!trio":
        return createVoiceChannel(
          msg.guild!,
          msg.member!,
          `${msg.author.username}'s Trios`,
          3
        );
      case "!squad":
        return createVoiceChannel(
          msg.guild!,
          msg.member!,
          `${msg.author.username}'s Squad`,
          5
        );
      default:
        return null;
    }

    /**
     * When detecting createChannelCommand in the specified channel for those, remove the message and create the channel author asked for
     */
    /*
    if (isInvitesChannel && onlyCommands && isCommand) {
      await msg.delete();
    }
    */

    //new Command(msg);
  } catch (e) {
    console.error;
  }
};

const createVoiceChannel = async (
  guild: Guild,
  author: GuildMember,
  name: string,
  slots: number
) => {
  try {
    // create the voiceChannel
    const newChannel = await guild.channels.create({
      name,
      type: 2,
      userLimit: slots,
      parent: "464153673962881024"
    });

    // Move the owner inside;
    if (author.voice !== null) await author.voice.setChannel(newChannel.id);
  } catch (e) {
    console.error(e);
  }
};
