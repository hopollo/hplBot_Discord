import { Guild } from "discord.js";
import { ServerClient } from "../utils/serverClient";

export function guildDelete(guild: Guild) {
  console.log(`Removed by ${guild.name} (${guild.id})`);
  new ServerClient().removeClient(guild.id);
}