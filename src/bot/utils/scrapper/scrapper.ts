import path from "path";
import { Bot_Config } from "../../../../config.json";
import { DataWriter } from "../data/write";
import { FossabotScrapper } from "./fossabot";
import { StreamElementsScrapper } from "./streamelements";
import { Message } from "discord.js";
import { NightbotScrapper } from "./nightbot";
import { MoobotScrapper } from "./moobot";

const serverDir = path.join(__dirname, '../../../..', Bot_Config.Servers_Config.servers_path);
const configFile = Bot_Config.Servers_Config.templates.configFile;

export class Scrapper {
  private _msg: Message;
  private _id: string;
  private _cmd: string;
  private _cfg: any;

  constructor(msg: Message, guildID: string, cmd: string) {
    this._msg = msg;
    this._cmd = cmd;
    this._id = guildID;
    this.init();
  }

  private async init() {
    this._cfg = await new DataWriter().read(path.join(serverDir, this._id, configFile));

    this._msg.react("⌛");

    if (this._cfg.Twitch_Bots_Config.Fossabot.enabled) this.fossabot();
    if (this._cfg.Twitch_Bots_Config.StreamElements.enabled) this.streamelements();
    if (this._cfg.Twitch_Bots_Config.Nightbot.enabled) this.nightbot();
    if (this._cfg.Twitch_Bots_Config.Moobot.enabled) this.moobot();
  }

  private fossabot() {
    const user = this._cfg.Twitch_Bots_Config.Fossabot.username;
    const url = Bot_Config.Fossabot_Config.replace('{{user}}', user);
    new FossabotScrapper(this._msg, url, this._cmd);
  }

  private streamelements() {
    const user: string = this._cfg.Twitch_Bots_Config.StreamElements.username;
    const url = Bot_Config.StreamElements_Config.replace('{{user}}', user);
    new StreamElementsScrapper(this._msg, url, this._cmd);
  }

  private nightbot() {
    const user: string = this._cfg.Twitch_Bots_Config.Nightbot.username;
    const url = Bot_Config.Nightbot_Config.replace('{{user}}', user);
    new NightbotScrapper(this._msg, url, this._cmd);
  }

  private moobot() {
    const user: string = this._cfg.Twitch_Bots_Config.Moobot.username;
    const url = Bot_Config.Moobot_Config.replace('{{user}}', user);
    new MoobotScrapper(this._msg, url, this._cmd);
  }
}