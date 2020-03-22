import { Client } from "discord.js";
import { Bot_Config } from '../../config.json';
import { ChannelDeleter } from '../utils/deleteChannel';

export function ready(client: Client) {
  const stableMode: boolean = Bot_Config.stable_mode.enabled;

  console.log(`${client.user?.tag} => Running...`);
  
  //Sets the game depending of if DevMode is ON or not
  if (!stableMode) {
    const game: string = Bot_Config.stable_mode.maintenance_game_message;
    client.user?.setActivity(game, {type: 'CUSTOM_STATUS'});
  } else {
    const game: string = Bot_Config.stable_mode.stable_game_message;
    client.user?.setActivity(game, {type: 'CUSTOM_STATUS'});
  }

  // Check all "missed" tempChannels to purge them or not if empty
  new ChannelDeleter().checkUsers(client.guilds.cache);
}