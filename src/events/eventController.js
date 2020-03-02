"use_strict";

const ready = require('./ready');
const guildMemberAdd = require('./guildMemberAdd');
const guildMemberRemove = require('./guildMemberRemove');
const voiceStateUpdate = require('./voiceStateUpdate');
const channelCreate = require('./channelCreate');
const channelDelete = require('./channelDelete');
const userUpdate = require('./userUpdate');
const message = require('./message');

exports.ready = ready;
exports.guildMemberAdd = guildMemberAdd;
exports.guildMemberRemove = guildMemberRemove;
exports.voiceStateUpdate = voiceStateUpdate;
exports.channelCreate = channelCreate;
exports.channelDelete = channelDelete;
exports.userUpdate = userUpdate;
exports.message = message;
