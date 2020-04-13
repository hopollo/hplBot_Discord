import { Message, DMChannel } from "discord.js";
import { message } from "../../events/messages/message";

export class DM {
  constructor(msg: Message) {
    this.processDM(msg)
  }

  async processDM(msg: Message) {
    try { 
      const author = msg.author;
      const msgContent = msg.content;

      const dm: DMChannel = await author.createDM();
                            await dm.send(`**Questions ? => https://twitter.com/HoPolloTV**`); 
    } catch (error) {
      console.error;
    }
  }
}