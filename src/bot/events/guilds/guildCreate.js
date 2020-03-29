"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var serverClient_1 = require("../../utils/data/serverClient");
function guildCreate(guild) {
    console.log("Added by " + guild.name + " (" + guild.id + ") from " + guild.region);
    new serverClient_1.ServerClient().generateNewClient(guild.id);
}
exports.guildCreate = guildCreate;
