"use_strict";

const { Bot_Config } = require('../../config.json');

module.exports = async (client) => {
  const stableMode = Bot_Config.stable_mode.enabled;
  let game;
  
  console.log(`${client.user.tag} => Running...`);
  
  if (!stableMode) {
    game = await Bot_Config.stable_mode.maintenance_game_message;
    client.user.setActivity(game);
  } else {
    game = await Bot_Config.stable_mode.stable_game_message;
    client.user.setActivity(game);
  }
}