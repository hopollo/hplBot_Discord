import fs from "node:fs";
import path from "node:path";
import { Bot_Config } from "../../../../config.json" with { type: "json" };
import { GuildManager } from "discord.js";
import { ChannelDeleter } from "../channels/deleteChannel.ts";

const serverDir = Bot_Config.Servers_Config.servers_path;

export class ServerClient {
  public updateClients(guilds: GuildManager) {
    guilds.cache.forEach((g) => {
      fs.access(path.join(serverDir, g.id), (access) => {
        if (!access) return this.generateNewClient(g.id);
        // Checks and purge temp channels
        new ChannelDeleter().checkUsersBulk(guilds);
      });
    });
  }

  public removeClient(id: string) {
    const filePath = path.join(serverDir, id);

    fs.access(filePath, (access) => {
      if (!access) return;
      fs.readdir(filePath, (err, files) => {
        if (err) return console.log;
        files.forEach((f) => {
          fs.unlink(path.join(filePath, f), (err) => {
            if (err) return console.error;
          });
          fs.rmdir(filePath, (err) => {
            if (err) return console.error;
          });
        });
      });
    });
  }

  public generateNewClient(id: string) {
    const serverClientPath = path.join(
      __dirname,
      "../../../..",
      Bot_Config.Servers_Config.servers_path,
      id,
    );
    const templatePath = path.join(
      __dirname,
      "../../../..",
      Bot_Config.Servers_Config.templates.path,
    );
    const configData = Bot_Config.Servers_Config.templates.configFile;
    const commands = Bot_Config.Servers_Config.templates.commandsFile;

    return fs.mkdir(serverClientPath, (err) => {
      if (err) return console.error;
      // commands.json
      fs.copyFile(
        path.join(templatePath, commands),
        path.join(serverClientPath, commands),
        (err) => {
          if (err) console.error;
        },
      );
      // config.json
      fs.copyFile(
        path.join(templatePath, configData),
        path.join(serverClientPath, configData),
        (err) => {
          if (err) console.error;
        },
      );
    });
  }
}
