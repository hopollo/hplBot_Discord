import fs from 'fs';
import path from 'path';
import { Bot_Config } from '../../config.json';

const serverDir = Bot_Config.Servers_Config.servers_path;

export class ServerClient {

  public removeClient(id: string) {
    const filePath = path.join(serverDir, id);
    fs.exists(filePath, (exists) => {
      if (exists) fs.rmdir(filePath, (err) => { if (err) console.error; })
    });
  }

  public async generateNewClient(id: string) {
    const serverClientPath = path.join(__dirname, '../..', Bot_Config.Servers_Config.servers_path, id);
    const templatePath = path.join(__dirname, '../..', Bot_Config.Servers_Config.templates.path);
    const config = Bot_Config.Servers_Config.templates.configFile;
    const tempChannels = Bot_Config.Servers_Config.templates.tempChannelsFile;
    const commands = Bot_Config.Servers_Config.templates.commandsFile;

    fs.mkdir(serverClientPath, (err) => {
      if (err) return console.error;
      // tempChannels.json
      fs.copyFileSync(path.join(templatePath, tempChannels), path.join(serverClientPath, tempChannels));
      // commands.json
      fs.copyFileSync(path.join(templatePath, commands), path.join(serverClientPath, commands));
      // config.json
      fs.copyFileSync(path.join(templatePath, config), path.join(serverClientPath, config));
    });
  }
}