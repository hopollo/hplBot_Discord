import fs from 'fs';
import path = require('path');
import { Log } from './logs';
import { DataWriter } from './write';
import { VoiceChannel, Message, Guild, Collection, Snowflake } from 'discord.js';
import { ServerClient } from './serverClient';
import { Bot_Config } from '../../config.json';

const serverDir = path.join(__dirname, '../..', Bot_Config.Servers_Config.servers_path);
const configFile = Bot_Config.Servers_Config.templates.configFile;
const tempChannelsFile = Bot_Config.Servers_Config.templates.tempChannelsFile;

export class ChannelDeleter {
  public async checkUsersOf(channel: VoiceChannel) {
    const config = await import(path.join(serverDir, channel.id, configFile));
    console.log(config);
    
    const tempChannels = await import(path.join(serverDir, channel.id, tempChannelsFile));
    const found = tempChannels.find(channel.id);
    
    if (!found) return;

    this.deleteChannel(channel);
  }
    
  public checkUsers(guild: Collection<Snowflake, Guild>) {
    guild.forEach(g => {
      fs.exists(path.join(serverDir, g.id.toString()), exists => {
        if (!exists) {
          return new ServerClient(g.id);
        } else {
          fs.readFile(path.join(serverDir, g.id, tempChannelsFile), (err, data) => {
            if (err) console.error;
          });
        }
      });
    });
  }
  
  private async deleteChannel(target: VoiceChannel) {
    const configFile = await import(path.join(serverDir, target.guild.id, Bot_Config.Servers_Config.templates.configFile));
    const tempChannels = await import(path.join(serverDir, target.guild.id, Bot_Config.Servers_Config.templates.tempChannelsFile)); 
    const allowDeletion = configFile.Vocals_Options.purge_options.purge_empty_channels;
    
    if (!allowDeletion) return;

    const usersCount = target.members.array.length;

    if (usersCount !== 0 || !target.deletable) return;
    target.delete();

    // get the object concerned in order to removes it from json
    const targetTempChannelData: boolean = tempChannels.find(target.id);
    if (!targetTempChannelData) return new Error(`Error to GET ${target.id} FROM tempChannels.json`);

    new DataWriter().removeTo(tempChannels, target.id);

    const msgContent = ''
    // Add LOGS
  }
}