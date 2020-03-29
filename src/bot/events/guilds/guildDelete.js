"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var serverClient_1 = require("../../utils/data/serverClient");
function guildDelete(guild) {
    console.log("Removed by " + guild.name + " (" + guild.id + ")");
    new serverClient_1.ServerClient().removeClient(guild.id);
}
exports.guildDelete = guildDelete;
