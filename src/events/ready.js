"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_json_1 = require("../../config.json");
var deleteChannel_1 = require("../utils/deleteChannel");
function ready(client) {
    var _a, _b, _c;
    var stableMode = config_json_1.Bot_Config.stable_mode.enabled;
    console.log(((_a = client.user) === null || _a === void 0 ? void 0 : _a.tag) + " => Running...");
    //Sets the game depending of if DevMode is ON or not
    if (!stableMode) {
        var game = config_json_1.Bot_Config.stable_mode.maintenance_game_message;
        (_b = client.user) === null || _b === void 0 ? void 0 : _b.setActivity(game, { type: 'CUSTOM_STATUS' });
    }
    else {
        var game = config_json_1.Bot_Config.stable_mode.stable_game_message;
        (_c = client.user) === null || _c === void 0 ? void 0 : _c.setActivity(game, { type: 'CUSTOM_STATUS' });
    }
    // Check all "missed" tempChannels to purge them or not if empty
    new deleteChannel_1.ChannelDeleter().checkUsers(client.guilds.cache);
}
exports.ready = ready;
