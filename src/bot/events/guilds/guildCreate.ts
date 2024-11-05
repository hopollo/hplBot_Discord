import { Guild } from "discord.js";
import { ServerClient } from "../../utils/data/serverClient.ts";

export function guildCreate(guild: Guild) {
  try {
    console.log(`Added by ${guild.name} (${guild.id})`);
    new ServerClient().generateNewClient(guild.id);
  } catch (e) {
    console.error(e);
  }
}
