import { Message, MessageEmbed } from "discord.js";
import { Bot_Config } from '../../config.json';
import path from "path";
import { ChannelCreator } from "./createChannel";
import fs from 'fs';
import { DataWriter } from "./write";

const serverDir = path.join(__dirname, '../..', Bot_Config.Servers_Config.servers_path);
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

    this.commandsFilePath = path.join(serverDir, msg.id, commandFile);

    this.processMsg(this._msg);
  }

  private async processMsg(msg: Message) {
    this._cfg = await new DataWriter().readFrom(path.join(serverDir, msg.guild?.id!, configFile));
    const customCommand: string = this._cfg.Vocals_Options.creation_command;

    switch(this._cmd) {
      case '!addcom': this.addCom(this._args); break;
      case '!editcom': this.editCom(this._args); break;
      case '!delcom': this.delCom(this._cmd); break;
      case '!duo': new ChannelCreator(this._msg, 2); break;
      case '!trio': new ChannelCreator(this._msg, 3); break;
      case '!squad': new ChannelCreator(this._msg, 5); break;
      case '!help': this.help(); break;
      case customCommand: this.customChannel(this._cmd, +this._args); break;
      default:
        this.fecthCommand(this._msg);
    }
  }

  private async fecthCommand(msg: Message) {
    const filePath = path.join(serverDir, msg.guild?.id!, commandFile);
    const unknownCommand = this._cfg.Commands_Options.enabled;
    const unknownCommandMessage = this._cfg.Commands_Options.message;
    
    const response = await new DataWriter().findInto(filePath, this._cmd) as string;
    if (response) return msg.reply(response);

    if (unknownCommand) {
      const msgContent = unknownCommandMessage
        .replace('{{command}}', this._cmd);msg.reply(msgContent);
    }
  }

  private help() {
    const helpEmbed = new MessageEmbed()
      .setAuthor('HplBot Commands :')
      .addField('Create a command', '!addcom !hi Hello there')
      .addField('Edit a command', '!editcom !hi Bonjour !')
      .addField('Delete a command', '!delcom !hi')
      .addField('Create a channel', '!duo, !trio, !squad, !custom NUMBER')
      .setFooter('more info on twitter @HoPolloTV');
    this._msg.reply(helpEmbed);
  }

  private addCom(args: string[]) {
    const command = args.slice(1)[0];
    const resp = args.slice(2);

    new DataWriter().appendTo(this.commandsFilePath, {command, resp});
  }

  private delCom(cmd: string) {
    return this._msg.reply('soon');
    new DataWriter().removeTo(this.commandsFilePath, cmd); 
  }

  private editCom(args: string[]) {
    const command = args.slice(1)[0];
    const resp = args.slice(2);
    new DataWriter().replaceTo(this.commandsFilePath, {command, resp});
  }
  
  private customChannel(cmd: string, slots: number) {
    new ChannelCreator(this._msg, slots);
  }
}