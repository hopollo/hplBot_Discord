import { Guild } from "discord.js";
import { ServerClient } from "../../utils/data/serverClient.ts";

export function guildDelete(guild: Guild) {
  try {
    console.log(`Removed by ${guild.name} (${guild.id})`);
    new ServerClient().removeClient(guild.id);
  } catch (e) { console.error(e); }
}