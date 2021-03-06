import fs from 'fs';
import path from 'path';
import { Bot_Config } from '../../../../config.json';
import { GuildManager } from 'discord.js';
import { ChannelDeleter } from '../channels/deleteChannel';

const serverDir = Bot_Config.Servers_Config.servers_path;

export class ServerClient {

  public updateClients(guilds: GuildManager) {
    guilds.cache.forEach(g => {
      fs.exists(path.join(serverDir, g.id), (exists) => {
        if (!exists) return this.generateNewClient(g.id);
        // Checks and purge temp channels
        new ChannelDeleter().checkUsersBulk(guilds);
      });
    });
  }

  public async removeClient(id: string) {
    const filePath = path.join(serverDir, id);

    fs.exists(filePath, (exists) => {
      if (!exists) return;
      fs.readdir(filePath, (err, files) => {
        if (err) return console.log;
        files.forEach(f => {
          fs.unlink(path.join(filePath, f), (err) => {
            if (err) return console.error;
          });
          fs.rmdir(filePath, (err) => { if (err) return console.error; });
        });
      });
    });
  }

  public async generateNewClient(id: string) {
    const serverClientPath = path.join(__dirname, '../../../..', Bot_Config.Servers_Config.servers_path, id);
    const templatePath = path.join(__dirname, '../../../..', Bot_Config.Servers_Config.templates.path);
    const config = Bot_Config.Servers_Config.templates.configFile;
    const commands = Bot_Config.Servers_Config.templates.commandsFile;
    
    return fs.mkdir(serverClientPath, (err) => {
      if (err) return console.error;
      // commands.json
      fs.copyFile(path.join(templatePath, commands), path.join(serverClientPath, commands), (err) => {
        if (err) console.error;
      });
      // config.json
      fs.copyFile(path.join(templatePath, config), path.join(serverClientPath, config), (err) => {
        if (err) console.error;
      });
    });
  }
}