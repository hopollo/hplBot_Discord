import { Message, GuildMember, TextChannel } from "discord.js";
import config from '../../../../config.json' with { type: "json" };
import path from "node:path";
import { ChannelCreator } from "../channels/createChannel.ts";
import { DataWriter } from "../data/write.ts";
import { Scrapper } from "../scrapper/scrapper.ts";
import { PunishHandler } from "../userActions/punish.ts";
import { Purger } from "../channels/purger.ts";

const serverDir = path.join(__dirname, '../../../..', config.Bot_Config.Servers_Config.servers_path);
const configFile = config.Bot_Config.Servers_Config.templates.configFile;
const commandFile = config.Bot_Config.Servers_Config.templates.commandsFile;

export class Command {
  private _cmd: string;
  private _content: string;
  private _msg: Message;
  private commandsFilePath: string;
  private _cfg: any;

  constructor(msg: Message) {
    this._msg = msg;
    this._content = msg.content;
    this._cmd = this._content.toLowerCase().split(' ')[0];

    this.commandsFilePath = path.join(serverDir, msg.guild!.id, commandFile);

    this.processMsg(this._msg);
  }

  private async processMsg(msg: Message) {
    this._cfg = await new DataWriter().read(path.join(serverDir, msg.guild?.id!, configFile));
    const customCommand: string = this._cfg.Vocals_Options.creation_command;

    switch (this._cmd) {
      case '!addcom': this.addCom(); break;
      case '!editcom': this.editCom(); break;
      case '!delcom': this.delCom(); break;
      case '!ban': this.ban(); break;
      case '!unban': this.unban(); break;
      case '!kick': this.kick(); break;
      case '!mute': this.mute(); break;
      case '!unmute': this.unmute(); break;
      case '!eject': this.eject(); break;
      case '!duo': new ChannelCreator(this._msg, 2); break;
      case '!trio': new ChannelCreator(this._msg, 3); break;
      case '!squad': new ChannelCreator(this._msg, 5); break;
      case '!purge': this.purge(); break;
      case '!help': this.help(); break;
      case customCommand: this.customChannel(); break;
      case '!scrap': this.fecthBotCommmands(); break;
      default:
        this.fecthCommand(this._msg);
    }
  }

  private async fecthCommand(msg: Message) {
    if (!msg.member?.permissions.has("ManageGuild")) return msg.reply(`Sorry, you'r not allowed.`);

    const unknownCommand = this._cfg.Commands_Options.enabled;
    const unknownCommandMessage = this._cfg.Commands_Options.message;

    const response = await new DataWriter().findInto(this.commandsFilePath, this._cmd) as string;
    if (response) return msg.reply(response);

    if (unknownCommand) {
      const msgContent = unknownCommandMessage
        .replace('{{command}}', this._cmd);

      this._msg.reply(msgContent);
    }
  }

  private fecthBotCommmands() {
    new Scrapper(this._msg, this._msg.guild!.id, this._cmd);
  }

  /*
  private help() {
    const helpEmbed = new MessageEmbed()
      .setAuthor('HplBot Commands :')
      .addField('Create a command', '!addcom !hi Hello there')
      .addField('Edit a command', '!editcom !hi Bonjour !')
      .addField('Delete a command', '!delcom !hi')
      .addField('Purge channel messages', '!purge 20')
      .addField('Ban a user (days)', '!ban XXXX 7 Spamming')
      .addField('Kick a user', '!kick XXXX Scammer')
      .addField('Mute a user', '!mute XXXX Too loud & annoying')
      .addField('Unmute a user', '!unmute XXXX Wrote apologies')
      .addField('Eject a user from a voice channel', '!eject XXXX AFK & mic open')
      //.addField('Always ignore a command from (!scrap)', '!bancom !setgame')
      //.addField('Protects a command from override with (!scrap)', '!lockcom !followage')
      .addField('Copy all twitch chat bot commands & override currents', '!scrap')
      .addField('Creates a temporary channel', '!duo, !trio, !squad, !custom NUMBER')
      .setFooter('more info on twitter @HoPolloTV');
    this._msg.reply(helpEmbed);
  }
  */

  private addCom() {
    if (!this._msg.member?.permissions.has("ManageGuild")) return undefined;

    const match: any = this._content.match(/^(!\w+)\s(!\w+)\s(.*)/);
    const command: string = match[2];
    const resp: string = match[3];
    const data: { [command: string]: string; } = { [command]: resp };

    new DataWriter().appendTo(this.commandsFilePath, data);
  }

  private editCom() {
    if (!this._msg.member?.permissions.has("ManageGuild")) return undefined;

    const match: any = this._content.match(/^(!\w+)\s(!\w+)\s(.*)/);
    const command: string = match[2];
    const response: string = match[3];
    const data: { [command: string]: string; } = { [command]: response };

    new DataWriter().appendTo(this.commandsFilePath, data);
  }

  private delCom() {
    if (!this._msg.member?.permissions.has("ManageGuild")) return undefined;

    const match: any = this._content.match(/^(!\w+)\s(!\w+)/);
    const command = match[2];
    new DataWriter().removeTo(this.commandsFilePath, command);
  }

  private customChannel() {
    const match: any = this._content.match(/^(!\w+)\s(!\w+)/);
    const slots: string = match[2];

    new ChannelCreator(this._msg, +slots);
  }

  private ban() {
    const match: any = this._content.match(/^(!\w+)\s(\w+)\s(\w+)\s(.*)/);
    const target: GuildMember = match[2];
    const time: number = match[3];
    const reason: string = match[4];

    new PunishHandler(this._msg.member!, target, 'ban', time, reason);
  }

  private unban() {
    const match: any = this._content.match(/^(!\w+)\s(\w+)\s(.*)/);
    const target: GuildMember = match[2];
    const reason: string = match[3];

    new PunishHandler(this._msg.member!, target, 'unban', undefined, reason);
  }

  private kick() {
    const match: any = this._content.match(/^(!\w+)\s(\w+)\s(.*)/);
    const target: GuildMember = match[2];
    const reason: string = match[3];

    new PunishHandler(this._msg.member!, target, 'kick', undefined, reason);
  }

  private eject() {
    const match: any = this._content.match(/^(!\w+)\s(\w+)\s(.*)/);
    const target: GuildMember = match[2];
    const reason: string = match[3];

    new PunishHandler(this._msg.member!, target, 'eject', undefined, reason);
  }

  private mute() {
    const match: any = this._content.match(/^(!\w+)\s(\w+)\s(.*)/);
    const target: GuildMember = match[2];
    const reason: string = match[3];

    new PunishHandler(this._msg.member!, target, 'mute', undefined, reason);
  }

  private unmute() {
    const match: any = this._content.match(/^(!\w+)\s(\w+)\s(.*)/);
    const target: GuildMember = match[2];
    const reason: string = match[3];

    new PunishHandler(this._msg.member!, target, 'unmute', undefined, reason);
  }

  private purge() {
    const match: any = this._content.match(/^(!\w+)\s(\w+)/);
    const length: string = match[2];

    new Purger(this._msg.member!, this._msg.channel as TextChannel, +length);
  }

  private help() {
    this._msg.reply("Find help in my twitter !");;
  }

  /*
  private banCom() {
    if (!this._msg.member?.hasPermission('MANAGE_GUILD')) return undefined;
    const match: any = this._content.match(/^(!\w+)\s(!\w+)/)
    const command = match[2];
    new DataWriter().appendTo(this.commandsFilePath, command)
  }

  private lockCom() {

  }
  */
}