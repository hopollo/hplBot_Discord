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
  private _username: string;

  constructor(msg: Message, guildID: string, cmd: string) {
    this._msg = msg;
    this._cmd = cmd;
    this._id = guildID;
    this._username = "";
    this.init();
  }

  private async init() {
    this._cfg = await new DataWriter().read(path.join(serverDir, this._id, configFile));
    this._username = this._cfg.Twitch_Bots_Config.username;

    this._msg.react("⌛");

    if (this._cfg.Twitch_Bots_Config.Fossabot) this.fossabot();
    if (this._cfg.Twitch_Bots_Config.StreamElements) this.streamelements();
    if (this._cfg.Twitch_Bots_Config.Nightbot) this.nightbot();
    if (this._cfg.Twitch_Bots_Config.Moobot) this.moobot();
  }

  private fossabot() {
    const url = Bot_Config.Fossabot_Config.replace('{{user}}', this._username);
    new FossabotScrapper(this._msg, url, this._cmd);
  }

  private streamelements() {
    const url = Bot_Config.StreamElements_Config.replace('{{user}}', this._username);
    new StreamElementsScrapper(this._msg, url, this._cmd);
  }

  private nightbot() {
    const url = Bot_Config.Nightbot_Config.replace('{{user}}', this._username);
    new NightbotScrapper(this._msg, url, this._cmd);
  }

  private moobot() {
    const url = Bot_Config.Moobot_Config.replace('{{user}}', this._username);
    new MoobotScrapper(this._msg, url, this._cmd);
  }
}