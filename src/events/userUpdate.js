"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Channels_Options = require('../../config.json');
var log = require('../utils/logs');
function userUpdate(oldUser, newUser) {
    var allowLogs = Channels_Options.logs_channel.logs_options.users_info_changes.enabled;
    // Stops here if the config says to do so
    if (allowLogs)
        return;
    var msgContent = Channels_Options.logs_channel.logs_options.users_info_changes.message
        .replace('{{user}}', newUser.username)
        .replace('{{old}}', oldUser.username)
        .replace('{{new}}', newUser.username);
    var msg = { newUser: newUser, msgContent: msgContent };
    log('users_changes', msg);
}
exports.userUpdate = userUpdate;
