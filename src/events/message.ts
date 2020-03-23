import path from 'path';
import { Bot_Config } from '../../config.json';
import { Log } from '../utils/logs';
import { Message } from 'discord.js';
import { ChannelCreator } from '../utils/createChannel';

const serverDir = path.join(__dirname, '../..', Bot_Config.Servers_Config.servers_path);
const configFile = Bot_Config.Servers_Config.templates.configFile;
const commandsFile = Bot_Config.Servers_Config.templates.commandsFile;

export async function message(msg: Message) {
  const stableMode: boolean = Bot_Config.stable_mode.enabled;
  const authorUsername: string =  msg.author.username;
  const msgContent: string = msg.content.toLowerCase();
  const commandsPrefix: string = Bot_Config.commands_prefix || '!';
  const config = await import(path.join(serverDir, msg.guild?.id!, configFile));
  const isCommand: boolean = msgContent.startsWith(commandsPrefix);
  const invitesChannelID: string = config.Channels_Options.invites_channel.id;
  const isInvitesChannel: boolean = msg.channel.id === invitesChannelID;
  const onlyCommands: boolean = config.Channels_Options.invites_channel.allow_only_commands_messages;
  const onlyCreations: boolean = config.Channels_Options.invites_channel.allow_only_creation_messages;

  const customCommand: string = config.Vocals_Options.creation_command;

  if (isInvitesChannel && !msg.author.bot && onlyCommands && !isCommand) {
    if (msg.deletable) return msg.delete({reason: "Not allowed in this channel"}).catch(console.error);
  }
  
  if (msg.author.bot || !isCommand) return undefined;
  if (!stableMode) return msg.reply('Maintenance en cours du bot, merci de réessayer plus tard.');
  

  // Create custom size vocals feature
  if (msgContent.includes(customCommand)) {
    // extract the number of slots
    const slots = msgContent.replace(customCommand, '');
    const customChannelsNamesTemplate = config.Vocals_Options.custom_vocals_titles
      .replace('{{slots}}', slots)
      .replace('{{user}}', authorUsername);
       
    return new ChannelCreator(msg, customChannelsNamesTemplate, +slots);
  }

  switch(msgContent) {
    case '!log': 
      new Log(msg.author, msgContent);
      break;
    case '!hplBot':
      msg.reply('HplBot Website : https://hplbot.netlify.com/');
      break;
    case '!help':
      msg.reply('HplBot Commands : https://www.hplbot.netlify.com/discord/commands/hplbot');
      break;
    case '!hplbot':
      msg.reply('HplBot est un bot discord et twitch, créer par @HoPolloTV');
      break;
    case '!solo':
      new ChannelCreator(msg, `${authorUsername} Solo`, 1);
      break;
    case '!duo':
      new ChannelCreator(msg, `${authorUsername} Duo`, 2);
      break;
    case '!trio':
      new ChannelCreator(msg, `${authorUsername} Trio`, 3);
      break;
    case '!squad':
      new ChannelCreator(msg, `${authorUsername} Squad`, 5);
      break;
    default:
      compareCommands(true);
    break;
  }

  async function compareCommands(fetch: boolean) {
    const commands = await import(path.join(serverDir, msg.guild!.id, commandsFile));
    const result = await commands.hasOwnProperty(msgContent);
    
    /*
    if (!result && fetch) return fetchFossabotCommands();

    //TODO : Tweaks i had to make this check to avoid reponding nothing if even
    // after fetching the command still not exist, should be something
    // better to right imo
    */
    if (result) {
      const response = await commands[msgContent];
      return msg.reply(response);
    }
  }
  
/*
  function fetchFossabotCommands() {
    const url = config.Fossabot_Config.commands_url;
    // Stops if scrapping is set to false in config
    if (!config.Fossabot_Config.scrapping) return;

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
      new DataWriter().replaceTo(commandsFilePath, data);
      return compareCommands(false);
    });
  }
  */
}