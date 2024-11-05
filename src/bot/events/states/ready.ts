import { Client } from "discord.js";
import configJSON from "../../../../config.json" with { type: "json" };
//import { ServerClient } from "../../utils/data/serverClient";

export const ready = (client: Client) => {
  const stableMode: boolean = configJSON.Bot_Config.stable_mode.enabled;

  console.log(`${client.user!.tag} => Running...`);

  //Sets the game depending of if DevMode is ON or not
  if (!stableMode) {
    const game: string =
      configJSON.Bot_Config.stable_mode.maintenance_game_message;
    client.user!.setActivity(game);
  } else {
    const game: string = configJSON.Bot_Config.stable_mode.stable_game_message;
    client.user!.setActivity(game);
  }

  //new ServerClient().updateClients(client.guilds);
};
