import path from "node:path";
import { DataWriter } from "../data/write.ts";
import { Message } from "discord.js";
import config from "../../../../config.json" with { type: "json" };
import puppeteer from "puppeteer";

const serverDir = path.join(
  __dirname,
  "../../../..",
  config.Bot_Config.Servers_Config.servers_path,
);
const commandsFile = config.Bot_Config.Servers_Config.templates.commandsFile;

export class StreamElementsScrapper {
  private _msg: Message;
  private _url: string;
  private _cmd: string;

  constructor(msg: Message, url: string, cmd: string) {
    this._msg = msg;
    this._url = url;
    this._cmd = cmd;
    this.fetchBotCommands();
  }

  fetchBotCommands() {
    const getData = async () => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      await page.goto(this._url);

      await page.waitForSelector("tr.md-row", { visible: true });

      const result = await page.evaluate(() => {
        return Array.from(document.querySelectorAll("tr.md-row"))
          .map((i) => i.children)
          .reduce(
            (a, b) => (a[b[0].innerHTML.slice(0, -1)] = b[1].innerHTML
              .replace("/me", ""),
              a),
            {},
          );
      });

      await browser.close();
      return result;
    };

    getData()
      .then(async (data) => {
        new DataWriter().appendTo(
          path.join(serverDir, this._msg.guild?.id!, commandsFile),
          data,
        );
        this._msg.reactions.removeAll();
        await this._msg.react("✔️");
      })
      .catch(async (e) => {
        this._msg.reactions.removeAll();
        await this._msg.react("❌");
        console.error(e);
      });
  }
}
