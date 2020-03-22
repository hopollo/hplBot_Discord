"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var discord_js_1 = require("discord.js");
var path_1 = __importDefault(require("path"));
var config_json_1 = require("../../config.json");
var serverDir = path_1.default.join(__dirname, '../..', config_json_1.Bot_Config.Servers_Config.servers_path);
var configFile = config_json_1.Bot_Config.Servers_Config.templates.configFile;
var Log = /** @class */ (function () {
    function Log(initiator, message) {
        // TODO find a way to get in what guild we are;
        var allowLogs = config_json_1.Bot_Config;
        // Stops there is general logs is disabled in config
        if (!allowLogs)
            return;
        var embed = new discord_js_1.MessageEmbed()
            .setColor(0xFF0000)
            .setDescription(message)
            .setAuthor(initiator, initiator.defaultAvatarURL)
            .setFooter("ID : " + initiator.id + " \u2022");
        // TODO add send();
    }
    return Log;
}());
exports.Log = Log;
