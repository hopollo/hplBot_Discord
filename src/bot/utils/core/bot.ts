import * as dotenv from "dotenv";
import { Client, VoiceState } from "discord.js";
import { ready } from "../../events/states/ready";
import { message } from '../../events/messages/message';
//import { userUpdate } from '@events/users/userUpdate';
import { voiceStateUpdate } from '../../events/voices/voiceStateUpdate';
//import { channelCreate } from '@events/channels/channelCreate';
//import { channelDelete } from '@events/channels/channelDelete';
//import { guildMemberAdd } from '@events/guilds/guildMemberAdd';
//import { guildMemberRemove } from '@events/guilds/guildMemberRemove';
//import { guildCreate } from '@events/guilds/guildCreate';
//import { guildDelete } from '@events/guilds/guildDelete';

dotenv.config();

const HplBot = () => {
  console.log("Starting HplDiscordBot...");

  const client = new Client({
    intents: [
      "GuildInvites",
      "GuildMessages",
      "GuildVoiceStates",
      "Guilds",
      "MessageContent"
    ],
  });

  client.login(process.env.BOT_TOKEN);

  client.once("ready", (client) => ready(client));

  //client.on('guildMemberAdd', (member) => guildMemberAdd(member));
  client.on('voiceStateUpdate', (oldState: VoiceState, newState: VoiceState) => voiceStateUpdate(oldState, newState));
  client.on("messageCreate", (msg) => message(msg));
  /*
    client.on('userUpdate', (oldUser: User, newUser: User) => userUpdate(oldUser, newUser));
    client.on('guildMemberRemove', (member: GuildMember) => guildMemberRemove(member));
    client.on('channelCreate', (channel: GuildChannel) => channelCreate(channel));
    client.on('channelDelete', (channel: GuildChannel) => channelDelete(channel));
  */

  //client.on('guildCreate', (guild) => guildCreate(guild));
  //client.on('guildDelete', (guild) => guildDelete(guild));
};

export default HplBot;
