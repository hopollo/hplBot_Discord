"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_json_1 = require("../../config.json");
var deleteChannel_1 = require("../utils/deleteChannel");
function ready(client) {
    var stableMode = config_json_1.Bot_Config.stable_mode.enabled;
    console.log(client.user.tag + " => Running...");
    //Sets the game depending of if DevMode is ON or not
    if (!stableMode) {
        var game = config_json_1.Bot_Config.stable_mode.maintenance_game_message;
        client.user.setActivity(game, { type: 'CUSTOM_STATUS' });
    }
    else {
        var game = config_json_1.Bot_Config.stable_mode.stable_game_message;
        client.user.setActivity(game, { type: 'CUSTOM_STATUS' });
    }
    // Check all "missed" tempChannels to purge them or not if empty
    new deleteChannel_1.ChannelDeleter().checkUsersBulk(client.guilds);
}
exports.ready = ready;
