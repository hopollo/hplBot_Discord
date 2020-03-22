import fs from 'fs';
import path from 'path';
import { Bot_Config } from '../../config.json';

export class ServerClient {
  private readonly _id: string;

  constructor(id: string) {
    this._id = id;
    this.generateNewClient();
  }

  public async generateNewClient() {
    const serverClientPath = path.join(__dirname, '../..', Bot_Config.Servers_Config.servers_path, this._id);
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

      console.log(`New Server : ${this._id} -> Added`);
    });
  }
}