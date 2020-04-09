import { Message, MessageEmbed } from "discord.js";
import { Bot_Config } from '../../../../config.json';
import path from "path";
import { ChannelCreator } from "../channels/createChannel";
import { DataWriter } from "../data/write";
import { Scrapper } from "../scrapper/scrapper";

const serverDir = path.join(__dirname, '../../../..', Bot_Config.Servers_Config.servers_path);
const configFile = Bot_Config.Servers_Config.templates.configFile;
const commandFile = Bot_Config.Servers_Config.templates.commandsFile;

export class Command {

  private _args: string[];
  private _cmd: string;
  private _content: string;
  private _msg: Message;
  private commandsFilePath: string;
  private _cfg: any;

  constructor(msg: Message) {
    this._msg = msg;
    this._content = msg.content;
    this._cmd = this._content.toLowerCase().split(' ')[0];
    this._args = this._content.split(' ').slice(1);

    this.commandsFilePath = path.join(serverDir, msg.guild!.id, commandFile);

    this.processMsg(this._msg);
  }

  private async processMsg(msg: Message) {
    this._cfg = await new DataWriter().read(path.join(serverDir, msg.guild?.id!, configFile));
    const customCommand: string = this._cfg.Vocals_Options.creation_command;

    switch(this._cmd) {
      case '!addcom': this.addCom(this._content); break;
      case '!editcom': this.editCom(this._content); break;
      case '!delcom': this.delCom(this._content); break;
      case '!duo': new ChannelCreator(this._msg, 2); break;
      case '!trio': new ChannelCreator(this._msg, 3); break;
      case '!squad': new ChannelCreator(this._msg, 5); break;
      case '!help': this.help(); break;
      case customCommand: this.customChannel(this._cmd, +this._args); break;
      case '!scrap': this.fecthBotCommmands(); break;
      default:
        this.fecthCommand(this._msg);
    }
  }

  private async fecthCommand(msg: Message) {
    if (!msg.member?.hasPermission("MANAGE_GUILD")) return msg.reply(`Sorry, you'r not allowed.`);
    
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

  private help() {
    const helpEmbed = new MessageEmbed()
      .setAuthor('HplBot Commands :')
      .addField('Create a command, overrides existing from (!scrap)', '!addcom !hi Hello there')
      .addField('Edit a command', '!editcom !hi Bonjour !')
      .addField('Delete a command', '!delcom !hi')
      //.addField('Always ignore a command from (!scrap)', '!bancom !setgame')
      //.addField('Protects a command from override with (!scrap)', '!lockcom !followage')
      .addField('Copy all twitch chat bot commands & override currents', '!scrap')
      .addField('Creates a channel', '!duo, !trio, !squad, !custom NUMBER')
      .setFooter('more info on twitter @HoPolloTV');
    this._msg.reply(helpEmbed);
  }

  private addCom(args: string) {
    if (!this._msg.member?.hasPermission('MANAGE_GUILD')) return;

    const match: any = args.match(/^(!\w+)\s(!\w+)\s(.*)/);
    const command: string = match[2];
    const resp: string = match[3];
    const data: { [command: string]: string; } = { [command] : resp };
    
    new DataWriter().appendTo(this.commandsFilePath, data);
  }

  private editCom(args: string) {
    if (!this._msg.member?.hasPermission('MANAGE_GUILD')) return;

    const match: any = args.match(/^(!\w+)\s(!\w+)\s(.*)/);
    const command: string = match[2];
    const resp: string = match[3];
    const data: { [command: string]: string; } = { [command] : resp };

    new DataWriter().appendTo(this.commandsFilePath, data);
  }

  private delCom(args: string) {
    if (!this._msg.member?.hasPermission('MANAGE_GUILD')) return;

    const match: any = args.match(/^(!\w+)\s(!\w+)/)
    const command = match[2];
    new DataWriter().removeTo(this.commandsFilePath, command); 
  }
  
  private customChannel(cmd: string, slots: number) {
    new ChannelCreator(this._msg, slots);
  }
}