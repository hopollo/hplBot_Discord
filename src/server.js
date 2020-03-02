"use_strict";

const { Client } = require('discord.js');
const event = require('./events/eventController');

const client = new Client();

require('dotenv').config();

client.login(process.env.BOT_TOKEN);

client.once('ready', () => event.ready(client));
client.on('guildMemberAdd', (member) => event.guildMemberAdd(member));
client.on('voiceStateUpdate', (oldChannel, newChannel) => event.voiceStateUpdate(oldChannel, newChannel));
client.on('message', (msg) => event.message(msg));
client.on('userUpdate', (oldUser, newUser) => event.userUpdate(oldUser, newUser));
client.on('guildMemberRemove', (member) => event.guildMemberRemove(member));
client.on('channelCreate', (channel) => event.channelCreate(channel));
client.on('channelDelete', (channel) => event.channelDelete(channel));