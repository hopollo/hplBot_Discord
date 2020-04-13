import { TextChannel, GuildMember, DiscordAPIError } from "discord.js";
import { Log } from "../logs/logs";

export class Purger {
  constructor(initiator: GuildMember, source: TextChannel, length: number) {
    this.purge(initiator, source, length);
  }

  purge(initiator: GuildMember, source: TextChannel, length: number) {
    if (!initiator.hasPermission('MANAGE_CHANNELS') && length > 10) 
      return initiator.send(`Security stop : Only administrators can purge more than 10 messages.`);
    
    if (initiator.hasPermission('ADMINISTRATOR') && length > 100)
        return initiator.send(`Bulk size too hight, aim from 1 to 100 messages max per chunks`);
            
    source.bulkDelete(length, true)
      .then(() => {
        const msgContent = `${initiator.displayName} Purged : **${source.name}** (Length: ${length})`;
        new Log(initiator.user, msgContent);
      })
      .catch((err: DiscordAPIError) => {
        initiator.send(`Error while trying to purge **${source.name}**: *${err.message}*.`);
      });
  }
}