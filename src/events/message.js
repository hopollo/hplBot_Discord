"use_strict";

const puppeteer = require('puppeteer');
const path = require('path');
const { Bot_Config, Vocals_Options, Channels_Options, Fossabot_Config } = require('../../config.json');
const commandsFilePath = path.join(__dirname, '../..', 'lib/dictionnaries', 'commands.json');
const commandsFile = require(commandsFilePath);
const tempChannels = path.join(__dirname, '../..', 'lib/dictionnaries', 'tempChannels.json');

const log = require('../utils/logs');
const write = require('../utils/write');
const move = require('../utils/move');

module.exports = async (msg) => {
  const stableMode = Bot_Config.stable_mode.enabled;
  const authorUsername = msg.author.username;
  const msgContent = msg.content.toLowerCase();
  const commandsPrefix = Bot_Config.commands_prefix;
  const customCommand = Vocals_Options.creation_command;
  const shareInvite = Channels_Options.invites_channel.post_invite_links;

  if (msg.author.bot) return;
  if (!msgContent.includes(commandsPrefix)) return;
  if (!stableMode) return msg.reply('Maintenance en cours du bot, merci de réessayer plus tard.');

  // Create custom size vocals feature
  if (msgContent.includes(customCommand)) {
    // extract the number of slots
    const slots = msgContent.replace(customCommand, '');
    const customChannelsNamesTemplate = Vocals_Options.custom_vocals_titles
      .replace('{{slots}}', slots)
      .replace('{{user}}', authorUsername);
       
    return createNewVoiceChannel(customChannelsNamesTemplate, slots);
  }

  switch(msgContent) {
    case '!site':
      msg.reply('Mon site : https://hopollo.netlify.com/');
      break;
    case '!facebook':
      msg.reply('Ma page Facebook : https://www.facebook.com/hopollo');
      break;
    case '!twitch':
      msg.reply('Mon Twitch : https://www.twitch.tv/hopollo');
      break;
    case '!youtube':
      msg.reply('Mon Youtube : https://www.youtube.com/hopollo');
      break;
    case '!tweet':
    case '!twitter':
      msg.reply('Mon Twitter: https://twitter.com/HoPolloTV')
      break;
    case '!hplbot':
      msg.reply('hlpBot est un bot discord et twitch, écrit par @HoPolloTV en Javascript via NodeJS');
      break;
    case '!solo':
      createNewVoiceChannel(`${authorUsername} Solo`, 1);
      break;
    case '!duo':
      createNewVoiceChannel(`${authorUsername} Duo`, 2);
      break;
    case '!trio':
      createNewVoiceChannel(`${authorUsername} Trio`, 3);
      break;
    case '!squad':
      createNewVoiceChannel(`${authorUsername} Squad`, 5);
      break;
    default:
      compareCommands(true);
    break;
  }

  async function compareCommands(fetch) {
    const result = await commandsFile.hasOwnProperty(msgContent);
    if (!result && fetch) return fetchFossabotCommands();

    //TODO : Tweaks i had to make this check to avoid reponding nothing if even
    // after fetching the command still not exist, should be something
    // better to right imo
    if (result) {
      const response = await commandsFile[msgContent];
      return msg.reply(response);
    }
  }

  function fetchFossabotCommands() {
    const url = Fossabot_Config.commands_url;
    // Stops if scrapping is set to false in config
    if (!Fossabot_Config.scrapping) return;

    const getData = async () => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      await page.goto(url);

      await page.waitForSelector('tr.jss139', {visible: true});

      const result = await page.evaluate(async () => {
        return Array.from(document.querySelectorAll('tr.jss139'))
          //TODO change this to something less hardcoded just in case
          .map(item => item.innerHTML.slice(40)
          // changes all classes to | for easier split();
          .replace('</td><td class=\"jss130 jss132 jss127\">','|')
          // removes commands permissions part
          .split('</td><td class=\"jss130 jss132 jss127\">Non-subs</td>')[0]
          .replace('/me','')
          .replace('$(sendername)','')
          .replace('$(sender)',''))
          // remold the entire scrapping into an object
          .reduce((a,b)=> (a[b.split('|')[0]]=b.split('|')[1], a), {});
      });

      await browser.close();
      return result;
    }

    getData().then(data => {
      write.replaceTo(commandsFilePath, data);
      return compareCommands(false);
    });
  }

  async function createNewVoiceChannel(channelName, slotsLimit) {
    const vocalsContainerID = Vocals_Options.vocals_category_id;
    const invitesChannelContainerID = Channels_Options.invites_channel.id;
    const vocalsMaxSlots = Vocals_Options.max_users;
    const reachedMessage = Vocals_Options.max_users.reached_message;
    const deleteCreationCommand = Vocals_Options.purge_options.purge_creation_commands;
    const msgDeleteIdle = Vocals_Options.purge_options.purge_creation_commands_idle;
    const moveCreator = Vocals_Options.move_creator_inside;
    const allowLogs = Channels_Options.logs_channel.logs_options.channels_creations.enabled;

    // Issues & security tweaks for custom numbers especially
    if (isNaN(slotsLimit)) return;
    if (slotsLimit >= vocalsMaxSlots) return msg.reply(reachedMessage);

    // Generate the temp channel with users specs
    const newChannel = await msg.guild.createChannel(channelName, {
      type: 'voice',
      userLimit: slotsLimit,
      // REMARK : Huge issue there, there's no way to convert channel id to "1615616",
      // the only way to makes it works is to set the "" manually inside the config line
      // it's never working otherwise, is it a lib issue ??
      parent: vocalsContainerID
    }).catch(console.error);

    // Delete the command msg for clearance
    if (deleteCreationCommand) msg.delete(msgDeleteIdle);

    if (shareInvite) {
      // Generate an invitation to the new temp channel
      const newChannelInvite = await newChannel.createInvite();
      const inviteLink = Channels_Options.invites_channel.invite_links_message
        .replace('{{user}}', authorUsername)
        .replace('{{channel}}', channelName)
        .replace('{{inviteLink}}', newChannelInvite);
      
      const author = authorUsername;
      const msgContent = Channels_Options.logs_channel.logs_options.channels_creations.message
        .replace('{{user}}', authorUsername)
        .replace('{{channel}}', channelName);

      const msg = {author, msgContent};
    
      if (allowLogs) log('channels_creations', msg);

      // Add both to use them for deletions after
      write.appendTo(tempChannels, {channelID: newChannel.id, inviteID: newChannelInvite.id});

      // Share the invitation to the correct invitations channel
      const invitationToShare = msg.guild.channels.find(cn => cn.id == invitesChannelContainerID);
      if (invitationToShare) return invitationToShare.send(inviteLink);
    } else {
      // Add both to use them for deletions after
      write.appendTo(tempChannels, {channelID: newChannel.id, inviteID: null});
    }

    // Moves the user into his new temporary channel feature
    // Status : DISCONNECTED: 5
    if (moveCreator && msg.client.status !== 5) return await move.moveTo(msg.member, newChannel);
  };
}