import { Client, GuildMember, GuildChannel, Message, User, VoiceState, Guild } from 'discord.js';
import { ready } from '../events/ready';
import { message } from '../events/message';
import { userUpdate } from '../events/userUpdate';
import { voiceStateUpdate } from '../events/voiceStateUpdate';
import { channelCreate } from '../events/channelCreate';
import { channelDelete } from '../events/channelDelete';
import { guildMemberAdd } from '../events/guildMemberAdd';
import { guildMemberRemove } from '../events/guildMemberRemove';
import { guildCreate } from '../events/guildCreate';
import { guildDelete } from '../events/guildDelete';

export class HplBot {
  public start(token: string) {
    console.log('Starting HplDiscordBot..');

    const client = new Client();

    client.login(token);

    client.once('ready', () => ready(client));
    client.on('guildMemberAdd', (member: GuildMember) => guildMemberAdd(member));
    client.on('voiceStateUpdate', (oldChannel: VoiceState, newChannel: VoiceState) => voiceStateUpdate(oldChannel, newChannel));
    client.on('message', (msg: Message) => message(msg));
    client.on('userUpdate', (oldUser: User, newUser: User) => userUpdate(oldUser, newUser));
    client.on('guildMemberRemove', (member: GuildMember) => guildMemberRemove(member));
    client.on('channelCreate', (channel: GuildChannel) => channelCreate(channel));
    client.on('channelDelete', (channel: GuildChannel) => channelDelete(channel));
    client.on('guildCreate', (guild: Guild) => guildCreate(guild));
    client.on('guildDelete', (guild: Guild) => guildDelete(guild));
  }
}