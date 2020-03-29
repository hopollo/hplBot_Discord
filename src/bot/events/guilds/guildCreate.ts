import { Guild } from "discord.js";
import { ServerClient } from "../../utils/data/serverClient";

export function guildCreate(guild: Guild) {
  console.log(`Added by ${guild.name} (${guild.id}) from ${guild.region}`);
  new ServerClient().generateNewClient(guild.id);
}