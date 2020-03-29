"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var discord_js_1 = require("discord.js");
var ready_1 = require("../../events/states/ready");
var message_1 = require("../../events/messages/message");
var userUpdate_1 = require("../../events/users/userUpdate");
var voiceStateUpdate_1 = require("../../events/voices/voiceStateUpdate");
var channelCreate_1 = require("../../events/channels/channelCreate");
var channelDelete_1 = require("../../events/channels/channelDelete");
var guildMemberAdd_1 = require("../../events/guilds/guildMemberAdd");
var guildMemberRemove_1 = require("../../events/guilds/guildMemberRemove");
var guildCreate_1 = require("../../events/guilds/guildCreate");
var guildDelete_1 = require("../../events/guilds/guildDelete");
var HplBot = /** @class */ (function () {
    function HplBot() {
    }
    HplBot.prototype.start = function (token) {
        console.log('Starting HplDiscordBot..');
        var client = new discord_js_1.Client();
        client.login(token);
        client.once('ready', function () { return ready_1.ready(client); });
        client.on('guildMemberAdd', function (member) { return guildMemberAdd_1.guildMemberAdd(member); });
        client.on('voiceStateUpdate', function (oldChannel, newChannel) { return voiceStateUpdate_1.voiceStateUpdate(oldChannel, newChannel); });
        client.on('message', function (msg) { return message_1.message(msg); });
        client.on('userUpdate', function (oldUser, newUser) { return userUpdate_1.userUpdate(oldUser, newUser); });
        client.on('guildMemberRemove', function (member) { return guildMemberRemove_1.guildMemberRemove(member); });
        client.on('channelCreate', function (channel) { return channelCreate_1.channelCreate(channel); });
        client.on('channelDelete', function (channel) { return channelDelete_1.channelDelete(channel); });
        client.on('guildCreate', function (guild) { return guildCreate_1.guildCreate(guild); });
        client.on('guildDelete', function (guild) { return guildDelete_1.guildDelete(guild); });
    };
    return HplBot;
}());
exports.HplBot = HplBot;
