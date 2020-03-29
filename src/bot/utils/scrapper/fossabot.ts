import path from "path";
import { DataWriter } from "../data/write";
import { Message } from "discord.js";
import { Bot_Config } from '../../../../config.json';
import puppeteer from 'puppeteer';

const serverDir = path.join(__dirname, '../../../..', Bot_Config.Servers_Config.servers_path);
const commandsFile = Bot_Config.Servers_Config.templates.commandsFile;

export class FossabotScrapper {
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
      await page.waitForSelector('.jss139', { visible: true});

      const result = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('tr.jss139'))
          //TODO change this to something less hardcoded just in case
          .map(item => item.innerHTML.slice(40)
          // changes all classes to | for easier split();
          .replace('</td><td class=\"jss130 jss132 jss127\">','|')
          // removes commands permissions part
          .split('</td><td class=\"jss130 jss132 jss127\">Non-subs</td>')[0]
          .replace('/me','')
          .replace('$(sendername)','')
          .replace('$(sender)',''))
          // remold the entire scrapping into an object
          .reduce((a,b)=> (a[b.split('|')[0]]=b.split('|')[1].substr(1), a), {});
      });

      await browser.close();
      return result;
    }

    getData()
      .then(async (data) => {
        new DataWriter().replaceTo(path.join(serverDir, this._msg.guild?.id!, commandsFile), data);
        this._msg.reactions.removeAll();
        await this._msg.react("✔️");
      })
      .catch(async (err) => {
        this._msg.reactions.removeAll();
        await this._msg.react('❌');
      });
  }
}