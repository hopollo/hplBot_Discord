"use_strict";

const { Channels_Options, Bot_Config } = require('../../config.json');
const RichEmbed = require('discord.js');

module.exports = async (type, msg) => {
  const logsChannel = Channels_Options.logs_channel.id;
  const allowLogs = Bot_Config.logs;
  
  // Stops there is general logs is disabled in config
  if (!allowLogs) return;

  if (Channels_Options.logs_channel.logs_options[type]) {
    const logToPost = client.channels.find(cn => cn.id == logsChannel);
    if (logToPost) {
      const embed = new RichEmbed()
          .setColor(0xFF0000)
          .setDescription(msg.msgContent)
          .setAuthor(msg.author.tag, msg.author.avatarURL)
          .setFooter(`ID : ${msg.author.id} •`)
      
      logToPost.send(embed);
    }
  } else {
    return console.log(`Type : ${type} not recognized`);
  }
}