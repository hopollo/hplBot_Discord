import { Message, MessageEmbed } from "discord.js";
import { Bot_Config } from '../../config.json';
import path from "path";
import { DataWriter } from "./write";
import { config } from "process";
import { ChannelCreator } from "./createChannel";

const serverDir = path.join(__dirname, '../..', Bot_Config.Servers_Config.servers_path);
const configFile = Bot_Config.Servers_Config.templates.configFile;
const commandFile = Bot_Config.Servers_Config.templates.commandsFile;

export class Command {

  private _args: string[];
  private _cmd: string;
  private _content: string;
  private _msg: Message;
  private _filePath: string;
  private _cfg: any;

  constructor(msg: Message) {
    this._msg = msg;
    this._content = msg.content;
    this._cmd = this._content.split(' ')[0].substr(1).toLowerCase(); 
    this._args = this._content.split(' ').slice(1);
    this._filePath = path.join(serverDir, msg.id, commandFile);

    this.processMsg(msg);
  }

  private async processMsg(msg: Message) {
    this._cfg = await import(path.join(serverDir, msg.guild?.id!, configFile));
    const customCommand: string = this._cfg.Vocals_Options.creation_command.substr(1);

    switch(this._cmd) {
      case 'addcom': this.addCom(this._args[1], this._args); break;
      case 'editcom': this.editCom(this._cmd[1], this._args.toString()); break;
      case 'delcom': this.delCom(this._cmd); break;
      case 'duo': new ChannelCreator(this._msg, 2); break;
      case 'trio': new ChannelCreator(this._msg, 3); break;
      case 'squad': new ChannelCreator(this._msg, 5); break;
      case 'help': this.help(); break;
      case customCommand: this.customChannel(this._cmd, +this._args); break;
      default:
        msg.reply(`${this._cmd} is not a commmand`);
    }
  }

  private help() {
    const helpEmbed = new MessageEmbed()
      .setAuthor('Commands :')
      .addField('Create a command', '!addcom !hi Hello there')
      .addField('Edit a command', '!editcom !hi Bonjour!')
      .addField('Delete a command', '!delcom !hi')
      .addField('Create a channel', '!duo, !trio, !squad, !custom NUMBER')
      .setFooter('more info on twitter @HoPolloTV');
    this._msg.reply(helpEmbed);
  }

  private addCom(cmd: string, response: string[]) {
    return this._msg.reply('soon');
    const argsToString = response.slice(1).toString();
    const reply = `{ "${cmd}": "${argsToString}" }`;
    console.log(reply);
    new DataWriter().appendTo(this._filePath, reply);
  }

  private delCom(cmd: string) {
    return this._msg.reply('soon');
    new DataWriter().removeTo(this._filePath, cmd); 
  }

  private editCom(cmd: string, data: string) {
    return this._msg.reply('soon');
    new DataWriter().replaceTo(this._filePath, data);
  }
  
  private customChannel(cmd: string, slots: number) {
    new ChannelCreator(this._msg, slots);
  }
}