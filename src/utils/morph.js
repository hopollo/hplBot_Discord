"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var discord_js_1 = require("discord.js");
var Morph = /** @class */ (function () {
    function Morph(obj) {
        console.log(obj);
        this._type = obj;
        switch (this._type) {
            case discord_js_1.Client:
                console.log('Array type');
                break;
            case discord_js_1.Message:
                console.log('Array type');
                break;
            case discord_js_1.GuildMember:
                console.log('Array type');
                break;
            case Array:
                console.log('Array type');
                break;
            default:
                console.log(this._type + " Not implemented yet");
        }
    }
    return Morph;
}());
exports.Morph = Morph;
/*
export function process(obj: object) {
  const classObj = obj.obj;
  const objType = obj.obj.constructor.name;

  if (sniffEventClass) console.log(objType);

  const phrase = obj.message;

  if (objType === Message)     return processMessage(classObj, phrase);
  if (objType === Client)      return processClient(classObj, phrase);
  if (objType === GuildMember) return processGuildMember(classObj, phrase);
  if (objType === Array)       return processArray(classObj, phrase);
}

function processMessage (msg, phrase) {
  debug(msg);

  const description = phrase
    .replace('{{user}}', msg.author.username)
    .replace('{{server}}', msg.guild.name)
    .replace('{{channel}}', msg.channel.name)
    //.repalce('{{message}}', TODO)

  const initiator = msg.author;
  const initObj = msg.guild;

  return {initObj, description, initiator};
}

function processClient (client, phrase) {
  debug(client);
  
  const description = phrase
    .replace('{{user}}', client.user.username)
    .replace('{{server}}', client.guild.name)
    .replace('{{channel}}', client.channel.name)

  const initiator = client;
  const initObj = client.guilds;

  return {initObj, description, initiator};
}

function processGuildMember (guildMember, phrase) {
  debug(guildMember);

  const description = phrase
    .replace('{{user}}', guildMember.newChannel.user.username)
    .replace('{{server}}', guildMember.newChannel.guild.name)
    .replace('{{channel}}', guildMember.newChannel.voiceChannel.name)

  const initiator = guildMember.user;
  const initObj = guildMember.guild;

  return {initObj, description, initiator};
}

function processArray(array, phrase) {
  debug(array);

  const description = phrase
  .replace('{{user}}', array[1].user.username)
  .replace('{{server}}', array[1].guild.name)
  .replace('{{channel}}', array[1].voiceChannel.name)
  .replace('{{old}}', array[0].voiceChannel.name)
  .replace('{{new}}', array[1].voiceChannel.name)

  const initiator = array[1].user;
  const initObj = array[1].guild;

  return {initObj, description, initiator};
}
*/ 
