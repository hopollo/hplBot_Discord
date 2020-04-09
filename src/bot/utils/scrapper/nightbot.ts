import path from "path";
import { DataWriter } from "../data/write";
import { Message } from "discord.js";
import { Bot_Config } from '../../../../config.json';
import puppeteer from 'puppeteer';

const serverDir = path.join(__dirname, '../../../..', Bot_Config.Servers_Config.servers_path);
const commandsFile = Bot_Config.Servers_Config.templates.commandsFile;

export class NightbotScrapper {
  private _msg: Message;
  private _url: string;
  private _cmd: string;

  constructor(msg: Message, url: string, cmd: string) {
    this._msg = msg;
    this._url = url;
    this._cmd = cmd;
    this.fetchBotCommands();
  }

  async fetchBotCommands() {
    const getData = async () => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      await page.goto(this._url);
      
      await page.waitForSelector('tr', { visible: true });

      const result = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('tr'))
                    .map(i => i.children)
                    .reduce((a: any, b: any) => (a[b[0].innerHTML] = b[1].innerHTML.replace('/me','').slice(1), a), {});
      });
      
      await browser.close();
      return result;
    }

    getData()
      .then(async (data) => { 
        new DataWriter().appendTo(path.join(serverDir, this._msg.guild?.id!, commandsFile), data)
        this._msg.reactions.removeAll();
        await this._msg.react("✔️");
      })
      .catch(async (err) => {
        this._msg.reactions.removeAll();
        await this._msg.react('❌');
      });
  }
}